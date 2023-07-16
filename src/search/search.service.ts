import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { Product } from './entities/product.entity';
import {
  ProductSearchBody,
  ProductSearchResult,
} from './interfaces/product-search-result.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SearchService {
  readonly index = 'products';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(product: Product) {
    try {
      const result = await this.elasticsearchService.index<
        ProductSearchResult,
        ProductSearchBody
      >({
        index: this.index,
        body: {
          id: product._id,
          name: product.name,
          product_code: product.product_code,
          price: product.price,
          sale: product.sale,
          slug: product.slug,
          description: product.description,
        },
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new RpcException('Failed to index product');
    }
  }

  async searchProduct(text: string) {
    try {
      const { body } =
        await this.elasticsearchService.search<ProductSearchResult>({
          index: this.index,
          body: {
            query: {
              multi_match: {
                query: text,
                fields: ['name', 'product_code', 'description'],
              },
            },
          },
        });
      const hits = body.hits.hits;
      return hits.map((item) => item._source);
    } catch (error) {
      console.error(error);
      throw new RpcException('Failed to search product');
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.elasticsearchService.deleteByQuery({
        index: this.index,
        body: {
          query: {
            match: {
              id: productId,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new RpcException('Failed to remove product');
    }
  }

  async updateProduct(product: Product) {
    try {
      const newBody = {
        id: product._id,
        name: product.name,
        product_code: product.product_code,
        price: product.price,
        sale: product.sale,
        slug: product.slug,
        description: product.description,
      };

      const script = Object.entries(newBody).reduce((result, [key, value]) => {
        if (typeof value === 'number') {
          return `${result} ctx._source.${key}=${value};`;
        }
        return `${result} ctx._source.${key}='${value}';`;
      }, '');

      return await this.elasticsearchService.updateByQuery({
        index: this.index,
        body: {
          query: {
            match: {
              id: product._id,
            },
          },
          script: {
            inline: script,
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new RpcException('Failed to update product');
    }
  }
}

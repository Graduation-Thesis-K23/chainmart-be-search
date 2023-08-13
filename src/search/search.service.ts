import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { Product } from './entities/product.entity';

import { RpcException } from '@nestjs/microservices';
import { Order } from './entities/order.entity';
import {
  OrderSearchBody,
  OrderSearchResult,
} from './interfaces/order-search-result.interface';
import {
  ProductSearchBody,
  ProductSearchResult,
} from './interfaces/product-search-result.interface';

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

  async indexOrder(order: Order) {
    console.log(order);

    try {
      const result = await this.elasticsearchService.index<
        OrderSearchResult,
        OrderSearchBody
      >({
        index: 'orders',
        body: {
          id: order.id,
          order_code: order.order_code,
          user_id: order.user_id,
        },
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new RpcException('Failed to index order');
    }
  }

  async searchOrders(text: string) {
    try {
      const { body } =
        await this.elasticsearchService.search<ProductSearchResult>({
          index: 'orders',
          body: {
            query: {
              // order_code contains text
              match: {
                order_code: text,
              },
            },
          },
        });
      const hits = body.hits.hits;
      console.log('hits', hits);

      return hits.map((item) => item._source);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

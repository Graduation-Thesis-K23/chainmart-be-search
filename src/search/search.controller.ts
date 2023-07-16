import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @EventPattern('search.product.index')
  indexProduct(product: any) {
    this.searchService.indexProduct(product);
  }

  @MessagePattern('search.product')
  searchProduct(@Payload() text: string) {
    return this.searchService.searchProduct(text);
  }

  @EventPattern('search.product.delete')
  deleteProduct(productId: string) {
    this.searchService.deleteProduct(productId);
  }

  @EventPattern('search.product.update')
  updateProduct(product: any) {
    this.searchService.updateProduct(product);
  }
}

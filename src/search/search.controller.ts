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
    console.log('hi');
    return this.searchService.searchProduct(text);
  }
}

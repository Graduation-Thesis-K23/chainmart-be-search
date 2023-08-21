import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern('search.health-check')
  async healthCheck() {
    console.log('search.health-check received');
    return 'search service is working';
  }

  @EventPattern('search.product.index')
  indexProduct(product: any) {
    this.searchService.indexProduct(product);
  }
  @EventPattern('search.order.index')
  indexOrder(order: any) {
    this.searchService.indexOrder(order);
  }

  @MessagePattern('search.product')
  searchProduct(@Payload() text: string) {
    console.log('hi');
    return this.searchService.searchProduct(text);
  }

  @MessagePattern('search.orders')
  searchOrders(@Payload() text: string) {
    return this.searchService.searchOrders(text);
  }
}

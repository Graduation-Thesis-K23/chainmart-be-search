export interface OrderSearchBody {
  id: string;
  order_code: string;
  user_id: string;
  slugs: string[];
  phone: string;
}

export interface OrderSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: OrderSearchBody;
    }>;
  };
}

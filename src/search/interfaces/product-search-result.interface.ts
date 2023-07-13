export interface ProductSearchBody {
  id: string;
  name: string;
  product_code: string;
  price: number;
  sale: number;
  slug: string;
  description: string;
}

export interface ProductSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ProductSearchBody;
    }>;
  };
}

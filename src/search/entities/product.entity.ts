export class Product {
  _id: string;
  name: string;
  product_code: string;
  price: number;
  sale: number;
  images: string[];
  supplier_id: string;
  specifications: object;
  description: string;
  acceptable_expiry_threshold: number;
  slug: string;
}

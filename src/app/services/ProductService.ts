import api from "./api";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  public async getProducts(inquiry: ProductInquiry = {}): Promise<Product[]> {
    const { data } = await api.get<Product[]>("/products", { params: inquiry });
    return data;
  }

  public async getProduct(productId: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${productId}`);
    return data;
  }
}

const productService = new ProductService();

export default productService;

export enum ProductStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  DELETE = "DELETE",
}

export enum ProductCollection {
  APPAREL = "APPAREL",
  FOOTWEAR = "FOOTWEAR",
  NUTRITION = "NUTRITION",
  EQUIPMENT = "EQUIPMENT",
  ACCESSORIES = "ACCESSORIES",
  OTHER = "OTHER",
}

export enum ProductSize {
  XS = "XS",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  XL = "XL",
  XXL = "XXL",
  ONE_SIZE = "ONE_SIZE",
}

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize?: ProductSize;
  productVolume?: number;
  productDesc: string;
  productImages: string[];
  productView: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInquiry {
  limit?: number;
  order?: "createdAt" | "productPrice" | "productView";
  direction?: "asc" | "desc";
  productCollection?: ProductCollection;
  productSize?: ProductSize;
  search?: string;
}

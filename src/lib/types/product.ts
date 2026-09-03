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
  SHOE_36 = "36",
  SHOE_37 = "37",
  SHOE_38 = "38",
  SHOE_39 = "39",
  SHOE_40 = "40",
  SHOE_41 = "41",
  SHOE_42 = "42",
  SHOE_43 = "43",
  SHOE_44 = "44",
  SHOE_45 = "45",
  SHOE_46 = "46",
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

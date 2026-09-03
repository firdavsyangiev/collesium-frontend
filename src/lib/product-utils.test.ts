import {
  deduplicateProductVariants,
  formatProductSize,
  requiresProductSize,
} from "./product-utils";
import { Product, ProductCollection, ProductSize, ProductStatus } from "./types/product";

function product(overrides: Partial<Product> = {}): Product {
  return {
    _id: "product-id",
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.APPAREL,
    productName: "Titan Shirt",
    productPrice: 50,
    productLeftCount: 10,
    productSize: ProductSize.MEDIUM,
    productDesc: "Training shirt",
    productImages: [],
    productView: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("apparel and footwear require a size", () => {
  expect(requiresProductSize(product())).toBe(true);
  expect(requiresProductSize(product({ productCollection: ProductCollection.FOOTWEAR }))).toBe(true);
  expect(requiresProductSize(product({ productCollection: ProductCollection.NUTRITION }))).toBe(false);
});

test("footwear sizes are displayed as EU sizes", () => {
  expect(formatProductSize(product({
    productCollection: ProductCollection.FOOTWEAR,
    productSize: ProductSize.SHOE_42,
  }))).toBe("EU 42");
});

test("one-size products never receive an EU prefix", () => {
  expect(formatProductSize(product({
    productCollection: ProductCollection.FOOTWEAR,
    productSize: ProductSize.ONE_SIZE,
  }))).toBe("ONE SIZE");
});

test("variant cards are deduplicated by collection and normalized name", () => {
  const products = [
    product({ _id: "medium", productSize: ProductSize.MEDIUM }),
    product({ _id: "large", productName: " titan shirt ", productSize: ProductSize.LARGE }),
    product({ _id: "shoes", productName: "Titan Shirt", productCollection: ProductCollection.FOOTWEAR }),
  ];

  expect(deduplicateProductVariants(products).map((item) => item._id)).toEqual(["medium", "shoes"]);
});

import { Product, ProductCollection } from "./types/product";

export function requiresProductSize(product: Product): boolean {
  return (
    product.productCollection === ProductCollection.APPAREL ||
    product.productCollection === ProductCollection.FOOTWEAR
  );
}

export function formatProductSize(product: Product): string {
  if (!product.productSize || product.productSize === "ONE_SIZE") return "ONE SIZE";
  return product.productCollection === ProductCollection.FOOTWEAR
    ? `EU ${product.productSize}`
    : product.productSize;
}

export function deduplicateProductVariants(products: Product[]): Product[] {
  const seenFamilies = new Set<string>();

  return products.filter((product) => {
    if (!requiresProductSize(product)) return true;
    const family = `${product.productCollection}:${product.productName.trim().toLowerCase()}`;
    if (seenFamilies.has(family)) return false;
    seenFamilies.add(family);
    return true;
  });
}

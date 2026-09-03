import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { Product } from "../../lib/types/product";

const CART_STORAGE_KEY = "collesiumCart";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];

    const parsed = JSON.parse(storedCart);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item?.product?._id) &&
        Number.isInteger(item?.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product, requestedQuantity = 1) => {
      if (product.productLeftCount < 1) return;

      setItems((currentItems) => {
        const existing = currentItems.find((item) => item.product._id === product._id);
        const safeQuantity = Math.max(1, Math.floor(requestedQuantity));

        if (existing) {
          return currentItems.map((item) =>
            item.product._id === product._id
              ? {
                  product,
                  quantity: Math.min(item.quantity + safeQuantity, product.productLeftCount),
                }
              : item,
          );
        }

        return [
          ...currentItems,
          { product, quantity: Math.min(safeQuantity, product.productLeftCount) },
        ];
      });
    };

    const updateQuantity = (productId: string, requestedQuantity: number) => {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(1, Math.floor(requestedQuantity)),
                  item.product.productLeftCount,
                ),
              }
            : item,
        ),
      );
    };

    const removeItem = (productId: string) => {
      setItems((currentItems) =>
        currentItems.filter((item) => item.product._id !== productId),
      );
    };

    const clearCart = () => setItems([]);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.product.productPrice * item.quantity,
      0,
    );

    return {
      items,
      cartCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    items: [],

    addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(i => i.product.id === product.id);
        if (existing) {
            set({
                items: items.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                ),
            });
        } else {
            set({ items: [...items, { product, quantity }] });
        }
    },

    removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        set({
            items: get().items.map(i =>
                i.product.id === productId ? { ...i, quantity } : i
            ),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotal: () => {
        return get().items.reduce((total, item) => {
            const price = item.product.promotion_price || item.product.price;
            return total + price * item.quantity;
        }, 0);
    },

    getCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
    },
}));

export default useCartStore;
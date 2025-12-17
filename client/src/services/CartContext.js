import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'thescentlab_cart';

// Load cart from localStorage
const loadCart = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

// Cart reducer
const cartReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case 'ADD_ITEM':
            // Check for existing item
            const existingIndex = state.findIndex(item =>
                item.fragranceId === action.payload.fragranceId &&
                item.type === action.payload.type &&
                (item.type === 'bottle' || item.mlQuantity === action.payload.mlQuantity)
            );

            if (existingIndex >= 0) {
                // Update quantity
                newState = state.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            } else {
                // Add new item
                newState = [...state, { ...action.payload, id: Date.now() }];
            }
            break;

        case 'REMOVE_ITEM':
            newState = state.filter(item => item.id !== action.payload);
            break;

        case 'UPDATE_QUANTITY':
            newState = state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                    : item
            );
            break;

        case 'CLEAR_CART':
            newState = [];
            break;

        default:
            return state;
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [], loadCart);

    // Calculate totals
    const cartTotal = cart.reduce((total, item) => {
        const itemPrice = item.type === 'bottle'
            ? item.price.bottle * item.quantity
            : item.price.perMl * item.mlQuantity * item.quantity;
        return total + itemPrice;
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const addToCart = (fragrance, type, quantity = 1, mlQuantity = 5) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                fragranceId: fragrance._id,
                name: fragrance.name,
                brand: fragrance.brand,
                imageUrl: fragrance.imageUrl,
                price: fragrance.price,
                type,
                quantity,
                mlQuantity: type === 'decant' ? mlQuantity : null,
                inventory: fragrance.inventory
            }
        });
    };

    const removeFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartTotal,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

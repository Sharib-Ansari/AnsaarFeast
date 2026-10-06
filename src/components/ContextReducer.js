import React, { useReducer, useContext, createContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img,
        },
      ];

    case 'REMOVE': {
      const newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;
    }

    case 'DROP':
      return [];

    case 'UPDATE': {
      const arr = [...state];
      const idx = arr.findIndex((food) => food.id === action.id);
      if (idx !== -1) {
        arr[idx] = {
          ...arr[idx],
          qty: parseInt(action.qty) + arr[idx].qty,
          price: action.price + arr[idx].price,
        };
      }
      return arr;
    }

    default:
      // Do not throw in production — return current state unchanged for unknown actions
      if (process.env.NODE_ENV === 'development') {
        console.warn('CartReducer: unknown action type:', action.type);
      }
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
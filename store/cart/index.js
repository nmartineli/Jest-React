import create from 'zustand';
import produce from 'immer';

//immer -> pega um objeto, faz a modificação, cria uma cópia com tudo o que já existia e adiciona a sua modificação

const initialState = {
  open: false,
  products: [],
};

const addProduct = (store, product) => {
  if (store.state.products.includes(product)) {
    return store.state.products;
  }
  return [...store.state.products, product];
};

export const useCartStore = create((set) => {
  const setState = (fn) => set(produce(fn));

  return {
    state: {
      ...initialState,
    },
    actions: {
      toggle() {
        setState(({ state }) => {
          state.open = !state.open;
        });
      },
      reset() {
        setState((store) => {
          store.state = initialState;
        });
      },
      add(product) {
        setState(({ state }) => {
          if (!state.products.includes(product)) {
            state.products.push(product);
          }
        });
      },
    },
  };
});

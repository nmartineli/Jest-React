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

      add(product) {
        setState(({ state }) => {
          if (!state.products.includes(product)) {
            state.products.push(product);
            state.open = true;
          }
        });
      },
      remove(product) {
        setState(({ state }) => {
          const exists = !!state.products.find(({ id }) => id === product.id);
          //vai retornar undefined caso não tenha o produto. as duas exclamações garantem que vai sempre voltar true ou false

          if (exists) {
            state.products = state.products.filter(({ id }) => {
              return id !== product.id;
            });
          }
        });
      },
      removeAll() {
        setState(({ state }) => {
          state.products = [];
        });
      },
      reset() {
        setState((store) => {
          store.state = initialState;
        });
      },
    },
  };
});

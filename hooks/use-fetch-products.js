import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios
      .get('/api/products')
      .then((res) => {
        if (mounted) {
          setProducts(res.data.products);
        }
      })
      .catch((error) => {
        //istambul é a ferramenta que o jest usa para o coverage dos testes e a mensagem abaixo serve para indicar que a linha deve ser ignorada
        /* istanbul ignore next */
        if (mounted) {
          setError(true);
        }
      });

    return () => (mounted = false);
  }, []);

  return { products, error };
};

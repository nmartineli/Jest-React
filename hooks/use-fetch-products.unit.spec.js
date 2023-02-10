import { renderHook } from '@testing-library/react-hooks';
import { useFetchProducts } from './use-fetch-products';
import { makeServer } from '../miragejs/server';
import Response from 'miragejs';

// o render hook foi desenvolvido para permitir fazer os testes de hooks sem depender de um function component
describe('useFetchProducts', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should return a list of 10 products', async () => {
    server.createList('product', 10);

    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());
    //por se tratar de uma operação assíncrona, é necessário usar o método para aguardar a atualização da lista
    await waitForNextUpdate();

    expect(result.current.products).toHaveLength(10);
    expect(result.current.error).toBe(false);
  });

  it('should set error to true when catch() block is executed', async () => {
    //criando uma resposta de erro na rota de products para testar o cenário negativo
    server.get('products', () => {
      return new Response(500, {}, '');
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());

    await waitForNextUpdate();

    expect(result.current.error).toBe(true);
    expect(result.current.products).toHaveLength(0);
  });
});

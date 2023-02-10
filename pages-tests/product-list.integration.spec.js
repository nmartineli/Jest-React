import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import ProductList from '../pages';
import { makeServer } from '../miragejs/server';
import Response from 'miragejs';
import userEvent from '@testing-library/user-event';

const renderProductList = () => {
  render(<ProductList />);
};

describe('ProductList', () => {
  let server;

  //o que deve ser feito antes de cada teste -> no caso é criar o servidor do mirage
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  //o que deve ser feito depois de cada teste -> no caso é finalizar o servidor do mirage
  afterEach(() => {
    server.shutdown();
  });

  it('should render ProductList', () => {
    renderProductList();

    const productList = screen.getByTestId('product-list');
    expect(productList).toBeInTheDocument();
  });

  it('should render the ProductCard component 10 times', async () => {
    // quando tem operação async, precisamos dar tempo para o react fazer a renderização da ação.

    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    });
  });

  it('should render the no products message', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('no-products')).toBeInTheDocument();
    });
  });

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      //Response(código do erro, header, mensagem de erro)
      return new Response(500, {}, '');
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toBeInTheDocument();
      expect(screen.queryByTestId('no-products')).toBeNull();
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
    });
  });

  it('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Relógio bonito';

    //dois produtos foram criados
    server.createList('product', 2);

    //mais um produto criado, dessa vez com o título abaixo
    server.create('product', {
      title: searchTerm,
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    //userEvent => acão de digitação do usuário / fireEvent => ação de envio
    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    });
  });

  it('should display the total quantity of products', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/10 Products/i)).toBeInTheDocument;
    });
  });

  it('should display product (singular) when there is only 1 product', async () => {
    server.createList('product', 1);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument;
    });
  });

  it('should display proper quantity when list is filtered', async () => {
    const searchTerm = 'Relógio bonito';

    server.createList('product', 2);

    server.create('product', {
      title: searchTerm,
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/3 Products/i)).toBeInTheDocument();
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    });
  });
});

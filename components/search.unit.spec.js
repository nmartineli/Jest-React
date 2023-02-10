import Search from './search';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

//render serve para montar o componente, enquanto o screen serve para referenciar a qualquer coisa que o componente retorne.
//tudo de fireEvent retorna uma promise
// jest.fn devolve uma função mock. quando a gente usa o jest.fn, ele encadeia os acontecimentos ao rodar todos os testes, o que pode dar alteração nos testes que contam os números de chamadas.

const doSearch = jest.fn();

describe('Search', () => {
  //método que limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a form', () => {
    render(<Search doSearch={doSearch} />);

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render a input type equals search', () => {
    render(<Search doSearch={doSearch} />);

    expect(screen.getByRole('searchbox')).toHaveProperty('type', 'search');
  });

  it('should call props.doSearch() when form is submitted', async () => {
    render(<Search doSearch={doSearch} />);

    const form = screen.getByRole('form');

    await fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledTimes(1);
  });

  it('should call props.doSearch() with the user input', async () => {
    render(<Search doSearch={doSearch} />);

    const inputText = 'some text here';
    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, inputText);
    await fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledWith(inputText);
  });

  it('should call doSearch when search input is cleared', async () => {
    render(<Search doSearch={doSearch} />);

    const inputText = 'some text here';
    const input = screen.getByRole('searchbox');

    //colocar alguma coisa no form
    await userEvent.type(input, inputText);

    //limpar o que está no input
    await userEvent.clear(input);

    expect(doSearch).toHaveBeenCalledTimes(1);
    expect(doSearch).toHaveBeenCalledWith('');
  });
});

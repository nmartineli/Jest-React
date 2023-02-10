import { screen, render, fireEvent } from '@testing-library/react';
import ProductCard from './product-card';

const product = {
  title: 'Relógio bonito',
  price: '22.00',
  image:
    'https://img.ltwebstatic.com/images3_pi/2022/03/09/16468225805fc23f1947180e44ce22a67be8860e7a_thumbnail_600x.webp',
};

const addToCart = jest.fn();

const renderProductCard = () => {
  render(<ProductCard product={product} addToCart={addToCart} />);
};

describe('ProductCard', () => {
  it('should render ProductCard', () => {
    renderProductCard();
    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderProductCard();

    expect(
      screen.getByText(new RegExp(product.title, 'i')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(product.price, 'i')),
    ).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('should call props.addToCart() when button gets clicked', async () => {
    renderProductCard();

    const button = screen.getByRole('button');

    await fireEvent.click(button);
    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});

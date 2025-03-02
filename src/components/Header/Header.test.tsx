import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header element', () => {
    render(<Header />);
    const header = screen.getByRole('banner'); // semantic role for <header>
    expect(header).toBeInTheDocument();
  });

  it('displays the MTA logo', () => {
    render(<Header />);
    const logo = screen.getByRole('img', { name: /mta/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'images/mta-white.svg');
  });

  it('displays the page title', () => {
    render(<Header />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Subway Map');
  });

  it('has correct structure', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.querySelector('img')).toHaveAttribute('src', 'images/mta-white.svg');
    expect(header?.querySelector('h1')).toHaveTextContent('Subway Map');
  });
});

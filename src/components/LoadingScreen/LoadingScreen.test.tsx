import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
  it('renders the logo container', () => {
    render(<LoadingScreen />);
    const container = screen.getByRole('img', { name: /mta/i }).closest('div');
    expect(container).toHaveClass('logo-container');
  });

  it('renders the MTA logo', () => {
    render(<LoadingScreen />);
    const logo = screen.getByRole('img', { name: /mta/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'images/mta-white.svg');
    expect(logo).toHaveClass('pulsing-logo');
  });

  it('displays the loading text', () => {
    render(<LoadingScreen />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('has correct HTML structure', () => {
    const { container } = render(<LoadingScreen />);
    expect(container.querySelector('.logo-container')).toBeInTheDocument();
    expect(container.querySelector('.pulsing-logo')).toBeInTheDocument();
    expect(container.querySelector('p')?.textContent).toBe('Loading…');
  });
});

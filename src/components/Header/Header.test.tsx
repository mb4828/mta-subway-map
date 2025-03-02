import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAtom } from 'jotai';
import userEvent from '@testing-library/user-event';
import Header from './Header';

// Mock Jotai's useAtom
vi.mock('jotai', () => ({
  useAtom: vi.fn(),
  atom: vi.fn(),
}));

describe('Header', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAtom).mockReturnValue(['light', mockSetTheme as never]); // Default to light theme
  });

  it('renders logo, title, and theme toggle button', () => {
    render(<Header />);

    expect(screen.getByRole('img', { name: /mta/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Subway Map');
    expect(screen.getByPlaceholderText('Light/Dark')).toBeInTheDocument();
  });

  it('toggles theme from light to dark', async () => {
    const user = userEvent.setup();

    render(<Header />);

    const toggleButton = screen.getByPlaceholderText('Light/Dark');

    await user.click(toggleButton);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles theme from dark to light', async () => {
    vi.mocked(useAtom).mockReturnValue(['dark', mockSetTheme as never]);

    const user = userEvent.setup();
    render(<Header />);

    const toggleButton = screen.getByPlaceholderText('Light/Dark');

    await user.click(toggleButton);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});

import { render, screen } from '@testing-library/react';
import App from './app';

test('renders navbar', () => {
    render(<App />);
    const linkElement = screen.getByText(/NBA Top Shot Market/i);
    expect(linkElement).toBeInTheDocument();
});

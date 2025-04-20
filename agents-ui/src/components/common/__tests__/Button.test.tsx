import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@mui/material';

describe('Button Component', () => {
    it('renders correctly', () => {
        render(<Button>Test Button</Button>);
        expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('applies variant correctly', () => {
        render(<Button variant="contained">Contained Button</Button>);
        const button = screen.getByText('Contained Button');
        expect(button).toHaveClass('MuiButton-contained');
    });
});
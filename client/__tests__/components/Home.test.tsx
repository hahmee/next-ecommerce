
import { render, screen } from '@testing-library/react';
import Home from '@/app/(home)/page'

describe('<Home />', () => {
    it('renders a heading', () => {
        const { container } = render(<Home />);

        const home = screen.getByText('Home');

        expect(home).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
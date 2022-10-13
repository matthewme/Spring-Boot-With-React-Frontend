import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import TestRenderer from 'react-test-renderer';
import AddCar from './components/AddCar';

test('renders a snapshot',()=> {
    const tree = TestRenderer.create(<AddCar />).toJSON();
    expect(tree).toMatchSnapshot();
})

//test('Open add car modal form', async () => {
//    render(<App />);
//    fireEvent.click(screen.getByText('New Car'));
//    expect(screen.getByRole('dialog')).toHaveTextContent('New Car');
//})
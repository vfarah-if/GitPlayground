import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Hello from './hello';

describe('hello', () => {
    it('should render without crashing', () => {
        // expect(true).toBe(true);
        const div = document.createElement('div');
        ReactDOM.render(<Hello name="Vincent" enthusiasmLevel={100} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});


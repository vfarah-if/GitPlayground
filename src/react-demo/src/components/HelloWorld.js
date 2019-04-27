import React, { Component } from 'react';

import Shout from './Shout';

export default class HelloWorld extends Component {
    constructor(props) {
        super(props);
        this.state = { who: props.who ? props.who : 'World' };
    }

    render() {
        const { who } = this.state;
        return (
            <section className="hello-world">
                <p>Hello <Shout what={who}></Shout></p>
            </section>
        );
    }
}

import * as React from 'react';
import { AccidentStatisticsService } from 'src/services/accident-statistics-service';

// tslint:disable-next-line:interface-name
export interface Props {
    name: string;
    enthusiasmLevel?: number;
}

// tslint:disable-next-line:interface-name
interface State {
    currentEnthusiasm: number;
}

class Hello extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { currentEnthusiasm: props.enthusiasmLevel || 1 };
        const accidentService = new AccidentStatisticsService();
        accidentService.get({ severity: 'Fatal' }).then(response => {
            console.log('Result of the service call', response);
        });
    }

    public onIncrement = () => this.updateEnthusiasm(this.state.currentEnthusiasm + 1);

    public onDecrement = () => this.updateEnthusiasm(this.state.currentEnthusiasm - 1);

    public render() {
        const { name, enthusiasmLevel = 1 } = this.props;

        if (enthusiasmLevel <= 0) {
            throw new Error('You could be a little more enthusiastic. :D');
        }

        return (
            <div className="hello">
                <div className="greeting">
                    Hello {name + getExclamationMarks(this.state.currentEnthusiasm)}
                </div>
                <button onClick={this.onDecrement}>-</button>
                <button onClick={this.onIncrement}>+</button>
            </div>
        );
    }

    private updateEnthusiasm(currentEnthusiasm: number) {
        console.log("Entered this function");
        this.setState({ currentEnthusiasm });
    };
}

export default Hello;

// Helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}
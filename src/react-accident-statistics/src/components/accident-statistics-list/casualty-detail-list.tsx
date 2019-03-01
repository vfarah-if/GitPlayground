import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Casualty, SeverityOptionValues } from 'src/models';

export interface CasualtyDetailListProps {
    casualties?: Array<Casualty>
}

export default class CasualtyDetailList extends React.PureComponent<CasualtyDetailListProps> {
    public render() {
        let { casualties } = this.props;
        casualties = casualties || new Array<Casualty>();

        return (
            <dl>
                {casualties.map((casualty: Casualty, index: number) =>
                    <dt key={index}>
                        <span>
                            <FontAwesomeIcon icon="ambulance" transform="shrink-3" color="orange"/>
                            Casualty {index + 1} of {casualty.severity ? this.severityDescription(casualty.severity) : 'unknown'} severity, aged {casualty.age}
                        </span>
                    </dt>
                )}
            </dl>
        );
    }

    private severityDescription(severity: SeverityOptionValues): string {
        if (severity === 0) {
            return 'serious';
        } else if (severity === 1) {
            return 'slight';
        } else if (severity === 2) {
            return 'fatal';
          } else {
            return severity.toString();
          }
    }
}

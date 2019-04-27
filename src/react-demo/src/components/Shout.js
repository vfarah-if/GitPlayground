import React from 'react';

const Shout = (props) => {
    const what = props.what || '';
    return (
        <React.Fragment>{what.toUpperCase() + '!'}</React.Fragment>
    );
}

export default Shout;
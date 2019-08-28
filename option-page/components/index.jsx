import React from 'react';
import Gest from '../../src/lib/gest.es6';

export default class Index extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        const gest = new Gest();
        gest.options.subscribeWithCallback((gesture) => {
            console.log(gesture);
            //alert("captured");
        })
        gest.start();
    }

    render() {
        return (
            <div></div>
        );
    }
}

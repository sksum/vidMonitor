import React, {Component} from 'react';
import { Button, FormText,ButtonGroup, Label } from 'reactstrap';

export default class counter extends Component{
    constructor(props){
        super(props);
        this.state = {
            n:props.init,
            maxVal:props.maxVal,
            minVal:props.minVal,
        }
    }

    increment = () => {
        let max = Math.min(this.state.n+1,this.state.maxVal)
        this.setState({ n: max})
        this.props.callBack(max);
    }
    
    decrement = () => {
        let min =  Math.max(this.state.n-1,this.state.minVal)
        this.setState({ n: min})
        this.props.callBack(min);    
    }

    render() {
        return (
            <div className = "col-2">
                <ButtonGroup >
                <Button color="danger" onClick = {this.decrement}>-</Button>
                <FormText>&nbsp; <strong>{this.state.n}</strong> &nbsp;</FormText>
                <Button color="success" onClick = {this.increment}>+</Button>
            </ButtonGroup>
            </div>
        );
    }
}

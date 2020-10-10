import React,{Component} from 'react';
import {Toast, ToastHeader} from 'reactstrap';

export default class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:true
        }
    }
  
    toggle = () => {
        this.setState({show: !this.state.show});
        this.props.handleRemove(this.props.Question.id)
    }
    render () {
        return(
            <Toast  isOpen={this.state.show}>
                <ToastHeader toggle = {this.toggle}>{this.props.Question.qs}</ToastHeader>
            </Toast>                   
    );
    }
}

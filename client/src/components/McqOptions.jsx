import React, {Component} from 'react';
import Counter from './helper/Counter.jsx';
import {Input} from 'reactstrap';

const Answers = ({n,callBack}) => {
    let ret =[];
    for (let i = 0 ;i < n;i++){
        ret.push(        
            <div key={i}>
                <div  className = "row mx-auto">
                    <Input type="radio" name="select" disabled />
                    <Input type="text" placeholder={"Option "+i} onChange={(evt)=>callBack(evt,i)}/>
                </div>
                &nbsp;
            </div>
        )
    }
    return (ret)
}

export default class McqOptions extends Component{
    constructor(props) {
        super();
        this.state = {
            n:2,
            options:{}
        }
    }

    setOptions = (evt,key) => {
        let options = this.state.options;
        options[key] = evt.target.value;
        this.setState({options})
        this.props.callBack(this.state);
    }

    changeN = n => {
        this.setState({n})
    }


    render(){
        return (
            <>
                <div className ="row">
                    <Counter init={this.state.n} minVal="2" maxVal="7" 
                        callBack={(n) => {this.changeN(n); this.props.callBack(this.state);}}/>
                </div>
                &nbsp;
                <Answers n={this.state.n} callBack={this.setOptions}/>
            </>
        );
    }
}

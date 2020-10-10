import React, {Component} from 'react';
import { Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import Preview from './helper/Preview.jsx'
import McqOptions from './McqOptions.jsx'

const SavedQuestions = ({list,handleRemove}) => {
    return(
        list.map((Question)=>{
            return (
                <div key={Question.id}  className="col-4">
                    <Preview Question = {Question} handleRemove={handleRemove} />
                </div>
                )
            })
    )
}

const OptionsType = (props) => {
    return (
        <>
            <div className ="row">
                <div className = "col-6">
                    <FormGroup>
                        <Label for="QuestionType">Type</Label>
                        <Input type="select" name="select" id="QuestionType" onChange = {evt=>props.callBack(evt.target.value)}>
                            <option>MCQ</option>
                            <option>Subjective</option>
                        </Input>
                    </FormGroup>
                </div>
            </div>
        </>
    );
}

const QuestionStatement = (props) => {
    return (
        <div className = "row">
            <div className = "col-9">
                <FormGroup>
                    <Label for="QuestionStatement">Question :</Label>
                    <Input type="textarea" name="text" id="QuestionStatement" placeholder={props.placeholder} onChange={(evt)=>props.callBack(evt.target.value)}/>
                </FormGroup>
            </div>
            <div className = "col-md">
            <FormGroup>
                <Label for="exampleFile">Illustration (if Any)</Label>
                <Input type="file" name="file" id="exampleFile" />
                <FormText color="muted">
                    Add images here
                </FormText>
            </FormGroup>
            </div>
        </div>
    )
}

let globalId = 0;
export default class NewForm extends Component {
    constructor(props) {
        super()
        this.state= {
            questions:[],
            new_ques:{
                qs:"",
            },
            type:"MCQ",
        }
    }

    changeType = (type) => {
        this.setState({type})
    }

    registerNewQuestion = (event) => {
        console.log("new qs: ",this.state.new_ques)
        let questions = this.state.questions;
        questions.push({qs:this.state.new_ques.qs,id:globalId++,options:this.state.new_ques.options})
        this.setState({questions})
        console.log(questions);
        event.preventDefault()
    }

    changeQuesStatement = (qs) => {
        let new_ques = this.state.new_ques;
        new_ques.qs = qs
        this.setState({new_ques})
    }

    addMCQ = (q) => {
        q.qs = this.state.new_ques.qs 
        this.setState({
            new_ques:q
            // need to add id as well
        }) 
    }

    deleteQs = (id) => {
        const questions = this.state.questions.filter((item) => item.id !== id)
        this.setState({questions})
    }

    render() {
        return (
            <div className = "container">
                <div className="row p-4 ">
                    <SavedQuestions list={this.state.questions} handleRemove={this.deleteQs}/>
                </div>
                <Form onSubmit={this.registerNewQuestion}>
                    <OptionsType callBack = {this.changeType}/>
                    <QuestionStatement placeholder = "Write your Question Statement here ..." callBack = {this.changeQuesStatement}/> 
                    {this.state.type == "MCQ"?<McqOptions callBack={this.addMCQ}/>:<></>}
                    <div className="row">
                        <div className = "mx-auto">
                            <Input type="submit" value="Add" />
                        </div>  
                    </div>
                </Form>
            </div>
        );
    }
}

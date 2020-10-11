import Firebase from 'firebase';
import config from '../config';
import { v1 as uuid } from "uuid";

import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Container,
  Button as ButtonStrap,
  Row,
  Col,
} from "reactstrap";
import Preview from "./helper/Preview.jsx";
import McqOptions from "./McqOptions.jsx";
import {
  makeStyles,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";

const SavedQuestions = ({ list, handleRemove }) => {
  return (
    <Container style={{ marginTop: "70px" }}>
      <Row>
        {list.length == 0 ? null : (
          <>
            <Typography variant="h5">Questions Added</Typography>
          </>
        )}
      </Row>
      {list.length == 0 ? null : <hr />}
      <Row style={{ marginTop: "10px" }}>
        {list.map((Question) => {
          return (
            <div
              key={Question.id}
              className="col-4"
              style={{ marginTop: "10px" }}
            >
              <Preview Question={Question} handleRemove={handleRemove} />
            </div>
          );
        })}
      </Row>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textFieldRoot: {
    "& > *": {
      margin: theme.spacing(1),
      width: "50vw",
      marginTop: "20px",
    },
  },
}));

const OptionsType = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    props.callBack(event.target.value);
    setValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="QuestionTypeLabel">Question Type</InputLabel>
        <Select
          labelId="QuestionTypeLabel"
          id="QuestionType"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={value}
          onChange={handleChange}
        >
          <MenuItem value={"MCQ"}>MCQ</MenuItem>
          <MenuItem value={"Subjective"}>Subjective</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

const QuestionStatement = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState("Controlled");

  const handleChange = (event) => {
    setValue(event.target.value);
    props.callBack(event.target.value);
  };

  return (
    <form className={classes.textFieldRoot} noValidate autoComplete="off">
      {/* <TextField id="standard-basic" label="Standard" /> */}
      <TextField
        id="questionStatement"
        label="Question"
        multiline
        rows={4}
        placeholder={props.placeholder}
        variant="outlined"
        style={{ marginTop: "20px" }}
      />
      <Input type="file" name="file" id="exampleFile" />
    </form>
    // <div className="row">
    //   <div className="col-9">
    //     <FormGroup>
    //       <Label for="QuestionStatement">Question :</Label>
    //       <Input
    //         type="textarea"
    //         name="text"
    //         id="QuestionStatement"
    //         placeholder={props.placeholder}
    //         onChange={(evt) => props.callBack(evt.target.value)}
    //       />
    //     </FormGroup>
    //   </div>
    //   <div className="col-md">
    //     <FormGroup>
    //       <Label for="exampleFile">Illustration (if Any)</Label>
    //   <Input type="file" name="file" id="exampleFile" />
    //       <FormText color="muted">Add images here</FormText>
    //     </FormGroup>
    //   </div>
    // </div>
  );
};

let globalId = 0;
export default class NewForm extends Component {
  constructor(props) {
    super();
    if (!Firebase.apps.length) {
      console.log("init app")
      Firebase.initializeApp(config);
    }
    this.state = {
      questions: [],
      new_ques: {
        qs: "",
      },
      type: "MCQ",
    };
  }

  changeType = (type) => {
    this.setState({ type });
  };
  writeUserData = (ev) => {
      const id = uuid();  
      const db = Firebase.database().ref('/').child(id);
      db.set(this.state);
      console.log(this.props);
      this.props.history.push(`/invil/${id}`);
      ev.preventDefault()
  }
  registerNewQuestion = (event) => {
    console.log("new qs: ", this.state.new_ques);
    let questions = this.state.questions;
    questions.push({
      qs: this.state.new_ques.qs,
      id: globalId++,
      options: this.state.new_ques.options,
    });
    this.setState({ questions });
    console.log(questions);
    event.preventDefault();
  };

  changeQuesStatement = (qs) => {
    let new_ques = this.state.new_ques;
    new_ques.qs = qs;
    this.setState({ new_ques });
  };

  addMCQ = (q) => {
    q.qs = this.state.new_ques.qs;
    this.setState({
      new_ques: q,
      // need to add id as well
    });
  };

  deleteQs = (id) => {
    const questions = this.state.questions.filter((item) => item.id !== id);
    this.setState({ questions });
  };

  render() {
    return (
      //     <div className={classes.root}>
      //     <Grid container spacing={3}>
      //       <Grid item xs={12}>
      //         <Paper className={classes.paper}>xs=12</Paper>
      //       </Grid>
      //       <Grid item xs={6}>
      //         <Paper className={classes.paper}>xs=6</Paper>
      //       </Grid>
      //       <Grid item xs={6}>
      //         <Paper className={classes.paper}>xs=6</Paper>
      //       </Grid>
      //       <Grid item xs={3}>
      //         <Paper className={classes.paper}>xs=3</Paper>
      //       </Grid>
      //       <Grid item xs={3}>
      //         <Paper className={classes.paper}>xs=3</Paper>
      //       </Grid>
      //       <Grid item xs={3}>
      //         <Paper className={classes.paper}>xs=3</Paper>
      //       </Grid>
      //       <Grid item xs={3}>
      //         <Paper className={classes.paper}>xs=3</Paper>
      //       </Grid>
      //     </Grid>
      //   </div>
      <Container>
        <div className="row p-4 ">
          <SavedQuestions
            list={this.state.questions}
            handleRemove={this.deleteQs}
          />
        </div>
        <Form onSubmit={this.registerNewQuestion} style={{ marginTop: "10px" }}>
          <Typography variant="h5">Add New Question</Typography>
          <hr />
          <Row
            style={{
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <Col xs={12} md={3}>
              <Typography>Question Type</Typography>
            </Col>
            <Col xs={12} md={9}>
              <OptionsType callBack={this.changeType} />
            </Col>
          </Row>
          <hr />
          <Row
            style={{
              alignItems: "center",
            }}
          >
            <Col xs={12} md={3} style={{ marginTop: "-50px" }}>
              <Typography>Question Statement</Typography>
            </Col>
            <Col xs={12} md={9}>
              <QuestionStatement
                placeholder="Write your Question Statement here ..."
                callBack={this.changeQuesStatement}
              />
            </Col>
          </Row>
          {this.state.type == "MCQ" ? (
            <>
              <hr />
              <McqOptions callBack={this.addMCQ} />
            </>
          ) : (
            <></>
          )}
          <Row style={{ marginBottom: "50px", marginTop: "20px" }}>
            <div className = "mx-auto">
                <Button onClick ={this.registerNewQuestion} >Add </Button >
            </div>  
            <div className = "mx-auto">
                <Button onClick ={this.writeUserData} >Make </Button >
            </div>  
          </Row>
        </Form>
      </Container>
    );
  }
}

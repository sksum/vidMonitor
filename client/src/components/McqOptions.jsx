import React, { Component } from "react";
import Counter from "./helper/Counter.jsx";
import { Input, Col, Row } from "reactstrap";
import { makeStyles, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textFieldRoot: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const Answers = ({ n, callBack }) => {
  const classes = useStyles();

  let ret = [];
  for (let i = 1; i <= n; i++) {
    ret.push(
      <div key={i} style={{ marginTop: "10px" }}>
        <div className="row mx-auto">
          <Input type="radio" name="select" disabled />
          {/* <Input type="text" placeholder={"Option "+i} onChange={(evt)=>callBack(evt,i)}/> */}
          <TextField
            id="standard-basic"
            // placeholder={`Option ${i}`}
            label={`Option ${i}`}
            onChange={(evt) => callBack(evt, i)}
            style={{ marginTop: "-15px" }}
          />
        </div>
        &nbsp;
      </div>
    );
  }
  return (
    <form className={classes.textFieldRoot} noValidate autoComplete="off">
      {ret}
    </form>
  );
};

export default class McqOptions extends Component {
  constructor(props) {
    super();
    this.state = {
      n: 2,
      options: {},
    };
  }

  setOptions = (evt, key) => {
    let options = this.state.options;
    options[key] = evt.target.value;
    this.setState({ options });
    this.props.callBack(this.state);
  };

  changeN = (n) => {
    this.setState({ n });
  };

  render() {
    return (
      <>
        <div
          className="row"
          style={{
            // marginLeft: "10px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          <Col xs={12} md={3}>
            <Typography>Number of Options</Typography>
          </Col>
          <Col xs={12} md={9}>
            <Counter
              init={this.state.n}
              minVal="2"
              maxVal="7"
              callBack={(n) => {
                this.changeN(n);
                this.props.callBack(this.state);
              }}
            />
          </Col>
        </div>
        <hr />
        &nbsp;
        <Row>
          <Col xs={12} md={3}>
            <Typography>Options</Typography>
          </Col>
          <Col xs={12} md={9}>
            <Answers n={this.state.n} callBack={this.setOptions} />
          </Col>
        </Row>
      </>
    );
  }
}

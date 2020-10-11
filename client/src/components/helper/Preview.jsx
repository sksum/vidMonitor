import React, { Component, useState } from "react";
import { Toast, ToastHeader } from "reactstrap";
import {
  Grid,
  Paper,
  Typography,
  ButtonBase,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export default function Preview(props) {
  const classes = useStyles();
  const [show, setShow] = useState(true);

  const toggle = () => {
    setShow(!this.state.show);
    props.handleRemove(props.Question.id);
  };
  return (
    // <Toast  isOpen={this.state.show}>
    //     <ToastHeader toggle = {this.toggle}>{this.props.Question.qs}</ToastHeader>
    // </Toast>
    show ? (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography variant="h6">
                    {props.Question.qs}
                    {/* {console.log(props.Question)} */}
                  </Typography>
                  <Typography variant="subtitle1">Options</Typography>
                  <Typography variant="body2" gutterBottom>
                    {props.Question.options
                      ? Object.values(props.Question.options).map((option) => (
                          <>
                            {option}
                            <br />
                          </>
                        ))
                      : null}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" style={{ cursor: "pointer" }}>
                    {props.Question.options ? "MCQ" : "Subjective"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    ) : null
  );
}

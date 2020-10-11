import React from "react";
import { Paper, makeStyles } from "@material-ui/core";
import { Row, Col, Container } from "reactstrap";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Container as ContainerMaterial, TextField } from "@material-ui/core";

export default function QuestionCard({ Question, number }) {
  const [value, setValue] = React.useState("female");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <Container style={{ margin: "10px 10px", padding: "20px 20px" }}>
      <Paper elevation={3}>
        <ContainerMaterial style={{ padding: "20px 20px" }}>
          <Row>
            <Col xs={12}>{"Q" + (number + 1) + ". " + Question.qs}</Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={{ size: 10, offset: 1 }}>
              {Question.type == "MCQ" ? (
                <>
                  {/* <FormLabel component="legend">Responses</FormLabel> */}
                  <RadioGroup
                    name="Responses"
                    value={value}
                    onChange={handleChange}
                  >
                    {Question.options.map((q) => (
                      <Row>
                        <FormControlLabel
                          value={q}
                          control={<Radio />}
                          label={q}
                        />
                      </Row>
                    ))}
                  </RadioGroup>
                </>
              ) : (
                <TextField id="standard-basic" fullWidth label="Answer" />
              )}
            </Col>
          </Row>
        </ContainerMaterial>
      </Paper>
    </Container>
  );
}

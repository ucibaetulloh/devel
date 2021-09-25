import React, { Component } from "react";
import { LinkSharp, SendSharp, Book, Create } from "@material-ui/icons";
import { Grid, Button, Typography } from "@material-ui/core";
import "./Button.style.css";

export default class TooltipAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title === undefined ? "" : props.title,
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      title: props.title === undefined ? "" : props.title,
    });
  };

  Submit = () => {
    if (this.props.Submit !== undefined) {
      this.props.Submit();
    }
  };

  render() {
    return (
      <div className="button-bottom">
        <Grid container justify="center">
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            style={{
              height: 50,
              backgroundColor: "#2e6da4",
            }}
            onClick={() => this.Submit()}
            endIcon={
              this.state.title === "Connect" ? (
                <LinkSharp />
              ) : this.state.title === "Book Now" ? (
                <Book />
              ) : this.state.title === "Reserve" ? (
                <Create />
              ) : (
                <SendSharp />
              )
            }
          >
            <Typography
              variant="button"
              style={{
                fontSize: 16,
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              {this.state.title}
            </Typography>
          </Button>
        </Grid>
      </div>
    );
  }
}

import React, { Component } from "react";
import { LinkSharp, SendSharp, Book, Create } from "@material-ui/icons";
import { Grid, Button, Typography, CircularProgress } from "@material-ui/core";
import "./Button.style.css";

export default class TooltipAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title === undefined ? "" : props.title,
      disabled: props.disabled === undefined ? "" : props.disabled,
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      title: props.title === undefined ? "" : props.title,
      disabled: props.disabled === undefined ? "" : props.disabled,
    });
  };

  Submit = () => {
    if (this.props.Submit !== undefined) {
      this.props.Submit();
    }
  };

  render() {
    return (
      <div className="button-bottom2">
        <Grid container justify="center">
          <Button
            disabled={this.state.disabled}
            variant="contained"
            color="secondary"
            fullWidth
            style={{
              height: 50,
              backgroundColor: "#2e6da4",
            }}
            onClick={() => this.Submit()}
            endIcon={
              this.state.disabled === false ? (
                this.state.title === "Connect" ? (
                  <LinkSharp />
                ) : this.state.title === "Book Now" ? (
                  <Book />
                ) : this.state.title === "Reserve" ? (
                  <Create />
                ) : (
                  <SendSharp />
                )
              ) : (
                ""
              )
            }
          >
            {this.state.disabled === true ? (
              <CircularProgress style={{ color: "#fff" }} size={24} />
            ) : (
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
            )}
          </Button>
        </Grid>
      </div>
    );
  }
}

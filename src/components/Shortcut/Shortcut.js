import React, { Component } from "react";
import { Cancel, LocationCity } from "@material-ui/icons";
import { Grid, Button, Typography, CircularProgress } from "@material-ui/core";
import "./Shortcut.style.css";

export default class ShortcutAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title === undefined ? "" : props.title,
      circleLoading: props.title === undefined ? "" : props.title,
    };
  }

  add = () => {
    if (this.props.add !== undefined) {
      this.props.add();
    }
  };

  delete = () => {
    if (this.props.add !== undefined) {
      this.props.delete();
    }
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      title: props.title === undefined ? "" : props.title,
      circleLoading: props.title === undefined ? "" : props.title,
    });
  };

  render() {
    return (
      <div className="shortcut-bottom">
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <div style={{ marginRight: -20 }} onClick={() => this.add()}>
              <Button
                disabled={this.state.circleLoading}
                size="large"
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: "#2e6da4",
                }}
                startIcon={<LocationCity style={{ color: "#fff" }} />}
              >
                {this.state.circleLoading === true ? (
                  <CircularProgress style={{ color: "#fff" }} size={24} />
                ) : (
                  <Typography
                    variant="button"
                    style={{
                      fontSize: 12,
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                  >
                    {this.state.title}
                  </Typography>
                )}
              </Button>
            </div>
          </Grid>
          <Grid item xs={2}>
            <div style={{ marginLeft: -5 }} onClick={() => this.delete()}>
              <Cancel
                style={{ width: 25, height: 25, color: "red", marginTop: -10 }}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

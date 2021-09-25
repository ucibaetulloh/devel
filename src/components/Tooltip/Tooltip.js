import React, { Component } from "react";
import { Add } from "@material-ui/icons";
import { Grid, Tooltip, Fab } from "@material-ui/core";
import "./Tooltip.style.css";

export default class TooltipAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  add = () => {
    if (this.props.add !== undefined) {
      this.props.add();
    }
  };

  render() {
    return (
      <div className="tooltip-bottom">
        <Grid container justify="flex-start">
          <Grid item>
            <Tooltip title="Add" aria-label="add" onClick={() => this.add()}>
              <Fab style={{ backgroundColor: "#2e6da4", color: "#fff" }}>
                <Add style={{ height: 35, width: 35 }} />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    );
  }
}

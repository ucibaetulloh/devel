import React, { Component } from "react";
import { Grid, Tooltip, Fab } from "@material-ui/core";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import "./Filter.style.css";

export default class Filter extends Component {
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
                <DateRangeOutlinedIcon style={{ height: 35, width: 35 }} />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    );
  }
}

import React, { Component } from "react";
import "./NoData.style.css";
import { imgEmpety } from "../../utils/DataJson";
import { Typography } from "@material-ui/core";
export default class dataEmpety extends Component {
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

  render() {
    return (
      <div>
        <div className="noDataContent">
          <img
            src={imgEmpety}
            alt={"noimage"}
            style={{ width: 180, height: 120 }}
          />
        </div>
        <div className="no-data" style={{ marginTop: 20 }}>
          <Typography variant="body2" component="p">
            <span style={{ fontSize: 16, color: "#8c8c8c" }}>
              {this.state.title}
            </span>
          </Typography>
        </div>
      </div>
    );
  }
}

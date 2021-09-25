import React, { Component } from "react";

export default class TabPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      index: props.index,
      value: props.value,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      children: props.children,
      index: props.index,
      value: props.value,
    });
  }

  render() {
    return (
      <div
        role="tabpanel"
        hidden={this.state.value !== this.state.index}
        id={`full-width-tabpanel-${this.state.index}`}
        aria-labelledby={`full-width-tab-${this.state.index}`}
      >
        {this.state.value === this.state.index && (
          <div>{this.state.children}</div>
        )}
      </div>
    );
  }
}

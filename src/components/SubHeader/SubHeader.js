import React, { Component } from "react";
import "./SubHeader.style.css";
import { AddBox, Search, AddAPhoto, ArrowBackIos } from "@material-ui/icons";
// import { Grid, Button, Typography } from "@material-ui/core";

export default class SubHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSearch: props.hideSearch === undefined ? false : props.hideSearch,
      showSearch: props.showSearch === undefined ? false : props.showSearch,
      title: props.title === undefined ? "" : props.title,
      disabled: props.disabled === undefined ? "" : props.disabled,
      showAddButton:
        props.showAddButton === undefined ? false : props.showAddButton,
      showCameraButton:
        props.showCameraButton === undefined ? false : props.showCameraButton,
    };
    this.backButtonRef = null;
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      hideSearch: props.hideSearch === undefined ? false : props.hideSearch,
      title: props.title === undefined ? "" : props.title,
      showAddButton:
        props.showAddButton === undefined ? "" : props.showAddButton,
      showCameraButton:
        props.showCameraButton === undefined ? "" : props.showCameraButton,
      disabled: props.disabled === undefined ? "" : props.disabled,
    });
  };

  goBack = () => {
    if (this.props.goBack !== undefined) {
      this.props.goBack();
    } else this.props.history.goBack();
  };

  onSearch = (query) => {
    if (this.props.onSearch !== undefined) {
      this.props.onSearch(query);
    }
  };

  add = () => {
    if (this.props.add !== undefined) {
      this.props.add();
    }
  };

  camera = () => {
    if (this.props.camera !== undefined) {
      this.props.camera();
    }
  };

  renderSearch = () => {
    if (!this.state.hideSearch) {
      return (
        <div className="search-container">
          <input
            type="text"
            placeholder={this.language.search}
            onChange={(event) => this.onSearch(event.target.value)}
          />
          <Search className="magnify" />
        </div>
      );
    } else {
      return <div className="title-container">{this.state.title}</div>;
    }
  };

  renderAddButton = () => {
    if (this.state.showAddButton) {
      return <AddBox />;
    } else if (this.state.showCameraButton) {
      return <AddAPhoto />;
    }
  };

  renderAddCamera = () => {
    if (this.state.showCameraButton) {
      return <AddAPhoto />;
    }
  };

  renderRightContainer = () => {
    if (this.state.hideSearch) {
      return (
        <div
          className="right-container"
          style={{
            width:
              this.backButtonRef === null
                ? "40px"
                : this.backButtonRef.clientWidth + "px",
          }}
          onClick={() => this.add()}
        >
          {this.renderAddButton()}
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="sub-header">
        <div
          ref={(ref) => (this.backButtonRef = ref)}
          className="back-container"
          disabled={this.state.disabled}
          onClick={() => this.goBack()}
        >
          <ArrowBackIos />
          <span className="backButton">Back</span>
        </div>
        {this.renderSearch()}
        {this.renderRightContainer()}
      </div>
    );
  }
}

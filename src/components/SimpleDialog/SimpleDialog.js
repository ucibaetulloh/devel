import React, { Component } from "react";
// import { Save } from "@material-ui/icons";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import "./SimpleDialog.style.css";

export default class SimpleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data === undefined ? "" : props.data,
      selectedValue:
        props.selectedValue === undefined ? "" : props.selectedValue,
      open: props.open === undefined ? "" : props.open,
      onClose: props.onClose === undefined ? "" : props.onClose,
    };
  }

  componentWillReceiveProps = (props) => {
    console.log(props.onClose);
    this.setState({
      data: props.data === undefined ? "" : props.data,
      selectedValue:
        props.selectedValue === undefined ? "" : props.selectedValue,
      open: props.open === undefined ? "" : props.open,
      onClose: props.onClose === undefined ? "" : props.onClose,
    });
  };

  handleListItemClick = (value) => {
    console.log("cek", value);
    // this.state.onClose;
    this.setState({
      selectedValue: value.display,
    });
  };

  render() {
    return (
      <Dialog
        onClose={this.state.onClose}
        aria-labelledby="simple-dialog-title"
        open={this.state.open}
      >
        <DialogTitle id="simple-dialog-title">Select Cloud Server</DialogTitle>
        <List>
          {this.state.data.map((value, i) => (
            <ListItem
              button
              onClick={() => this.handleListItemClick(value)}
              key={value.id}
            >
              <ListItemText primary={value.cloudname} />
              <ListItemText primary={value.display} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }
}

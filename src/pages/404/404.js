import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

class NotFound404 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <CssBaseline />
        <Container maxWidth="sm">
          <div>
            <h1>Not Found 404</h1>
            <div></div>
          </div>
        </Container>
      </>
    );
  }
}
export default NotFound404;

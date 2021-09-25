import { withStyles } from "@material-ui/core/styles";

import { Container } from "@material-ui/core";

export var StyledContainer = withStyles((props) => {
  return {
    root: {
      paddingRight: "0px",
      paddingLeft: "0px",
      height: "100vh",
      overflow: "auto",
      backgroundColor: "#fff",
      [props.breakpoints.only("sm")]: {
        paddingRight: "0",
        paddingLeft: "0",
      },
      [props.breakpoints.only("lg")]: {
        paddingRight: "0",
        paddingLeft: "0",
      },
    },
  };
})(Container);

export const styles = {
  root: {
    position: "relative",
  },
  slide: {
    padding: 15,
    minHeight: 100,
    color: "#fff",
  },
  slide1: {
    backgroundColor: "#FEA900",
  },
  slide2: {
    backgroundColor: "#B3DC4A",
  },
  slide3: {
    backgroundColor: "#6AC0FF",
  },
};

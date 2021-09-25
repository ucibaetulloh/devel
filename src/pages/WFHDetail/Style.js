import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

export var NewsDetailContainer = withStyles((props) => {
  return {
    root: {
      paddingRight: "0px",
      paddingLeft: "0px",
      width: "100%",
      overflow: "hidden",
      backgroundColor: "#fff",
      [props.breakpoints.only("xs")]: {
        paddingRight: "0px",
        paddingLeft: "0px",
      },
    },
  };
})(Container);

export var ContentBody = withStyles((props) => {
  return {
    root: {
      paddingRight: "0px",
      paddingLeft: "0px",
      backgroundColor: "#fff",
      [props.breakpoints.only("xs")]: {
        paddingRight: "0",
        paddingLeft: "0",
      },
    },
  };
})(Container);

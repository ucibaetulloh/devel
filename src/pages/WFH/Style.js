import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

export var NewsContainer = withStyles((props) => {
  return {
    root: {
      paddingRight: "0px",
      paddingLeft: "0px",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      backgroundColor: "#fff",
      [props.breakpoints.only("xs")]: {
        paddingRight: "0",
        paddingLeft: "0",
      },
    },
  };
})(Container);

export var NewsContent = withStyles((props) => {
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

export var NoDataContainer = withStyles((props) => {
  return {
    root: {
      paddingRight: "0px",
      paddingLeft: "0px",
      overflow: "auto",
      backgroundColor: "#fff",
      [props.breakpoints.only("xs")]: {
        paddingRight: "0",
        paddingLeft: "0",
      },
    },
  };
})(Container);

export let styles = {
  tabs: {
    background: "#fff",
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
  tab: {
    minWidth: "50%", // a number of your choice
    width: "50%", // a number of your choice
    textTransform: "capitalize",
    fontSize: 14,
    color: "#2e6da4",
  },
};

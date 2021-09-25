import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Card, CardMedia } from "@material-ui/core";

export var MomentContainer = withStyles((props) => {
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

export var MomentContent = withStyles((props) => {
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

export var CardMoment = withStyles((props) => {
  return {
    root: {
      margin: "10px",
      marginBottom: "20px",
      // boxShadow:
      //   "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      boxShadow:
        "0 0px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 0.19)",
      // box-shadow: ;
    },
  };
})(Card);

export var CardMediaMoment = withStyles((props) => {
  return {
    root: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
  };
})(CardMedia);

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
  },
  cssLabel: {
    color: "rgb(61, 158, 116) !important",
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "rgb(61, 158, 116) !important",
    color: "rgb(61, 158, 116)",
  },
};

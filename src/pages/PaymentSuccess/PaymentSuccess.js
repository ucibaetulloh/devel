import React, { Component } from "react";
import "./PaymentSuccess.style.css";
import { Typography, Button, CircularProgress } from "@material-ui/core";

export default class PaymentSuccessPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneno: "",
      email: "",
      circleLoading: false,
    };
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  //===============Request API Service==================//

  //===============Method & function====================//

  waitForBridge() {
    //the react native postMessage has only 1 parameter
    //while the default one has 2, so check the signature
    //of the function

    if (window.postMessage.length !== 1) {
      setTimeout(
        function () {
          this.waitForBridge();
        }.bind(this),
        200
      );
    } else {
      let param =
        '{"title":"' +
        "Payment Success" +
        '","canGoBack":false, "showCommunityName":true, "hideTopbar":false, "hideFooterMenu":false}';
      window.postMessage(param, "*");
    }
  }

  loadUser = () => {
    let info = localStorage.getItem("smart-app-id-login");
    if (
      info !== null &&
      info !== undefined &&
      info !== "null" &&
      info !== "" &&
      info !== "undefined"
    ) {
      info = JSON.parse(info);
      this.setState({
        phoneno: info.phonenumber,
        email: info.email,
      });
      //   this.doLoadDataComplaintUser(info.phonenumber);
    } else {
      // this.setState({
      //   phoneno: "082216825612",
      //   email: "ucibaetulloh@gmail.com",
      // });
      // this.doLoadDataComplaintUser("082216825612");
    }
  };

  goToHome = () => {
    this.setState({ circleLoading: true });

    let param = '{"code":"need-home"}';
    this.sendPostMessage(param);

    setTimeout(() => {
      this.setState({ circleLoading: false });
    }, 2000);
  };

  sendPostMessage = (param) => {
    if (window.postMessage.length !== 1) {
      setTimeout(
        function () {
          this.sendPostMessage(param);
        }.bind(this),
        200
      );
    } else {
      window.postMessage(param, "*");
    }
  };

  scrollTopFunction = () => {
    window.onscroll = function () {
      myFunction();
    };

    var header = document.getElementById("myHeader");
    var sticky = header.offsetTop;

    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }
  };

  render() {
    return (
      <div className="content-payment-success">
        <Typography
          component="view"
          variant="h3"
          style={{ fontWeight: "bold", color: "#000" }}
        >
          Payment Accepted
        </Typography>
        <br></br>
        <Typography component="view" variant="h5" style={{ color: "#333" }}>
          We have received your bill of payment. If you have any problems,
          please contact our customer service.
        </Typography>
        <br></br>
        <Button
          variant="contained"
          color="secondary"
          style={{
            backgroundColor: "#2e6da4",
          }}
          disabled={this.state.circleLoading}
          onClick={() => this.goToHome()}
        >
          {this.state.circleLoading === true ? (
            <CircularProgress style={{ color: "#fff" }} size={24} />
          ) : (
            <Typography
              variant="button"
              style={{
                fontSize: 16,
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Done
            </Typography>
          )}
        </Button>
      </div>
    );
  }
}

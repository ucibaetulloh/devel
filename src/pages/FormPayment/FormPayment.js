import React, { Component } from "react";
import Iframe from "react-iframe";
import SubHeader from "../../components/SubHeader/SubHeader";
import "./FormPayment.style.css";

export default class PaymentFormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "",
      urlXendit: decodeURIComponent(props.match.params.xenditId),
      redirect: false,
    };
  }

  componentDidMount = () => {
    this.scrollTopFunction();
  };

  componentWillUnmount = () => {};

  //===============Request API Service==================//

  //===============Method & function====================//

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

  goBack = () => {
    let param = '{"code":"need-home"}';
    this.sendPostMessage(param);
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

  render() {
    const idUrl =
      "https://checkout-staging.xendit.co/web/" + this.state.urlXendit;
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            onSearch={this.onSearch}
            title="Payment Methods"
            goBack={this.goBack}
          />
          <div className="contents">
            <Iframe
              url={idUrl}
              width="100%"
              height="100%"
              id="myId"
              className="myClassname"
              display="initial"
              position="absolute"
            />
          </div>
        </div>
      </div>
    );
  }
}

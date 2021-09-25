import React, { Component } from "react";
// import SubHeader from "../../components/SubHeader/SubHeader";
// import DataEmpety from "../../components/NoData/NoData";
// import TooltipAdd from "../../components/Tooltip/Tooltip";
import "./Entertainment.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

export default class Entertainment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneno: "",
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
  };

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
        "Entertainment" +
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
      });
      // this.doLoadDataComplaintUser(info.phonenumber);
    } else {
      // this.setState({
      //   phoneno: "082216825612",
      // });
      // this.doLoadDataComplaintUser("082216825612");
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

  handleScroll = (e) => {
    var difference = document.documentElement.scrollHeight - window.innerHeight;
    var scrollposition = document.documentElement.scrollTop;
    if (difference - scrollposition <= 2) {
      // if (this.state.moments.showLoadMore === true) {
      //   this.loadMoment(this.state.moments.currentIndex);
      // }
    }
    // const el = e.target.documentElement;
    // const bottom = el.scrollHeight - el.scrollTop === el.clientHeight;
    // if (bottom) {
    //   console.log("we are in the bottom inquery");
    // }
  };

  goBack = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          {/* <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="Enter"
            goBack={this.goBack}
          /> */}
        </div>
        <div className="contents">
          <div style={{ marginTop: 150 }}>
            <h1
              style={{
                textAlign: "center",
                color: "#1273de",
                fontWeight: "bold",
                fontfamily: "sans-serif",
              }}
              className="display-7"
            >
              COMING SOON!
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

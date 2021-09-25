import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import Iframe from "react-iframe";
import "./CameraView.style.css";
import { apiStreamCameraId } from "../../services/ConfigServices";

export default class CameraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.match.params.title,
      streamingId: props.match.params.id,
      areaCameraList: [],
      phoneno: "",
      url: "http://192.168.0.105:8081",
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    // this.loadStreamCamera();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //===============Request API Service==================//
  loadStreamCamera = () => {
    apiStreamCameraId(this.state.streamingId)
      .then((response) => {
        // console.log(response);
        if (response.data.status === "OK") {
          this.setState({
            areaCameraList: response.data.records[0],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      let tmp = localStorage.getItem("smart-app-id-login");
      let needLogin = false;
      // let tmp2 = localStorage.getItem('smart-app-id-binding');
      // let needBinding = false;

      if (
        tmp === undefined ||
        tmp === null ||
        tmp === "null" ||
        tmp === "" ||
        tmp === "undefined"
      )
        needLogin = true;
      // else if(tmp2 == undefined || tmp2 == null || tmp2 == 'null' || tmp2 == '' ||tmp2 == 'undefined' ) needBinding = true;
      else {
        tmp = JSON.parse(tmp);
        this.setState({
          phoneno: tmp.phonenumber,
        });
      }

      let param =
        '{"title":"' +
        this.state.title +
        '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true, "needLogin":' +
        (needLogin ? "true" : "false") +
        "}";
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
      this.setState({
        phoneno: "082216825612",
      });
      // let url = this.state.url+'/?categoryId='+this.state.streamingId+'&phoneno='+this.state.phoneno
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
    }
  };

  goBack = () => {
    this.props.history.push("/streamcamera");
  };

  render() {
    const url =
      this.state.url +
      "/?categoryId=" +
      this.state.streamingId +
      "&phoneno=" +
      this.state.phoneno;

    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title={this.state.title}
            goBack={this.goBack}
          />
        </div>
        <div className="contents">
          <Iframe
            url={url}
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="initial"
            position="absolute"
          />
        </div>
      </div>
    );
  }
}

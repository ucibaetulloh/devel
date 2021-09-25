import React, { Component } from "react";
import "./SmartHomeControl.style.css";
import SubHeader from "../../components/SubHeader/SubHeader";
// import { TextField } from "@material-ui/core";
// import * as websocket from "../../../WebSocket";

class SmartHomeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneno: "",
      name: "",
      page: "",
      userId: "",
      cloudid: "",
      alias: "",
      redirect: false,
      title: "SMART HOME",
    };

    let search = props.location.search.replace("?", "");
    let params = search.split("&");
    for (let i = 0; i < params.length; i++) {
      let param = params[i].split("=");
      if (param[0].toLowerCase() === "page") {
        this.state.navigateTo = param[1];
        this.state.redirect = true;
        break;
      } else if (param[0].toLowerCase() === "community") {
        this.state.community = param[1];
      }
    }
    // console.log(this.search);
    // console.log(this.params);

    let curr = localStorage.getItem("smarthome");
    if (curr === null || curr === undefined || curr === "") curr = 0;
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    // websocket.subscribe("viewId8", this.testing);
    // websocket.start();
    // setTimeout(() => {
    //   if (websocket.statusSocket() === 1) {
    //     websocket.sendView8();
    //   }
    // }, 20000);
  };

  testing = (userlist) => {
    console.log("masuk callback");
    console.log(userlist);
  };

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
    } else {
      // this.setState({
      //   phoneno: "082216825612",
      // });
    }
  };

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
        this.state.title +
        '","canGoBack":true, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
      window.postMessage(param, "*");
    }
  }

  goBack = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="main-container">
        <SubHeader
          history={this.props.history}
          hideSearch={true}
          title={this.state.title}
          goBack={this.goBack}
        />
        {/* <div className="service-center-form">
          <div className="service-center-form-title">REGISTER GATEWAY</div>
          <div className="form-container">
            <div className="field-container">
              <div className="field-label">USER ID</div>
              <div className="field-value">
                <input
                  type="text"
                  value={this.state.userId}
                  placeholder="Enter user ID"
                  onChange={(e) => this.setState({ userId: e.target.value })}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field-label">CLOUD ID</div>
              <div className="field-value">
                <input
                  type="text"
                  value={this.state.cloudid}
                  placeholder="Enter cloud ID"
                  onChange={(e) => this.setState({ cloudid: e.target.value })}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field-label">ALIAS NAME</div>
              <div className="field-value">
                <input
                  type="text"
                  value={this.state.alias}
                  placeholder="Enter alias name"
                  onChange={(e) => this.setState({ alias: e.target.value })}
                />
              </div>
            </div>
            <div className="field-container">
              <div style={{ marginTop: 20, marginBottom: 20 }}></div>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default SmartHomeControl;

import React, { Component } from "react";
import {
  apiStreamCameraList,
  apiCheckAccessCamera,
} from "../../services/ConfigServices";
import SubHeader from "../../components/SubHeader/SubHeader";
import DataEmpety from "../../components/NoData/NoData";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { FiberManualRecord, LiveTv } from "@material-ui/icons";
import "./Camera.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

export default class StreamCameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Streaming Camera",
      Camera: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      phoneno: "",
      OpenAlert: false,
      OpenAlertStatus: false,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.loadStreamCamera();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //===============Request API Service==================//
  loadStreamCamera = () => {
    apiStreamCameraList()
      .then((response) => {
        // console.log(response);
        if (response.data.status === "OK") {
          this.setState({
            Camera: {
              list: response.data.records,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doCheckAccess = (dtItem) => {
    apiCheckAccessCamera(dtItem, this.state.phoneno)
      .then((response) => {
        if (response.data.status === "OK") {
          if (dtItem.status === 0) {
            this.setState({
              OpenAlertStatus: true,
            });
          } else {
            this.props.history.push(
              "/streamingview/" + dtItem.id + "/" + dtItem.area
            );
          }
        } else {
          this.setState({ OpenAlert: true });
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
        "Stream Camera" +
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
    }
  };

  goBack = () => {
    this.props.history.push("/");
  };

  goToStream = (dtItem) => {
    this.props.history.push(
      "/streamingview/" + dtItem.areaId + "/" + dtItem.areaName
    );
  };

  renderStatusStream = (dtItem) => {
    if (dtItem.status === 0) {
      return <FiberManualRecord style={{ color: "red" }} />;
    } else {
      return <FiberManualRecord style={{ color: "green" }} />;
    }
  };

  renderCekStatus = (dtItem) => {
    if (dtItem.status === 0) {
      return <span>Offline</span>;
    } else {
      return <span>Online</span>;
    }
  };

  renderImg = (dtImg) => {
    if (dtImg.img_stream !== "") {
      return (
        <img
          src={dtImg.icon}
          alt={dtImg.areaName}
          onClick={() => this.goToStream(dtImg)}
        />
      );
    } else {
      return (
        <LiveTv
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#000",
            color: "#fff",
          }}
          onClick={() => this.goToStream(dtImg)}
        />
      );
    }
  };

  alertValidationAccess = () => {
    if (this.state.OpenAlert === true) {
      setTimeout(
        function () {
          this.setState({ OpenAlert: false });
        }.bind(this),
        3000
      );

      return (
        <div
          style={{
            marginTop: 10,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            <Typography style={{ fontSize: 12 }} align="left" variant="inherit">
              You don't have access to streaming camera.
            </Typography>
          </Alert>
        </div>
      );
    }
  };

  alertCamera = () => {
    if (this.state.OpenAlertStatus === true) {
      setTimeout(
        function () {
          this.setState({ OpenAlertStatus: false });
        }.bind(this),
        3000
      );

      return (
        <div
          style={{
            marginTop: 10,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Alert severity="error">
            {/* <AlertTitle>Warning</AlertTitle> */}
            <Typography style={{ fontSize: 12 }} align="left" variant="inherit">
              Stream camera offline
            </Typography>
          </Alert>
        </div>
      );
    }
  };

  renderBody = () => {
    if (this.state.Camera.list.length > 0) {
      return (
        <div className="root">
          <GridList cellHeight={180} className="gridList">
            {this.state.Camera.list.map((dtItem) => (
              <GridListTile key={dtItem.areaId} style={{ padding: 6 }}>
                {this.renderImg(dtItem)}
                <GridListTileBar
                  title={
                    <span style={{ fontSize: 15, textAlign: "center" }}>
                      {dtItem.areaName}
                    </span>
                  }
                  onClick={() => this.goToStream(dtItem)}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      );
    } else {
      return (
        <div className="list-stream">
          <DataEmpety title="Stream camera not available" />
        </div>
      );
    }
  };

  render() {
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
        <div className="contents">{this.renderBody()}</div>
        {this.alertValidationAccess()}
        {this.alertCamera()}
      </div>
    );
  }
}

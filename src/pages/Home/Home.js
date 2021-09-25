import React, { Component } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { Home, ExitToApp } from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import { StyledContainer, styles } from "./Style";
import { IconHome } from "../../utils/DataJson";
import "./Home.style.css";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Pagination from "../../components/PaginationDot/Pagination";
import {
  appLoadBanner,
  app_update_platform,
  deleteShortcut,
  apiLoadShortcut,
  apiVmsProfile,
  apiCheckValidationVenue,
  apiVmsListByVenueId,
  apiVmsto202,
} from "../../services/ConfigServices";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import ShortcutAdd from "../../components/Shortcut/Shortcut";
import { Player, ControlBar, PlayToggle, VolumeMenuButton } from "video-react";
import "../../../node_modules/video-react/dist/video-react.css";
import moment from "moment";
import { registerLocale } from "react-datepicker";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

//============CONSTANTA========================//
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const icons = IconHome;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "",
      redirect: false,
      AdvCommunity: [],
      AdvCommunityBottom: [],
      videoAdvTop: [],
      videoAdvBottom: [],
      index: 0,
      index2: 0,
      community: 22,
      phoneno: "",
      showShortcut: [],
      vmsUserFacePic: [],
      setOpenValidation: false,
      dataVisitorVms: [],
      setVisitLocation: "",
      statusVaksinUser: 0,
      setOpenSuccess: false,
      NavigationIndex: 0,
    };

    let search = props.location.search.replace("?", "");
    let params = search.split("&");
    for (let i = 0; i < params.length; i++) {
      let param = params[i].split("=");
      if (param[0].toLowerCase() === "page") {
        this.state.page = param[1];
        this.state.redirect = true;
        break;
      } else if (param[0].toLowerCase() === "community") {
        this.state.community = param[1];
        localStorage.setItem("smart-app-id-login-community", param[1]);
      } else if (param[0].toLowerCase() === "community") {
        this.state.community = param[1];
        localStorage.setItem("smart-app-id-binding-community", param[1]);
      } else if (param[0].toLowerCase() === "community") {
        this.state.community = param[1];
        localStorage.setItem("Modernland-Account-community", param[1]);
      } else if (param[0].toLowerCase() === "community") {
        this.state.community = param[1];
        localStorage.setItem("smart-app-id-token-community", param[1]);
      }
      // console.log(params);
    }

    let videoAdvTop = JSON.parse(localStorage.getItem("VideoTOP"));
    if (
      videoAdvTop === null ||
      videoAdvTop === undefined ||
      videoAdvTop === [] ||
      videoAdvTop === ""
    )
      videoAdvTop = [];

    let videoAdvBottom = JSON.parse(localStorage.getItem("VideoBOTTOM"));
    if (
      videoAdvBottom === null ||
      videoAdvBottom === undefined ||
      videoAdvBottom === [] ||
      videoAdvBottom === ""
    )
      videoAdvBottom = [];

    let bannerTop = JSON.parse(localStorage.getItem("TOP"));
    if (
      bannerTop === null ||
      bannerTop === undefined ||
      bannerTop === [] ||
      bannerTop === ""
    )
      bannerTop = [];

    let bannerBottom = JSON.parse(localStorage.getItem("BOTTOM"));
    if (
      bannerBottom === null ||
      bannerBottom === undefined ||
      bannerBottom === [] ||
      bannerBottom === ""
    )
      bannerBottom = [];
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.getCommunityData();
    this.cekplatformdevice();
    this.localStorageHandle();
    // document.addEventListener("message", this.onMessage);
    // window.addEventListener("message", this.onMessage);
  };

  componentWillUnmount = () => {
    // document.removeEventListener("message", this.onMessage);
    // window.removeEventListener("message", this.onMessage);
  };

  //===================Request Api Services=========================//
  getCommunityData = () => {
    appLoadBanner(this.state.community)
      .then((response) => {
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let adv = [];
          for (let i = 0; i < result.records.length; i++) {
            for (let idx = 0; idx < result.records[i].bannerpic.length; idx++) {
              adv.push({
                src: result.records[i].bannerpic[idx].banner,
                altText: "slide" + idx,
                caption: "cap" + idx,
              });
            }
          }
          localStorage.setItem("TOP", JSON.stringify(adv));
          this.setState({ AdvCommunity: adv });
          // console.log(this.state.AdvCommunity);

          let advBottom = [];
          for (let i = 0; i < result.records.length; i++) {
            for (
              let idx = 0;
              idx < result.records[i].gallerypic.length;
              idx++
            ) {
              advBottom.push({
                src: result.records[i].gallerypic[idx].gallery,
                altText: "slide" + idx,
                caption: "cap" + idx,
              });
            }
          }
          this.setState({ AdvCommunityBottom: advBottom });
          localStorage.setItem("BOTTOM", JSON.stringify(advBottom));
          // console.log(this.state.AdvCommunityBottom);

          let videoAdvTop = [];
          for (let i = 0; i < result.records.length; i++) {
            for (
              let idx = 0;
              idx < result.records[i].bannerVideoTop.length;
              idx++
            ) {
              videoAdvTop.push({
                src: result.records[i].bannerVideoTop[idx].videoURLTop,
                altText: "slide" + idx,
                caption: "cap" + idx,
              });
            }
          }
          this.setState({ videoAdvTop: videoAdvTop });
          localStorage.setItem("VideoTOP", JSON.stringify(videoAdvTop));
          // console.log(this.state.videoAdvTop);

          let videoAdvBottom = [];
          for (let i = 0; i < result.records.length; i++) {
            for (
              let idx = 0;
              idx < result.records[i].bannerVideoBottom.length;
              idx++
            ) {
              videoAdvBottom.push({
                src: result.records[i].bannerVideoBottom[idx].videoURLBottom,
                poster:
                  result.records[i].bannerVideoBottom[idx].videoURLBottom +
                  "#t=0.1",
                altText: "slide" + idx,
                caption: "cap" + idx,
              });
            }
          }
          this.setState({ videoAdvBottom: videoAdvBottom });
          localStorage.setItem("VideoBOTTOM", JSON.stringify(videoAdvBottom));
          // console.log(this.state.videoAdvBottom);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  doUsePlatformUser = (phonenumber, platform) => {
    app_update_platform(phonenumber, platform)
      .then((response) => {
        // let result = response.data;
        // console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doDeleteShortcut = () => {
    let dataPhone = this.state.phoneno;
    deleteShortcut(dataPhone)
      .then((response) => {
        let result = response.data;
        if (result.status === "ok") {
          this.setState({
            showShortcut: [],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doLoadShortCut = (phoneno) => {
    apiLoadShortcut(phoneno)
      .then((response) => {
        let result = response.data.records;
        if (result.length > 0) {
          this.setState({
            showShortcut: result,
          });

          this.getDataVmsVenue(phoneno, result[0].venueId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doCheckProfile = (phoneno) => {
    apiVmsProfile(phoneno)
      .then((response) => {
        this.setState({
          vmsUserFacePic: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getDataVmsVenue = (phone, venueId) => {
    apiVmsListByVenueId(phone, venueId)
      .then((response) => {
        let resData = response.data.DataVisitor;
        if (resData.length > 0) {
          this.setState({
            dataVisitorVms: resData,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  doCheckAppointmentNow = (data) => {
    apiCheckValidationVenue(data[0].phonenumber, data[0].venueId)
      .then((response) => {
        // console.log(response);
        if (response.data.status !== "OK") {
          this.doSubmitVms(this.state.dataVisitorVms);
        } else {
          this.setState({
            setOpenValidation: true,
            setVisitLocation: this.state.dataVisitorVms[0].visitLocation,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doSubmitVms = (dtVisitor) => {
    if (dtVisitor.length > 0) {
      const format1 = "YYYY-MM-DD HH:mm:ss";
      const format2 = "YYYY-MM-DD";
      var date1 = new Date();
      var dateIn = moment(date1).format(format1);
      var dateOut = moment(date1).format(format2);

      var dtVMS = dtVisitor[0];

      this.setState({
        statusVaksinUser: dtVMS.status_vaksin,
        setVisitLocation: dtVMS.visitLocation,
      });

      var name = dtVMS.fullname;
      var first_name = name.split(" ")[0];
      var last_name = name.substring(first_name.length).trim();

      let params = {
        VisitId: 0,
        name: name,
        nameFirst: first_name,
        nameLast: last_name,
        nickname: dtVMS.nickname,
        gender: dtVMS.gender,
        userId: dtVMS.CompanyId,
        partment: "",
        category: "1",
        shift: "1",
        phone: this.state.phoneno,
        identity: dtVMS.Identity,
        employeeId: "",
        nationality: dtVMS.Nationality,
        idType: dtVMS.IdType,
        idNo: dtVMS.Identity,
        visitContact: dtVMS.visitContact,
        visitReason: dtVMS.visitReason,
        visitCompany: dtVMS.visitDepartment,
        notes: dtVMS.Notes,
        facePics: this.state.vmsUserFacePic[0].facePics,
        PcrAntigen: "",
        PcrAntigenPcr: "",
        checkIn: dateIn,
        checkOut: dateOut + " 23:59:59",
        vaksin: dtVMS.status_vaksin,
        visitLocation: dtVMS.visitLocation,
        venueId: dtVMS.venueId,
        statusApproval: dtVMS.statusApprove,
        createShortcut: 1,
      };
      // console.log("cek data params", params);
      this.setState({ circleLoading: false });

      apiVmsto202(params)
        .then((response) => {
          this.setState({ circleLoading: false });
          if (response.data.status === "OK") {
            this.doLoadShortCut(this.state.phoneno);
            this.setState({
              setOpenSuccess: true,
            });
          }
        })
        .catch((error) => {
          this.setState({ circleLoading: false });
          console.log(error);
        });
    }
  };

  //===================Method & Function============================//

  localStorageHandle = () => {
    let videoAdvTop = JSON.parse(localStorage.getItem("VideoTOP"));
    if (
      videoAdvTop === null ||
      videoAdvTop === undefined ||
      videoAdvTop === [] ||
      videoAdvTop === ""
    )
      videoAdvTop = [];
    this.setState({ videoAdvTop: videoAdvTop });

    let videoAdvBottom = JSON.parse(localStorage.getItem("VideoBOTTOM"));
    if (
      videoAdvBottom === null ||
      videoAdvBottom === undefined ||
      videoAdvBottom === [] ||
      videoAdvBottom === ""
    )
      videoAdvBottom = [];
    this.setState({ videoAdvBottom: videoAdvBottom });

    let bannerTop = JSON.parse(localStorage.getItem("TOP"));
    if (
      bannerTop === null ||
      bannerTop === undefined ||
      bannerTop === [] ||
      bannerTop === ""
    )
      bannerTop = [];
    this.setState({ AdvCommunity: bannerTop });

    let bannerBottom = JSON.parse(localStorage.getItem("BOTTOM"));
    if (
      bannerBottom === null ||
      bannerBottom === undefined ||
      bannerBottom === [] ||
      bannerBottom === ""
    )
      bannerBottom = [];
    this.setState({ AdvCommunityBottom: bannerBottom });
  };

  cekplatformdevice = () => {
    let PlatformDevice = localStorage.getItem("PlatformDevice");
    // console.log("cek platform", PlatformDevice);
    this.setState({
      platform: PlatformDevice,
    });
    this.loadUser(PlatformDevice);
  };

  loadUser = (PlatformDevice) => {
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
      this.doLoadShortCut(info.phonenumber);
      this.doCheckProfile(info.phonenumber);
      if (PlatformDevice === '"ios"' || PlatformDevice === "ios") {
        let platformiOS = "IOS";
        this.doUsePlatformUser(info.phonenumber, platformiOS);
      } else if (PlatformDevice === null || PlatformDevice === "") {
        let platformAndroid = "ANDROID";
        this.doUsePlatformUser(info.phonenumber, platformAndroid);
      }
    } else {
      this.props.history.push("/login");
      this.setState({
        phoneno: "082216825612",
      });
      this.doCheckProfile("082216825612");
      this.doLoadShortCut("082216825612");
    }
  };

  onMessage = (data) => {
    //alert('');
    let messContent = null;
    if (data.data) messContent = JSON.parse(data.data);

    if (messContent) {
      if (messContent.code === "DevicePlatform") {
        localStorage.setItem(
          "PlatformDevice",
          JSON.stringify(messContent.param)
        );
        window.postMessage('{"code":"receivePlatform"}', "*");
      } else if (messContent.code === "login") {
        // messContent.param.phoneno = messContent.param.phonenumber;
        localStorage.setItem(
          "smart-app-id-login",
          JSON.stringify(messContent.param)
        );
        window.postMessage('{"code":"receivelogin"}', "*");
      } else if (messContent.code === "binding") {
        // messContent.param.debtor = messContent.param.DebtorAcct;
        localStorage.setItem(
          "smart-app-id-binding",
          JSON.stringify(messContent.param)
        );
        window.postMessage('{"code":"receiveloginBinding"}', "*");
      } else if (messContent.code === "token") {
        localStorage.setItem(
          "smart-app-id-token",
          JSON.stringify(messContent.param)
        );
        window.postMessage('{"code":"receiveloginToken"}', "*");
      } else if (messContent.code === "user") {
        localStorage.setItem(
          "Modernland-Account",
          JSON.stringify(messContent.param)
        );
        window.postMessage('{"code":"receiveloginUser"}', "*");
      } else if (messContent.code === "logout") {
        localStorage.setItem("smart-app-id-login", null);
        localStorage.removeItem("smart-app-id-login");
        localStorage.setItem("smart-app-id-binding", null);
        localStorage.removeItem("smart-app-id-binding");
        localStorage.setItem("Modernland-Account", null);
        localStorage.removeItem("Modernland-Account");
        localStorage.setItem("smart-app-id-token", null);
        localStorage.removeItem("smart-app-id-token");
        window.postMessage('{"code":"receivelogout"}', "*");
      }
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
        '{"title":"","canGoBack":false, "showCommunityName":true, "hideTopbar":false, "hideFooterMenu":false}';
      window.postMessage(param, "*");
    }
  }

  handleChangeIndex = (index) => {
    this.setState({
      index,
    });
  };

  doAddVms = () => {
    let dataSortcut = this.state.showShortcut;
    if (dataSortcut.length > 0) {
      this.doCheckAppointmentNow(dataSortcut);
    }
  };

  renderShortCut = () => {
    if (this.state.showShortcut.length > 0) {
      return (
        <ShortcutAdd
          title="reservation now"
          circleLoading={this.state.circleLoading}
          add={this.doAddVms}
          delete={this.doDeleteShortcut}
        />
      );
    }
  };

  handleCloseSuccess = () => {
    this.setState({
      setOpenSuccess: false,
      statusVaksinUser: 0,
    });
  };

  handleCloseValidation = () => {
    this.setState({
      setOpenValidation: false,
    });
  };

  renderAdvCommunity = () => {
    const { index } = this.state;
    if (
      this.state.AdvCommunity.length > 0 &&
      this.state.videoAdvTop.length > 0
    ) {
      return (
        <div style={styles.root}>
          <SwipeableViews
            enableMouseEvents
            index={index}
            onChangeIndex={this.handleChangeIndex}
          >
            {this.state.videoAdvTop.map((item) => (
              <div key={item.src} className="home-header">
                <div className="home-banner-container">
                  <Player
                    poster={item.src}
                    // autoPlay
                    fluid={false}
                    width={"100%"}
                    height={"100%"}
                    aspectRatio={"16:9"}
                  >
                    <source src={item.src} />
                    <ControlBar autoHide={false} disableDefaultControls={true}>
                      <PlayToggle />
                      <VolumeMenuButton disabled />
                    </ControlBar>
                  </Player>

                  {/* <Player
                    fluid={false}
                    width={"100%"}
                    height={"100%"}
                    aspectRatio={"16:9"}
                  >
                    <source src={item.poster} />
                    <ControlBar autoHide={false} disableDefaultControls={true}>
                      <PlayToggle />
                      <VolumeMenuButton disabled />
                    </ControlBar>
                  </Player> */}
                </div>
              </div>
            ))}
            {this.state.AdvCommunity.map((item) => (
              <div key={item.src} className="home-header">
                <div className="home-banner-container">
                  <img
                    src={item.src}
                    alt={item.altText}
                    className="home-banner"
                  />
                </div>
              </div>
            ))}
          </SwipeableViews>
          <Pagination
            dots={
              this.state.videoAdvTop.length + this.state.AdvCommunity.length
            }
            index={index}
            onChangeIndex={this.handleChangeIndex}
          />
        </div>
      );
    } else {
      return (
        <div style={styles.root}>
          <AutoPlaySwipeableViews
            enableMouseEvents
            index={index}
            onChangeIndex={this.handleChangeIndex}
          >
            {this.state.AdvCommunity.map((item) => (
              <div key={item.src} className="home-header">
                <div className="home-banner-container">
                  <img
                    src={item.src}
                    alt={item.altText}
                    className="home-banner"
                  />
                </div>
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <Pagination
            dots={this.state.AdvCommunity.length}
            index={index}
            onChangeIndex={this.handleChangeIndex}
          />
        </div>
      );
    }
  };

  handleChangeIndexBotom = (index2) => {
    this.setState({
      index2,
    });
  };

  renderAdvCommunityBottom = () => {
    const { index2 } = this.state;
    if (
      this.state.AdvCommunityBottom.length > 0 &&
      this.state.videoAdvBottom.length > 0
    ) {
      return (
        <div style={styles.root}>
          <SwipeableViews
            enableMouseEvents
            index={index2}
            onChangeIndex={this.handleChangeIndexBotom}
          >
            {this.state.videoAdvBottom.map((item) => (
              <div key={item.src} className="home-header">
                <div className="home-banner-container">
                  <Player
                    fluid={false}
                    width={"100%"}
                    height={"100%"}
                    aspectRatio={"16:9"}
                  >
                    <source src={item.poster} />
                    <ControlBar autoHide={false} disableDefaultControls={true}>
                      <PlayToggle />
                      <VolumeMenuButton disabled />
                    </ControlBar>
                  </Player>
                </div>
              </div>
            ))}
            {this.state.AdvCommunityBottom.map((item) => (
              <div key={item.src} className="home-header">
                <div className="home-banner-container">
                  <img
                    src={item.src}
                    alt={item.altText}
                    className="home-banner"
                  />
                </div>
              </div>
            ))}
          </SwipeableViews>
          <Pagination
            dots={
              this.state.videoAdvBottom.length +
              this.state.AdvCommunityBottom.length
            }
            index={index2}
            onChangeIndex={this.handleChangeIndexBotom}
          />
        </div>
      );
    } else {
      return (
        <div style={styles.root}>
          <AutoPlaySwipeableViews
            enableMouseEvents
            index={index2}
            onChangeIndex={this.handleChangeIndexBotom}
          >
            {this.state.AdvCommunityBottom.map((item) => (
              <div key={item.src} className="home-header">
                <div className="home-banner-container">
                  <img
                    src={item.src}
                    alt={item.altText}
                    className="home-banner"
                  />
                </div>
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <Pagination
            dots={this.state.AdvCommunityBottom.length}
            index={index2}
            onChangeIndex={this.handleChangeIndexBotom}
          />
        </div>
      );
    }
  };

  renderMenuIcon = (icon, i) => {
    return (
      <div key={i} className="icon-column">
        <Link to={icon.link} style={{ textDecoration: "none" }}>
          <div className="link-label">
            <img
              src={icon.image}
              style={{ height: 60, width: 60 }}
              alt="Icon"
            />
            <br />
            {icon.label}
          </div>
        </Link>
      </div>
    );
  };

  renderDialogValidation = () => {
    return (
      <Dialog
        open={this.state.setOpenValidation}
        onClose={this.handleCloseValidation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              You have made an appointment with {this.state.setVisitLocation}{" "}
              today. Please try the next day.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleCloseValidation}
            color="primary"
            autoFocus
          >
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderDialogSuccess = () => {
    return (
      <Dialog
        open={this.state.setOpenSuccess}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.statusVaksinUser === parseInt(2)
                ? "Your reservation has been successfully submitted"
                : this.state.statusVaksinUser === parseInt(1)
                ? "You have been vaccinated and your visit reservation has been successfully submitted."
                : "Your visit cannot be continued, because you have not been vaccinated."}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseSuccess} color="primary" autoFocus>
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  logout = () => {
    window.localStorage.removeItem("smart-app-id-login");
    this.props.history.push("/");
  };

  handleChangeNavigation = (event, value) => {
    this.setState({ NavigationIndex: value });
  };

  renderNavigation = () => {
    return (
      <BottomNavigation
        showLabels
        value={this.state.NavigationIndex}
        onChange={this.handleChangeNavigation}
        style={{
          backgroundColor: "#d9d9d9",
          borderTopWidth: 1,
          borderColor: "#d9d9d9",
          position: "fixed",
          width: "100%",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomNavigationAction
          label="Home"
          // value={this.state.NavigationIndex}
          icon={<Home style={{ width: 30, height: 30 }} />}
        />
        <BottomNavigationAction
          label="Log out"
          // value="favorites"
          icon={<ExitToApp style={{ width: 30, height: 30 }} />}
          onClick={() => {
            this.logout();
          }}
        />
      </BottomNavigation>
    );
  };

  render() {
    if (this.state.redirect) {
      if (this.state.page === "connectionsetting") {
        return <Redirect to="/connectionsetting" />;
      } else if (this.state.page === "entertainment") {
        return <Redirect to="/entertainment" />;
      } else if (this.state.page === "marketplace") {
        return <Redirect to="/marketplace" />;
      } else if (this.state.page === "statuspayment") {
        return <Redirect to="/statuspayment" />;
      } else if (this.state.page === "logview") {
        return <Redirect to="/logview" />;
      }
    }
    return (
      <StyledContainer maxWidth="xs" xs={12}>
        <div className="HomeBanner">{this.renderAdvCommunity()}</div>
        <div className="icons">
          <div className="home-icons-container">
            {icons.map((icon, i) => this.renderMenuIcon(icon, i))}
          </div>
        </div>
        {this.renderShortCut()}
        {this.renderDialogValidation()}
        {this.renderDialogSuccess()}
        {this.renderNavigation()}
      </StyledContainer>
    );
  }
}
export default HomePage;

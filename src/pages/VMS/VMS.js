import React, { Component } from "react";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import SubHeader from "../../components/SubHeader/SubHeader";
import DataEmpety from "../../components/NoData/NoData";
import TooltipAdd from "../../components/Tooltip/Tooltip";
import more from "../../assets/more.png";
import {
  apiVmsProfile,
  apiLoadVms,
  apiLoadVmsById,
  apiCheckValidation,
  apiVmsto202,
  apiCheckValidationCompy,
  apiLoadVenue,
} from "../../services/ConfigServices";
import "./VMS.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const stylesDialog = {
  appBar: {
    position: "relative",
    backgroundColor: "#2e6da4",
  },
  title: {
    marginLeft: 0,
    flex: 1,
    fontSize: 16,
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class VMSPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      currentServiceCategoryId: 0,
      InProgress: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      Completed: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      phoneno: "",
      fullname: "",
      vmsUserFacePic: [],
      limitList: 10,
      setOpenValidation: false,
      statusUser: 3,
      setOpenAkses: false,
      setOpenVisit: false,
      runCircleLoading: false,
      dtLocation: "",
      locationVenue: [],
      currentBookingCategoryId: 0,
      setFaceValid: false,
      SetDataVisitorList: [],
      setViewVMS: false,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.loadVenue();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=================Request API Service==================//
  loadVenue = () => {
    apiLoadVenue()
      .then((response) => {
        // console.log(response);
        this.setState({
          locationVenue: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doCheckProfile = (phoneno) => {
    apiVmsProfile(phoneno)
      .then((response) => {
        // console.log(response);
        this.setState({
          vmsUserFacePic: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadVmsList = (phone) => {
    // this.state.news.showLoadMore = false;
    this.setState({ showLoading: true });
    this.setState({ onload: true });
    apiLoadVms(this.state.InProgress.currentIndex, this.state.limitList, phone)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.InProgress.list;

          for (var i = 0; i < result.DataVisitor.length; i++) {
            result.DataVisitor[i].Notes = decodeURIComponent(
              result.DataVisitor[i].Notes
            );
            list.push(result.DataVisitor[i]);
          }

          let next = this.state.InProgress.currentIndex;
          if (result.DataVisitor.length > 0) next += 1;

          let show = true;
          if (result.DataVisitor.length < this.state.limitList) show = false;

          this.setState({
            InProgress: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
            setOpenValidation: false,
            setOpenVisit: false,
          });

          // console.log(this.state.news);
        }
        setTimeout(() => {
          this.setState({ showLoading: false });
        }, 500);
      })
      .catch((error) => {
        // this.state.news.showLoadMore = false;
        this.setState({ onload: false });
        console.log(error);
      });
  };

  loadVmsListByVenue = (venueId) => {
    // this.state.news.showLoadMore = false;
    this.setState({ showLoading: true });
    this.setState({ onload: true });
    apiLoadVmsById(0, this.state.limitList, this.state.phoneno, venueId)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.InProgress.list;

          for (var i = 0; i < result.DataVisitor.length; i++) {
            result.DataVisitor[i].Notes = decodeURIComponent(
              result.DataVisitor[i].Notes
            );
            list.push(result.DataVisitor[i]);
          }

          let next = this.state.InProgress.currentIndex;
          if (result.DataVisitor.length > 0) next += 1;

          let show = true;
          if (result.DataVisitor.length < this.state.limitList) show = false;

          this.setState({
            InProgress: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
            setOpenValidation: false,
            setOpenVisit: false,
          });

          // console.log(this.state.news);
        }
        setTimeout(() => {
          this.setState({ showLoading: false });
        }, 500);
      })
      .catch((error) => {
        // this.state.news.showLoadMore = false;
        this.setState({ onload: false });
        console.log(error);
      });
  };

  doCheckAppointment = () => {
    apiCheckValidation(this.state.phoneno)
      .then((response) => {
        // console.log(response);
        if (response.data.status === "OK") {
          // console.log("cek data");
          this.setState({
            setOpenVisit: true,
          });

          // this.props.history.push("/vmsform");
        } else {
          // console.log("validation");
          // this.setState({ setOpenValidation: true });
          if (this.state.InProgress.list.length > 0) {
            this.setState({
              setOpenVisit: true,
            });
          } else {
            this.props.history.push("/vmsform");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doCheckAppointmentNow = (dataVisitor) => {
    apiCheckValidationCompy(this.state.phoneno, dataVisitor.CompanyId)
      .then((response) => {
        // console.log(response);
        if (response.data.status !== "OK") {
          this.doSubmitVms(dataVisitor);
        } else {
          // console.log("cek appointmet", dataVisitor);
          this.setState({
            setOpenVisit: false,
          });
          this.setState({
            setOpenValidation: true,
            dtLocation: dataVisitor.visitLocation,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doSubmitVms = (dataVisitor) => {
    this.setState({
      setOpenVisit: false,
    });
    const format1 = "YYYY-MM-DD HH:mm:ss";
    const format2 = "YYYY-MM-DD";
    var date1 = new Date();
    var dateIn = moment(date1).format(format1);
    var dateOut = moment(date1).format(format2);

    var name = this.state.fullname;
    var first_name = name.split(" ")[0];
    var last_name = name.substring(first_name.length).trim();

    let params = {
      name: this.state.fullname,
      nameFirst: first_name,
      nameLast: last_name,
      gender: dataVisitor.gender,
      userId: dataVisitor.CompanyId,
      partment: "",
      category: "1",
      shift: "1",
      phone: this.state.phoneno,
      identity: dataVisitor.Identity,
      employeeId: "",
      nationality: dataVisitor.Nationality,
      idType: dataVisitor.IdType,
      idNo: dataVisitor.Identity,
      visitContact: dataVisitor.visitContact,
      visitReason: dataVisitor.visitReason,
      visitCompany: dataVisitor.visitDepartment,
      notes: dataVisitor.Notes,
      facePics: this.state.vmsUserFacePic[0].facePics,
      PcrAntigen: "",
      PcrAntigenPcr: "",
      checkIn: dateIn,
      checkOut: dateOut + " 23:59:59",
      vaksin: dataVisitor.status_vaksin,
      visitLocation: dataVisitor.visitLocation,
    };

    // console.log("cek data params", params);

    apiVmsto202(params)
      .then((response) => {
        this.setState({ circleLoading: false });
        if (response.data.status === "OK") {
          this.setState({
            InProgress: {
              list: [],
              currentIndex: 0,
              showLoadMore: false,
            },
            runCircleLoading: true,
            setOpenValidation: false,
            setOpenVisit: false,
          });
          this.loadVmsList(this.state.phoneno);
          // this.handleCloseDialogVisit();
        }
      })
      .catch((error) => {
        this.setState({ circleLoading: false });
        console.log(error);
      });
  };

  //=================Function & Method ===================//
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
        "Visitor Management" +
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
        statusUser: info.statusownerid,
        fullname: info.name,
        identity: info.ktp,
      });
      this.doCheckProfile(info.phonenumber);
      this.loadVmsList(info.phonenumber);
    } else {
      this.setState({
        phoneno: "082216825612",
        fullname: "Uci Baetulloh",
        statusUser: 3,
        identity: "3278070712960005",
      });
      this.doCheckProfile("082216825612");
      this.loadVmsList("082216825612");
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
      if (this.state.InProgress.showLoadMore === true) {
        this.loadVmsList(this.state.phoneno);
      }
    }
  };

  handleCloseViewVMS = () => {
    this.setState({
      setViewVMS: false,
      SetDataVisitorList: [],
    });
  };

  handleCloseValidation = () => {
    this.setState({
      setOpenValidation: false,
      dtLocation: "",
    });
  };

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleChangeIndex = (index) => {
    this.setState({
      index: index,
    });
  };

  handleChangeIdx = (index) => {
    this.setState({
      index: index,
    });
  };

  goBack = () => {
    this.props.history.push("/home");
  };

  doAddVms = () => {
    if (this.state.InProgress.list.length > 0) {
      let dtv = this.state.InProgress.list;
      const dtr = dtv.filter((elm) => elm.face_invalid === 1);
      // console.log(dtr);
      if (dtr.length > 0) {
        this.setState({
          setFaceValid: true,
        });
      } else {
        this.props.history.push("/vmsform");
      }
    } else {
      this.props.history.push("/vmsform");
    }

    // if (this.state.statusUser === 3) {
    //   if (this.state.vmsUserFacePic.length > 0) {
    //     this.doCheckAppointment();
    //   } else {
    //     // console.log("kosong");
    //     this.gotoVmsProfile();
    //   }
    // } else {
    //   this.setState({
    //     setOpenAkses: true,
    //   });
    // }
  };

  handleCloseDialogFace = () => {
    this.gotoVmsProfile();
    this.setState({
      setFaceValid: false,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      setOpenAkses: false,
    });
  };

  handleCloseDialogVisit = () => {
    this.setState({
      setOpenVisit: false,
    });
  };

  gotoVmsProfile = () => {
    // this.props.history.push("/");
    let param = '{"code":"need-facepics"}';
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

  renderDot = (dt) => {
    if (dt.statusVisitor === 0 && dt.face_invalid === 0) {
      return (
        <div className="dotContainer">
          <FiberManualRecordIcon
            style={{ width: 20, height: 20, color: "#ff6900" }}
          />
        </div>
      );
    } else if (dt.statusVisitor === 1 && dt.face_invalid === 0) {
      return (
        <div className="dotContainer">
          <FiberManualRecordIcon
            style={{ width: 20, height: 20, color: "#1976d2" }}
          />
        </div>
      );
    } else if (dt.statusVisitor === 1 && dt.face_invalid === 1) {
      return (
        <div className="dotContainer">
          <ErrorOutlineIcon style={{ width: 20, height: 20, color: "red" }} />
        </div>
      );
    }
  };

  renderStatusVms = (dt) => {
    if (dt.statusVisitor === 0 && dt.face_invalid === 0) {
      return (
        <ListItemText
          primary="Waiting"
          primaryTypographyProps={{
            style: {
              color: "#ff6900",
              fontWeight: 500,
              fontSize: 14,
            },
          }}
        />
      );
    } else if (dt.statusVisitor === 1 && dt.face_invalid === 0) {
      return (
        <ListItemText
          primary="Accepted"
          primaryTypographyProps={{
            style: {
              color: "#1976d2",
              fontWeight: 500,
              fontSize: 14,
            },
          }}
        />
      );
    } else if (dt.statusVisitor === 1 && dt.face_invalid === 1) {
      return (
        <ListItemText
          primary="Face Verification Failed"
          primaryTypographyProps={{
            style: {
              color: "red",
              fontWeight: 500,
              fontSize: 11,
            },
          }}
          secondary={
            <React.Fragment>
              <Button
                onClick={() => this.UpdateFace()}
                variant="outlined"
                color="primary"
              >
                <Typography
                  component="span"
                  variant="body2"
                  style={
                    (stylesListComent.inline,
                    {
                      fontSize: 11,
                      color: "#2e6da4",
                      fontWeight: "bold",
                    })
                  }
                >
                  Update Photo
                </Typography>
              </Button>
            </React.Fragment>
          }
        />
      );
    }
  };

  doViewDetail = (dt, idx) => {
    // console.log(dt, idx);

    if (dt.statusVisitor === 1 && dt.face_invalid === 1) {
      this.gotoVmsProfile();
    } else {
      // console.log("detail");
      let DataVMSView = [];
      DataVMSView.push(dt);
      this.setState({
        SetDataVisitorList: DataVMSView,
        setViewVMS: true,
      });

      // console.log(DataVMSView);
    }
  };

  UpdateFace = () => {
    this.gotoVmsProfile();
  };

  renderInProggresBody = () => {
    if (this.state.InProgress.list.length > 0) {
      return (
        <List className="list-payment-root">
          <div style={{ marginBottom: 100 }}>
            {this.state.InProgress.list.map((dt, i) => {
              return (
                <div key={dt.vmsId}>
                  <ListItem
                    alignItems="flex-start"
                    button
                    onClick={() => this.doViewDetail(dt, i)}
                  >
                    {this.renderDot(dt)}
                    <ListItemText
                      primary={
                        moment(dt.dateTimeIn).format("ll") +
                        ", " +
                        dt.dateTimeIn.substr(11, 5)
                      }
                      primaryTypographyProps={{
                        style: { color: "#000", fontWeight: 500, fontSize: 14 },
                      }}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              {
                                fontSize: 14,
                                color: "#2e6da4",
                                fontWeight: "bold",
                              })
                            }
                          >
                            {dt.visitLocation}
                          </Typography>
                          <br></br>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            {dt.visitDepartment}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <div style={{ alignSelf: "center", textAlign: "center" }}>
                      {this.renderStatusVms(dt)}
                    </div>
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </div>
        </List>
      );
    } else {
      return (
        <div className="list-payment-root">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  renderDialogValidation = () => {
    return (
      <Dialog
        open={this.state.setOpenValidation}
        onClose={this.handleCloseValidation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            component="span"
            variant="body2"
            style={
              (stylesListComent.inline,
              { fontSize: 15, color: "#2e6da4", fontWeight: "bold" })
            }
          >
            Information!
          </Typography>{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              You have made an appointment with {this.state.dtLocation} today.
              Please register the visit form the next day.
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

  renderDialogValid = () => {
    return (
      <Dialog
        open={this.state.setOpenAkses}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            component="span"
            variant="body2"
            style={
              (stylesListComent.inline,
              { fontSize: 15, color: "#ff9800", fontWeight: "bold" })
            }
          >
            Waring!
          </Typography>{" "}
        </DialogTitle>
        <DialogContent style={{ maxWidth: 250, width: 300 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              You cannot make an appointment, this menu is only accessible to
              visitors
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
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

  renderDialogFaceValid = () => {
    return (
      <Dialog
        open={this.state.setFaceValid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ maxWidth: 250, width: 300 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, fontWeight: "bold", color: "red" })
              }
            >
              Face verification failed.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleCloseDialogFace}
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
              Update Photo
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderDialogVisit() {
    // console.log("cek open visit", this.state.setOpenVisit);
    if (this.state.setOpenVisit === true) {
      if (this.state.InProgress.list.length > 0) {
        var DataVisitor = this.state.InProgress.list[0];
        var location = this.state.InProgress.list[0].visitLocation;

        return (
          <Dialog
            open={this.state.setOpenVisit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {this.state.runCircleLoading === false ? (
              <>
                <DialogTitle id="alert-dialog-title">
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 15, color: "#2e6da4", fontWeight: "bold" })
                    }
                  >
                    Confirmation!
                  </Typography>{" "}
                </DialogTitle>
                <DialogContent style={{ maxWidth: 300, width: 300 }}>
                  <DialogContentText id="alert-dialog-description">
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333" })
                      }
                    >
                      Do you want to revisit {location}?
                    </Typography>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => this.doCheckAppointmentNow(DataVisitor)}
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
                      Yes
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.history.push("/vmsform");
                    }}
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
                      No, go to new location
                    </Typography>
                  </Button>
                </DialogActions>
              </>
            ) : (
              <>
                {/* <CircularProgress size={24} />
                <Typography
                  component="span"
                  variant="body2"
                  style={
                    (stylesListComent.inline, { fontSize: 14, color: "#333" })
                  }
                >
                  Loading...
                </Typography> */}
              </>
            )}
          </Dialog>
        );
      } else {
        this.props.history.push("/vmsform");
      }
    }
  }

  handleSelectCategory = (id) => {
    this.setState({
      currentBookingCategoryId: id,
      InProgress: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
    });

    this.loadVmsListByVenue(id);
  };

  renderBookingCategory = (dtCategory) => {
    if (dtCategory.value === this.state.currentBookingCategoryId) {
      return (
        <div
          className="booking-link-label booking-link-active"
          onClick={() => this.handleSelectCategory(dtCategory.value)}
        >
          <img src={dtCategory.Icon} alt={"icon"} />
          <br />
          {dtCategory.label}{" "}
        </div>
      );
    } else {
      return (
        <div
          className="booking-link-label"
          onClick={() => this.handleSelectCategory(dtCategory.value)}
        >
          <img src={dtCategory.Icon} alt="icon" />
          <br />
          {dtCategory.label}{" "}
        </div>
      );
    }
  };

  renderBookingCategoryDt = (dtCategory) => {
    if (dtCategory.value === this.state.currentBookingCategoryId) {
      return (
        <div
          className="booking-link-label booking-link-active"
          onClick={() => this.handleSelectCategory(dtCategory.value)}
        >
          <img src={dtCategory.Icon} alt={"icon"} />
          <br />
          {dtCategory.label}
        </div>
      );
    } else {
      return (
        <div
          className="booking-link-label"
          onClick={() => this.handleSelectCategory(dtCategory.value)}
        >
          <img src={dtCategory.Icon} alt="icon" />
          <br />
          {dtCategory.label}{" "}
        </div>
      );
    }
  };

  renderVenue = () => {
    const all = {
      value: 0,
      label: "All",
      Icon: more,
    };

    return (
      <div>
        <div className="booking-icons">
          <div className="booking-icons-container">
            <table className="table-icon">
              <tbody>
                <tr>
                  <td>
                    <div className="booking-icon-column">
                      {this.renderBookingCategory(all)}
                    </div>
                  </td>
                  {this.state.locationVenue.map((category, i) => (
                    <td>
                      <div key={category.value} className="booking-icon-column">
                        {this.renderBookingCategoryDt(category)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  renderDialogViewInvoice = () => {
    const { SetDataVisitorList } = this.state;

    if (SetDataVisitorList.length > 0) {
      return (
        <Dialog
          fullScreen
          open={this.state.setViewVMS}
          onClose={() => this.handleCloseViewVMS()}
          TransitionComponent={Transition}
        >
          <AppBar style={stylesDialog.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.handleCloseViewVMS()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={stylesDialog.title}>
                {SetDataVisitorList[0].visitLocation}
              </Typography>
            </Toolbar>
          </AppBar>

          <List className="root-viewInv">
            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Check-in Date
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {moment(SetDataVisitorList[0].dateTimeIn).format("ll") +
                        ", " +
                        SetDataVisitorList[0].dateTimeIn.substr(11, 5)}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Location
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {SetDataVisitorList[0].visitDepartment}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Contact
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {SetDataVisitorList[0].visitContact}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Reason
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {SetDataVisitorList[0].visitReason}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Status
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              {this.renderStatusVMSview(SetDataVisitorList[0])}
            </ListItem>
            <Divider />
          </List>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  renderStatusVMSview = (dt) => {
    if (dt.statusVisitor === 0 && dt.face_invalid === 0) {
      return (
        <ListItemText
          style={{ textAlign: "right" }}
          primary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                style={
                  (stylesListComent.inline,
                  { fontSize: 14, color: "#ff6900", textAlign: "center" })
                }
              >
                Waiting
              </Typography>
              <br></br>
            </React.Fragment>
          }
        />
      );
    } else if (dt.statusVisitor === 1 && dt.face_invalid === 0) {
      return (
        <ListItemText
          style={{ textAlign: "right" }}
          primary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                style={
                  (stylesListComent.inline,
                  { fontSize: 14, color: "#1976d2", textAlign: "center" })
                }
              >
                Accepted
              </Typography>
              <br></br>
            </React.Fragment>
          }
        />
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
            title="Visitor Management"
            goBack={this.goBack}
          />
          {this.renderVenue()}
        </div>
        <div className="contents">{this.renderInProggresBody()}</div>
        <TooltipAdd add={this.doAddVms} />
        {this.renderDialogValidation()}
        {this.renderDialogValid()}
        {this.renderDialogVisit()}
        {this.renderDialogFaceValid()}
        {this.renderDialogViewInvoice()}
      </div>
    );
  }
}

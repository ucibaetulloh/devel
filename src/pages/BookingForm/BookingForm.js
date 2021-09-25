import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import {
  CardHeader,
  Typography,
  Divider,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Room } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import FbImageLibrary from "react-fb-image-grid";
import { CardMoment, styles } from "./Style";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonSave from "../../components/Button/Button";
import "./BookingForm.style.css";
// import { api_add_complaint } from "../../services/ConfigServices";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import Select from "react-select";
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
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuId: props.match.params.id,
      menuName: props.match.params.title,
      incidentDate: new Date(),
      complaint: "",
      complaintDesc: "",
      phoneno: "",
      name: "",
      gallery: [
        "http://placeimg.com/1200/800/nature",
        "http://placeimg.com/800/1200/nature",
        "http://placeimg.com/1920/1080/nature",
        "http://placeimg.com/1500/500/nature",
      ],
      setOpenBooking: false,
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      hourIn: "",
      hourOut: "",
      options: [
        { value: 60, label: "1 hour" },
        { value: 120, label: "2 hours" },
        { value: 180, label: "3 hours" },
        { value: 240, label: "4 hours" },
        { value: 300, label: "5 hours" },
        { value: 360, label: "6 hours" },
        { value: 420, label: "7 hours" },
        { value: 480, label: "8 hours" },
        { value: 540, label: "9 hours" },
        { value: 600, label: "10 hours" },
        { value: 660, label: "11 hours" },
        { value: 720, label: "12 hours" },
      ],
      selectedOption: null,
      title: "",
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=====================Request API Service===================//
  doReserve = () => {
    const format1 = "YYYY-MM-DD HH:mm:ss";
    var date1 = new Date();
    var datetimecreated = moment(date1).format(format1);

    let checkOut = this.state.startDate + " " + this.state.hourIn;
    var addMinutes = new Date(checkOut);
    addMinutes.setMinutes(
      addMinutes.getMinutes() + this.state.selectedOption.value
    );
    addMinutes = new Date(addMinutes);
    var endDate = moment(addMinutes).format(format1);
    var startDate = this.state.startDate + " " + this.state.hourIn + ":00";

    let params = {
      menuId: this.state.menuId,
      createDate: datetimecreated,
      phoneno: this.state.phoneno,
      checkIn: startDate,
      checkOut: endDate,
      title: this.state.title,
    };

    console.log(params);
  };

  //=====================Method & Function=====================//

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
          name: tmp.name,
          profilepic: tmp.profilepic,
        });
      }

      let param =
        '{"title":"' +
        this.state.menuName +
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
        name: info.name,
      });
    } else {
      this.setState({
        phoneno: "082216825612",
        name: "Fuji Baetulloh",
      });
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

  handleChangeOption = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleChange = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  handleDatechange = (event) => {
    this.setState({ startDate: event.target.value });
  };

  handleDatechangeEnd = (event) => {
    this.setState({ endDate: event.target.value });
  };

  handleChangeHourIn = (event) => {
    this.setState({ hourIn: event.target.value });
  };

  handleChangeHourOut = (event) => {
    this.setState({ hourOut: event.target.value });
  };

  handleOpenDialog = () => {
    this.setState({
      setOpenBooking: true,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      setOpenBooking: false,
    });
  };

  renderFormBody = () => {
    return (
      <div className="bookingform-list">
        <CardMoment>
          <FbImageLibrary images={this.state.gallery} countFrom={2} />
          <CardHeader
            style={{ fontSize: 16 }}
            title={
              <Typography variant="body2" color="textSecondary" component="p">
                <span style={{ fontSize: 15, color: "#000" }}>
                  {this.state.menuName}{" "}
                </span>
              </Typography>
            }
            subheader={
              <>
                <div style={{ marginBottom: 6, marginTop: 6 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <span style={{ fontSize: 13 }}>Rp. 20.000 /hour</span>
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <Room />
                    &nbsp; <span style={{ fontSize: 13 }}>at 7 flour </span>
                  </Typography>
                </div>
              </>
            }
          />
          <CardContent style={{ marginTop: -20 }}>
            <Typography variant="body2" color="textSecondary" component="p">
              <span style={{ fontSize: 14, color: "#333" }}>
                {" "}
                Sort desc Sort desc Sort desc Sort desc Sort desc Sort desc Sort
                desc Sort desc Sort desc Sort desc{" "}
              </span>
            </Typography>
          </CardContent>
          <Divider />
        </CardMoment>
        <CardMoment>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="body2" color="textSecondary" component="p">
                <span style={{ fontSize: 15, color: "#000" }}>Facilities</span>
              </Typography>
            </AccordionSummary>
            <Divider />
            <List className="root-view-info">
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
                          {
                            fontSize: 14,
                            color: "#333",
                            textAlign: "center",
                          })
                        }
                      >
                        Amount
                      </Typography>
                      <br></br>
                    </React.Fragment>
                  }
                />
                <ListItemText
                  style={{ textAlign: "left", marginLeft: -50 }}
                  primary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        style={
                          (stylesListComent.inline,
                          {
                            fontSize: 14,
                            color: "#333",
                            textAlign: "center",
                          })
                        }
                      >
                        www
                      </Typography>
                      <br></br>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Accordion>
        </CardMoment>
        <CardMoment>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="body2" color="textSecondary" component="p">
                <span style={{ fontSize: 15, color: "#000" }}>
                  Services Included
                </span>
              </Typography>
            </AccordionSummary>
            <Divider />
            <List className="root-view-info">
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
                          {
                            fontSize: 14,
                            color: "#333",
                            textAlign: "center",
                          })
                        }
                      >
                        Amount
                      </Typography>
                      <br></br>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Accordion>
        </CardMoment>
        <CardMoment>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="body2" color="textSecondary" component="p">
                <span style={{ fontSize: 15, color: "#000" }}>
                  Reservation Info
                </span>
              </Typography>
            </AccordionSummary>
            <Divider />
            <List className="root-view-info">
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
                          {
                            fontSize: 14,
                            color: "#333",
                            textAlign: "center",
                          })
                        }
                      >
                        Amount
                      </Typography>
                      <br></br>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Accordion>
        </CardMoment>
      </div>
    );
  };

  renderDialogBooking = () => {
    return (
      <Dialog
        fullScreen
        open={this.state.setOpenBooking}
        onClose={() => this.handleCloseDialog()}
        TransitionComponent={Transition}
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => this.handleCloseDialog()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={stylesDialog.title}>
              Create Booking
            </Typography>
          </Toolbar>
        </AppBar>
        <List className="list-reservation-root">
          <div style={{ marginBottom: 70 }}>
            <form className="formControl-complaint">
              <TextField
                disabled
                id="standard-full-width"
                type="text"
                label="Name"
                style={{ margin: 8 }}
                value={this.state.name}
                placeholder=""
                fullWidth
                size={"medium"}
                margin="normal"
                inputProps={{
                  classes: {
                    root: styles.notchedOutline,
                    focused: styles.notchedOutline,
                    notchedOutline: styles.notchedOutline,
                  },
                  style: { fontSize: 16 },
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: 18 },
                }}
              />

              <TextField
                id="date"
                label="Check-in Date"
                type="date"
                defaultValue={this.state.startDate}
                onChange={this.handleDatechange}
                style={{ margin: 8 }}
                fullWidth
                size={"medium"}
                margin="normal"
                inputProps={{
                  classes: {
                    root: styles.notchedOutline,
                    focused: styles.notchedOutline,
                    notchedOutline: styles.notchedOutline,
                  },
                  style: { fontSize: 16 },
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: 18 },
                }}
              />

              <TextField
                id="time"
                label="Check-in Time"
                type="time"
                defaultValue={this.state.hourIn}
                onChange={this.handleChangeHourIn}
                style={{ margin: 8 }}
                fullWidth
                size={"medium"}
                margin="normal"
                inputProps={{
                  classes: {
                    root: styles.notchedOutline,
                    focused: styles.notchedOutline,
                    notchedOutline: styles.notchedOutline,
                  },
                  style: { fontSize: 16 },
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: 18 },
                }}
              />

              <div className="basic-single">
                <Typography
                  variant="subtitle1"
                  style={
                    (stylesDialog.title,
                    {
                      color: "#00000061",
                      marginBottom: 4,
                      paddingLeft: 3,
                      fontSize: 15,
                    })
                  }
                >
                  Duration
                </Typography>
                <Select
                  isClearable
                  classNamePrefix="select"
                  placeholder="Select For..."
                  value={this.state.selectedOption}
                  onChange={this.handleChangeOption}
                  options={this.state.options}
                />
              </div>

              <TextField
                id="standard-multiline-flexible"
                label="Title"
                placeholder="(Optional)"
                // multiline
                // rowsMax={2}
                value={this.state.title}
                onChange={this.handleChange}
                style={{ margin: 8 }}
                fullWidth
                autoComplete="off"
                size={"medium"}
                margin="normal"
                inputProps={{
                  classes: {
                    root: styles.notchedOutline,
                    focused: styles.notchedOutline,
                    notchedOutline: styles.notchedOutline,
                  },
                  style: { fontSize: 16, color: "#000" },
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: 18 },
                }}
              />
            </form>
          </div>
        </List>
        <ButtonSave Submit={this.doReserve} title={"Reserve"} />
      </Dialog>
    );
  };

  doSubmitComplaint = () => {
    console.log("cek data params");
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title={this.state.menuName}
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderFormBody()}</div>
        {this.renderDialogBooking()}
        <ButtonSave Submit={this.handleOpenDialog} title={"Book Now"} />
      </div>
    );
  }
}

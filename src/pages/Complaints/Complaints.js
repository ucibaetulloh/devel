import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import DataEmpety from "../../components/NoData/NoData";
import TooltipAdd from "../../components/Tooltip/Tooltip";
import {
  apiComplaintList,
  apiComplaintDeleted,
} from "../../services/ConfigServices";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import "./Complaints.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

const stylesListComent = {
  inline: {
    display: "inline",
    fontSize: 12,
    color: "#2e6da4",
  },
};

export default class ComplaintPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Complaint: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      phoneno: "",
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

  //===============Request API Service==================//
  doLoadDataComplaintUser = (phone) => {
    apiComplaintList(phone)
      .then((response) => {
        // console.log(response);
        if (response.data.status === "OK") {
          this.setState({
            Complaint: {
              list: response.data.records,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doDeleteComplaintUser = (dtComplaintDeleted) => {
    apiComplaintDeleted(dtComplaintDeleted)
      .then((response) => {
        // console.log(response);
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
        "Complaints" +
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
      this.doLoadDataComplaintUser(info.phonenumber);
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

  doDeleteComplaint = (complaintId) => {
    let dtComplaint = this.state.Complaint.list;
    const dtDelComplaint = dtComplaint.filter((rv) => rv.id === complaintId);
    const dtReadyComplaint = dtComplaint.filter((rv) => rv.id !== complaintId);

    this.doDeleteComplaintUser(dtDelComplaint[0]);

    // console.log("cek yg dihapus", dtDelComplaint);

    this.setState({
      Complaint: {
        list: dtReadyComplaint,
      },
    });
  };

  renderComplaintList = () => {
    if (this.state.Complaint.list.length > 0) {
      return (
        <List className="list-complaint">
          <div style={{ marginBottom: 70 }}>
            {this.state.Complaint.list.map((dt, i) => {
              return (
                <div key={dt.id}>
                  <ListItem button>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            style={stylesListComent.inline}
                          >
                            {moment(dt.incidentDate).format("LL")}
                          </Typography>
                          <br></br>
                          <div style={{ marginBottom: 6 }}></div>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { color: "#000", fontWeight: 450, fontSize: 11 })
                            }
                          >
                            Complaint : {dt.complaint}
                          </Typography>
                          <div style={{ marginBottom: 6 }}></div>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { color: "#000", fontWeight: 450, fontSize: 11 })
                            }
                          >
                            Description : {dt.complaintDetail}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={() => this.doDeleteComplaint(dt.id)}
                      aria-label="close"
                    >
                      <DeleteForever
                        style={{ height: 25, width: 25, color: "red" }}
                      />
                    </IconButton>
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
        <div className="list-complaint">
          <DataEmpety title="Complaint not available" />
        </div>
      );
    }
  };

  goToFormComplaint = () => {
    this.props.history.push("/complaintform");
  };

  goBack = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="Complaints"
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderComplaintList()}</div>
        <TooltipAdd add={this.goToFormComplaint} />
      </div>
    );
  }
}

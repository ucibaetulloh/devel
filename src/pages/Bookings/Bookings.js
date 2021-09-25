import React, { Component } from "react";
import { apiBookingCategory } from "../../services/ConfigServices";
import SubHeader from "../../components/SubHeader/SubHeader";
import "./Bookings.style.css";
import { styles } from "./Style";
import DataEmpety from "../../components/NoData/NoData";
import TooltipAdd from "../../components/Tooltip/Tooltip";
import SwipeableViews from "react-swipeable-views";
import {
  Tabs,
  Tab,
  AppBar,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel/TabPanel";
import more from "../../assets/more.png";
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

class BookingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      currentBookingCategoryId: 0,
      title: "Bookings",
      phoneno: "",
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
      bookingCategory: [],
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.loadBookingCategory();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //===============Request API Service================//
  loadBookingCategory = () => {
    apiBookingCategory()
      .then((response) => {
        let dtCategory = response.data;
        if (dtCategory.status === "OK") {
          this.setState({
            bookingCategory: dtCategory.records,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //===============Function & Method=================//

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

  handleSelectCategory = (id) => {
    this.setState({ currentBookingCategoryId: id });
  };

  renderBooking = () => {
    const all = {
      categoryId: 0,
      categoryName: "All",
      icon: more,
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
                  {this.state.bookingCategory.map((category, i) => (
                    <td>
                      <div
                        key={category.categoryId}
                        className="booking-icon-column"
                      >
                        {this.renderBookingCategoryDt(category)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* {this.renderBookingBody()} */}
      </div>
    );
  };

  renderBookingCategory = (dtCategory) => {
    if (dtCategory.categoryId === this.state.currentBookingCategoryId) {
      return (
        <div
          className="booking-link-label booking-link-active"
          onClick={() => this.handleSelectCategory(dtCategory.categoryId)}
        >
          <img src={dtCategory.icon} alt={"icon"} />
          <br />
          {dtCategory.categoryName}{" "}
        </div>
      );
    } else {
      return (
        <div
          className="booking-link-label"
          onClick={() => this.handleSelectCategory(dtCategory.categoryId)}
        >
          <img src={dtCategory.icon} alt="icon" />
          <br />
          {dtCategory.categoryName}{" "}
        </div>
      );
    }
  };

  renderBookingCategoryDt = (dtCategory) => {
    if (dtCategory.categoryId === this.state.currentBookingCategoryId) {
      return (
        <div
          className="booking-link-label booking-link-active"
          onClick={() => this.handleSelectCategory(dtCategory.categoryId)}
        >
          <img src={dtCategory.icon} alt={"icon"} />
          <br />
          {dtCategory.categoryName}{" "}
        </div>
      );
    } else {
      return (
        <div
          className="booking-link-label"
          onClick={() => this.handleSelectCategory(dtCategory.categoryId)}
        >
          <img src={dtCategory.icon} alt="icon" />
          <br />
          {dtCategory.categoryName}{" "}
        </div>
      );
    }
  };

  renderInProggresBody = () => {
    if (this.state.InProgress.list.length > 0) {
      return (
        <List className="list-payment-root">
          <div style={{ marginBottom: 100 }}>
            <div>
              <ListItem
                alignItems="flex-start"
                button
                // onClick={() => this.doViewInvoice(dt, i)}
              >
                <ListItemAvatar style={{ alignSelf: "center" }}>
                  <Avatar alt="" src="" />
                </ListItemAvatar>
                <ListItemText
                  primary=""
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
                          { fontSize: 14, color: "#333" })
                        }
                      >
                        {/* {dt.Category} */}
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
                        Period:
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
                        Amount:
                      </Typography>
                    </React.Fragment>
                  }
                />
                <div style={{ alignSelf: "center", textAlign: "center" }}>
                  <ListItemText
                    primary="Status"
                    primaryTypographyProps={{
                      style: {
                        color: "#000",
                        fontWeight: 500,
                        fontSize: 14,
                      },
                    }}
                    secondary={
                      <React.Fragment>
                        {/* {this.renderStatus(dt)} */}
                      </React.Fragment>
                    }
                  />
                </div>
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          </div>
        </List>
      );
    } else {
      return (
        <div className="bookings-scroll-view">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  renderCompletedBody = () => {
    if (this.state.Completed.list.length > 0) {
      return <div className="bookings-scroll-view"></div>;
    } else {
      return (
        <div className="bookings-scroll-view">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  gotoAdd = () => {
    this.props.history.push("/bookingcategory");
  };

  goBack = () => {
    this.props.history.push("/");
  };

  render() {
    const { index } = this.state;
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title={this.state.title}
            goBack={this.goBack}
          />
          <AppBar position="static" color="default">
            <Tabs
              value={index}
              indicatorColor={"primary"}
              textColor={"inherit"}
              centered={true}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#2e6da4",
                },
              }}
              onChange={this.handleChange}
            >
              <Tab
                style={styles.tab}
                onClick={() => this.handleChangeIndex(0)}
                label="In Progress"
              />
              <Tab
                style={styles.tab}
                onClick={() => this.handleChangeIndex(1)}
                label="Completed"
              />
            </Tabs>
          </AppBar>
          {this.renderBooking()}
        </div>
        <div className="contents">
          <SwipeableViews
            enableMouseEvents={true}
            index={this.state.index}
            onChangeIndex={(e) => this.handleChangeIdx(e)}
          >
            <TabPanel value={index} index={0}>
              {this.renderInProggresBody()}
            </TabPanel>
            <TabPanel value={index} index={1}>
              {this.renderCompletedBody()}
            </TabPanel>
          </SwipeableViews>
        </div>
        {this.state.index === 0 ? <TooltipAdd add={this.gotoAdd} /> : ""}
      </div>
    );
  }
}
export default BookingsPage;

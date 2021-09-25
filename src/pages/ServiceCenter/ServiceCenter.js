import React, { Component } from "react";
// import { Container, Button } from "@material-ui/core";
import SubHeader from "../../components/SubHeader/SubHeader";
import { styles } from "./Style";
import DataEmpety from "../../components/NoData/NoData";
import TooltipAdd from "../../components/Tooltip/Tooltip";
import SwipeableViews from "react-swipeable-views";
import { Tabs, Tab, AppBar } from "@material-ui/core";
import TabPanel from "../../components/TabPanel/TabPanel";
import more from "../../assets/more.png";
import "./ServiceCenter.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

export default class ServiceCenterPage extends Component {
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
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=================Request API Service==================//

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
        "Service Center" +
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
    const el = e.target.documentElement;
    const bottom = el.scrollHeight - el.scrollTop === el.clientHeight;
    if (bottom) {
      console.log("we are in the bottom services");
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

  renderservice = () => {
    const all = {
      ServiceCategoryId: 0,
      ServiceCategoryName: "All",
      icon: more,
    };

    return (
      <div className="service-icons">
        <div className="service-icons-container">
          <table className="table-icon">
            <tbody>
              <tr>
                <td>
                  <div className="service-icon-column">
                    {this.renderServiceCategory(all)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  renderServiceCategory = (dtCategory) => {
    if (dtCategory.ServiceCategoryId === this.state.currentServiceCategoryId) {
      return (
        <div
          className="service-link-label service-link-active"
          // onClick={() => this.loadWedding(category.weddingcategoryid)}
        >
          <img src={dtCategory.icon} alt={"icon"} />
          <br />
          {dtCategory.ServiceCategoryName}{" "}
        </div>
      );
    } else {
      return (
        <div
          className="service-link-label"
          // onClick={() => this.loadWedding(category.weddingcategoryid)}
        >
          <img src={dtCategory.icon} alt="icon" />
          <br />
          {dtCategory.ServiceCategoryName}{" "}
        </div>
      );
    }
  };

  renderInProggresBody = () => {
    if (this.state.InProgress.list.length > 0) {
      return (
        <div className="services-scroll-view">
          <table>
            <tbody>
              {this.state.InProgress.list.map((item, i) => (
                <tr
                  key={i}
                  className="service-list"
                  // onClick={() => this.goToWeddingDetail(item)}
                >
                  <td className="service-list-col-dot">
                    {this.renderDot(item)}
                  </td>
                  <td className="service-list-col1">
                    <div className="service-name">{item.servicename}</div>
                    <div className="service-checkin">
                      Check In: {moment(item.checkin).format("lll")}
                    </div>
                    <div className="service-checkout">
                      Check Out: {moment(item.checkout).format("lll")}
                    </div>
                    {/*<div className="service-desc">Rp. {item.price}</div>*/}
                  </td>
                  <td className="services-list-col-qty">
                    <div className="service-status-label">Status</div>
                    <div className="service-status-value">
                      {/* {this.renderStatus(item)} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="services-scroll-view">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  renderCompletedBody = () => {
    if (this.state.Completed.list.length > 0) {
      return (
        <div className="services-scroll-view">
          <table>
            <tbody>
              {this.state.Completed.list.map((item, i) => (
                <tr
                  key={i}
                  className="service-list"
                  // onClick={() => this.goToWeddingDetail(item)}
                >
                  <td className="service-list-col-dot">
                    {this.renderDot(item)}
                  </td>
                  <td className="service-list-col1">
                    <div className="service-name">{item.servicename}</div>
                    <div className="service-checkin">
                      Check In: {moment(item.checkin).format("lll")}
                    </div>
                    <div className="service-checkout">
                      Check Out: {moment(item.checkout).format("lll")}
                    </div>
                    {/*<div className="service-desc">Rp. {item.price}</div>*/}
                  </td>
                  <td className="services-list-col-qty">
                    <div className="service-status-label">Status</div>
                    <div className="service-status-value">
                      {/* {this.renderStatus(item)} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="services-scroll-view">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  gotoAdd = () => {
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
            title="Service Center"
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
          {this.renderservice()}
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
        <TooltipAdd add={this.gotoAdd} />
      </div>
    );
  }
}

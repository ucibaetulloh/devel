import React, { Component } from "react";
import {
  apiGetUserStaff,
  apiLogAllData,
  apiLog7dayData,
  apiUpdate7Day,
} from "../../services/ConfigServices";
// import { Container, Button } from "@material-ui/core";
import SubHeader from "../../components/SubHeader/SubHeader";
import { styles } from "./Style";
import DataEmpety from "../../components/NoData/NoData";
// import TooltipAdd from "../../components/Tooltip/Tooltip";
// import SwipeableViews from "react-swipeable-views";
import { Tabs, Tab, AppBar, Button, ButtonGroup } from "@material-ui/core";
// import TabPanel from "../../components/TabPanel/TabPanel";
import more from "../../assets/more.png";
import "./LogView.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

export default class LogViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      staff_id: "",
      employeeId: "",
      phonenumber: "",
      firstname: "",
      showLoading: false,
      currentIndex: 0,
      limitList: 100,
      staffid: "",
      checked: false,
      logView: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      logViewLast7days: {
        list: [],
        listTop: [],
        currentIndex: 0,
        showLoadMore: false,
      },
    };
    this.loginInfo = {
      phoneno: "",
      name: "",
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.scrollTopFunction();
    document.addEventListener("message", this.onMessage);
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    document.removeEventListener("message", this.onMessage);
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=================Request API Service==================//

  getUserLog = (employeeId) => {
    apiGetUserStaff(employeeId)
      .then((response) => {
        let result = response.data;
        console.log(result);
        if (result.status === "OK") {
          let dataLogUserId = result.records;
          for (var i = 0; i < dataLogUserId.length; i++) {
            this.loadLogView(
              dataLogUserId[i].staff_id,
              0,
              this.state.limitList
            );
            this.loadLogView7Day(
              dataLogUserId[i].staff_id,
              0,
              this.state.limitList
            );
            this.setState({
              staff_id: dataLogUserId[i].staff_id,
              employeeId: dataLogUserId[i].employeeId,
              firstname: dataLogUserId[i].firstname,
            });
          }
        } else {
          alert(result.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadLogView = (staffId, idx, limit) => {
    apiLogAllData(staffId, idx, limit)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.logView.list;
          for (var i = 0; i < result.records.length; i++) {
            list.push(result.records[i]);
          }

          let next = this.state.logView.currentIndex;
          if (result.records.length > 0) next += 1;

          let show = true;
          if (result.records.length < this.state.limitList) show = false;

          list.sort(function compare(a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateB - dateA;
          });

          console.log(list);

          // let datra = list.sort((a, b) => a.date - b.date);
          // console.log(datra);

          this.setState({
            logView: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
          });

          //   console.log(this.state.logView);
        }
        setTimeout(() => {
          this.setState({ showLoading: false });
        }, 500);
      })
      .catch((error) => {
        // this.state.logView.showLoadMore = false;
        this.setState({ onload: false });
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  loadLogView7Day = (staffId, idx, limit) => {
    apiLog7dayData(staffId, idx, limit)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.logViewLast7days.list;

          for (var i = 0; i < result.records.length; i++) {
            // result.records[i].isChecked = result.records[i].isChecked
            //   ? true
            //   : false;
            list.push(result.records[i]);
          }

          let next = this.state.logViewLast7days.currentIndex;
          if (result.records.length > 0) next += 1;

          let show = true;
          if (result.records.length < this.state.limitList) show = false;

          list.sort(function compare(a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateB - dateA;
          });

          console.log(list);

          this.setState({
            logViewLast7days: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
          });

          //   console.log(this.state.logViewLast7days);
        }
        setTimeout(() => {
          this.setState({ showLoading: false });
        }, 500);
      })
      .catch((error) => {
        // this.state.logViewLast7days.showLoadMore = false;
        this.setState({ onload: false });
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  doUpdateLast7days = () => {
    let params = {
      LogViewDataUpdate: this.state.logViewLast7days.list,
    };
    apiUpdate7Day(params)
      .then((response) => {
        this.setState({ showLoading: false });
        let result = response.data;
        if (result.status === "OK") {
          this.setState({
            currentTab: 0,
            logView: {
              list: [],
              currentIndex: 0,
              showLoadMore: false,
            },
            logViewLast7days: {
              list: [],
              listTop: [],
              currentIndex: 0,
              showLoadMore: false,
            },
          });
          this.getUserLog(this.state.employeeId);
        } else {
          alert(result.message);
        }
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  //=================Function & Method ===================//
  onMessage = (data) => {
    //alert('');
    let messContent = null;
    if (data.data) messContent = JSON.parse(data.data);

    if (messContent) {
      if (messContent.code === "login") {
        localStorage.setItem(
          "smart-app-id-login",
          JSON.stringify(messContent.param)
        );
        window.postMessage('{"code":"receivelogin"}', "*");
      } else if (messContent.code === "logout") {
        localStorage.setItem("smart-app-id-login", null);
        localStorage.removeItem("smart-appy-id-login");
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
      let tmp = localStorage.getItem("smart-app-id-login");
      let needLogin = false;
      if (
        tmp === undefined ||
        tmp === null ||
        tmp === "null" ||
        tmp === "" ||
        tmp === "undefined"
      )
        needLogin = true;
      else {
        tmp = JSON.parse(tmp);
        this.loginInfo.phoneno = tmp.phonenumber;
        this.loginInfo.name = tmp.name;
      }

      let param =
        '{"title":"' +
        "Log View" +
        '","canGoBack":false, "showCommunityName":false, "hideTopbar":true, "hideFooterMenu":true, "needLogin":' +
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
        employeeId: info.employeeId,
        staff_id: info.staff_id,
        name: info.name,
      });
      this.getUserLog(info.employeeId);
    } else {
      //   this.getUserLog("FATMAWATI101");
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

  goBack = () => {
    let param = '{"code":"need-profile"}';
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

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleChangeIndex = (index) => {
    this.setState({
      currentTab: index,
    });
  };

  handleChangeIdx = (index) => {
    this.setState({
      currentTab: index,
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

  renderWhat = () => {
    if (this.state.currentTab === 0) {
      return this.RenderNameID();
    } else if (this.state.currentTab === 1) {
      return this.RenderNameIDSave();
    }
  };

  RenderNameID = () => {
    return (
      <div className="container-logview">
        <table>
          <tbody>
            <tr>
              <td width={60}>
                <span style={{ fontSize: 12 }}>Name</span>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>{this.state.firstname}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span style={{ fontSize: 12 }}>ID</span>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>{this.state.employeeId}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div>{this.renderList()}</div>
      </div>
    );
  };

  renderSingleImage = (item) => {
    if (item.photo !== "") {
      return (
        <div className="img-cropped">
          <img
            src={"http://202.157.177.50/prod-image" + item.photo}
            alt={"imgpic"}
            className="img-cropped"
          />
        </div>
      );
    } else {
      return <div className="img-cropped"></div>;
    }
  };

  renderStatusLog = (item) => {
    if (item.status === 0) {
      return <span style={{ fontSize: 12 }}>Status: OUT</span>;
    } else if (item.status === 1) {
      return <span style={{ fontSize: 12 }}>Status: IN</span>;
    } else if (item.status === 3) {
      return <span style={{ fontSize: 12 }}>Status: </span>;
    }
  };

  renderList = () => {
    if (this.state.logView.list.length > 0) {
      return (
        <div className="logview-list-section-data">
          <div>
            {this.state.logView.list.map((item, i) => (
              <div className="list-item" key={i}>
                <div className="relative-container">
                  <div className="descript-container-border">
                    {this.renderSingleImage(item)}
                    <div className="descript-container-small">
                      <div className="headline-text-name">
                        {/* <span className="category-Text">{item.name}</span> */}
                        <span style={{ fontSize: 12 }}>Date: {item.date}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 12 }}>
                          Location: {item.location}
                        </span>
                        <br />
                        <span style={{ fontSize: 12 }}>
                          Temperature: {item.temperature} &deg;c
                        </span>
                        <br />
                        {this.renderStatusLog(item)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="logview-list-section-data">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  RenderNameIDSave = () => {
    return (
      <div className="container-logview">
        <table>
          <tbody>
            <tr>
              <td width={60}>
                <span style={{ fontSize: 12 }}>Name</span>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>{this.state.firstname} </span>
              </td>
            </tr>
            <tr>
              <td>
                <span style={{ fontSize: 12 }}>ID</span>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>{this.state.employeeId}</span>
              </td>
              <td>
                <div style={{ float: "right", paddingLeft: 20 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="sm"
                    onClick={() => this.doUpdateLast7days()}
                  >
                    Save
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div>{this.renderList2()}</div>
      </div>
    );
  };

  renderSingleImage2 = (item) => {
    if (item.photo !== "") {
      return (
        <div className="img-cropped">
          <img
            src={"http://202.157.177.50/prod-image" + item.photo}
            alt={"imgpic"}
            className="img-cropped"
          />
        </div>
      );
    } else {
      return <div className="img-cropped"></div>;
    }
  };

  setRSelected = (index, e) => {
    console.log(index);
    console.log(e);
    let tmp = this.state.logViewLast7days.list;
    tmp[index].status = e;
    this.setState({
      logViewLast7days: {
        list: tmp,
      },
    });

    console.log(this.state.logViewLast7days.list);
  };

  renderButtonStop = (status, i) => {
    if (status === 3) {
      return (
        <Button
          style={{ height: 20, width: 40 }}
          size="sm"
          variant="outlined"
          color="primary"
          onClick={() => this.setRSelected(i, 3)}
          active={status === 3}
        >
          <div style={{ fontSize: 11, marginTop: -3 }}>0</div>
        </Button>
      );
    } else {
      return (
        <Button
          style={{ height: 20, width: 40 }}
          size="sm"
          variant="outlined"
          onClick={() => this.setRSelected(i, 3)}
          active={status === 3}
        >
          <div style={{ fontSize: 11, marginTop: -3 }}>0</div>
        </Button>
      );
    }
  };

  renderButtonOut = (status, i) => {
    if (status === 0) {
      return (
        <Button
          style={{ height: 20, width: 40, color: "red" }}
          size="sm"
          variant="outlined"
          color="danger"
          onClick={() => this.setRSelected(i, 0)}
          active={status === 0}
        >
          <div style={{ fontSize: 11, marginTop: -3 }}>OUT</div>
        </Button>
      );
    } else {
      return (
        <Button
          style={{ height: 20, width: 40 }}
          size="sm"
          variant="outlined"
          onClick={() => this.setRSelected(i, 0)}
          active={status === 0}
        >
          <div style={{ fontSize: 11, marginTop: -3 }}>OUT</div>
        </Button>
      );
    }
  };

  renderButtonIN = (status, i) => {
    if (status === 1) {
      return (
        <Button
          style={{ height: 20, width: 40, color: "green" }}
          size="sm"
          variant="outlined"
          color="success"
          onClick={() => this.setRSelected(i, 1)}
          active={status === 1}
        >
          <div style={{ fontSize: 11, marginTop: -3 }}>IN</div>
        </Button>
      );
    } else {
      return (
        <Button
          style={{ height: 20, width: 40 }}
          size="sm"
          variant="outlined"
          onClick={() => this.setRSelected(i, 1)}
          active={status === 1}
        >
          <div style={{ fontSize: 11, marginTop: -3 }}>IN</div>
        </Button>
      );
    }
  };

  renderList2 = () => {
    if (this.state.logViewLast7days.list.length > 0) {
      return (
        <div className="logview-list-section-data">
          <div>
            {this.state.logViewLast7days.list.map((item, i) => (
              <div className="list-item" key={i}>
                <div className="relative-container">
                  <div className="descript-container-border">
                    {this.renderSingleImage2(item)}
                    <div className="descript-container-small">
                      <div className="headline-text-name">
                        <span style={{ fontSize: 12 }}>Date: {item.date}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 12 }}>
                          Location: {item.location}
                        </span>
                        <br />
                        <span style={{ fontSize: 12 }}>
                          Temperature: {item.temperature} &deg;c
                        </span>
                        <br />
                        <div
                          style={{
                            marginTop: -3,
                            float: "right",
                          }}
                        >
                          <ButtonGroup>
                            {this.renderButtonStop(item.status, i)}
                            {this.renderButtonOut(item.status, i)}
                            {this.renderButtonIN(item.status, i)}
                          </ButtonGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="logview-list-section-data">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  render() {
    const { currentTab } = this.state;
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="Log View"
            goBack={this.goBack}
          />
          <AppBar position="static" color="default">
            <Tabs
              value={currentTab}
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
                label="All Data"
              />
              <Tab
                style={styles.tab}
                onClick={() => this.handleChangeIndex(1)}
                label="Last 7 Days Data"
              />
            </Tabs>
          </AppBar>
        </div>
        <div className="contents">
          {/* <SwipeableViews
            enableMouseEvents={true}
            index={this.state.currentTab}
            onChangeIndex={(e) => this.handleChangeIdx(e)}
          >
            <TabPanel value={this.state.currentTab} index={0}>
              {this.renderList()}
            </TabPanel>
            <TabPanel value={this.state.currentTab} index={1}>
              {this.renderList2()}
            </TabPanel>
          </SwipeableViews> */}
          {this.renderWhat()}
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import axios from "axios";
import { webserviceurl } from "../../services/BaseUrl";
import { Link } from "react-router-dom";
// import SubHeader from "../../components/SubHeader/SubHeader";
// import DataEmpety from "../../components/NoData/NoData";
// import TooltipAdd from "../../components/Tooltip/Tooltip";
// import { StyledContainer, styles } from "./Style";
import { IconMarketplace } from "../../utils/DataJson";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Pagination from "../../components/PaginationDot/Pagination";
import "./Marketplace.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);
//============CONSTANTA========================//
const icons = IconMarketplace;
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const styles = {
  root: {
    position: "relative",
  },
  slide: {
    padding: 15,
    minHeight: 100,
    color: "#fff",
  },
  slide1: {
    backgroundColor: "#FEA900",
  },
  slide2: {
    backgroundColor: "#B3DC4A",
  },
  slide3: {
    backgroundColor: "#6AC0FF",
  },
};

export default class MarketplacePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "",
      redirect: false,
      community: 22,
      activeIndex: 0,
      markers: [{ lat: -6.1779101, lng: 106.9516151 }],
      isOpen: false,
      title: "",
      address: "",
      description: "",
      startdate: "",
      enddate: "",
      starttime: "",
      endtime: "",
      picture: [],
      icons: [],
      Advmarket: [],
      AdvmarketBottom: [],
      index: 0,
      index2: 0,
    };

    let bannerTop = JSON.parse(localStorage.getItem("MARKET_TOP"));
    if (
      bannerTop === null ||
      bannerTop === undefined ||
      bannerTop === [] ||
      bannerTop === ""
    )
      bannerTop = [];

    let bannerBottom = JSON.parse(localStorage.getItem("MARKET_BOTTOM"));
    if (
      bannerBottom === null ||
      bannerBottom === undefined ||
      bannerBottom === [] ||
      bannerBottom === ""
    )
      bannerBottom = [];
  }

  componentDidMount = () => {
    let bannerTop = JSON.parse(localStorage.getItem("MARKET_TOP"));
    if (
      bannerTop === null ||
      bannerTop === undefined ||
      bannerTop === [] ||
      bannerTop === ""
    )
      bannerTop = [];
    this.setState({ Advmarket: bannerTop });

    let bannerBottom = JSON.parse(localStorage.getItem("MARKET_BOTTOM"));
    if (
      bannerBottom === null ||
      bannerBottom === undefined ||
      bannerBottom === [] ||
      bannerBottom === ""
    )
      bannerBottom = [];
    this.setState({ AdvmarketBottom: bannerBottom });

    this.waitForBridge();
    // this.loadMerchantCategory();
    this.loadMarketplace();
    if (this.state.community !== "") {
      this.getMatketPlaceAdv();
      this.getMatketPlaceAdvBottom();
    }
  };

  componentWillUnmount = () => {};

  //===============Request API Service==================//
  loadMerchantCategory = () => {
    axios
      .post(
        webserviceurl + "/app_load_merchantcategory.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        var tmp = [];

        for (var i = 0; i < response.data.records.length; i++) {
          //   var pic = [];
          var a = {};

          a.image = response.data.records[i].icon;
          a.label = response.data.records[i].name;
          if (response.data.records[i].isonlinestore === 0)
            a.link =
              "/merchantlist/" +
              this.state.community +
              "/" +
              response.data.records[i].merchantcategoryid;
          else a.link = "/onlinestore/" + this.state.community + "";

          tmp.push(a);
        }

        this.setState({ icons: tmp });
        // console.log(this.state.icons);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  loadMarketplace = () => {
    axios
      .post(
        webserviceurl + "/app_load_marketplace.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        var tmp = [];

        for (var i = 0; i < response.data.records.length; i++) {
          var pic = [];
          if (response.data.records[i].info.picture !== "") {
            pic.push(response.data.records[i].info.picture);
          }

          tmp.push(response.data.records[i].position);
          this.setState({ title: response.data.records[i].info.title });
          this.setState({
            description: response.data.records[i].info.description,
          });
          this.setState({ address: response.data.records[i].info.address });
          this.setState({ startdate: response.data.records[i].info.startdate });
          this.setState({ enddate: response.data.records[i].info.enddate });
          this.setState({ starttime: response.data.records[i].info.starttime });
          this.setState({ endtime: response.data.records[i].info.endtime });
          this.setState({ picture: pic });
        }

        this.setState({ markers: tmp });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  getMatketPlaceAdv = () => {
    axios({
      method: "post",
      url: webserviceurl + "/app_load_marketplace_banneradv.php",
      data: {
        communityid: this.state.community,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    })
      .then((response) => {
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let adv = [];
          for (let i = 0; i < result.records.length; i++) {
            adv.push({
              src: result.records[i].banner,
              altText: "slide" + i,
              caption: "cap" + i,
            });
          }
          localStorage.setItem("MARKET_TOP", JSON.stringify(adv));
          this.setState({ Advmarket: adv });
          //   console.log(this.state.Advmarket);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getMatketPlaceAdvBottom = () => {
    axios({
      method: "post",
      url: webserviceurl + "/app_load_marketplace_banneradv2.php",
      data: {
        communityid: this.state.community,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    })
      .then((response) => {
        // console.log(response);
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let advBottom = [];
          for (let i = 0; i < result.records.length; i++) {
            advBottom.push({
              src: result.records[i].banner,
              altText: "slide" + i,
              caption: "cap" + i,
            });
          }
          localStorage.setItem("MARKET_BOTTOM", JSON.stringify(advBottom));
          this.setState({ AdvmarketBottom: advBottom });
          //   console.log(this.state.AdvmarketBottom);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //===============Method & function====================//
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
        "Marketplace" +
        '","canGoBack":false, "showCommunityName":true, "hideTopbar":false, "hideFooterMenu":false}';
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

  renderAdvmarket = () => {
    const { index } = this.state;
    if (this.state.Advmarket.length > 0) {
      return (
        <div style={styles.root}>
          <AutoPlaySwipeableViews
            index={index}
            onChangeIndex={this.handleChangeIndex}
          >
            {this.state.Advmarket.map((item) => (
              <div className="home-header">
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
            dots={this.state.Advmarket.length}
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

  renderAdvmarketBottom = () => {
    const { index2 } = this.state;
    if (this.state.AdvmarketBottom.length > 0) {
      return (
        <div style={styles.root}>
          <AutoPlaySwipeableViews
            index={index2}
            onChangeIndex={this.handleChangeIndexBotom}
          >
            {this.state.AdvmarketBottom.map((item) => (
              <div className="home-header">
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
            dots={this.state.AdvmarketBottom.length}
            index={index2}
            onChangeIndex={this.handleChangeIndexBotom}
          />
        </div>
      );
    }
  };

  render() {
    return (
      <div className="main-container">
        <div className="HomeBanner">{this.renderAdvmarket()}</div>
        <div className="icons" style={{ marginTop: 10 }}>
          <div className="home-icons-container">
            {icons.map((icon, i) => (
              <div key={i} className="icon-column">
                <Link
                //  to={icon.link}
                >
                  <div className="link-label">
                    <img
                      src={icon.image}
                      alt="market"
                      style={{ height: 60, width: 60 }}
                    />
                    <br />
                    {icon.label}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="BottomBanner">{this.renderAdvmarketBottom()}</div>
      </div>
    );
  }
}

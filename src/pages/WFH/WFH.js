import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import SwipeableViews from "react-swipeable-views";
import { api_wfh_load, api_countReading } from "../../services/ConfigServices";
import "./Style";
import "./WFH.style.css";
import DataEmpety from "../../components/NoData/NoData";
import TabPanel from "../../components/TabPanel/TabPanel";
import ScrollToTopBtn from "../../components/ScrollToTop/ScrollToTop";
import newsdefault from "../../assets/news_default.png";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

class WFHPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      newValue: "",
      index: 0,
      wfh: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      howLoading: false,
      limitList: 10,
      phonenumber: "",
      reading: 0,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadWFH(this.state.wfh.currentIndex);
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //==============Request API Service===================//
  loadWFH = (currentIndex) => {
    this.setState({ showLoading: true });
    this.setState({ onload: true });
    api_wfh_load(currentIndex, this.state.limitList)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        if (result.status === "OK") {
          let list = this.state.wfh.list;

          for (var i = 0; i < result.records.length; i++) {
            result.records[i].shortdesc = decodeURIComponent(
              result.records[i].shortdesc
            );
            result.records[i].time = moment(result.records[i].time);
            list.push(result.records[i]);
          }

          let next = this.state.wfh.currentIndex;
          if (result.records.length > 0) next += 1;

          let show = true;
          if (result.records.length < this.state.limitList) show = false;

          this.setState({
            wfh: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
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

  countReading = (item) => {
    api_countReading(this.state.phonenumber, item, this.state.reading + 1)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  //==============Method & Function====================//
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
        "WFH" +
        '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
      window.postMessage(param, "*");
    }
  }

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
      if (this.state.wfh.showLoadMore === true) {
        this.loadWFH(this.state.wfh.currentIndex);
      }
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

  renderBigImg = (item) => {
    if (item.newspic[0] !== "" && item.previewmode === 4) {
      return (
        <div className="image-big-mode">
          <img src={item.newspic[0]} alt="" />
        </div>
      );
    } else {
      return (
        <div className="image-big-mode">
          <img src={newsdefault} alt="" />
        </div>
      );
    }
  };

  renderThumbnail = (item) => {
    if (item.previewmode === 1) {
      return (
        <div className="tree-mode-image">
          {item.thumbnail.map((img, i) => (
            <div className="center-cropped">
              <img src={img.picture} alt={"imgpic"} />
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="tree-mode-image">
          <div className="center-cropped">
            <img src={newsdefault} alt={"imgpic"} />
          </div>
        </div>
      );
    }
  };

  renderSingleImage = (item) => {
    if (item.newspic[0] !== "" && item.previewmode === 2) {
      return (
        <div className="img-cropped">
          <img src={item.newspic[0]} alt={"imgpic"} className="img-cropped" />
        </div>
      );
    } else {
      return (
        <div className="img-cropped">
          <img src={newsdefault} alt={"imgpic"} className="img-cropped" />
        </div>
      );
    }
  };

  renderVideoLarge = (item) => {
    if (item.video_url[0] !== "" && item.previewmode === 5) {
      return (
        <video width="100%" controls style={{ marginTop: 10 }}>
          <source src={item.video_url[0]} type="video/mp4" />
        </video>
      );
    } else {
      return (
        <div className="imgitem-container">
          <img src={newsdefault} alt={"imgpic"} className="imgdefault" />
        </div>
      );
    }
  };

  renderSmallVideo = (item) => {
    if (item.video_url[0] !== "" && item.previewmode === 6) {
      return (
        <div className="small-video">
          <video width="100%" height="90%" controls style={{ marginTop: 10 }}>
            <source src={item.video_url[0]} type="video/mp4" />
          </video>
        </div>
      );
    } else {
      return (
        <div className="small-video">
          <img src={newsdefault} alt={"imgpic"} />
        </div>
      );
    }
  };

  renderSingleImageFeed = (item) => {
    if (item.urlToImage !== "" || item.urlToImage !== null) {
      return (
        <div className="img-cropped">
          <img src={item.urlToImage} alt={"imgpic"} className="img-cropped" />
        </div>
      );
    } else {
      return (
        <div className="img-cropped">
          <img src={newsdefault} alt={"imgpic"} className="img-cropped" />
        </div>
      );
    }
  };

  renderPreviewMode = (item) => {
    // console.log(item);

    if (item.previewmode === 1) {
      //tree-image
      return (
        <div className="relative-container">
          <div className="tree-image-mode">
            <div className="descriptime">
              <div className="name-container">
                <span className="category-Text">{item.category}</span>
                {item.title}
              </div>
            </div>
            {this.renderThumbnail(item)}
            <div className="descriptime">
              <div className="timeupdate">
                <span>{moment(item.time_ago).fromNow()} </span>
              </div>
              <div className="reading">
                <span>{item.reading} Reading</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (item.previewmode === 2) {
      //single-image
      return (
        <div className="relative-container">
          <div className="descript-container-border">
            {this.renderSingleImage(item)}
            <div className="descript-container-small">
              <div className="headline-text-name">
                <span className="category-Text">{item.category}</span>{" "}
                {item.title}
              </div>
              <div
                className="sortdesc-headline-text"
                dangerouslySetInnerHTML={{ __html: item.shortdesc }}
              ></div>
              <div className="descriptime">
                <div className="timeupdate">
                  <span>{moment(item.time_ago).fromNow()} </span>
                </div>
                <div className="reading">
                  <span>{item.reading} Reading</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (item.previewmode === 3) {
      //text-mode
      return (
        <div className="relative-container">
          <div className="text-mode">
            <div className="name-container">
              <span className="category-Text">{item.category}</span>
              {item.title}
            </div>
            <div className="descriptime">
              <div className="timeupdate">
                <span>{moment(item.time_ago).fromNow()} </span>
              </div>
              <div className="reading">
                <span>{item.reading} Reading</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (item.previewmode === 4) {
      //BIG Img Mode
      return (
        <div className="relative-container">
          <div className="tree-image-mode">
            {this.renderBigImg(item)}
            <div className="descriptime">
              <div className="name-container">
                <span className="category-Text">{item.category}</span>
                {item.title}
              </div>
            </div>
            <div className="descriptime">
              <div className="timeupdate">
                <span>{moment(item.time_ago).fromNow()} </span>
              </div>
              <div className="reading">
                <span>{item.reading} Reading</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (item.previewmode === 5) {
      //large-video-mode
      return (
        <div className="relative-container">
          <div className="tree-image-mode">
            <div className="descript-video">
              <div className="name-container">
                <span className="category-Text">{item.category}</span>
                {item.title}
              </div>
            </div>
            {this.renderVideoLarge(item)}
            <div className="descriptime">
              <div className="timeupdate">
                <span>{moment(item.time_ago).fromNow()} </span>
              </div>
              <div className="reading">
                <span>{item.reading} Reading</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (item.previewmode === 6) {
      //large-video-mode
      return (
        <div className="relative-container">
          <div className="descript-container-border">
            {this.renderSmallVideo(item)}
            <div className="descript-container-small">
              <div className="headline-text-name">
                <span className="category-Text">{item.category}</span>{" "}
                {item.title}
              </div>
              <div
                className="sortdesc-headline-text"
                dangerouslySetInnerHTML={{ __html: item.shortdesc }}
              ></div>
              <div className="descriptime">
                <div className="timeupdate">
                  <span>{moment(item.time_ago).fromNow()} </span>
                </div>
                <div className="reading">
                  <span>{item.reading} Reading</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  goToDetail(wfh) {
    this.countReading(wfh);
    // localStorage.setItem("covidtabnews", "0");
    this.props.history.push("/wfhdetail/" + wfh.id);
  }

  renderWFHActivityList = () => {
    if (this.state.wfh.list.length > 0) {
      return (
        <div>
          {this.state.wfh.list.map((item, i) => (
            <div
              className="list-item"
              key={i}
              onClick={() => this.goToDetail(item)}
            >
              {this.renderPreviewMode(item)}
            </div>
          ))}
        </div>
      );
    } else {
      return <DataEmpety title="Not data available" />;
    }
    // }
  };

  renderTab = () => {
    if (this.state.index === 0) {
      return this.renderNewsActivityList();
    }
  };

  render() {
    const { index } = this.state;
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="WFH"
            goBack={this.goBack}
          />
        </div>

        <div className="contents">
          <div className="wfh-list-section-data">
            <SwipeableViews
              enableMouseEvents={true}
              index={this.state.index}
              onChangeIndex={(e) => this.handleChangeIdx(e)}
            >
              <TabPanel value={index} index={0}>
                {this.renderWFHActivityList()}
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
        <ScrollToTopBtn />
      </div>
    );
  }
}
export default WFHPage;

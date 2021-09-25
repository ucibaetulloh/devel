import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import { styles } from "./Style";
import SwipeableViews from "react-swipeable-views";
import {
  Tab,
  Tabs,
  IconButton,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  List,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  app_load_news,
  count_reading,
  apiNewsFeed,
} from "../../services/ConfigServices";
import FbImageLibrary from "react-fb-image-grid";
import "./Style";
import "./News.style.css";
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

class NewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      newValue: "",
      index: 0,
      news: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      newsfeed: {
        list: [],
        listTop: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      howLoading: false,
      limitList: 10,
      phonenumber: "",
      reading: 0,
      setOpen: false,
      itemDataFeed: [],
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadNews(this.state.news.currentIndex);
    this.loadNewsFeedGlobal();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //==============Request API Service===================//
  loadNews = (currentIndex) => {
    // this.state.news.showLoadMore = false;
    this.setState({ showLoading: true });
    this.setState({ onload: true });
    app_load_news(currentIndex, this.state.limitList)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.news.list;

          for (var i = 0; i < result.records.length; i++) {
            result.records[i].shortdesc = decodeURIComponent(
              result.records[i].shortdesc
            );
            result.records[i].time = moment(result.records[i].time);
            list.push(result.records[i]);
          }

          let next = this.state.news.currentIndex;
          if (result.records.length > 0) next += 1;

          let show = true;
          if (result.records.length < this.state.limitList) show = false;

          this.setState({
            news: {
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

  loadNewsFeedGlobal = () => {
    this.setState({ showLoading: true });
    apiNewsFeed()
      .then((response) => {
        // console.log(response);
        let result = response.data;
        if (result.status === "ok") {
          var tmp = result.articles;
          for (let i = 0; i < tmp.length; i++) {
            tmp[i].id = i;
          }

          // console.log(tmp);

          this.setState({ newsfeed: { list: tmp } });

          setTimeout(() => {
            this.setState({ showLoading: false });
          }, 200);
        }
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  countReading = (item) => {
    count_reading(this.state.phonenumber, item, this.state.reading + 1)
      .then((response) => {
        // let result = response.data;
        // console.log(result);
      })
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
        "News" +
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

  handleScroll = (e) => {
    var difference = document.documentElement.scrollHeight - window.innerHeight;
    var scrollposition = document.documentElement.scrollTop;

    if (difference - scrollposition <= 2) {
      if (this.state.news.showLoadMore === true) {
        this.loadNews(this.state.news.currentIndex);
      }
    }
  };

  handleClose = () => {
    this.setState({
      itemDataFeed: [],
      setOpen: false,
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

  goToDetail(news) {
    this.countReading(news);
    // localStorage.setItem("covidtabnews", "0");
    this.props.history.push("/newsdetail/" + news.id);
  }

  goToDetailfeed(news) {
    let DataItem = [];
    DataItem.push(news);

    this.setState({
      itemDataFeed: DataItem,
    });

    this.setState({
      setOpen: true,
    });
  }

  renderNewsActivityList = () => {
    if (this.state.news.list.length > 0) {
      return (
        <div>
          {this.state.news.list.map((item, i) => (
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
      return <DataEmpety title="News activity not available" />;
    }
    // }
  };

  renderPreviewModeFeed = (item) => {
    if (item.urlToImage === null || item.urlToImage === "") {
      return (
        <div className="relative-container">
          <div className="text-mode">
            <div className="headline-text-name"> {item.title}</div>
            <div
              className="sortdesc-headline-text"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
            <div className="descriptime">
              <div className="timeupdate">
                <span>{moment(item.publishedAt).fromNow()} </span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative-container">
          <div className="descript-container-border">
            {this.renderSingleImageFeed(item)}
            <div className="descript-container-small">
              <div className="headline-text-name"> {item.title}</div>
              <div
                className="sortdesc-headline-text"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></div>
              <div className="descriptime">
                <div className="timeupdate">
                  <span>{moment(item.publishedAt).fromNow()} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  renderNewsFeed = () => {
    if (this.state.newsfeed.list.length > 0) {
      return (
        <div className="news-list-section-data">
          <div>
            {this.state.newsfeed.list.map((item, i) => (
              <div
                className="list-item"
                key={i}
                onClick={() => this.goToDetailfeed(item)}
              >
                {this.renderPreviewModeFeed(item)}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <DataEmpety title="News feed not available" />;
    }
  };

  renderDialogNewsFeed = () => {
    const { itemDataFeed } = this.state;

    // console.log(itemDataFeed);

    if (itemDataFeed.length > 0) {
      return (
        <Dialog
          fullScreen
          open={this.state.setOpen}
          onClose={() => this.handleClose()}
          TransitionComponent={Transition}
        >
          <AppBar style={stylesDialog.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.handleClose()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={stylesDialog.title}>
                {itemDataFeed[0].source.name}
              </Typography>
            </Toolbar>
          </AppBar>

          <List className="list-comment-root">
            <div style={{ marginBottom: 70 }}>
              {this.renderItemNewsFeed(itemDataFeed)}
            </div>
          </List>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  renderItemNewsFeed = (itemFeed) => {
    // console.log(itemFeed);
    if (itemFeed[0].urlToImage !== "" || itemFeed[0].urlToImage !== null) {
      var dtImg = [];
      dtImg.push(itemFeed[0].urlToImage);

      console.log(dtImg);
    }

    if (itemFeed.length > 0) {
      return (
        <div className="vnews-content" key={itemFeed[0].id}>
          <div className="vnews-title">{itemFeed[0].title}</div>
          <div style={{ marginBottom: 10 }}>
            <span>{moment(itemFeed[0].publishedAt).fromNow()} </span>
          </div>
          <div
            className="vnews-description"
            dangerouslySetInnerHTML={{ __html: itemFeed[0].description }}
          ></div>
          {itemFeed[0].urlToImage !== null || itemFeed[0].urlToImage !== ""}
          {<FbImageLibrary images={dtImg} />}

          <div
            className="vnews-description"
            dangerouslySetInnerHTML={{ __html: itemFeed[0].content }}
          ></div>
        </div>
      );
    } else {
      return (
        <div className="list-comment-root">
          <DataEmpety title="No data available" />
        </div>
      );
    }
  };

  renderTab = () => {
    if (this.state.index === 0) {
      return this.renderNewsActivityList();
    } else if (this.state.index === 1) {
      return this.renderNewsFeed();
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
            title="News"
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
                label="News Activity"
              />
              <Tab
                style={styles.tab}
                onClick={() => this.handleChangeIndex(1)}
                label="News Feed"
              />
            </Tabs>
          </AppBar>
        </div>

        <div className="contents">
          <div className="news-list-section-data">
            <SwipeableViews
              enableMouseEvents={true}
              index={this.state.index}
              onChangeIndex={(e) => this.handleChangeIdx(e)}
            >
              <TabPanel value={index} index={0}>
                {this.renderNewsActivityList()}
              </TabPanel>
              <TabPanel value={index} index={1}>
                {this.renderNewsFeed()}
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
        {this.renderDialogNewsFeed()}
        <ScrollToTopBtn />
      </div>
    );
  }
}
export default NewsPage;

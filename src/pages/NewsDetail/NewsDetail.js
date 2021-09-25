import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import SwipeableViews from "react-swipeable-views";
import "./NewsDetail.style.css";
import { app_load_newsdetailList } from "../../services/ConfigServices";
import ScrollToTopBtn from "../../components/ScrollToTop/ScrollToTop";
import newsdefault from "../../assets/news_default.png";
import DataEmpety from "../../components/NoData/NoData";
import { registerLocale } from "react-datepicker";
import ImageViewer from "react-simple-image-viewer";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

export default class NewsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "News Detail",
      newsid: props.match.params.id,
      currentIndex: props.match.params.currentIndex,
      newsDataList: [],
      news: [
        {
          id: 0,
          title: "",
          fulldesc: "",
          newspic: [],
          showLoading: false,
          time: "",
        },
      ],
      showLoading: false,
      isViewerOpen: false,
      setIsViewerOpen: false,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadNewsDetailList(this.state.newsid);
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //==============Request API Service===================//
  loadNewsDetailList = (id) => {
    this.setState({ showLoading: true });
    app_load_newsdetailList(id)
      .then((response) => {
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.newsDataList;
          for (var i = 0; i < result.records.length; i++) {
            result.records[i].shortdesc = decodeURIComponent(
              result.records[i].shortdesc
            );
            list.push(result.records[i]);
          }
          // console.log(list);
          this.setIndex(list);
          this.setState({ newsDataList: list });
        }

        setTimeout(() => {
          this.setState({ showLoading: false });
        }, 400);
        // console.log(this.state.newsDataList);
      })
      .catch((error) => {
        setTimeout(() => {
          this.setState({ showLoading: false });
        }, 400);
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
        "News Detail" +
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
      // if (this.state.news.showLoadMore === true) {
      //   this.loadNews(this.state.news.currentIndex);
      // }
    }
  };

  setIndex = (list) => {
    // console.log("id news", this.state.newsid);
    var index = list.findIndex(
      (p) => p.id.toString() === this.state.newsid.toString()
    );
    // console.log(index);
    this.setState({
      currentIndex: index,
    });
  };

  doOpenView = (img) => {
    // console.log(img);
    this.setState({
      images: img,
    });

    this.setState({
      setCurrentImage: 0,
      setIsViewerOpen: true,
    });
  };

  closeImageViewer = () => {
    this.setState({
      images: "",
      setCurrentImage: 0,
      setIsViewerOpen: false,
    });
  };

  renderImgView = () => {
    if (this.state.setIsViewerOpen === true) {
      return (
        <ImageViewer
          src={this.state.images}
          currentIndex={this.state.currentImage}
          onClose={this.closeImageViewer}
        />
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

  renderPreviewMode = (item) => {
    if (item.previewmode === 1) {
      return (
        <div className="vnews-content" key={item.id}>
          <div className="vnews-title">{item.title}</div>
          <div className="descriptime" style={{ marginBottom: 10 }}>
            <div className="timeupdate">
              <span>{item.time} </span>
            </div>
            <div className="reading">
              <span>{item.reading} Reading</span>
            </div>
          </div>
          <div onClick={() => this.doOpenView(item.newspic)}>
            <img width={"100%"} src={item.newspic} alt="img" />
          </div>
          {this.renderThumbnail(item)}
          <div
            className="vnews-description"
            dangerouslySetInnerHTML={{ __html: item.fulldesc }}
          ></div>
        </div>
      );
    }
    if (item.previewmode === 2 || item.previewmode === 4) {
      return (
        <div className="vnews-content" key={item.id}>
          <div className="vnews-title">{item.title}</div>
          <div className="descriptime" style={{ marginBottom: 10 }}>
            <div className="timeupdate">
              <span>{item.time} </span>
            </div>
            <div className="reading">
              <span>{item.reading} Reading</span>
            </div>
          </div>
          <div onClick={() => this.doOpenView(item.newspic)}>
            <img width={"100%"} src={item.newspic} alt="img" />
          </div>
          {/* <FbImageLibrary images={item.newspic} countFrom={1} /> */}
          {/* <Picture images={item.newspic} theme={"full"} /> */}

          <div
            className="vnews-description"
            dangerouslySetInnerHTML={{ __html: item.fulldesc }}
          ></div>
        </div>
      );
    }
    if (item.previewmode === 3) {
      //
      return (
        <div className="vnews-content" key={item.id}>
          <div className="vnews-title">{item.title}</div>
          <div className="descriptime" style={{ marginBottom: 10 }}>
            <div className="timeupdate">
              <span>{item.time} </span>
            </div>
            <div className="reading">
              <span>{item.reading} Reading</span>
            </div>
          </div>
          <div onClick={() => this.doOpenView(item.newspic)}>
            <img width={"100%"} src={item.newspic} alt="img" />
          </div>
          {/* <Picture images={item.newspic} theme={"full"} /> */}
          <div
            className="vnews-description"
            dangerouslySetInnerHTML={{ __html: item.fulldesc }}
          ></div>
        </div>
      );
    }
    if (item.previewmode === 5 || item.previewmode === 6) {
      //tree-image
      return (
        <div className="vnews-content" key={item.id}>
          <video width="100%" controls style={{ marginTop: 10 }}>
            <source src={item.video_url[0]} type="video/mp4" />
          </video>
          <div className="vnews-title">{item.title}</div>
          <div className="descriptime" style={{ marginBottom: 10 }}>
            <div className="timeupdate">
              <span>{item.time} </span>
            </div>
            <div className="reading">
              <span>{item.reading} Reading</span>
            </div>
          </div>
          <div
            className="vnews-description"
            dangerouslySetInnerHTML={{ __html: item.fulldesc }}
          ></div>
        </div>
      );
    }
  };

  renderNewsDataList = () => {
    if (this.state.newsDataList.length > 0) {
      return (
        <SwipeableViews index={this.state.currentIndex}>
          {this.state.newsDataList.map((item) => (
            <div key={item.id} className="main-container whitebg">
              {this.renderPreviewMode(item)}
              {/* <div>
                <h4 className="h3-more-news">More news</h4>
                <div className="app-scroll">
                  <ul className="hs full no-scrollbar">
                    <li className="item">
                      <div className="img-more-news">
                        <img
                          src={
                            "http://smart-community.csolusi.com/smart-cluster-webapi-cp/images/news_20210508151818.png"
                          }
                          alt="img"
                        />
                      </div>
                      <div className="text-more-news">
                        <span className="category-Text">News </span>
                        jalanan sepi kita bisa lihat bagaimana cara mereka
                        mengetahui sepertinya ayahnya tidak mengizinkan siapa
                        mereka itu apakah kalian tahu
                      </div>
                    </li>
                  </ul>
                </div>
              </div> */}
              <br></br>
              <br></br>
              <br></br>
            </div>
          ))}
        </SwipeableViews>
      );
    } else {
      return <DataEmpety title="News not available" />;
    }
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title={this.state.title}
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderNewsDataList()}</div>
        {this.renderImgView()}
        <ScrollToTopBtn />
      </div>
    );
  }
}

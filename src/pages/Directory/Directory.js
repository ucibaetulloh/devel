import React, { Component } from "react";
// import { Container, Button } from "@material-ui/core";

import { tileData } from "../../utils/DataJson";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import SubHeader from "../../components/SubHeader/SubHeader";
// import DataEmpety from "../../components/NoData/NoData";
import "./Directory.style.css";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

export default class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Complaint: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      tileData: tileData,
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

  //===============Request API Service==================//

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
      let param =
        '{"title":"' +
        "Directory" +
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
    }
  };

  goBack = () => {
    this.props.history.push("/");
  };

  renderBody = () => {
    return (
      <div className="root">
        <GridList cellHeight={180} className="gridList">
          {tileData.map((tile) => (
            <GridListTile key={tile.img} style={{ padding: 6 }}>
              <img
                src={tile.img}
                alt={tile.title}
                onClick={() => this.goBack()}
              />
              <GridListTileBar
                title={tile.title}
                onClick={() => this.goBack()}
                // subtitle={<span>by: {tile.author}</span>}
                // actionIcon={
                //   <IconButton
                //     aria-label={`info about ${tile.title}`}
                //     className="icon"
                //   >
                //     <InfoIcon />
                //   </IconButton>
                // }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="Directory"
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderBody()}</div>
      </div>
    );
  }
}

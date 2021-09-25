import React, { Component } from "react";
import { apiBookingCategory } from "../../services/ConfigServices";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import SubHeader from "../../components/SubHeader/SubHeader";
import DataEmpety from "../../components/NoData/NoData";
import "./BookingSelected.style.css";

export default class BookingSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Booking Category",
      bookingCategory: [],
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadBookingCategory();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //===============Request API Service==================//
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
        this.state.title +
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
    this.props.history.push("/bookings");
  };

  goToMenu = (dt) => {
    this.props.history.push(
      "bookingmenu/" + dt.categoryId + "/" + dt.categoryName
    );
  };

  renderBody = () => {
    if (this.state.bookingCategory.length > 0) {
      return (
        <div className="root">
          <GridList cellHeight={180} className="gridList">
            {this.state.bookingCategory.map((dt, i) => (
              <GridListTile key={dt.categoryId} style={{ padding: 6 }}>
                <img
                  src={dt.icon}
                  alt={dt.categoryName}
                  onClick={() => this.goToMenu(dt)}
                />
                <GridListTileBar
                  title={
                    <span style={{ fontSize: 16 }}>{dt.categoryName} </span>
                  }
                  onClick={() => this.goToMenu(dt)}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      );
    } else {
      return (
        <div>
          <DataEmpety title="No data available" />
        </div>
      );
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
        <div className="contents">{this.renderBody()}</div>
      </div>
    );
  }
}

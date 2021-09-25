import React, { Component } from "react";
import { apiBookingMenu } from "../../services/ConfigServices";
import DataEmpety from "../../components/NoData/NoData";
import { List, Grid, Paper, Typography, ButtonBase } from "@material-ui/core";
import SubHeader from "../../components/SubHeader/SubHeader";
import "./BookingMenu.style.css";

export default class BookingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: props.match.params.id,
      title: props.match.params.title,
      menuBooking: [],
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadBookingMenu();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //===============Request API Service==================//
  loadBookingMenu = () => {
    apiBookingMenu(this.state.categoryId)
      .then((response) => {
        let dtMenu = response.data;
        if (dtMenu.status === "OK") {
          this.setState({
            menuBooking: dtMenu.records,
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
    this.props.history.push("/bookingcategory");
  };

  goToForm = (dt) => {
    // this.props.history.push("/bookingform/" + dt.menuId + "/" + dt.menuName);
  };

  renderStatus = (dtValue) => {
    if (dtValue.status === 0) {
      return (
        <Typography variant="subtitle1" style={{ fontSize: 12 }}>
          Available
        </Typography>
      );
    } else {
      return (
        <Typography variant="subtitle1" style={{ fontSize: 12 }}>
          Reserved
        </Typography>
      );
    }
  };

  renderBody = () => {
    if (this.state.menuBooking.length > 0) {
      return (
        <List className="list-complaint">
          <div style={{ marginBottom: 70 }}>
            {this.state.menuBooking.map((dtValue, i) => {
              return (
                <div className="root-Booking-menu" key={dtValue.menuId}>
                  <Paper className="paper">
                    <Grid
                      container
                      spacing={2}
                      onClick={() => this.goToForm(dtValue)}
                    >
                      <Grid item>
                        <ButtonBase style={{ height: 130, width: 130 }}>
                          <img
                            style={{
                              maxHeight: "100%",
                              width: "100%",
                              display: "block",
                            }}
                            alt="complex"
                            src={dtValue.menuPic}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item style={{ flex: 1, alignSelf: "center" }}>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography gutterBottom variant="h5">
                              {dtValue.menuName}
                            </Typography>
                            <Typography style={{ fontSize: 12.5 }} gutterBottom>
                              {dtValue.sortdesc}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="body2"
                              style={{ cursor: "pointer", fontSize: 12 }}
                            >
                              Status
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>{this.renderStatus(dtValue)}</Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              );
            })}
          </div>
        </List>
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
        <div className="contents"> {this.renderBody()}</div>
      </div>
    );
  }
}

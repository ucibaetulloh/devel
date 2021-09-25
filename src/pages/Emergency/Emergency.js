import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import SubHeader from "../../components/SubHeader/SubHeader";
import { api_emergency } from "../../services/ConfigServices";
import DefaultUserImg from "../../assets/user.jpeg";
import DefaultPhone from "../../assets/btn_phone_n@2x.png";
import DataEmpety from "../../components/NoData/NoData";
import ScrollToTopBtn from "../../components/ScrollToTop/ScrollToTop";
import "./Emergency.style.css";

class EmergencyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Emergency: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      limitList: 100,
      showLoading: false,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadEmergency(this.state.Emergency.currentIndex);
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //================Request API Service================//

  loadEmergency = (currentIndex) => {
    // this.state.news.showLoadMore = false;
    this.setState({ showLoading: true });
    this.setState({ onload: true });
    api_emergency(currentIndex, this.state.limitList)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.Emergency.list;

          for (var i = 0; i < result.records.length; i++) {
            list.push(result.records[i]);
          }

          let next = this.state.Emergency.currentIndex;
          if (result.records.length > 0) next += 1;

          let show = true;
          if (result.records.length < this.state.limitList) show = false;

          this.setState({
            Emergency: {
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

  //================Method & Function=================//
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
        "Emergency" +
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
      if (this.state.Emergency.showLoadMore === true) {
        this.loadEmergency(this.state.Emergency.currentIndex);
      }
    }
  };

  renderEmergencyList = () => {
    if (this.state.Emergency.list.length > 0) {
      return (
        <div className="body-section">
          <table className="table-contact">
            <tbody>
              {this.state.Emergency.list.map((item, i) => (
                <tr key={item.id}>
                  <td className="column-pic">
                    <img
                      src={item.image === "" ? DefaultUserImg : item.image}
                      className="contact-pic"
                      alt={
                        item.image === "no image" ? DefaultUserImg : item.image
                      }
                    />
                  </td>
                  <td>
                    <div className="contact-name">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span style={{ fontSize: 12, color: "#000" }}>
                          {item.name}
                        </span>
                      </Typography>
                    </div>
                    <div className="contact-position">{item.position}</div>
                  </td>
                  <td className="column-icon">
                    <a href={"tel:" + item.phone + ""}>
                      <img src={DefaultPhone} alt={DefaultPhone} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="body-section">
          <DataEmpety title="Emergency not available" />
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
            title="Emergency"
            goBack={this.goBack}
          />
        </div>
        <div className="contents emergency">{this.renderEmergencyList()}</div>
        <ScrollToTopBtn />
      </div>
    );
  }
}
export default EmergencyPage;

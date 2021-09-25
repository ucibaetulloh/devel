import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import { TextField } from "@material-ui/core";
import { styles } from "./Style";
import styled from "styled-components";
import ButtonSave from "../../components/Button/Button";
import "./ComplaintsForm.style.css";
import { api_add_complaint } from "../../services/ConfigServices";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    font-size: 20px;
    color: #000;
    ${
      "" /* font-family: Akrobat;
    font-weight: 800; */
    }
  }
  .MuiInput-underline::before {
    border-bottom-color: white;
  }
  .MuiInput-underline:hover:not(.Mui-disabled)::before {
    border-bottom-color: white;
  }
  .MuiInput-underline::after {
    border-bottom-color: #000;
  }
`;

export default class ComplaintForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incidentDate: new Date(),
      complaint: "",
      complaintDesc: "",
      phoneno: "",
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=====================Request API Service===================//

  doAddComplaintUser = (params) => {
    // console.log(params);
    api_add_complaint(params)
      .then((response) => {
        // console.log(response);
        if (response.data.status === "OK") {
          this.props.history.push("/complaints");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //=====================Method & Function=====================//

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
          name: tmp.name,
          profilepic: tmp.profilepic,
        });
      }

      let param =
        '{"title":"' +
        "Complaint Form" +
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
    } else {
      // this.setState({
      //   phoneno: "082216825612",
      // });
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

  handleChange = (event) => {
    this.setState({
      complaint: event.target.value,
    });
  };

  handleChangeComplaintDesc = (event) => {
    this.setState({
      complaintDesc: event.target.value,
    });
  };

  renderFormBody = () => {
    return (
      <form className="formControl-complaint">
        <TextField
          disabled
          //   className="textfiled"
          id="standard-full-width"
          type="number"
          label="Phone Number"
          style={{ margin: 8 }}
          value={this.state.phoneno}
          placeholder="Enter your phone number"
          //   helperText="Full width!"
          fullWidth
          size={"medium"}
          margin="normal"
          inputProps={{
            classes: {
              root: styles.notchedOutline,
              focused: styles.notchedOutline,
              notchedOutline: styles.notchedOutline,
            },
            style: { fontSize: 16 },
          }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: 18 },
          }}
        />

        <TextField
          id="date"
          label="Incident Date"
          type="date"
          defaultValue={this.state.complaintDesc}
          style={{ margin: 8 }}
          fullWidth
          size={"medium"}
          margin="normal"
          inputProps={{
            classes: {
              root: styles.notchedOutline,
              focused: styles.notchedOutline,
              notchedOutline: styles.notchedOutline,
            },
            style: { fontSize: 16 },
          }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: 18 },
          }}
        />

        <TextField
          id="standard-multiline-flexible"
          label="Complaint"
          placeholder="Enter your complaint"
          // multiline
          // rowsMax={2}
          value={this.state.complaint}
          onChange={this.handleChange}
          style={{ margin: 8 }}
          fullWidth
          size={"medium"}
          margin="normal"
          inputProps={{
            classes: {
              root: styles.notchedOutline,
              focused: styles.notchedOutline,
              notchedOutline: styles.notchedOutline,
            },
            style: { fontSize: 16, color: "#000" },
          }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: 18, color: "#000" },
          }}
        />

        <StyledTextField
          id="standard-multiline-flexible"
          label="Complaint Detail"
          placeholder="Enter your complaint detail "
          multiline
          rowsMax={6}
          value={this.state.complaintDesc}
          onChange={this.handleChangeComplaintDesc}
          style={{ margin: 8 }}
          fullWidth
          size={"medium"}
          margin="normal"
          inputProps={{
            classes: {
              root: styles.notchedOutline,
              focused: styles.notchedOutline,
              notchedOutline: styles.notchedOutline,
            },
            style: { fontSize: 16, height: 60, paddingTop: 10 },
          }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: 18 },
          }}
        />
      </form>
    );
  };

  doSubmitComplaint = () => {
    const format1 = "YYYY-MM-DD HH:mm:ss";
    const format2 = "YYYY-MM-DD";
    var date1 = new Date();
    var datetimecreated = moment(date1).format(format1);

    var dateIncident = moment(this.state.incidentDate).format(format2);

    let params = {
      phonenumber: this.state.phoneno,
      dateComplaint: datetimecreated,
      incidentDate: dateIncident,
      complaint: this.state.complaint,
      complaintDesc: this.state.complaintDesc,
    };

    // console.log("cek data params", params);

    this.doAddComplaintUser(params);
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="Complaint Form"
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderFormBody()}</div>
        <ButtonSave Submit={this.doSubmitComplaint} title={"Submit"} />
      </div>
    );
  }
}

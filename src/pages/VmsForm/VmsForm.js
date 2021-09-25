import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import {
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Checkbox,
} from "@material-ui/core";
import { styles } from "./Style";
import styled from "styled-components";
import ButtonSave from "../../components/Button/Button2";
import "./VmsForm.style.css";
import {
  apiVmsto202,
  apiVmsProfile,
  apiloadCompany,
  apiVaccine,
  apiSaveVaksin,
  apiCheckStatusVaksin,
  apiCompanyEnable,
  apiLoadVenue,
  apiLoadReason,
  apiLoadLocationVenue,
} from "../../services/ConfigServices";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import Select from "react-select";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

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

export default class VmsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incidentDate: new Date(),
      fullname: "",
      nickname: "",
      identity: "",
      visitlocation: "",
      visitdepartment: "",
      visitcontact: "",
      notes: "",
      phoneno: "",
      circleLoading: false,
      selectedOptionType: null,
      selectedOptionNational: null,
      selectedOptionReason: null,
      selectedOptionGender: null,
      selectedOptionLocation: null,
      optionsType: [
        { value: "ID CARD", label: "KTP" },
        { value: "PASSPORT", label: "Paspor" },
        { value: "Other", label: "Lainnya" },
      ],
      optionsNational: [
        { value: "Indonesia", label: "Indonesia" },
        { value: "Malaysia", label: "Malaysia" },
        { value: "Singapore", label: "Singapore" },
        { value: "Other", label: "Other" },
      ],
      optionsReson: [],
      optionsGender: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      selectedOptionLocationVenue: null,
      optionLocation: [],
      optionsLocationVenue: [],
      optionVenue: [],
      vmsUserFacePic: [],
      setOpenSuccess: false,
      setOpenValid: false,
      statusCode: 0,
      dataVaksin: [],
      companyEnableData: [],
      statusEnable: 0,
      setOpenValidation: false,
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      hourIn: "00:00",
      hourOut: "",
      createShortcute: false,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    // this.loadCompany();
    this.loadVenue();
    this.loadReason();
    this.loadEnableCompanyVaksin();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=====================Request API Service===================//

  doCheckProfile = (phoneno) => {
    apiVmsProfile(phoneno)
      .then((response) => {
        // console.log(response);
        this.setState({
          vmsUserFacePic: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadVaksin = (phoneno, NIK) => {
    apiCheckStatusVaksin(phoneno, NIK)
      .then((response) => {
        // console.log(response);
        this.setState({
          dataVaksin: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadCompany = () => {
    apiloadCompany()
      .then((response) => {
        // console.log(response);
        this.setState({
          optionLocation: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadVenue = () => {
    apiLoadVenue()
      .then((response) => {
        // console.log(response);
        this.setState({
          optionLocation: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadReason = () => {
    apiLoadReason()
      .then((response) => {
        // console.log(response);
        this.setState({
          optionsReson: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  LoadLocationVenue = (id) => {
    apiLoadLocationVenue(id)
      .then((response) => {
        // console.log(response);
        this.setState({
          optionsLocationVenue: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadEnableCompanyVaksin = () => {
    apiCompanyEnable()
      .then((response) => {
        this.setState({
          companyEnableData: response.data.records,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  doCheckDataVaccine = () => {
    if (this.state.selectedOptionLocation === null) {
      this.setState({
        error: "Pilih venue kunjungan",
        setOpenValid: true,
      });
    } else if (this.state.selectedOptionLocationVenue === null) {
      this.setState({
        error: "Pilih lokasi kunjungan",
        setOpenValid: true,
      });
    } else if (this.state.selectedOptionReason === null) {
      this.setState({
        error: "Pilih alasan kunjungan",
        setOpenValid: true,
      });
    } else {
      this.setState({ circleLoading: true });

      let enableVaksin = this.state.selectedOptionLocation;
      // console.log(enableVaksin);

      // const enableVaksin = dtEnable.filter(
      //   (elm) => elm.companyId === this.state.selectedOptionLocation.value
      // );
      // console.log(enableVaksin);

      if (enableVaksin.status === "Enabled") {
        if (this.state.dataVaksin.length > 0) {
          if (this.state.dataVaksin[0].status_vaksin === parseInt(0)) {
            var d = new Date();
            var x = moment(d).format("YYYY-MM-DD");
            var s = this.state.dataVaksin[0].createDate;
            var r = moment(s).format("YYYY-MM-DD");

            if (x === r) {
              // console.log(x, r);
              this.setState({
                error:
                  "Kunjungan Anda tidak dapat dilanjutkan, karena Anda belum divaksinasi.",
                setOpenValid: true,
                statusCode: 404,
              });
              this.doSubmitVms(
                this.state.dataVaksin[0].status_vaksin === 1 ? true : false
              );
            } else {
              apiVaccine(this.state.identity)
                .then((response) => {
                  // console.log(response.data.code);
                  this.setState({ circleLoading: false });
                  if (response.data.code === parseInt(404)) {
                    this.setState({
                      error:
                        "Kunjungan Anda tidak dapat dilanjutkan, karena Anda belum divaksinasi.",
                      setOpenValid: true,
                      statusCode: response.data.code,
                    });
                    this.doSaveVaksin(response.data);
                    this.doSubmitVms(response.data.data.adaDataVaksin);
                  } else if (response.data.code === parseInt(200)) {
                    this.setState({
                      statusCode: response.data.code,
                    });
                    this.doSaveVaksin(response.data);
                    this.doSubmitVms(response.data.data.adaDataVaksin);
                  } else if (response.data.code === parseInt(401)) {
                    this.setState({
                      error: response.data.message,
                      setOpenValid: true,
                    });
                  }
                })
                .catch((err) => {
                  this.setState({ circleLoading: false });
                  console.log(err);
                });
            }
          } else if (this.state.dataVaksin[0].status_vaksin === parseInt(1)) {
            this.setState({
              statusCode: 200,
            });

            this.doSubmitVms(
              this.state.dataVaksin[0].status_vaksin === 1 ? true : false
            );
          }
        } else {
          apiVaccine(this.state.identity)
            .then((response) => {
              // console.log(response.data.code);
              this.setState({ circleLoading: false });
              if (response.data.code === parseInt(404)) {
                this.setState({
                  error:
                    "Kunjungan Anda tidak dapat dilanjutkan, karena Anda belum divaksinasi.",
                  setOpenValid: true,
                  statusCode: response.data.code,
                });
                this.doSaveVaksin(response.data);
                this.doSubmitVms(response.data.data.adaDataVaksin);
              } else if (response.data.code === parseInt(200)) {
                this.setState({
                  statusCode: response.data.code,
                });
                this.doSaveVaksin(response.data);
                this.doSubmitVms(response.data.data.adaDataVaksin);
              } else if (response.data.code === parseInt(401)) {
                this.setState({
                  error: response.data.message,
                  setOpenValid: true,
                });
              }
            })
            .catch((err) => {
              this.setState({ circleLoading: false });
              console.log(err);
            });
        }
      } else {
        this.doSubmitVms(2);
      }
    }
  };

  doSaveVaksin = (data) => {
    const format1 = "YYYY-MM-DD HH:mm:ss";
    var date = new Date();
    var createDate = moment(date).format(format1);
    // console.log(data);
    let params = {
      datecreate: createDate,
      nik: this.state.identity,
      phone: this.state.phoneno,
      status_vaksin: data.data.adaDataVaksin === true ? 1 : 0,
      data: this.state.dataVaksin.length,
    };
    // console.log(params);
    apiSaveVaksin(params)
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  doSubmitVms = (vaksin) => {
    // const format1 = "YYYY-MM-DD HH:mm:ss";
    // const format2 = "YYYY-MM-DD";
    // var date1 = new Date();
    // var dateIn = moment(date1).format(format1);
    // var dateOut = moment(date1).format(format2);

    var name = this.state.fullname;
    var first_name = name.split(" ")[0];
    var last_name = name.substring(first_name.length).trim();

    this.setState({
      statusEnable: vaksin,
    });

    // console.log(vaksin);

    let params = {
      VisitId: 0,
      name: this.state.fullname,
      nickname: this.state.nickname,
      nameFirst: first_name,
      nameLast: last_name,
      gender: this.state.selectedOptionGender === "Laki-laki" ? 1 : 0,
      userId: this.state.selectedOptionLocation.companyId,
      partment: "",
      category: "1",
      shift: "1",
      phone: this.state.phoneno,
      identity: this.state.identity,
      employeeId: "",
      nationality: this.state.selectedOptionNational,
      idType:
        this.state.selectedOptionType === "KTP"
          ? "ID CARD"
          : this.state.selectedOptionType,
      idNo: this.state.identity,
      visitContact: this.state.visitcontact,
      visitReason: this.state.selectedOptionReason.label,
      visitCompany: this.state.selectedOptionLocationVenue.label,
      notes: this.state.notes,
      facePics: this.state.vmsUserFacePic[0].facePics,
      PcrAntigen: "",
      PcrAntigenPcr: "",
      checkIn: this.state.startDate + " " + this.state.hourIn + ":00",
      checkOut: this.state.startDate + " 23:59:59",
      vaksin: vaksin === parseInt(2) ? 2 : vaksin === true ? 1 : 0,
      visitLocation: this.state.selectedOptionLocation.label,
      venueId: this.state.selectedOptionLocation.value,
      statusApproval: this.state.selectedOptionLocation.approval,
      createShortcut: this.state.createShortcute === true ? 1 : 0,
    };

    // console.log("cek data params", params);

    apiVmsto202(params)
      .then((response) => {
        // console.log(response);
        this.setState({ circleLoading: false });
        if (response.data.status === "OK") {
          if (this.state.statusCode !== parseInt(404)) {
            this.setState({ setOpenSuccess: true });
          } else {
            setTimeout(
              function () {
                this.props.history.push("/vms");
              }.bind(this),
              5000
            );
          }
        } else if (response.data.status === "ERROR") {
          // console.log("buka wao");
          this.setState({
            setOpenValidation: true,
          });
        }
      })
      .catch((error) => {
        this.setState({ circleLoading: false });
        console.log(error);
      });

    // this.doAddComplaintUser(params);
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
        "Create a Reservation" +
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
        fullname: info.name,
        nickname: info.nickname,
        identity: info.ktp,
        selectedOptionGender: info.genderId === 1 ? "Laki-laki" : "Perempuan",
        selectedOptionNational: info.nationality,
        selectedOptionType: info.idType === "ID CARD" ? "KTP" : info.idType,
      });
      this.doCheckProfile(info.phonenumber);
      this.loadVaksin(info.phonenumber, info.ktp);
    } else {
      this.setState({
        phoneno: "082216825612",
        fullname: "Uci Baetulloh",
        nickname: "Uci",
        identity: "3278070712960005",
        selectedOptionGender: "Laki-laki",
        selectedOptionNational: "Indonesia",
        selectedOptionType: "KTP",
      });
      this.doCheckProfile("082216825612");
      this.loadVaksin("082216825612", "3278070712960005");
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

  handleDatechange = (event) => {
    this.setState({ startDate: event.target.value });
  };

  handleDatechangeEnd = (event) => {
    this.setState({ endDate: event.target.value });
  };

  handleChangeHourIn = (event) => {
    this.setState({ hourIn: event.target.value });
  };

  handleChangeHourOut = (event) => {
    this.setState({ hourOut: event.target.value });
  };

  handleCloseSuccess = () => {
    this.setState({
      setOpenSuccess: false,
    });
    this.props.history.push("/vms");
  };

  handleCloseValid = () => {
    this.setState({
      setOpenValid: false,
      error: "",
    });
    if (this.state.statusCode === parseInt(404)) {
      this.props.history.push("/vms");
    }
  };

  handleChangeOptionType = (selectedOptionType) => {
    this.setState({ selectedOptionType });
  };

  handleChangeOptionNational = (selectedOptionNational) => {
    this.setState({ selectedOptionNational });
  };

  handleChangeOptionReason = (selectedOptionReason) => {
    this.setState({ selectedOptionReason });
  };

  handleChangeOptionGender = (selectedOptionGender) => {
    this.setState({ selectedOptionGender });
  };

  handleChangeOptionLocation = (selectedOptionLocation) => {
    this.setState({ selectedOptionLocation });
    this.setState({ selectedOptionLocationVenue: null });

    this.LoadLocationVenue(selectedOptionLocation.value);
  };

  handleChangeOptionLocationVenue = (selectedOptionLocationVenue) => {
    this.setState({ selectedOptionLocationVenue });
  };

  handleScroll = (e) => {
    var difference = document.documentElement.scrollHeight - window.innerHeight;
    var scrollposition = document.documentElement.scrollTop;
    if (difference - scrollposition <= 2) {
    }
  };

  handleChangeFullName = (event) => {
    this.setState({
      fullname: event.target.value,
    });
  };

  handleChangeIdentity = (event) => {
    this.setState({
      identity: event.target.value,
    });
  };

  handleChangeVisitDepartment = (event) => {
    this.setState({
      visitdepartment: event.target.value,
    });
  };

  handleChangeVisitContact = (event) => {
    this.setState({
      visitcontact: event.target.value,
    });
  };

  handleChangeNotes = (event) => {
    this.setState({
      notes: event.target.value,
    });
  };

  handleCheckBox = (event) => {
    this.setState({
      createShortcute: event.target.checked,
    });
  };

  goBack = () => {
    this.props.history.push("/vms");
  };

  renderFormBody = () => {
    return (
      <form className="formControl-complaint">
        {/* <TextField
          disabled
          //   className="textfiled"
          id="standard-full-width"
          type="number"
          label="Nomor Telepon"
          style={{ margin: 8 }}
          value={this.state.phoneno}
          // placeholder="Enter your phone number"
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
            style: { fontSize: 16, color: "#000" },
          }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: 18 },
          }}
        /> */}

        {/* <TextField
          id="standard-multiline-flexible"
          label="Nama Lengkap"
          // placeholder="Enter your full name"
          // multiline
          // rowsMax={2}
          disabled
          autoComplete="off"
          value={this.state.fullname}
          onChange={this.handleChangeFullName}
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
            style: { fontSize: 18 },
          }}
        /> */}

        {/* <TextField
          id="standard-multiline-flexible"
          label="Jenis Kelamin"
          // multiline
          // rowsMax={2}
          disabled
          autoComplete="off"
          value={this.state.selectedOptionGender}
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
            style: { fontSize: 18 },
          }}
        /> */}
        {/* 
        <TextField
          id="standard-multiline-flexible"
          label="Jenis ID"
          // multiline
          // rowsMax={2}
          disabled
          autoComplete="off"
          value={this.state.selectedOptionType}
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
            style: { fontSize: 18 },
          }}
        /> */}

        {/* <TextField
          id="standard-multiline-flexible"
          label="Kewarganegaraan"
          // multiline
          // rowsMax={2}
          disabled
          autoComplete="off"
          value={this.state.selectedOptionNational}
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
            style: { fontSize: 18 },
          }}
        /> */}

        {/* <div className="basic-single">
          <Typography
            variant="subtitle1"
            style={
              (stylesDialog.title,
              {
                color: "#00000061",
                marginBottom: 4,
                paddingLeft: 3,
                fontSize: 15,
              })
            }
          >
            Gender
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Select For..."
            value={this.state.selectedOptionGender}
            onChange={this.handleChangeOptionGender}
            options={this.state.optionsGender}
          />
        </div>

        <div className="basic-single">
          <Typography
            variant="subtitle1"
            style={
              (stylesDialog.title,
              {
                color: "#00000061",
                marginBottom: 4,
                paddingLeft: 3,
                fontSize: 15,
              })
            }
          >
            ID Type
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Select For..."
            value={this.state.selectedOptionType}
            onChange={this.handleChangeOptionType}
            options={this.state.optionsType}
          />
        </div>

        <div className="basic-single">
          <Typography
            variant="subtitle1"
            style={
              (stylesDialog.title,
              {
                color: "#00000061",
                marginBottom: 4,
                paddingLeft: 3,
                fontSize: 15,
              })
            }
          >
            Nationality
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Select For..."
            value={this.state.selectedOptionNational}
            onChange={this.handleChangeOptionNational}
            options={this.state.optionsNational}
          />
        </div> */}

        {/* <TextField
          id="standard-multiline-flexible"
          label="NIK"
          // placeholder="Enter your indentity"
          disabled
          // multiline
          // rowsMax={2}
          autoComplete="off"
          value={this.state.identity}
          onChange={this.handleChangeIdentity}
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
            style: { fontSize: 18 },
          }}
        /> */}

        {/* <TextField
          id="standard-multiline-flexible"
          label="Visit Location"
          placeholder="Enter your visit location"
          // multiline
          // rowsMax={2}
          autoComplete="off"
          value="Central Raya Group"
          disabled
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
            style: { fontSize: 18 },
          }}
        /> */}

        <TextField
          id="date"
          label="Tanggal"
          type="date"
          defaultValue={this.state.startDate}
          onChange={this.handleDatechange}
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
          id="time"
          label="Jam"
          type="time"
          defaultValue={this.state.hourIn}
          onChange={this.handleChangeHourIn}
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

        <div className="basic-single">
          <Typography
            variant="subtitle1"
            style={
              (stylesDialog.title,
              {
                color: "#00000061",
                marginBottom: 4,
                paddingLeft: 3,
                fontSize: 15,
              })
            }
          >
            Venue
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Pilih..."
            value={this.state.selectedOptionLocation}
            onChange={this.handleChangeOptionLocation}
            options={this.state.optionLocation}
          />
        </div>

        <div className="basic-single">
          <Typography
            variant="subtitle1"
            style={
              (stylesDialog.title,
              {
                color: "#00000061",
                marginBottom: 4,
                paddingLeft: 3,
                fontSize: 15,
              })
            }
          >
            Location
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Pilih..."
            value={this.state.selectedOptionLocationVenue}
            onChange={this.handleChangeOptionLocationVenue}
            options={this.state.optionsLocationVenue}
          />
        </div>

        {/* <TextField
          id="standard-multiline-flexible"
          label="Location"
          placeholder="Masukan departemen yang akan anda kunjungi"
          // multiline
          // rowsMax={2}
          autoComplete="off"
          value={this.state.visitdepartment}
          onChange={this.handleChangeVisitDepartment}
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
            style: { fontSize: 18 },
          }}
        /> */}

        <TextField
          id="standard-multiline-flexible"
          label="Kontak"
          placeholder="Masukan kontak yang akan anda kunjungi"
          // multiline
          // rowsMax={2}
          autoComplete="off"
          value={this.state.visitcontact}
          onChange={this.handleChangeVisitContact}
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
            style: { fontSize: 18 },
          }}
        />

        <div className="basic-single">
          <Typography
            variant="subtitle1"
            style={
              (stylesDialog.title,
              {
                color: "#00000061",
                marginBottom: 4,
                paddingLeft: 3,
                fontSize: 15,
              })
            }
          >
            Alasan
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Pilih..."
            value={this.state.selectedOptionReason}
            onChange={this.handleChangeOptionReason}
            options={this.state.optionsReson}
          />
        </div>

        <StyledTextField
          id="standard-multiline-flexible"
          label="Catatan"
          placeholder="Masukan catatan tambahan anda"
          multiline
          rowsMax={6}
          value={this.state.notes}
          onChange={this.handleChangeNotes}
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

        <div className="basic-single">
          <Checkbox
            for="check"
            checked={this.state.createShortcute}
            onChange={this.handleCheckBox}
            name="checkedB"
            color="primary"
          />
          <span id="check">Buat shortcut reservasi</span>
        </div>

        <ButtonSave
          disabled={this.state.circleLoading}
          Submit={this.doCheckDataVaccine}
          title={"Kirim"}
        />
      </form>
    );
  };

  renderDialogSuccess = () => {
    return (
      <Dialog
        open={this.state.setOpenSuccess}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            component="span"
            variant="body2"
            style={(stylesListComent.inline, { fontSize: 15 })}
          >
            Informasi!
          </Typography>{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.statusEnable === parseInt(2)
                ? "Formulir reservation anda telah berhasil dikirimkan."
                : "Anda telah divaksinasi dan formulir reservasi kunjungan telah berhasil dikirimkan."}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseSuccess} color="primary" autoFocus>
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderDialogValid = () => {
    return (
      <Dialog
        open={this.state.setOpenValid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            component="span"
            variant="body2"
            style={
              (stylesListComent.inline,
              { fontSize: 15, color: "#ff9800", fontWeight: "bold" })
            }
          >
            Peringatan!
          </Typography>{" "}
        </DialogTitle>
        <DialogContent style={{ maxWidth: 250, width: 300 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.error}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseValid} color="primary" autoFocus>
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleCloseValidation = () => {
    this.setState({
      setOpenValidation: false,
    });
  };

  renderDialogValidation = () => {
    if (this.state.setOpenValidation === true) {
      return (
        <Dialog
          open={this.state.setOpenValidation}
          onClose={this.handleCloseValidation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 15, color: "#2e6da4", fontWeight: "bold" })
              }
            >
              Information!
            </Typography>{" "}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography
                component="span"
                variant="body2"
                style={
                  (stylesListComent.inline, { fontSize: 14, color: "#333" })
                }
              >
                You have made an appointment with{" "}
                {this.state.selectedOptionLocation.label} today. Please try the
                next day.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseValidation}
              color="primary"
              autoFocus
            >
              <Typography
                component="span"
                variant="body2"
                style={
                  (stylesListComent.inline,
                  { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
                }
              >
                OK
              </Typography>
            </Button>
          </DialogActions>
        </Dialog>
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
            disabled={this.state.circleLoading}
            title="Create a Reservation"
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderFormBody()}</div>
        {this.renderDialogSuccess()}
        {this.renderDialogValid()}
        {this.renderDialogValidation()}
      </div>
    );
  }
}

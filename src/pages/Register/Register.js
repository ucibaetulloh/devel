import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import {
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import { styles } from "./Style";
import "./Register.style.css";
import {
  api_add_complaint,
  apiLoadGender,
  apiLoadNationality,
  apiLoadIdType,
  apiValidationEmail,
  apiValidationNIK,
  apiValidationPhone,
  appRegistrasiVisitor,
} from "../../services/ConfigServices";
import Resizer from "react-image-file-resizer";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import ButtonSave from "../../components/Button/Button2";
import Select from "react-select";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
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

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incidentDate: new Date(),
      complaint: "",
      complaintDesc: "",
      phoneno: "",
      optionstypeId: [],
      optionsGender: [],
      optionsNationality: [],
      selectedOptionType: null,
      selectedOptionNational: null,
      selectedOptionGender: null,
      birthday: moment(new Date()).format("yyyy-MM-DD"),
      nik: "",
      fullname: "",
      nickname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      setOpenValid: false,
      error: "",
      multipleImage: [],
      facePics: "",
      circleLoading: false,
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadGender();
    this.loadNationality();
    this.loadTypeId();
    this.loadUser();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=====================Request API Service===================//

  loadGender = () => {
    apiLoadGender()
      .then((response) => {
        // console.log(response);
        this.setState({
          optionsGender: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadNationality = () => {
    apiLoadNationality()
      .then((response) => {
        // console.log(response);
        this.setState({
          optionsNationality: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadTypeId = () => {
    apiLoadIdType()
      .then((response) => {
        // console.log(response);
        this.setState({
          optionstypeId: response.data.records,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      let param =
        '{"title":"' +
        "Sign Up" +
        '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
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

  handleChangeNIK = (event) => {
    this.setState({
      nik: event.target.value,
    });
  };

  handleDatechange = (event) => {
    this.setState({ birthday: event.target.value });
  };

  handleChangeFullName = (event) => {
    this.setState({
      fullname: event.target.value,
    });
    var name = event.target.value;
    var first_name = name.split(" ")[0];

    this.setState({
      nickname: first_name,
    });
  };

  handleChangeNickName = (event) => {
    this.setState({
      nickname: event.target.value,
    });
  };

  handleChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleChangePhone = (event) => {
    this.setState({
      phoneno: event.target.value,
    });
  };

  handleChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleChangePasswordConfirmation = (event) => {
    this.setState({
      passwordConfirmation: event.target.value,
    });
  };

  handleChangeOptionGender = (selectedOptionGender) => {
    this.setState({ selectedOptionGender });
  };

  handleChangeOptionNationality = (selectedOptionNational) => {
    this.setState({ selectedOptionNational });
  };

  handleChangeOptionTypeId = (selectedOptionType) => {
    this.setState({ selectedOptionType });
  };

  renderFormBody = () => {
    return (
      <form className="formControl-complaint">
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
            placeholder="Select..."
            value={this.state.selectedOptionType}
            onChange={this.handleChangeOptionTypeId}
            options={this.state.optionstypeId}
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
            placeholder="Select..."
            value={this.state.selectedOptionNational}
            onChange={this.handleChangeOptionNationality}
            options={this.state.optionsNationality}
          />
        </div>

        <TextField
          id="standard-multiline-flexible"
          label="NIK"
          placeholder="Enter your NIK"
          autoComplete="off"
          value={this.state.nik}
          onChange={this.handleChangeNIK}
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

        <TextField
          id="standard-multiline-flexible"
          label="Full Name"
          placeholder="Enter your full name"
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
        />

        <TextField
          id="standard-multiline-flexible"
          label="Nick Name"
          placeholder="Enter your nick name"
          autoComplete="off"
          value={this.state.nickname}
          onChange={this.handleChangeNickName}
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
            Gender
          </Typography>
          <Select
            isClearable
            classNamePrefix="select"
            placeholder="Select..."
            value={this.state.selectedOptionGender}
            onChange={this.handleChangeOptionGender}
            options={this.state.optionsGender}
          />
        </div>

        <TextField
          id="date"
          label="Birth Day"
          type="date"
          defaultValue={this.state.birthday}
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
          id="standard-multiline-flexible"
          label="Email"
          placeholder="Enter your email address"
          autoComplete="off"
          value={this.state.email}
          onChange={this.handleChangeEmail}
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

        <TextField
          id="standard-full-width"
          type="number"
          label="Phone Number"
          style={{ margin: 8 }}
          value={this.state.phoneno}
          onChange={this.handleChangePhone}
          placeholder="Enter your phone number"
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
          id="standard-full-width"
          label="Password"
          style={{ margin: 8 }}
          type="password"
          value={this.state.password}
          onChange={this.handleChangePassword}
          placeholder="Enter your password"
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
          id="standard-full-width"
          label="Confirmation Password"
          style={{ margin: 8 }}
          type="password"
          value={this.state.passwordConfirmation}
          onChange={this.handleChangePasswordConfirmation}
          placeholder="Enter your confirmation password"
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
            Upload Photo (take a selfie)
          </Typography>

          {this.state.facePics === "" ? (
            <>
              <Card variant="outlined">
                <CardContent>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={this.fileUploadImage}
                  />
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload
                    </Button>
                  </label>{" "}
                </CardContent>
              </Card>
            </>
          ) : (
            this.renderPreviewPicture()
          )}
        </div>

        <ButtonSave
          disabled={this.state.circleLoading}
          Submit={this.doCheckUserVisitor}
          title={"Kirim"}
        />
      </form>
    );
  };

  renderPreviewPicture = () => {
    if (this.state.facePics !== "") {
      return (
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={10}>
                <div className="FacePic">
                  <img src={this.state.facePics} alt={this.state.fullname} />
                </div>
              </Grid>
              <Grid item xs={2}>
                <div onClick={() => this.removeFacepic()}>
                  <DeleteIcon style={{ color: "red", height: 25, width: 25 }} />
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }
  };

  removeFacepic = () => {
    this.setState({
      facePics: "",
    });
  };

  fileUploadImage = (event) => {
    // console.log(event.target.files[0]);

    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        500,
        500,
        "PNG",
        100,
        0,
        (uri) => {
          // console.log(uri);

          this.setState({
            facePics: uri,
          });

          //   console.log(uri);
        },
        "base64"
      );
    }
  };

  doCheckUserVisitor = () => {
    if (this.state.selectedOptionType === null) {
      this.setState({
        error: "Select ID Type",
        setOpenValid: true,
      });
    } else if (this.state.selectedOptionNational === null) {
      this.setState({
        error: "Select Nationality",
        setOpenValid: true,
      });
    } else if (this.state.nik === "") {
      this.setState({
        error: "Enter your NIK",
        setOpenValid: true,
      });
    } else if (this.state.fullname === "") {
      this.setState({
        error: "Enter your full name",
        setOpenValid: true,
      });
    } else if (this.state.nickname === "") {
      this.setState({
        error: "Enter your nick name",
        setOpenValid: true,
      });
    } else if (this.state.selectedOptionGender === null) {
      this.setState({
        error: "Select gender",
        setOpenValid: true,
      });
    } else if (this.state.email === "") {
      this.setState({
        error: "Enter your email address",
        setOpenValid: true,
      });
    } else if (this.state.password === "") {
      this.setState({
        error: "Enter your password",
        setOpenValid: true,
      });
    } else if (this.state.passwordConfirmation === "") {
      this.setState({
        error: "Enter your password confirmation",
        setOpenValid: true,
      });
    } else if (this.state.facePics === "") {
      this.setState({
        error: "Upload your photo selfie",
        setOpenValid: true,
      });
    } else {
      apiValidationPhone(this.state.phoneno)
        .then((response) => {
          let dtResponse = response.data;
          if (dtResponse.status === "OK") {
            this.setState({
              error: "Phone number has been registered.",
              setOpenValid: true,
            });
          } else {
            apiValidationNIK(this.state.nik).then((response) => {
              let dtResponseNik = response.data;
              if (dtResponseNik.status === "OK") {
                this.setState({
                  error: "NIK has been registered.",
                  setOpenValid: true,
                });
              } else {
                apiValidationEmail(this.state.email.replace(/\s/g, "")).then(
                  (response) => {
                    let dtResponseEmail = response.data;
                    if (dtResponseEmail.status === "OK") {
                      this.setState({
                        error: "Email address already exists.",
                        setOpenValid: true,
                      });
                    } else {
                      this.doRegister();
                    }
                  }
                );
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  doRegister = () => {
    // console.log("cek register");
    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({
        error: "Confirm password is not the same.",
        setOpenValid: true,
      });
    } else {
      const format1 = "YYYY-MM-DD HH:mm:ss";
      var date1 = new Date();
      var dateIn = moment(date1).format(format1);

      let uploadMultiImg = [];
      let multipleImage = this.state.facePics;
      uploadMultiImg.push(multipleImage);

      let params = {
        phonenumber: this.state.phoneno,
        password: this.state.password,
        name: this.state.fullname,
        nickname: this.state.nickname,
        gender: this.state.selectedOptionGender.value,
        dob: this.state.birthday,
        email: this.state.email.replace(/\s/g, ""),
        company: "",
        location: "",
        userTypeId: 3,
        phonenumberOwner: "",
        dateCreate: dateIn,
        ktp: this.state.nik,
        clusterInfo: [{ cluster: "", unit: "" }],
        idType: this.state.selectedOptionType.label,
        nationality: this.state.selectedOptionNational.label,
        gallery: uploadMultiImg,
      };

      //   console.log(params);
      this.setState({
        circleLoading: true,
      });
      appRegistrasiVisitor(params)
        .then((response) => {
          let dataResponseVisit = response.data;
          this.setState({
            circleLoading: false,
          });
          if (dataResponseVisit.status === "OK") {
            this.setState({
              error: "Registration successful.",
              setOpenValid: true,
            });

            setTimeout(
              function () {
                this.props.history.push("/");
              }.bind(this),
              3000
            );
          }
        })
        .catch((error) => {
          this.setState({
            circleLoading: false,
          });
          console.log(error);
        });
    }
  };

  handleCloseValid = () => {
    this.setState({
      setOpenValid: false,
      error: "",
    });
  };

  renderDialogValid = () => {
    return (
      <Dialog
        open={this.state.setOpenValid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            title="Sign Up"
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderFormBody()}</div>
        {this.renderDialogValid()}
      </div>
    );
  }
}

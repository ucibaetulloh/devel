import React, { Component } from "react";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { apiLogin } from "../../services/ConfigServices";
import "./Login.style.css";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: "",
      password: "",
      setOpenAlert: false,
      setValidation: 0,
    };
  }

  goSignUp = () => {
    this.props.history.push("/signup");
  };

  doLogin = () => {
    if (this.state.phonenumber === "" || this.state.password === "") {
      this.setState({
        setOpenAlert: true,
        setValidation: 1,
      });
    } else {
      let params = {
        phonenumber: this.state.phonenumber,
        password: this.state.password,
      };
      console.log(params);
      apiLogin(this.state.phonenumber, this.state.password)
        .then((response) => {
          let resdata = response.data;
          if (resdata.status === "OK") {
            if (resdata.records.length === 0) {
              this.setState({
                setOpenAlert: true,
              });
            } else {
              localStorage.setItem(
                "smart-app-id-login",
                JSON.stringify(resdata.records[0])
              );
              this.props.history.push("/home");
            }
          } else {
            this.setState({
              setOpenAlert: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleChangePhone = (event) => {
    this.setState({
      phonenumber: event.target.value,
    });
  };

  handleChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleCloseAlert = () => {
    this.setState({
      setOpenAlert: false,
      setValidation: 0,
    });
  };

  renderDialogAlert = () => {
    return (
      <Dialog
        open={this.state.setOpenAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.setValidation === 1
                ? "Mobile phone number & password cannot be empty."
                : " Invalid phone number or password."}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseAlert} color="primary" autoFocus>
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
      <div className="login-container">
        <div className="login-box-container">
          <div className="logo">
            <img
              width="100"
              src="http://202.157.177.50/secure_vms/logo-vms-secure-apps.png"
              alt="logo"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div
            className="login-title"
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            <Typography
              style={{ fontWeight: "bold", fontSize: 16 }}
              component="h1"
              variant="h5"
            >
              SECURE VMS
            </Typography>
          </div>
          <div className="form" noValidate autoComplete="off">
            <TextField
              autoComplete="off"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="number"
              label="Mobile Phone Number"
              name="number"
              type="number"
              value={this.state.phonenumber}
              onChange={this.handleChangePhone}
              inputProps={{
                style: { fontSize: 15, color: "#000" },
              }}
              InputLabelProps={{
                style: { color: "#000" },
              }}
            />
            <TextField
              autoComplete="off"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              inputProps={{
                style: { fontSize: 15, color: "#000" },
              }}
              InputLabelProps={{
                style: { color: "#000" },
              }}
            />
            <div style={{ marginTop: 10, marginBottom: 14 }}>
              <Button
                onClick={() => this.doLogin()}
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                style={{
                  height: 40,
                  backgroundColor: "#2e6da4",
                }}
              >
                <Typography
                  variant="button"
                  style={{
                    fontSize: 14,
                    color: "#fff",
                  }}
                >
                  Login
                </Typography>
              </Button>
            </div>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 11, color: "#2e6da4" })
                    }
                  >
                    Forgot password?
                  </Typography>
                </Link> */}
              </Grid>
              <Grid item>
                <div onClick={() => this.goSignUp()}>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 11, color: "#2e6da4" })
                    }
                  >
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        {this.renderDialogAlert()}
      </div>
    );
  }
}

export let styles = {
  tabs: {
    background: "#fff",
  },
  slide: {
    padding: 15,
    minHeight: 100,
    color: "#fff",
  },
  slide1: {
    backgroundColor: "#FEA900",
  },
  slide2: {
    backgroundColor: "#B3DC4A",
  },
  slide3: {
    backgroundColor: "#6AC0FF",
  },
  tab: {
    minWidth: "50%", // a number of your choice
    width: "50%", // a number of your choice
    textTransform: "capitalize",
    fontSize: 14,
  },
  cssLabel: {
    color: "rgb(61, 158, 116) !important",
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "rgb(61, 158, 116) !important",
    color: "rgb(61, 158, 116)",
  },
};

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

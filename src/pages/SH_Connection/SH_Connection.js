import React, { Component } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import {
  TextField,
  Grid,
  IconButton,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
// import { Alert, AlertTitle } from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import CloseIcon from "@material-ui/icons/Close";
import {
  ListAlt,
  AddBox,
  ArrowBackIos,
  DeleteForever,
} from "@material-ui/icons";
import { styles } from "./Style";
import * as websocket from "../../WebSocket";
import ButtonConnect from "../../components/Button/Button";
import "./SH_Connection.style.css";

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

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class SmartHomeConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Connection Setting",
      cloudId: "",
      cloudServerId: "",
      setOpenCloud: false,
      ServerCloudShow: [
        { id: 1, cloudname: "Indonesia", display: "Dynamax P2P" },
        { id: 2, cloudname: "China", display: "Dynamax P2S" },
      ],
      userGateway: "",
      passwordGateway: "",
      setOpenGateway: false,
      setAddGateway: false,
      newAlias: "",
      newGatewatID: "",
      phoneno: "",
      GatewayShowList: [],
      OpenAlert: false,
    };
    this.handleCloseCloud = this.handleCloseCloud.bind(this);
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.scrollTopFunction();
    websocket.subscribe("viewId8", this.testing);
    websocket.start();
    setTimeout(() => {
      if (websocket.statusSocket() === 1) {
        websocket.sendView8();
      }
    }, 20000);
    window.addEventListener("scroll", this.handleScroll);
  };

  testing = (userlist) => {
    console.log("masuk callback");
    console.log(userlist);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=====================Request API Service===================//

  doApiAddGatewayUser = (phone, alias, gatewayid) => {};

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
        this.state.title +
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
    const el = e.target.documentElement;
    const bottom = el.scrollHeight - el.scrollTop === el.clientHeight;
    if (bottom) {
      console.log("we are in the bottom complaint");
    }
  };

  handleChange = (event) => {
    this.setState({
      cloudId: event.target.value,
    });
  };

  handleChangeUser = (event) => {
    this.setState({
      userGateway: event.target.value,
    });
  };
  handleChangePassword = (event) => {
    this.setState({
      passwordGateway: event.target.value,
    });
  };

  handleChangeNewAlias = (event) => {
    this.setState({
      newAlias: event.target.value,
    });
  };

  handleChangeNewGatewayID = (event) => {
    this.setState({
      newGatewatID: event.target.value,
    });
  };

  handleCloseCloud = () => {
    console.log("tutup dialog");

    this.setState({
      setOpenCloud: false,
    });
  };

  handleOpenCloud = () => {
    console.log("buka dialog");
    this.setState({
      setOpenCloud: true,
    });
  };

  handleOpenGateway = () => {
    this.setState({
      setOpenGateway: true,
    });
  };

  handleCloseGateway = () => {
    this.setState({
      setOpenGateway: false,
    });
  };

  handleAddGateway = () => {
    this.setState({
      setAddGateway: true,
    });
  };

  handleCancelAddGateway = () => {
    this.setState({
      setAddGateway: false,
      newAlias: "",
      newGatewatID: "",
    });
  };

  goBack = () => {
    let param = '{"code":"need-home"}';
    this.sendPostMessage(param);
  };

  sendPostMessage = (param) => {
    if (window.postMessage.length !== 1) {
      setTimeout(
        function () {
          this.sendPostMessage(param);
        }.bind(this),
        200
      );
    } else {
      window.postMessage(param, "*");
    }
  };

  doAddGateway = () => {
    const dtGateway = this.state.GatewayShowList.filter(
      (gtw) => gtw.gatewayId === this.state.newGatewatID
    );
    console.log("cek data gtway", dtGateway);

    if (dtGateway.length > 0) {
      console.log("gateway sudah ada");
      this.setState({
        OpenAlert: true,
      });
    } else {
      let dataGateway = this.state.GatewayShowList;
      dataGateway.push({
        userId: this.state.phoneno,
        alias: this.state.newAlias,
        gatewayId: this.state.newGatewatID,
      });

      this.doApiAddGatewayUser(
        this.state.phoneno,
        this.state.newAlias,
        this.state.newGatewatID
      );

      console.log("data new", dataGateway);

      this.setState({
        GatewayShowList: dataGateway,
        newAlias: "",
        newGatewatID: "",
        setAddGateway: false,
      });
    }
  };

  renderDialogServerCloud = () => {
    return (
      <Dialog
        fullScreen
        open={this.state.setOpenCloud}
        onClose={() => this.handleCloseCloud()}
        TransitionComponent={Transition}
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => this.handleCloseCloud()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={stylesDialog.title}>
              Select Cloud Server
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {/* <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem> */}
        </List>
      </Dialog>
    );
  };

  renderDialogListGateway = () => {
    return (
      <Dialog
        fullScreen
        open={this.state.setOpenGateway}
        onClose={() => this.handleCloseGateway()}
        TransitionComponent={Transition}
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => this.handleCloseGateway()}
              aria-label="close"
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" style={stylesDialog.title}>
              Gateway List
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleAddGateway()}
              aria-label="close"
            >
              <AddBox style={{ height: 30, width: 25 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List className="list-gateway">
          <div style={{ marginBottom: 70 }}>
            {this.renderListGatewatItem(this.state.GatewayShowList)}
          </div>
        </List>
      </Dialog>
    );
  };

  renderListGatewatItem = (dataItem) => {
    if (dataItem.length > 0) {
      return (
        <>
          {dataItem.map((dt, i) => {
            return (
              <div key={dt.gatewayId}>
                <ListItem button>
                  <ListItemText
                    onClick={() => this.doSelectedGateway(dt)}
                    primary={dt.alias}
                    primaryTypographyProps={{
                      style: { color: "#000", fontWeight: 500, fontSize: 12 },
                    }}
                    secondary={
                      <React.Fragment>
                        <div style={{ marginBottom: 6 }}></div>
                        <Typography
                          component="span"
                          variant="body2"
                          style={
                            (stylesListComent.inline,
                            { color: "#000", fontWeight: 450, fontSize: 11 })
                          }
                        >
                          {dt.gatewayId}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() =>
                      this.doDeletedGateway(dt.gatewayId, dt.userId)
                    }
                    aria-label="close"
                  >
                    <DeleteForever
                      style={{ height: 25, width: 25, color: "red" }}
                    />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </>
      );
    }
  };

  doSelectedGateway = (selectedGateway) => {
    console.log("selected", selectedGateway);
    this.setState({
      cloudId: selectedGateway.gatewayId,
      setOpenGateway: false,
    });
  };

  doDeletedGateway = (gatewayId, userId) => {
    let dataListGateway = this.state.GatewayShowList;

    const dtDelGateway = dataListGateway.filter(
      (rv) => rv.gatewayId === gatewayId
    );

    const dtReadyGateway = dataListGateway.filter(
      (rmv) => rmv.gatewayId !== gatewayId
    );

    console.log("delete gateway", dtDelGateway);
    console.log("ready gateway", dtReadyGateway);

    this.setState({ GatewayShowList: dtReadyGateway });
  };

  renderDialogAddGateway = () => {
    return (
      <Dialog
        open={this.state.setAddGateway}
        onClose={() => this.handleCancelAddGateway()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Add Gateway</DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginBottom: 10 }}
            placeholder="Enter name or alias gateway"
            autoFocus
            size={"medium"}
            InputLabelProps={{
              shrink: true,
              style: { fontSize: 15, color: "#000" },
            }}
            inputProps={{
              classes: {
                root: styles.notchedOutline,
                focused: styles.notchedOutline,
                notchedOutline: styles.notchedOutline,
              },
              style: {
                fontSize: 16,
                color: "#000",
                textTransform: "capitalize",
              },
            }}
            value={this.state.newAlias}
            onChange={this.handleChangeNewAlias}
            margin="none"
            // id="name"
            label="Name"
            fullWidth
          />
          <TextField
            margin="none"
            size={"medium"}
            placeholder="Enter gateway ID"
            InputLabelProps={{
              shrink: true,
              style: { fontSize: 15, color: "#000" },
            }}
            inputProps={{
              classes: {
                root: styles.notchedOutline,
                focused: styles.notchedOutline,
                notchedOutline: styles.notchedOutline,
              },
              style: { fontSize: 16, color: "#000" },
            }}
            value={this.state.newGatewatID}
            onChange={this.handleChangeNewGatewayID}
            // id="gatewayId"
            label="Gateway ID"
            fullWidth
          />
          {this.alertValidationGateway()}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.handleCancelAddGateway()}
            color="primary"
            style={{ color: "#2e6da4" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => this.doAddGateway()}
            color="primary"
            style={{ color: "#2e6da4" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  alertValidationGateway = () => {
    if (this.state.OpenAlert === true) {
      setTimeout(
        function () {
          this.setState({ OpenAlert: false });
        }.bind(this),
        3000
      );

      return (
        <div style={{ marginTop: 10 }}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            <Typography align="left" variant="inherit">
              The gateway already exist!
            </Typography>
          </Alert>
        </div>
      );
    }
  };

  renderAlert = () => {
    if (this.state.OpenAlert === true) {
      return (
        <div className="alert-position">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            This is an error alert — <strong>check it out!</strong>
          </Alert>
        </div>
      );
    }
  };

  renderFormBody = () => {
    return (
      <div className="scroll-container">
        <form className="formControl">
          <Typography align="center" variant="inherit" style={{ margin: 16 }}>
            Unable to connect to your Smart Home. Please make sure your
            connection configuration is correct.
          </Typography>
          <Grid container>
            <Grid item xs={10}>
              <TextField
                id="standard-multiline-flexible"
                label="Gateway ID"
                placeholder="Enter gateway ID"
                value={this.state.cloudId}
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
            </Grid>

            <Grid item xs={2} style={{ alignSelf: "center" }}>
              <IconButton
                aria-label="list"
                onClick={() => this.handleOpenGateway()}
              >
                <ListAlt style={{ width: 30, height: 30 }} />
              </IconButton>
            </Grid>
          </Grid>

          <TextField
            id="standard-multiline-flexible"
            label="Cloud Server"
            placeholder="Select"
            // multiline
            // rowsMax={2}
            value={this.state.cloudServerId}
            onClick={() => this.handleOpenCloud()}
            // onChange={this.handleChange}
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

          <TextField
            id="standard-multiline-flexible"
            label="User"
            placeholder=""
            // multiline
            // rowsMax={2}
            value={this.state.userGateway}
            onChange={this.handleChangeUser}
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

          <TextField
            id="standard-multiline-flexible"
            label="Password"
            placeholder=""
            value={this.state.passwordGateway}
            onChange={this.handleChangePassword}
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
        </form>
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
            title={this.state.title}
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderFormBody()}</div>

        {this.renderDialogServerCloud()}
        {this.renderDialogListGateway()}
        {this.renderDialogAddGateway()}

        <ButtonConnect Submit={this.doConnect} title={"Connect"} />
      </div>
    );
  }
}

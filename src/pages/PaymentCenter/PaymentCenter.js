import "date-fns";
import React, { Component } from "react";
import { convertToRupiah, makeid } from "../../utils/global";
import BottomPay from "../../components/ButtonPay/ButtonPay";
import Filter from "../../components/Filter/Filter";
import {
  apiUnitBinding,
  apiPaymentInvoice,
  apiPaymentInvPaid,
  apiXenditPayment,
  apiPaymentPaidByDate,
} from "../../services/ConfigServices";
import { styles } from "./Style";
import DataEmpety from "../../components/NoData/NoData";
import SwipeableViews from "react-swipeable-views";
import {
  Tabs,
  Tab,
  AppBar,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Dialog,
  Toolbar,
  IconButton,
  Slide,
  ListItemSecondaryAction,
  Checkbox,
  Grid,
  Button,
  CircularProgress,
  Backdrop,
  DialogActions,
  // DialogContentText,
  TextField,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Payment } from "@material-ui/icons";
import TabPanel from "../../components/TabPanel/TabPanel";
import "./PaymentCenter.style.css";
import SubHeader from "../../components/SubHeader/SubHeader";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { registerLocale } from "react-datepicker";
import moment from "moment";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentCenterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      InProgress: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      Completed: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      age: "",
      phoneno: "",
      email: "",
      currentUnitCode: "",
      currentLotNo: "",
      listUnitCode: [],
      invMustPay: "",
      DebtorAcct: "",
      LotNo: "",
      CompanyCode: "",
      limitList: 10,
      sub_total: 0,
      setViewInvoice: false,
      setDataInvoice: [],
      setOpenPay: false,
      setDataPayment: [],
      totalPaymentChecked: 0,
      totalPayment: 0,
      circleLoading: false,
      loadingData: false,
      setOpenFilter: false,
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    // this.loadBinding();
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=================Request API payment==================//
  doLoadDataUnit = (phoneno) => {
    apiUnitBinding(phoneno)
      .then((response) => {
        let result = response.data;
        let tmp = result.UserAcct;
        let currentLotNo = "";
        if (tmp.length > 0) {
          currentLotNo = tmp[0].LotNo;
          this.setState({
            listUnitCode: tmp,
            currentLotNo: currentLotNo,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doLoadInvoicePayment = (debtor, unit, idx, limit) => {
    this.setState({ onload: true });
    //========UNPAID================//
    apiPaymentInvoice(debtor, unit, idx, limit)
      .then((response) => {
        this.setState({ onload: false });

        let result = response.data;
        if (result.status === "OK") {
          let list = this.state.InProgress.list;
          let dtInvoice = result.DataInvoice;
          for (var i = 0; i < dtInvoice.length; i++) {
            dtInvoice[i].isChecked = false;
            list.push(dtInvoice[i]);
          }

          let next = this.state.InProgress.currentIndex;
          if (dtInvoice.length > 0) next += 1;
          let show = true;
          if (dtInvoice.length < this.state.limitList) show = false;

          let sum = (a) => a.reduce((x, y) => x + y);
          let totalAmount = sum(list.map((x) => Number(x.InvAmt)));

          this.setState({
            InProgress: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
            sub_total: totalAmount,
          });
        }
      })
      .catch((error) => {
        this.setState({ onload: false });
        console.log(error);
      });

    //=========PAID============//
    apiPaymentInvPaid(debtor, unit, idx, limit)
      .then((response) => {
        this.setState({ onload: false });

        let result = response.data;
        if (result.status === "OK") {
          let list = this.state.Completed.list;
          let dtInvoice = result.DataInvoice;
          for (var i = 0; i < dtInvoice.length; i++) {
            dtInvoice[i].isChecked = false;
            list.push(dtInvoice[i]);
          }

          let next = this.state.Completed.currentIndex;
          if (dtInvoice.length > 0) next += 1;
          let show = true;
          if (dtInvoice.length < this.state.limitList) show = false;

          this.setState({
            Completed: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
          });
        }
      })
      .catch((error) => {
        this.setState({ onload: false });
        console.log(error);
      });
  };

  scrollInvoicePayment = (DebtorAcct, Unit) => {
    if (this.state.index === 0) {
      apiPaymentInvoice(
        DebtorAcct,
        Unit,
        this.state.InProgress.currentIndex,
        this.state.limitList
      )
        .then((response) => {
          this.setState({ onload: false });

          let result = response.data;
          if (result.status === "OK") {
            let list = this.state.InProgress.list;
            let dtInvoice = result.DataInvoice;
            for (var i = 0; i < dtInvoice.length; i++) {
              dtInvoice[i].isChecked = false;
              list.push(dtInvoice[i]);
            }

            let next = this.state.InProgress.currentIndex;
            if (dtInvoice.length > 0) next += 1;
            let show = true;
            if (dtInvoice.length < this.state.limitList) show = false;

            let sum = (a) => a.reduce((x, y) => x + y);
            let totalAmount = sum(list.map((x) => Number(x.InvAmt)));

            this.setState({
              InProgress: {
                list: list,
                currentIndex: next,
                showLoadMore: show,
              },
              sub_total: totalAmount,
            });
          }
        })
        .catch((error) => {
          this.setState({ onload: false });
          console.log(error);
        });
    } else {
      apiPaymentInvPaid(
        DebtorAcct,
        Unit,
        this.state.Completed.currentIndex,
        this.state.limitList
      )
        .then((response) => {
          this.setState({ onload: false });

          let result = response.data;
          if (result.status === "OK") {
            let list = this.state.Completed.list;
            let dtInvoice = result.DataInvoice;
            for (var i = 0; i < dtInvoice.length; i++) {
              dtInvoice[i].isChecked = false;
              list.push(dtInvoice[i]);
            }

            let next = this.state.Completed.currentIndex;
            if (dtInvoice.length > 0) next += 1;
            let show = true;
            if (dtInvoice.length < this.state.limitList) show = false;

            this.setState({
              Completed: {
                list: list,
                currentIndex: next,
                showLoadMore: show,
              },
            });
          }
        })
        .catch((error) => {
          this.setState({ onload: false });
          console.log(error);
        });
    }
  };

  doFilterDate = () => {
    this.setState({
      Completed: { list: [], currentIndex: 0, showLoadMore: false },
    });
    const format2 = "YYYY-MM-DD";
    let start = moment(this.state.startDate).format(format2);
    let end = moment(this.state.endDate).format(format2);

    let paramsReq = {
      Debtor: this.state.DebtorAcct,
      UnitCode: this.state.LotNo,
      currentIndex: 0,
      limit: this.state.limitList,
      start: start + " 00:00:00",
      end: end + " 23:59:59",
    };

    // console.log(paramsReq);
    apiPaymentPaidByDate(paramsReq)
      .then((response) => {
        this.setState({ onload: false });
        this.handleCloseFilter();
        let result = response.data;
        if (result.status === "OK") {
          let list = this.state.Completed.list;
          let dtInvoice = result.DataInvoice;
          for (var i = 0; i < dtInvoice.length; i++) {
            dtInvoice[i].isChecked = false;
            list.push(dtInvoice[i]);
          }

          let next = this.state.Completed.currentIndex;
          if (dtInvoice.length > 0) next += 1;
          let show = true;
          if (dtInvoice.length < this.state.limitList) show = false;

          this.setState({
            Completed: {
              list: list,
              currentIndex: next,
              showLoadMore: show,
            },
          });
        }
      })
      .catch((error) => {
        this.setState({ onload: false });
        console.log(error);
      });
  };

  //=================Function & Method ===================//
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
        });
      }

      let param =
        '{"title":"' +
        "Payment Center" +
        '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true, "needLogin":' +
        (needLogin ? "true" : "false") +
        "}";
      window.postMessage(param, "*");
    }
  }

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
        email: info.email,
      });
      this.doLoadDataUnit(info.phonenumber);
    } else {
      // this.setState({
      //   phoneno: "082216825612",
      //   email: "ucibaetulloh@gmail.com",
      // });
      // this.doLoadDataUnit("082216825612");
    }
  };

  loadBinding = async () => {
    let tmp = localStorage.getItem("smart-app-id-binding");
    let tmp2 = localStorage.getItem("Modernland-Account");
    if (
      tmp2 === undefined ||
      tmp2 === null ||
      tmp2 === "null" ||
      tmp2 === "" ||
      tmp2 === "undefined"
    ) {
      let param = '{"code":"need-binding"}';
      this.sendPostMessage(param);
    }
    if (
      tmp === undefined ||
      tmp === null ||
      tmp === "null" ||
      tmp === "" ||
      tmp === "undefined"
    ) {
      let param = '{"code":"need-binding"}';
      this.sendPostMessage(param);
    } else {
      this.loadUser();
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
    if (difference - scrollposition <= 1) {
      // console.log("scroll cek data");
      if (this.state.index === 0) {
        if (this.state.InProgress.showLoadMore === true) {
          this.scrollInvoicePayment(this.state.DebtorAcct, this.state.LotNo);
        }
      } else {
        if (this.state.Completed.showLoadMore === true) {
          this.scrollInvoicePayment(this.state.DebtorAcct, this.state.LotNo);
        }
      }
    }
  };

  handleDatechange = (event) => {
    this.setState({ startDate: event.target.value });
  };

  handleDatechangeEnd = (event) => {
    this.setState({ endDate: event.target.value });
  };

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleChangeIndex = (index) => {
    this.setState({
      index: index,
    });
  };

  handleChangeIdx = (index) => {
    this.setState({
      index: index,
    });
  };

  handleChangeUnit = (event) => {
    // console.log(event.target.value);
    this.setState({ age: event.target.value });
  };

  handleOpenFilter = () => {
    this.setState({ setOpenFilter: true });
  };

  handleCloseFilter = () => {
    this.setState({ setOpenFilter: false });
  };

  handleCloseViewInv = () => {
    this.setState({
      setViewInvoice: false,
      setDataInvoice: [],
    });
  };

  doViewInvoice = (dtInv, idx) => {
    let dataInv = [];
    dataInv.push(dtInv);
    // console.log(dataInv);
    this.setState({
      setDataInvoice: dataInv,
      setViewInvoice: true,
    });
  };

  handleClosePayment = () => {
    if (this.state.circleLoading === false) {
      this.setState({
        setOpenPay: false,
        setDataPayment: [],
        totalPayment: 0,
        totalPaymentChecked: 0,
      });
    }
  };

  handleOpenPayment = () => {
    let tmpInvoice = this.state.InProgress.list;
    for (let i = 0; i < tmpInvoice.length; i++) {
      tmpInvoice[i].isChecked = true;
    }

    // console.log(tmpInvoice);
    var total_payment = 0;

    tmpInvoice.forEach((val, idx) => {
      if (val.isChecked === true) {
        this.setState({ DebtorAcct: val.DebtorAcct });
        total_payment += val.InvAmt;
      }
    });

    const result = tmpInvoice.filter((v) => v.isChecked === true);
    let payment = result.length;

    this.setState({
      totalPayment: payment,
      totalPaymentChecked: total_payment,
      setDataPayment: tmpInvoice,
      setOpenPay: true,
    });
  };

  handleCheck(e, i) {
    if (this.state.circleLoading === false) {
      let dtPaymentInv = this.state.setDataPayment;
      for (let j = 0; j < dtPaymentInv.length; j++) {
        if (j <= i) {
          dtPaymentInv[j].isChecked = e.target.checked;
        } else {
          dtPaymentInv[j].isChecked = false;
        }
      }
      // console.log(dtPaymentInv);
      var total_pay = 0;

      dtPaymentInv.forEach((val, idx) => {
        if (val.isChecked === true) {
          this.setState({ DebtorAcct: val.DebtorAcct });
          total_pay += val.InvAmt;
        }
      });

      const result = dtPaymentInv.filter((v) => v.isChecked === true);
      let payment = result.length;

      this.setState({
        totalPayment: payment,
        setDataPayment: dtPaymentInv,
        totalPaymentChecked: total_pay,
      });
    }
  }

  doPaymentInvoiceXendit = () => {
    let dataPaymentInv = this.state.setDataPayment;
    let FilterInv = dataPaymentInv.filter((val, i) => val.isChecked === true);
    // console.log("bayar ke xendit", FilterInv);

    const body = JSON.stringify({
      debtoracct: this.state.DebtorAcct,
      companycode: this.state.CompanyCode,
      external_id: "ID/MP/" + makeid(10),
      amount: this.state.totalPaymentChecked,
      payer_email: this.state.email.replace(/\s/g, ""),
      description: "Multi Payment Invoice IPKL",
      items: FilterInv,
    });

    // console.log("cek parameters", body);

    this.setState({ circleLoading: true });
    apiXenditPayment(body)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.props.history.push(
            "/paymentform/" + encodeURIComponent(response.data.id)
          );
        }
        setTimeout(
          function () {
            this.setState({ circleLoading: false });
          }.bind(this),
          2000
        );
      })
      .catch((error) => {
        this.setState({ circleLoading: false });
        console.log(error);
      });
  };

  goBack = () => {
    this.props.history.push("/home");
  };

  changeUnitCode = (value) => {
    // console.log(value);
    this.setState({
      invMustPay: "",
      InProgress: {
        list: [],
        currentIndex: 0,
      },
      Completed: {
        list: [],
        currentIndex: 0,
      },
    });
    let arr = value.split("|");

    this.setState({ DebtorAcct: arr[0], LotNo: arr[1], CompanyCode: arr[2] });
    this.doLoadInvoicePayment(arr[0], arr[1], 0, this.state.limitList);
    this.setState({ currentUnitCode: value });
  };

  renderStatus = (item) => {
    if (item.PayAmt === "" && item.status === "") {
      return (
        <Typography
          component="span"
          variant="body2"
          style={(stylesListComent.inline, { fontSize: 14, color: "#ff5722" })}
        >
          Pending
        </Typography>
      );
    } else if (item.PayAmt !== "" && item.status === "") {
      return (
        <Typography
          component="span"
          variant="body2"
          style={(stylesListComent.inline, { fontSize: 14, color: "#009688" })}
        >
          <span>Payment</span>
          <br></br>Accepted
        </Typography>
      );
    } else {
      return (
        <Typography
          component="span"
          variant="body2"
          style={(stylesListComent.inline, { fontSize: 14, color: "#2196f3" })}
        >
          Paid
        </Typography>
      );
    }
  };

  renderInProggresBody = () => {
    if (this.state.InProgress.list.length > 0) {
      return (
        <List className="list-payment-root">
          <div style={{ marginBottom: 100 }}>
            {this.state.InProgress.list.map((dt, i) => {
              return (
                <div key={dt.InvNo}>
                  <ListItem
                    alignItems="flex-start"
                    button
                    onClick={() => this.doViewInvoice(dt, i)}
                  >
                    <ListItemAvatar style={{ alignSelf: "center" }}>
                      <Avatar
                        alt="ipkl"
                        src="https://smart-community.csolusi.com/smartcluster/ipkl.jpeg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={dt.InvNo}
                      primaryTypographyProps={{
                        style: { color: "#000", fontWeight: 500, fontSize: 14 },
                      }}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            {dt.Category}
                          </Typography>
                          <br></br>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            Period: {dt.Periode}
                          </Typography>
                          <br></br>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            Amount: {convertToRupiah(dt.InvAmt)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <div style={{ alignSelf: "center", textAlign: "center" }}>
                      <ListItemText
                        primary="Status"
                        primaryTypographyProps={{
                          style: {
                            color: "#000",
                            fontWeight: 500,
                            fontSize: 14,
                          },
                        }}
                        secondary={
                          <React.Fragment>
                            {this.renderStatus(dt)}
                          </React.Fragment>
                        }
                      />
                    </div>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            })}
          </div>
        </List>
      );
    } else {
      return (
        <div className="payments-scroll-view">
          <DataEmpety title="No outstanding bills" />
        </div>
      );
    }
  };

  renderDialogViewInvoice = () => {
    const { setDataInvoice } = this.state;

    if (setDataInvoice.length > 0) {
      return (
        <Dialog
          fullScreen
          open={this.state.setViewInvoice}
          onClose={() => this.handleCloseViewInv()}
          TransitionComponent={Transition}
        >
          <AppBar style={stylesDialog.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.handleCloseViewInv()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={stylesDialog.title}>
                Invoice Details
              </Typography>
            </Toolbar>
          </AppBar>

          <List className="root-viewInv">
            <ListItem>
              <ListItemText
                style={{ textAlign: "center" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 15, color: "#000", textAlign: "center" })
                      }
                    >
                      {setDataInvoice[0].InvNo}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Amount
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {convertToRupiah(setDataInvoice[0].InvAmt)}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Period
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {setDataInvoice[0].Periode}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Unit
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {setDataInvoice[0].Unit}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Category
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      {setDataInvoice[0].Category}
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />

            {this.renderInvoiceDetailPaid()}

            <ListItem>
              <ListItemText
                style={{ textAlign: "left" }}
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 14, color: "#333", textAlign: "center" })
                      }
                    >
                      Status
                    </Typography>
                    <br></br>
                  </React.Fragment>
                }
              />
              <ListItemText
                style={{ textAlign: "right" }}
                primary={
                  <React.Fragment>
                    {this.renderStatus(setDataInvoice[0])}
                    <br></br>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />
          </List>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  renderInvoiceDetailPaid = () => {
    const { setDataInvoice } = this.state;
    if (setDataInvoice[0].PayAmt !== "") {
      return (
        <>
          <ListItem>
            <ListItemText
              style={{ textAlign: "left" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    Paid Date
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
            <ListItemText
              style={{ textAlign: "right" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    {setDataInvoice[0].PayDate}
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              style={{ textAlign: "left" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    Transaction ID
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
            <ListItemText
              style={{ textAlign: "right" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    {setDataInvoice[0].PayNo}
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              style={{ textAlign: "left" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    Total Payment
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
            <ListItemText
              style={{ textAlign: "right" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    {convertToRupiah(parseInt(setDataInvoice[0].PayAmt))}
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              style={{ textAlign: "left" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  >
                    Payment Method
                  </Typography>
                  <br></br>
                </React.Fragment>
              }
            />
            <ListItemText
              style={{ textAlign: "right" }}
              primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 14, color: "#333", textAlign: "center" })
                    }
                  ></Typography>
                  <br></br>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider />
        </>
      );
    }
  };

  renderDialogCheckedInvoice = () => {
    const { setDataPayment } = this.state;

    if (setDataPayment.length > 0) {
      return (
        <Dialog
          fullScreen
          open={this.state.setOpenPay}
          onClose={() => this.handleClosePayment()}
          TransitionComponent={Transition}
        >
          <AppBar style={stylesDialog.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.handleClosePayment()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={stylesDialog.title}>
                Multiple Payments
              </Typography>
            </Toolbar>
          </AppBar>
          <List className="list-multi-root">
            <div style={{ marginBottom: 100 }}>
              {this.state.setDataPayment.map((dt, i) => {
                return (
                  <div key={dt.insert}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar style={{ alignSelf: "center" }}>
                        <Avatar alt="" src="" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={dt.InvNo}
                        primaryTypographyProps={{
                          style: {
                            color: "#000",
                            fontWeight: 500,
                            fontSize: 14,
                          },
                        }}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              style={
                                (stylesListComent.inline,
                                { fontSize: 14, color: "#333" })
                              }
                            >
                              {dt.Category}
                            </Typography>
                            <br></br>
                            <Typography
                              component="span"
                              variant="body2"
                              style={
                                (stylesListComent.inline,
                                { fontSize: 14, color: "#333" })
                              }
                            >
                              Period: {dt.Periode}
                            </Typography>
                            <br></br>
                            <Typography
                              component="span"
                              variant="body2"
                              style={
                                (stylesListComent.inline,
                                { fontSize: 14, color: "#333" })
                              }
                            >
                              Amount: {convertToRupiah(dt.InvAmt)}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <div style={{ alignSelf: "center", textAlign: "center" }}>
                        <ListItemSecondaryAction>
                          <Checkbox
                            style={{ width: 40, height: 40 }}
                            edge="end"
                            onChange={(e) => this.handleCheck(e, i)}
                            checked={dt.isChecked}
                            inputProps={{
                              "aria-labelledby":
                                "checkbox-list-secondary-label",
                            }}
                          />
                        </ListItemSecondaryAction>
                      </div>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </div>
                );
              })}
            </div>
          </List>
          {this.renderButton()}
        </Dialog>
      );
    } else {
      return null;
    }
  };

  renderButton = () => {
    if (this.state.totalPayment !== 0) {
      return (
        <div className="pay-bottom">
          <Grid container justify="center">
            <Grid item xs={4} style={{ textAlign: "start" }}>
              <ListItemText
                style={{ textAlign: "center", paddingLeft: -10 }}
                primary={this.state.totalPayment}
                primaryTypographyProps={{
                  style: {
                    color: "#000",
                    fontWeight: 500,
                    fontSize: 14,
                  },
                }}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 12, color: "black", fontWeight: "bold" })
                      }
                    >
                      Payment
                    </Typography>
                  </React.Fragment>
                }
              />
            </Grid>
            <Grid item xs={4}>
              <ListItemText
                style={{ textAlign: "center" }}
                primary="Total Bill"
                primaryTypographyProps={{
                  style: {
                    color: "#000",
                    fontWeight: 500,
                    fontSize: 14,
                    textAlign: "center",
                  },
                }}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={
                        (stylesListComent.inline,
                        { fontSize: 16, color: "red", fontWeight: "bold" })
                      }
                    >
                      {convertToRupiah(this.state.totalPaymentChecked)}
                    </Typography>
                  </React.Fragment>
                }
              />
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                textAlign: "end",
                paddingRight: 10,
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="small"
                style={{
                  height: 50,
                  backgroundColor: "#2e6da4",
                }}
                disabled={this.state.circleLoading}
                // onClick={() => this.doPaymentInvoiceXendit()}
                endIcon={this.state.circleLoading === false ? <Payment /> : ""}
              >
                {this.state.circleLoading === true ? (
                  <CircularProgress style={{ color: "#fff" }} size={24} />
                ) : (
                  <Typography
                    variant="button"
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                  >
                    Pay
                  </Typography>
                )}
              </Button>
            </Grid>
          </Grid>
        </div>
      );
    }
  };

  renderCompletedBody = () => {
    if (this.state.Completed.list.length > 0) {
      return (
        <List className="list-payment-root">
          <div style={{ marginBottom: 100 }}>
            {this.state.Completed.list.map((dt, i) => {
              return (
                <div key={dt.InvNo}>
                  <ListItem
                    alignItems="flex-start"
                    button
                    onClick={() => this.doViewInvoice(dt, i)}
                  >
                    <ListItemAvatar style={{ alignSelf: "center" }}>
                      <Avatar
                        alt="ipkl"
                        src="https://smart-community.csolusi.com/smartcluster/ipkl.jpeg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={dt.InvNo}
                      primaryTypographyProps={{
                        style: { color: "#000", fontWeight: 500, fontSize: 14 },
                      }}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            {dt.Category}
                          </Typography>
                          <br></br>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            Period: {dt.Periode}
                          </Typography>
                          <br></br>
                          <Typography
                            component="span"
                            variant="body2"
                            style={
                              (stylesListComent.inline,
                              { fontSize: 14, color: "#333" })
                            }
                          >
                            Amount: {convertToRupiah(dt.InvAmt)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <div style={{ alignSelf: "center", textAlign: "center" }}>
                      <ListItemText
                        primary="Status"
                        primaryTypographyProps={{
                          style: {
                            color: "#000",
                            fontWeight: 500,
                            fontSize: 14,
                          },
                        }}
                        secondary={
                          <React.Fragment>
                            {this.renderStatus(dt)}
                          </React.Fragment>
                        }
                      />
                    </div>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            })}
          </div>
        </List>
      );
    } else {
      return (
        <div className="payments-scroll-view">
          <DataEmpety title="No bills have been paid" />
        </div>
      );
    }
  };

  renderDialogFilterDate = () => {
    return (
      <Dialog
        open={this.state.setOpenFilter}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleCloseFilter}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography
            component="span"
            variant="body2"
            style={(stylesListComent.inline, { fontSize: 14, color: "#333" })}
          >
            Find transaction date
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container justifycontent="space-around" spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="date"
                label="Start"
                type="date"
                defaultValue={this.state.startDate}
                onChange={this.handleDatechange}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: 18, color: "#000" },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="date"
                label="End"
                type="date"
                onChange={this.handleDatechangeEnd}
                defaultValue={this.state.endDate}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: 18, color: "#000" },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseFilter} color="primary">
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, color: "red", textTransform: "capitalize" })
              }
            >
              Cancel
            </Typography>
          </Button>
          <Button onClick={this.doFilterDate} color="primary">
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListComent.inline,
                { fontSize: 14, color: "#2e6da4", textTransform: "capitalize" })
              }
            >
              Submit
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderButtonIndex = () => {
    if (this.state.index === 0 && this.state.InProgress.list.length > 0) {
      return (
        <BottomPay
          Submit={this.handleOpenPayment}
          total={this.state.sub_total}
          title={"Pay"}
        />
      );
    } else if (this.state.index === 1) {
      return <Filter add={this.handleOpenFilter} />;
    }
  };

  render() {
    const { index } = this.state;
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            onSearch={this.onSearch}
            title="My Bills"
            goBack={this.goBack}
          />
          <AppBar position="static" color="default">
            <Tabs
              value={index}
              indicatorColor={"primary"}
              textColor={"inherit"}
              centered={true}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#2e6da4",
                },
              }}
              onChange={this.handleChange}
            >
              <Tab
                style={styles.tab}
                onClick={() => this.handleChangeIndex(0)}
                label="Pending"
              />
              <Tab
                style={styles.tab}
                onClick={() => this.handleChangeIndex(1)}
                label="Paid"
              />
            </Tabs>
          </AppBar>
          <Box width="100%">
            <Box width="auto" bgcolor="#fff" p={1} my={0.5}>
              <FormControl
                style={{ width: "100%" }}
                className="formControl-payment"
              >
                <Select
                  fullWidth
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  value={this.state.currentUnitCode}
                  defaultValue={this.state.currentUnitCode}
                  onChange={(e) => this.changeUnitCode(e.target.value)}
                >
                  <MenuItem value="">
                    <em>
                      <span style={{ fontSize: 16 }}>Select Unit:</span>
                    </em>
                  </MenuItem>
                  {this.state.listUnitCode.map((item, i) => (
                    <MenuItem
                      key={item.LotNo}
                      value={
                        item.DebtorAcct +
                        "|" +
                        item.LotNo +
                        "|" +
                        item.CompanyCode
                      }
                    >
                      <span style={{ fontSize: 16 }}>
                        Unit Code: {item.LotNo} - Cluster: {item.ClusterName}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </div>
        <div className="contents">
          <SwipeableViews
            enableMouseEvents={true}
            index={this.state.index}
            onChangeIndex={(e) => this.handleChangeIdx(e)}
          >
            <TabPanel value={index} index={0}>
              {this.renderInProggresBody()}
            </TabPanel>
            <TabPanel value={index} index={1}>
              {this.renderCompletedBody()}
            </TabPanel>
          </SwipeableViews>
        </div>
        {this.renderButtonIndex()}
        {this.renderDialogViewInvoice()}
        {this.renderDialogCheckedInvoice()}
        {this.renderDialogFilterDate()}
        <Backdrop className="backdrop" open={this.state.loadingData}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
// import { createBrowserHistory } from "history";
import HomePage from "./pages/Home/Home";
import NewsPage from "./pages/News/News";
import MomentsPage from "./pages/Moments/Moments";
import EmergencyPage from "./pages/Emergency/Emergency";
import BookingsPage from "./pages/Bookings/Bookings";
import ComplaintPage from "./pages/Complaints/Complaints";
import ComplaintForm from "./pages/ComplaintsForm/ComplaintsForm";
import ServiceCenterPage from "./pages/ServiceCenter/ServiceCenter";
import PaymentCenterPage from "./pages/PaymentCenter/PaymentCenter";
import DirectoryPage from "./pages/Directory/Directory";
import InquiryPage from "./pages/Inquiry/Inquiry";
import WFHPage from "./pages/WFH/WFH";
import AskMePage from "./pages/AskMe/AskMe";
import MerchantPage from "./pages/Merchants/Merchants";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import WFHDetail from "./pages/WFHDetail/WFHDetail";
import SmartHomeControl from "./pages/SmartHomeControl/SmartHomeControl";
import SH_Connection from "./pages/SH_Connection/SH_Connection";
import StreamCameraPage from "./pages/Camera/Camera";
import CameraView from "./pages/CameraView/CameraView";
import BookingSelected from "./pages/BookingSelected/BookingSelected";
import BookingMenu from "./pages/BookingMenu/BookingMenu";
import Entertainment from "./pages/Entertainment/Entertainment";
import MarketplacePage from "./pages/Marketplace/Marketplace";
import PaymentFormPage from "./pages/FormPayment/FormPayment";
import PaymentSuccessPage from "./pages/PaymentSuccess/PaymentSuccess";
import BookingForm from "./pages/BookingForm/BookingForm";
import VMSPage from "./pages/VMS/VMS";
import VmsForm from "./pages/VmsForm/VmsForm";
import LogViewPage from "./pages/LogView/LogView";
import LoginPage from "./pages/LoginPage/Login";
import RegisterPage from "./pages/Register/Register";
// const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/home" component={HomePage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/newsdetail/:id" component={NewsDetail} />
        <Route path="/moments" component={MomentsPage} />
        <Route path="/emergency" component={EmergencyPage} />
        <Route path="/bookings" component={BookingsPage} />
        <Route path="/complaints" component={ComplaintPage} />
        <Route path="/complaintform" component={ComplaintForm} />
        <Route path="/servicecenter" component={ServiceCenterPage} />
        <Route path="/mybills" component={PaymentCenterPage} />
        <Route path="/directory" component={DirectoryPage} />
        <Route path="/inquiry" component={InquiryPage} />
        <Route path="/wfh" component={WFHPage} />
        <Route path="/wfhdetail/:id" component={WFHDetail} />
        <Route path="/askme" component={AskMePage} />
        <Route path="/merchants" component={MerchantPage} />
        <Route path="/smarthomecontrol" component={SmartHomeControl} />
        <Route path="/connectionsetting" component={SH_Connection} />
        <Route path="/streamcamera" component={StreamCameraPage} />
        <Route path="/streamingview/:id/:title" component={CameraView} />
        <Route path="/bookingcategory" component={BookingSelected} />
        <Route path="/bookingmenu/:id/:title" component={BookingMenu} />
        <Route path="/paymentcenter" component={PaymentCenterPage} />
        <Route path="/entertainment" component={Entertainment} />
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/paymentform/:xenditId" component={PaymentFormPage} />
        <Route path="/statuspayment" component={PaymentSuccessPage} />
        <Route path="/bookingform/:id/:title" component={BookingForm} />
        <Route path="/vms" component={VMSPage} />
        <Route path="/vmsform" component={VmsForm} />
        <Route path="/logview" component={LogViewPage} />
        <Route path="/signup" component={RegisterPage} />
      </Switch>
    );
  }
}
export default App;

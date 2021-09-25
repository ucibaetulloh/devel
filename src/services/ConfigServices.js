import axios from "axios";
import { webserviceurl } from "./BaseUrl";
import moment from "moment";

export function appLoadBanner(communityid) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_load_communitydata.php",
      data: {
        communityid: communityid,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function app_update_platform(phonenumber, platform) {
  let params = {
    phoneno: phonenumber,
    platform: platform,
  };
  try {
    const response = axios.post(
      webserviceurl + "/app_update_platform.php",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export function app_load_news(currentIndex, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_load_news.php",
      data: {
        currentIndex: currentIndex,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function count_reading(phonenumber, item, reading) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/master_save_news_reading.php",
      data: {
        phoneno: phonenumber,
        newsid: item.id,
        reading: reading,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function app_view_moment(currentIndex, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_view_moment.php",
      data: {
        currentIndex: currentIndex,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function app_load_newsdetailList(id) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_view_newsdetail.php",
      data: {
        newsid: id,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function app_insert_comment(
  commentId,
  momentId,
  comments,
  commentphonenoid,
  insert
) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_moment_comment_add.php",
      data: {
        commentid: commentId,
        momentid: momentId,
        comment: comments,
        commentphoneno: commentphonenoid,
        d_insert: insert,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function deleted_likes_moment(phonenumber, momentId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_moment_likes_deleted.php",
      data: {
        phonenumber: phonenumber,
        momentid: momentId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function add_likes_moment(momentId, PhoneId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_moment_likes_add.php",
      data: {
        momentid: momentId,
        phonenumber: PhoneId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function api_emergency(currentIndex, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_view_emergency.php",
      data: {
        currentIndex: currentIndex,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function api_wfh_load(currentIndex, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_load_WFH.php",
      data: {
        currentIndex: currentIndex,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function api_countReading(phonenumber, item, reading) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/master_save_news_wfh_reading.php",
      data: {
        phoneno: phonenumber,
        newsid: item.id,
        reading: reading,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function api_detail_wfh(id) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_view_wfhdetail.php",
      data: {
        newsid: id,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function api_add_complaint(params) {
  // console.log(params);
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/complaintAdd.php",
      data: {
        phonenumber: params.phonenumber,
        dateComplaint: params.dateComplaint,
        incidentDate: params.incidentDate,
        complaint: params.complaint,
        complaintDesc: params.complaintDesc,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiComplaintList(phone) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/complaintList.php",
      data: {
        phonenumber: phone,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiComplaintDeleted(dtParams) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/complaintDeleted.php",
      data: {
        complaintId: dtParams.id,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCommentDelete(params) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_moment_comment_delete.php",
      data: {
        phoneno: params.phoneno,
        momentid: params.momentid,
        comment: params.comment,
        insert: params.insert,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiStreamCameraList() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/area_central.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCheckAccessCamera(dtParams, phone) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/user_access_camera.php",
      data: {
        streamId: dtParams.id,
        phonenumber: phone,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiStreamCameraId(streamId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/stream_camera_id.php",
      data: {
        streamId: streamId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiBookingCategory() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/booking_category.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiBookingMenu(CategoryId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/booking_menu.php",
      data: { categoryId: CategoryId },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiUnitBinding(phone) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/payment_debtorAcct.php",
      data: { phonenumber: phone },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiPaymentInvoice(debtor, unit, idx, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/payment_InvAcct.php",
      data: {
        Debtor: debtor,
        UnitCode: unit,
        currentIndex: idx,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiPaymentInvPaid(debtor, unit, idx, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/payment_InvPaid.php",
      data: {
        Debtor: debtor,
        UnitCode: unit,
        currentIndex: idx,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiXenditPayment(body) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/apiXendit/create_invoice_multi.php",
      data: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiPaymentPaidByDate(ParamsReq) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/payment_InvPaid_byDate.php",
      data: ParamsReq,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiVmsProfile(phoneno) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/vms_check_profile.php",
      data: {
        phonenumber: phoneno,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiVmsto202(params) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_vms_add.php",
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadVms(currentIndex, limitList, phone) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_vms_list.php",
      data: {
        currentIndex: currentIndex,
        limit: limitList,
        phoneno: phone,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadVmsById(currentIndex, limitList, phone, Id) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_vms_by_venueId.php",
      data: {
        currentIndex: currentIndex,
        limit: limitList,
        phoneno: phone,
        venueId: Id,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCheckValidation(phoneno) {
  const format2 = "YYYY-MM-DD";
  var date1 = new Date();
  var dateTimeNow = moment(date1).format(format2);

  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_vms_validation.php",
      data: {
        phonenumber: phoneno,
        dateTime: dateTimeNow,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCheckValidationCompy(phoneno, userid) {
  const format2 = "YYYY-MM-DD";
  var date1 = new Date();
  var dateTimeNow = moment(date1).format(format2);

  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_company_vms_validation.php",
      data: {
        phonenumber: phoneno,
        dateTime: dateTimeNow,
        userId: userid,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCheckValidationVenue(phoneno, venueId) {
  const format2 = "YYYY-MM-DD";
  var date1 = new Date();
  var dateTimeNow = moment(date1).format(format2);

  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_venue_vms_validation.php",
      data: {
        phonenumber: phoneno,
        dateTime: dateTimeNow,
        venueId: venueId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiloadCompany() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/location_vms.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadVenue() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/venue_vms.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadReason() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/reason_vms.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadGender() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/gender_vms.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadNationality() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/nationality_vms.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadIdType() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/id_type_vms.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadLocationVenue(id) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/location_venue_vms.php",
      data: { venueId: id },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCompanyEnable() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/company_validation.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiVaccine(NIK) {
  try {
    const response = axios({
      method: "post",
      url: "",
      data: {
        nik: NIK,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiSaveVaksin(params) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/save_status_vaksin.php",
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiCheckStatusVaksin(PHONE, NIK) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/check_status_vaksin.php",
      data: {
        phonenumber: PHONE,
        nik: NIK,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiGetUserStaff(employeId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/log_view_get_user_id.php",
      data: {
        employeeId: employeId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLogAllData(staff_id, currentIndex, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/log_view_getAll_data2.php",
      data: {
        staff_id: staff_id,
        currentIndex: currentIndex,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLog7dayData(staff_id, currentIndex, limitList) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/log_view_get7day_data2.php",
      data: {
        staff_id: staff_id,
        currentIndex: currentIndex,
        limit: limitList,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiUpdate7Day(params) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/log_view_update7day_data2.php",
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiNewsFeed() {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/news_feed.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function deleteShortcut(phonenumber) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_delete_shortcut.php",
      data: {
        phonenumber: phonenumber,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLoadShortcut(phonenumber) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_shortcut.php",
      data: {
        phonenumber: phonenumber,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiVmsListByVenueId(phonenumber, venueId) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_vms_list_venueId.php",
      data: {
        phoneno: phonenumber,
        venueId: venueId,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiLogin(phonenumber, password) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_login_2021.php",
      data: {
        phonenumber: phonenumber,
        password: password,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiValidationPhone(phonenumber) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_phonenumber_validation.php",
      data: {
        phonenumber: phonenumber,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiValidationEmail(email) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_email_validation.php",
      data: {
        email: email,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function apiValidationNIK(nik) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_nik_validation.php",
      data: {
        ktp: nik,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export function appRegistrasiVisitor(params) {
  try {
    const response = axios({
      method: "post",
      url: webserviceurl + "/app_vms_register.php",
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

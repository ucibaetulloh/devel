import React, { Component } from "react";
import { CardMoment } from "./Style";
import SubHeader from "../../components/SubHeader/SubHeader";
import "./Moments.style.css";
import {
  app_view_moment,
  deleted_likes_moment,
  add_likes_moment,
  app_insert_comment,
  apiCommentDelete,
} from "../../services/ConfigServices";
import {
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Button,
  Dialog,
  TextareaAutosize,
  AppBar,
  Toolbar,
  Slide,
  Icon,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Favorite, Comment, DeleteForever, Share } from "@material-ui/icons";
import ScrollToTopBtn from "../../components/ScrollToTop/ScrollToTop";
import FbImageLibrary from "react-fb-image-grid";
import DataEmpety from "../../components/NoData/NoData";
import { registerLocale } from "react-datepicker";
import moment from "moment";
import { zhCN } from "date-fns/esm/locale";
import "moment/locale/en-au";
moment.locale("zhCN");
registerLocale("zhCN", zhCN);

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

class MomentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moments: {
        list: [],
        currentIndex: 0,
        showLoadMore: false,
      },
      itemDataMomentUser: [],
      expanded: false,
      setExpanded: false,
      momentid: 0,
      phoneno: "",
      name: "",
      profilepic: [],
      desc: "",
      gallery: [],
      showLoading: false,
      limitList: 10,
      open: false,
      setOpen: false,
      Textcomment: "",
      dataComment: [],
      idxMomentId: "",
      updatedlikes: false,
      listLikeMoment: [],
    };
  }

  componentDidMount = () => {
    this.waitForBridge();
    this.loadUser();
    this.loadMoment(this.state.moments.currentIndex);
    this.scrollTopFunction();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  //=====================Request API Service===================//
  loadMoment = (currentIndex) => {
    // this.state.news.showLoadMore = false;
    this.setState({ showLoading: true });
    this.setState({ onload: true });
    app_view_moment(currentIndex, this.state.limitList)
      .then((response) => {
        this.setState({ onload: false });
        let result = response.data;
        // console.log(result);
        if (result.status === "OK") {
          let list = this.state.moments.list;

          for (var i = 0; i < result.records.length; i++) {
            result.records[i].desc = decodeURIComponent(result.records[i].desc);
            result.records[i].time = moment(result.records[i].time);
            list.push(result.records[i]);
          }

          let next = this.state.moments.currentIndex;
          if (result.records.length > 0) next += 1;

          let show = true;
          if (result.records.length < this.state.limitList) show = false;

          this.setState({
            moments: {
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

  doDeletedLikes = (phone, momentID) => {
    deleted_likes_moment(phone, momentID)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  doAddLikes = (momentId, PhoneId) => {
    add_likes_moment(momentId, PhoneId)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  doCommentAdd = (commentId, MomentId, Comment, Phone, D_insert) => {
    app_insert_comment(commentId, MomentId, Comment, Phone, D_insert)
      .then((response) => {})
      .catch((error) => {});
  };

  doCommentDeleted = (params) => {
    apiCommentDelete(params)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  //=====================Method & Function=====================//

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
      if (this.state.moments.showLoadMore === true) {
        this.loadMoment(this.state.moments.currentIndex);
      }
    }
  };

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
        "Moments" +
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
        name: info.name,
        profilepic: info.profilepic,
      });
    } else {
      // this.setState({
      //   phoneno: "082216825612",
      //   name: "Uci Baetulloh",
      //   profilepic:
      //     "http://smart-community.csolusi.com/smart-cluster-webapi-app/images/082216825612_20210330063501.png",
      // });
    }
  };

  goFormMoment = () => {
    // this.props.history.push("/");
    let param = '{"code":"need-moment"}';
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

  textCountLikes = (v, i) => {
    // console.log("cek hasil dari likes nya ", v);

    if (v.likes.length > 0) {
      const dtLikesUser = v.likes.filter(
        (ftUser) => ftUser.phoneno === this.state.phoneno
      );

      if (dtLikesUser.length > 0) {
        return (
          <>
            <Favorite style={{ color: "#2e6da4" }} />
            &nbsp;
            {v.count_likes > 0 ? (
              <span style={{ fontSize: 12 }}>{v.count_likes}&nbsp;Likes</span>
            ) : (
              <span style={{ fontSize: 12 }}>{v.count_likes}&nbsp;Like</span>
            )}
          </>
        );
      } else {
        return (
          <>
            <Favorite />
            &nbsp;
            {v.count_likes > 0 ? (
              <span style={{ fontSize: 12 }}>{v.count_likes}&nbsp;Likes</span>
            ) : (
              <span style={{ fontSize: 12 }}>{v.count_likes}&nbsp;Like</span>
            )}
          </>
        );
      }
    } else {
      return (
        <>
          <Favorite />
          &nbsp;
          {v.count_likes > 0 ? (
            <span style={{ fontSize: 12 }}>{v.count_likes}&nbsp;Likes</span>
          ) : (
            <span style={{ fontSize: 12 }}>{v.count_likes}&nbsp;Like</span>
          )}
        </>
      );
    }
  };

  textComment = (v, i) => {
    // console.log(v);

    if (v.comment.length > 0) {
      const dtCommentUsr = v.comment.filter(
        (ftrCmnt) => ftrCmnt.phoneno === this.state.phoneno
      );

      if (dtCommentUsr.length > 0) {
        return (
          <>
            <Comment style={{ color: "#2e6da4" }} />
            &nbsp;
            {v.count > 0 ? (
              <span style={{ fontSize: 12 }}>{v.count}&nbsp; Comments</span>
            ) : (
              <span style={{ fontSize: 12 }}>{v.count}&nbsp; Comment</span>
            )}
          </>
        );
      } else {
        return (
          <>
            <Comment />
            &nbsp;
            {v.count > 0 ? (
              <span style={{ fontSize: 12 }}>{v.count}&nbsp; Comments</span>
            ) : (
              <span style={{ fontSize: 12 }}>{v.count}&nbsp; Comment</span>
            )}
          </>
        );
      }
    } else {
      return (
        <>
          <Comment />
          &nbsp;
          {v.count > 0 ? (
            <span style={{ fontSize: 12 }}>{v.count}&nbsp; Comments</span>
          ) : (
            <span style={{ fontSize: 12 }}>{v.count}&nbsp; Comment</span>
          )}
        </>
      );
    }
  };

  textShare = (v, i) => {
    // console.log(v);

    if (v.comment.length > 0) {
      const dtCommentUsr = v.comment.filter(
        (ftrCmnt) => ftrCmnt.phoneno === this.state.phoneno
      );

      if (dtCommentUsr.length > 0) {
        return (
          <>
            <Share style={{ color: "#2e6da4" }} />
            &nbsp;
            {v.count > 0 ? (
              <span style={{ fontSize: 12 }}> Share</span>
            ) : (
              <span style={{ fontSize: 12 }}> Share</span>
            )}
          </>
        );
      } else {
        return (
          <>
            <Share />
            &nbsp;
            {v.count > 0 ? (
              <span style={{ fontSize: 12 }}> Share</span>
            ) : (
              <span style={{ fontSize: 12 }}> Share</span>
            )}
          </>
        );
      }
    } else {
      return (
        <>
          <Share />
          &nbsp;
          {v.count > 0 ? (
            <span style={{ fontSize: 12 }}> Share</span>
          ) : (
            <span style={{ fontSize: 12 }}> Share</span>
          )}
        </>
      );
    }
  };

  handleLikes = (itemLikes, idx) => {
    // console.log(itemLikes);
    let pushItem = [];
    pushItem.push(itemLikes);
    // console.log("index", idx);
    // console.log(pushItem);

    if (itemLikes.likes.length > 0) {
      // console.log("likes lebih dr 1");
      const checkLikesUser = itemLikes.likes.filter(
        (like) => like.phoneno === this.state.phoneno
      );
      // console.log("cek likes>0", checkLikesUser);

      if (checkLikesUser.length > 0) {
        // console.log("dislike");

        const dtaLikes = itemLikes.likes.filter(
          (rmv) => rmv.phoneno !== this.state.phoneno
        );
        // console.log("sisa data", dtaLikes);

        let resLikesCount = [];
        for (var iii = 0; iii < pushItem.length; iii++) {
          pushItem[iii].likes = dtaLikes;
          pushItem[iii].count_likes = dtaLikes.length;
          resLikesCount.push(pushItem[iii]);
        }

        this.doDeletedLikes(this.state.phoneno, checkLikesUser[0].momentid);

        let dataAllMoment = this.state.moments.list;
        // console.log("data all moment", dataAllMoment);
        this.setState({
          moments: {
            list: dataAllMoment,
            currentIndex: this.state.moments.currentIndex,
            showLoadMore: this.state.moments.showLoadMore,
          },
        });
      } else {
        // console.log("likes");
        let dataLikes = itemLikes.likes;
        dataLikes.push({
          id_likes: 0,
          momentid: itemLikes.id,
          phoneno: this.state.phoneno,
        });

        this.doAddLikes(itemLikes.id, this.state.phoneno);

        let resLikesCount = [];
        for (var ii = 0; ii < pushItem.length; ii++) {
          pushItem[ii].likes = dataLikes;
          pushItem[ii].count_likes = dataLikes.length;
          resLikesCount.push(pushItem[ii]);
        }

        let dataAllMoment = this.state.moments.list;
        // console.log("data all moment", dataAllMoment);

        this.setState({
          moments: {
            list: dataAllMoment,
            currentIndex: this.state.moments.currentIndex,
            showLoadMore: this.state.moments.showLoadMore,
          },
        });
      }
    } else {
      let dataLikes = itemLikes.likes;
      dataLikes.push({
        id_likes: 0,
        momentid: itemLikes.id,
        phoneno: this.state.phoneno,
      });

      this.doAddLikes(itemLikes.id, this.state.phoneno);

      // console.log("new like", dataLikes);
      // console.log("push item", pushItem);

      let resLikesCount = [];
      for (var i = 0; i < pushItem.length; i++) {
        pushItem[i].likes = dataLikes;
        pushItem[i].count_likes = dataLikes.length;
        resLikesCount.push(pushItem[i]);
      }

      // console.log("result count likes data", resLikesCount);

      let dataAllMoment = this.state.moments.list;

      // console.log("data all moment", dataAllMoment);

      this.setState({
        moments: {
          list: dataAllMoment,
          currentIndex: this.state.moments.currentIndex,
          showLoadMore: this.state.moments.showLoadMore,
        },
      });
    }
  };

  handleShare = (item, idx) => {
    console.log(JSON.stringify(item));

    let param = '{"code":"share-moment", "data":' + JSON.stringify(item) + "}";
    this.sendPostMessage(param);
  };

  handleClickOpen = (itemMoment, idx) => {
    let DataItem = [];
    DataItem.push(itemMoment);
    // console.log(DataItem);
    // console.log("index", idx);
    this.setState({
      itemDataMomentUser: DataItem,
      idxMomentId: idx,
    });

    if (itemMoment.comment.length > 0) {
      let dtComment = this.state.dataComment;
      dtComment.push(itemMoment.comment);

      // console.log(dtComment[0]);

      this.setState({
        dataComment: dtComment[0],
      });
    } else {
      let dtComment = this.state.dataComment;
      // console.log(dtComment);
      this.setState({
        dataComment: dtComment,
      });
    }

    this.setState({
      setOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      itemDataMomentUser: [],
      dataComment: [],
      setOpen: false,
      idxMomentId: "",
      Textcomment: "",
    });
  };

  handleChangeTextComment = (e) => {
    this.setState({
      Textcomment: e.target.value,
    });
  };

  doSendComment = () => {
    const format1 = "YYYY-MM-DD HH:mm:ss";
    var date1 = new Date();
    var datetimecreated = moment(date1).format(format1);
    let userComments = this.state.dataComment;
    let arrComment = [];

    arrComment.push({
      comment: this.state.Textcomment,
      commentid: 0,
      edit: "",
      insert: datetimecreated,
      momentid: this.state.itemDataMomentUser[0].id,
      phoneno: this.state.phoneno,
      profilepic: this.state.profilepic,
      username: this.state.name,
    });

    //======Api Add Comment=======//
    this.doCommentAdd(
      0,
      this.state.itemDataMomentUser[0].id,
      this.state.Textcomment,
      this.state.phoneno,
      datetimecreated
    );

    this.setState({
      Textcomment: "",
    });

    let arrCombComment = arrComment.concat(userComments);

    // console.log("user coment", arrComment);
    // console.log("item comments", userComments);

    // console.log("index arr", this.state.idxMomentId);
    // console.log("data moment user", this.state.itemDataMomentUser);
    // console.log("data comment", arrCombComment);

    this.setState({
      dataComment: arrCombComment,
    });

    let dataUserMoment = this.state.itemDataMomentUser;
    let resMomentComment = [];
    for (var i = 0; i < dataUserMoment.length; i++) {
      dataUserMoment[i].comment = arrCombComment;
      dataUserMoment[i].count = arrCombComment.length;
      resMomentComment.push(dataUserMoment[i]);
    }

    // console.log("Result Comment Moment", resMomentComment);

    let dataAllMoment = this.state.moments.list;

    // console.log("data all moment", dataAllMoment);

    this.setState({
      moments: {
        list: dataAllMoment,
        currentIndex: this.state.moments.currentIndex,
        showLoadMore: this.state.moments.showLoadMore,
      },
    });
  };

  renderMomentList = () => {
    if (this.state.moments.list.length > 0) {
      return (
        <div className="moments-list-section-data">
          {this.state.moments.list.map((v, i) => (
            <div key={v.id}>
              <CardMoment>
                <CardHeader
                  style={{ fontSize: 16 }}
                  avatar={<Avatar alt={v.name} src={v.pic} />}
                  title={
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <span style={{ fontSize: 13, color: "#000" }}>
                        {v.name}
                      </span>
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <span style={{ fontSize: 12 }}>
                        {moment(v.date[0]).fromNow()}
                      </span>
                    </Typography>
                  }
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <span style={{ fontSize: 13 }}> {v.desc}</span>
                  </Typography>
                </CardContent>
                <FbImageLibrary images={v.gallery} countFrom={2} />
                <Divider />
                <CardActions disableSpacing>
                  <IconButton
                    aria-label="add to favorites"
                    onClick={() => this.handleLikes(v, i)}
                  >
                    {this.textCountLikes(v, i)}
                  </IconButton>
                  <IconButton
                    aria-label="Comment"
                    onClick={() => this.handleClickOpen(v, i)}
                  >
                    {this.textComment(v, i)}
                  </IconButton>
                  <IconButton
                    aria-label="Share"
                    onClick={() => this.handleShare(v, i)}
                  >
                    {this.textShare(v, i)}
                  </IconButton>
                </CardActions>
              </CardMoment>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="moments-list-section-data">
          <DataEmpety title="Moments not available" />
        </div>
      );
    }
  };

  doDeleteComment = (dtItem) => {
    let dtComment = this.state.dataComment;
    const dtDelComment = dtComment.filter((rv) => rv === dtItem);
    const dtReadyComment = dtComment.filter((rv) => rv !== dtItem);
    // console.log("data ready", dtReadyComment);
    // console.log("data deleted", dtDelComment);
    this.setState({
      dataComment: dtReadyComment,
    });

    this.doCommentDeleted(dtDelComment[0]);

    let dataUserMoment = this.state.itemDataMomentUser;
    let resMomentComment = [];
    for (var i = 0; i < dataUserMoment.length; i++) {
      dataUserMoment[i].comment = dtReadyComment;
      dataUserMoment[i].count = dtReadyComment.length;
      resMomentComment.push(dataUserMoment[i]);
    }
    let dataAllMoment = this.state.moments.list;
    this.setState({
      moments: {
        list: dataAllMoment,
        currentIndex: this.state.moments.currentIndex,
        showLoadMore: this.state.moments.showLoadMore,
      },
    });
  };

  ifCheckDeleteByUserId = (dtItem) => {
    if (dtItem.phoneno === this.state.phoneno) {
      return (
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => this.doDeleteComment(dtItem)}
          aria-label="close"
        >
          <DeleteForever style={{ height: 25, width: 25, color: "red" }} />
        </IconButton>
      );
    }
  };

  renderCommentItem = (item) => {
    // console.log(item);
    if (item.length > 0) {
      return (
        <>
          {item.map((cm, i) => {
            return (
              <div key={cm.insert}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={cm.username} src={cm.profilepic} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={cm.username}
                    primaryTypographyProps={{
                      style: { color: "#000", fontWeight: 500, fontSize: 12 },
                    }}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          style={stylesListComent.inline}
                        >
                          {moment(cm.insert).fromNow()}
                        </Typography>
                        <br></br>
                        <div style={{ marginBottom: 6 }}></div>
                        <Typography
                          component="span"
                          variant="body2"
                          style={
                            (stylesListComent.inline,
                            { color: "#000", fontWeight: 450, fontSize: 11 })
                          }
                        >
                          {cm.comment}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {this.ifCheckDeleteByUserId(cm)}
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            );
          })}
        </>
      );
    } else {
      return (
        <div className="list-comment-root">
          <DataEmpety title="No comments yet" />
        </div>
      );
    }
  };

  renderDialogComment = () => {
    const { itemDataMomentUser } = this.state;

    if (itemDataMomentUser.length > 0) {
      return (
        <Dialog
          fullScreen
          open={this.state.setOpen}
          onClose={() => this.handleClose()}
          TransitionComponent={Transition}
        >
          <AppBar style={stylesDialog.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.handleClose()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={stylesDialog.title}>
                Comment {itemDataMomentUser[0].name}
              </Typography>
            </Toolbar>
          </AppBar>

          <List
            // style={{ overflowY: "auto" }}
            className="list-comment-root"
          >
            <div style={{ marginBottom: 70 }}>
              {this.renderCommentItem(this.state.dataComment)}
            </div>
          </List>

          <form>
            <div className="form-comment">
              <div className="row-comment-avatar">
                <Avatar alt={this.state.name} src={this.state.profilepic} />
                <div className="row-comment">
                  <div className="arrow-left"></div>
                  <div className="input-div">
                    <Typography variant="h6" style={stylesDialog.title}>
                      {this.state.name}
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      rowsMax={1}
                      placeholder="write comment..."
                      value={this.state.Textcomment}
                      onChange={(e) => this.handleChangeTextComment(e)}
                    />
                  </div>
                  <Button
                    onClick={() => this.doSendComment()}
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#2e6da4", fontSize: 12 }}
                  >
                    {<Icon>send</Icon>}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="ContentHeader">
        <div className="headers" id="myHeader">
          <SubHeader
            history={this.props.history}
            hideSearch={true}
            onSearch={this.onSearch}
            showCameraButton={true}
            add={this.goFormMoment}
            title="Moments"
            goBack={this.goBack}
          />
        </div>
        <div className="contents">{this.renderMomentList()}</div>
        {this.renderDialogComment()}
        <ScrollToTopBtn />
      </div>
    );
  }
}
export default MomentsPage;

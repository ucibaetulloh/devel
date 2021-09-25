let socket = null;
let socketConfig = {
  registered: false,
  cloudId: "190DBC9AA9",
  serverId: "",
  connectionId: "",
};
let gatewayConfig = {
  user: "ADMIN",
  pass: "88888888",
};

let callbackList = [];

export function subscribe(name, callback) {
  let exists = false;

  for (let i = 0; i < callbackList.length; i++) {
    if (callbackList[i].name === name) {
      exists = true;
      break;
    }
  }

  if (exists) {
    return { status: "error", message: "already exists" };
  }

  callbackList.push({ name: name, callback: callback });
  return { status: "ok", message: "" };
}

export function unsubscribe(name) {
  let idx = -1;
  for (let i = 0; i < callbackList.length; i++) {
    if (callbackList[i].name === name) {
      idx = i;
      break;
    }
  }
  callbackList.splice(idx, 1);
}

export function statusSocket() {
  if (socket === null) {
    return null;
  } else {
    console.log("cek status socket", socket.readyState);
    return socket.readyState;
  }
}

export function start() {
  console.log("check socket start", socket);
  if (socket === null) {
    socket = new WebSocket("ws://p2p1.dynamaxcn.com:8805");
    socket.binaryType = "arraybuffer";

    socket.onopen = onOpen;
    socket.onerror = onError;
    socket.onclose = onClose;
    socket.onmessage = onMessage;
  } else {
  }
}

function onOpen(event) {
  console.log("Socket Opened", event);
}

function onError(error) {
  console.log("Socket Error : ");
  console.log(error);
}

function onClose(event) {
  console.log("Socket Closed", event);
  socket = null;
}

function onMessage(event) {
  let messageid = parseInt(buf2hex(new Uint8Array(event.data.slice(4, 5))));
  let idx = 0;

  console.log(messageid);

  if (messageid === 44) {
    // HB
    sendHB();
  } else if (messageid === 52) {
    // register cloud
    socketConfig.registered = true;

    idx = 7;

    // --get cloud id
    socketConfig.cloudId = "";
    for (let i = 0; i < 64; i++) {
      socketConfig.cloudId += String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;
    }

    let uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
    socketConfig.serverId = intFromBytes(uint8View);
    //console.log('server id : ' + socketConfig.serverId)

    idx += 4;

    uint8View = new Uint8Array(event.data.slice(idx, idx + 8));
    let littleend = [];
    let j = 0;
    for (let i = uint8View.length - 1; i >= 0; i--) {
      littleend[j] = uint8View[i];
      j++;
    }
    socketConfig.connectionId = byteArrayToLong(littleend);

    idx += 8;

    let replystatus = String.fromCharCode.apply(
      null,
      new Uint8Array(event.data.slice(idx, idx + 1))
    );
    console.log("reply : " + replystatus);

    // LOGIN GATEWAY
    loginGateway();
  } else if (messageid === 11) {
    idx = 83;

    idx += 6; // global header
    let uint8View = new Uint8Array(event.data.slice(idx, idx + 2));

    let viewId = parseInt(intFromBytes(uint8View));
    console.log("viewId : " + viewId);

    idx += 2;

    idx += 11; // sisa view header

    if (viewId === 8) {
      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let NoOfuser = intFromBytes(uint8View);

      idx += 4;

      let userList = [];
      for (let i = 0; i < NoOfuser; i++) {
        let userId = "";
        for (let i = 0; i < 24; i++) {
          userId += String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;
        }

        let userName = "";
        for (let i = 0; i < 128; i++) {
          userName += String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;
        }

        let password = "";
        for (let i = 0; i < 64; i++) {
          password += String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;
        }

        let userData = {
          userId: userId,
          userName: userName,
          password: password,
        };

        userList.push(userData);
      }

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId8") {
          callbackList[i].callback(userList);
          break;
        }
      }
    } else if (viewId === 9) {
      let userId = "";
      for (let i = 0; i < 24; i++) {
        userId += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let reasonFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        userId: userId,
        successFlag: successFlag,
        reasonFlag: reasonFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId9") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 10) {
      let userId = "";
      for (let i = 0; i < 24; i++) {
        userId += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        userId: userId,
        successFlag: successFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId10") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 11) {
      let userId = "";
      for (let i = 0; i < 24; i++) {
        userId += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let reasonFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        userId: userId,
        successFlag: successFlag,
        reasonFlag: reasonFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId11") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 14) {
      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        successFlag: successFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId14") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 19) {
      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        successFlag: successFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId19") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 20) {
      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let NoTemplate = this.intFromBytes(uint8View);

      idx += 4;

      let template = [];

      for (let i = 0; i < NoTemplate; i++) {
        let templateId = 0;
        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        templateId = this.intFromBytes(uint8View);

        idx += 4;

        let templateName = "";
        for (let i = 0; i < 128; i++) {
          templateName += String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;
        }

        let templateIcon = 0;
        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        templateIcon = this.intFromBytes(uint8View);

        idx += 4;

        let templateSchedule = 0;
        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        templateSchedule = this.intFromBytes(uint8View);

        idx += 4;

        let templateScheduleStatus = "";
        templateScheduleStatus += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;

        let templateRepeat = "";
        for (let i = 0; i < 7; i++) {
          templateRepeat += String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;
        }

        template.push({
          templateId,
          templateName,
          templateIcon,
          templateSchedule,
          templateScheduleStatus,
          templateRepeat,
        });
      }

      let result = {
        noTemplate: NoTemplate,
        templateList: template,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId20") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 25) {
      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        successFlag: successFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId25") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 26) {
      let ledBulb = "";
      for (let i = 0; i < 24; i++) {
        ledBulb += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let NoDevice = this.intFromBytes(uint8View);
      idx += 4;

      let deviceList = [];

      for (let i = 0; i < NoDevice; i++) {
        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        let deviceId = this.intFromBytes(uint8View);
        idx += 4;

        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        let command = this.intFromBytes(uint8View);
        idx += 4;

        deviceList.push({ deviceId, command });
      }

      let result = {
        ledBulb: ledBulb,
        noDevice: NoDevice,
        deviceList: deviceList,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId26") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 32) {
      let userId = "";
      for (let i = 0; i < 24; i++) {
        userId += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        userId: userId,
        successFlag: successFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId32") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 49) {
      let successFlag = String.fromCharCode.apply(
        null,
        new Uint8Array(event.data.slice(idx, idx + 1))
      );
      idx += 1;

      let result = {
        successFlag: successFlag,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId49") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 50) {
      let userId = "";
      for (let i = 0; i < 24; i++) {
        userId += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let sex = this.intFromBytes(uint8View);
      idx += 4;

      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let level = this.intFromBytes(uint8View);
      idx += 4;

      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let height = this.intFromBytes(uint8View);
      idx += 4;

      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let birthDate = this.intFromBytes(uint8View);
      idx += 4;

      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let age = this.intFromBytes(uint8View);
      idx += 4;

      let phone = "";
      for (let i = 0; i < 64; i++) {
        phone += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      let email = "";
      for (let i = 0; i < 128; i++) {
        email += String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;
      }

      let result = {
        userId,
        sex,
        level,
        height,
        birthDate,
        age,
        phone,
        email,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId50") {
          callbackList[i].callback(result);
          break;
        }
      }
    } else if (viewId === 2001) {
      uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
      let NoRoom = this.intFromBytes(uint8View);
      idx += 4;

      let roomList = [];

      for (let i = 0; i < NoRoom; i++) {
        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        let roomId = this.intFromBytes(uint8View);
        idx += 4;

        let roomType = String.fromCharCode.apply(
          null,
          new Uint8Array(event.data.slice(idx, idx + 1))
        );
        idx += 1;

        let roomName = "";
        for (let j = 0; j < 128; j++) {
          roomName += String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;
        }

        uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
        let noDevice = this.intFromBytes(uint8View);
        idx += 4;

        let deviceList = [];

        for (let j = 0; j < noDevice; j++) {
          let uint8View = new Uint8Array(event.data.slice(idx, idx + 8));
          let littleend = [];
          let k = 0;
          for (let l = uint8View.length - 1; l >= 0; l--) {
            littleend[k] = uint8View[l];
            k++;
          }
          let realDeviceId = this.byteArrayToLong(littleend);

          idx += 8;

          let realDeviceType = String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;

          uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
          let deviceId = this.intFromBytes(uint8View);
          idx += 4;

          let deviceType = String.fromCharCode.apply(
            null,
            new Uint8Array(event.data.slice(idx, idx + 1))
          );
          idx += 1;

          let deviceName = "";
          for (let j = 0; j < 128; j++) {
            deviceName += String.fromCharCode.apply(
              null,
              new Uint8Array(event.data.slice(idx, idx + 1))
            );
            idx += 1;
          }

          uint8View = new Uint8Array(event.data.slice(idx, idx + 4));
          let deviceState = this.intFromBytes(uint8View);
          idx += 4;

          deviceList.push({
            realDeviceId,
            realDeviceType,
            deviceId,
            deviceType,
            deviceName,
            deviceState,
          });
        }

        roomList.push({ roomId, roomType, roomName, noDevice, deviceList });
      }

      let result = {
        noRoom: NoRoom,
        roomList: roomList,
      };

      for (let i = 0; i < callbackList.length; i++) {
        if (callbackList[i].name === "viewId2001") {
          callbackList[i].callback(result);
          break;
        }
      }
    }

    /*if (viewId === 2050) {
                let successFlag = ''
                for (let i = 0; i < 1; i++) {
                    successFlag += String.fromCharCode.apply(null, new Uint8Array(event.data.slice(idx, idx + 1)))
                    idx += 1
                }

                console.log(successFlag)
            } else if (viewId === 35) {
                uint8View = new Uint8Array(event.data.slice(idx, idx + 4))
                let deviceId = this.intFromBytes(uint8View)

                idx += 4

                console.log('deviceid : ' + deviceId)

                uint8View = new Uint8Array(event.data.slice(idx, idx + 4))
                let deviceState = intFromBytes(uint8View)

                console.log('devicestate :' + deviceState)

                //if (deviceId === 88) { setState({state: deviceState + ''}) }

            } else if (viewId === 2042) {
                uint8View = new Uint8Array(event.data.slice(idx, idx + 8))
                let littleend = []
                let j = 0
                for (let i = uint8View.length - 1; i >= 0; i--) {
                    littleend[j] = uint8View[i]
                    j++
                }
                let sensorId = this.byteArrayToLong(littleend)
                console.log('Sensor id : ' + sensorId)

                idx += 8

                let name = ''
                for (let i = 0; i < 128; i++) {
                    name += String.fromCharCode.apply(null, new Uint8Array(event.data.slice(idx, idx + 1)))
                    idx += 1
                }
                console.log('Sensor name : ' + name)

                let type = this.buf2hex(new Uint8Array(event.data.slice(idx, idx + 1)))
                console.log('sensor type : ' + type)

                idx += 1

                let roomid = this.intFromBytes(new Uint8Array(event.data.slice(idx, idx + 4)))
                console.log('room id : ' + roomid)

                idx += 4

                let date = this.intFromBytes(new Uint8Array(event.data.slice(idx, idx + 4)))
                console.log('room id : ' + date)

                idx += 4

                let time = this.intFromBytes(new Uint8Array(event.data.slice(idx, idx + 4)))
                console.log('room id : ' + time)

                idx += 4

                let note = ''
                for (let i = 0; i < 64; i++) {
                    note += String.fromCharCode.apply(null, new Uint8Array(event.data.slice(idx, idx + 1)))
                    idx += 1
                }
                console.log('note : ' + note)

                let state = this.intFromBytes(new Uint8Array(event.data.slice(idx, idx + 4)))
                console.log('state : ' + state)

                idx += 4
            } else if (viewId === 2058) {
                let uint8View = new Uint8Array(event.data.slice(idx, idx + 8))
                let littleend = []
                let j = 0
                for (let i = uint8View.length - 1; i >= 0; i--) {
                    littleend[j] = uint8View[i]
                    j++
                }
                let sensorId = this.byteArrayToLong(littleend)
                console.log('device id : ' + sensorId)
                idx += 8

                uint8View = new Uint8Array(event.data.slice(idx, idx + 4))

                let state = this.intFromBytes(uint8View)
                console.log('device state :' + state)

                idx += 4

                uint8View = new Uint8Array(event.data.slice(idx, idx + 4))

                let lowbat = this.intFromBytes(uint8View)
                console.log('lowbat :' + lowbat)
            }*/
    sendHB();
  }

  if (!socketConfig.registered) {
    registerCloud();
  }
}

//=======VIEW=========
export function sendView8() {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(8);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  //let viewDeviceId = intToLittleEndian(88)
  //let viewCommand = intToLittleEndian(state === '1' ? 1 : 0)

  let dataArr = [];
  //dataArr = dataArr.concat(viewDeviceId)
  //dataArr = dataArr.concat(viewCommand)

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send8");
  socket.send(new Uint8Array(result).buffer);
}

export function sendView9(userId, userName, password) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(9);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let bufferUserName = new Array(128);
  for (let i = 0; i < 128; i++) {
    bufferUserName[i] = 0;
  }
  for (let i = 0; i < userName.length; i++) {
    bufferUserName[i] = userName.charCodeAt(i);
  }

  let bufferPassword = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferPassword[i] = 0;
  }
  for (let i = 0; i < password.length; i++) {
    bufferPassword[i] = password.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);
  dataArr = dataArr.concat(bufferUserName);
  dataArr = dataArr.concat(bufferPassword);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send9");
  socket.send(new Uint8Array(result).buffer);
}

export function sendView10(userId) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(10);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send10");
  socket.send(new Uint8Array(result).buffer);
}

export function sendView11(userId, oldPassword, newPassword) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(11);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let bufferOldPassword = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferOldPassword[i] = 0;
  }
  for (let i = 0; i < oldPassword.length; i++) {
    bufferOldPassword[i] = oldPassword.charCodeAt(i);
  }

  let bufferNewPassword = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferNewPassword[i] = 0;
  }
  for (let i = 0; i < newPassword.length; i++) {
    bufferNewPassword[i] = newPassword.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);
  dataArr = dataArr.concat(bufferOldPassword);
  dataArr = dataArr.concat(bufferNewPassword);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send11");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {string} userId
 * @param {array} roomList list of object, example : [{ roomId : 1 }, { roomId : 2 }]
 */
export function sendView14(userId, roomList) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(14);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let bufferRoomNo = intToLittleEndian(roomList.length);

  let bufferRoom = [];
  for (let i = 0; i < roomList.length; i++) {
    bufferRoom = bufferRoom.concat(intToLittleEndian(roomList[i].roomId));
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);
  dataArr = dataArr.concat(bufferRoomNo);
  dataArr = dataArr.concat(bufferRoom);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send14");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {int} deviceId
 * @param {int} command
 */
export function sendView19(deviceId, command) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(19);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferDeviceId = this.intToLittleEndian(deviceId);
  let bufferCommand = this.intToLittleEndian(command);

  let dataArr = [];
  dataArr = dataArr.concat(bufferDeviceId);
  dataArr = dataArr.concat(bufferCommand);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send19");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {string} userId
 */
export function sendView20(userId) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(20);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send20");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {int} templateId
 */
export function sendView25(templateId) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(25);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferTemplateId = intToLittleEndian(templateId);

  let dataArr = [];
  dataArr = dataArr.concat(bufferTemplateId);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send20");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {int} templateId
 */
export function sendView26(templateId) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(26);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferTemplateId = intToLittleEndian(templateId);

  let dataArr = [];
  dataArr = dataArr.concat(bufferTemplateId);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send26");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {string} userId
 * @param {string} userName
 * @param {string} password
 */
export function sendView32(userId, userName, password) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(32);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let bufferUserName = new Array(128);
  for (let i = 0; i < 128; i++) {
    bufferUserName[i] = 0;
  }
  for (let i = 0; i < userName.length; i++) {
    bufferUserName[i] = userName.charCodeAt(i);
  }

  let bufferPassword = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferPassword[i] = 0;
  }
  for (let i = 0; i < password.length; i++) {
    bufferPassword[i] = password.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);
  dataArr = dataArr.concat(bufferUserName);
  dataArr = dataArr.concat(bufferPassword);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send20");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {string} userId
 * @param {int} sex
 * @param {int} level
 * @param {int} height
 * @param {int} birthDate
 * @param {string} phone
 * @param {string} email
 */
export function sendView49(
  userId,
  sex,
  level,
  height,
  birthDate,
  phone,
  email
) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(49);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let bufferSex = int16ToLittleEndian(sex);
  let bufferLevel = int16ToLittleEndian(level);
  let bufferHeight = int16ToLittleEndian(height);
  let bufferBirthDate = int16ToLittleEndian(birthDate);

  let bufferPhone = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferPhone[i] = 0;
  }
  for (let i = 0; i < phone.length; i++) {
    bufferPhone[i] = phone.charCodeAt(i);
  }

  let bufferEmail = new Array(128);
  for (let i = 0; i < 128; i++) {
    bufferEmail[i] = 0;
  }
  for (let i = 0; i < email.length; i++) {
    bufferEmail[i] = email.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);
  dataArr = dataArr.concat(bufferSex);
  dataArr = dataArr.concat(bufferLevel);
  dataArr = dataArr.concat(bufferHeight);
  dataArr = dataArr.concat(bufferBirthDate);
  dataArr = dataArr.concat(bufferPhone);
  dataArr = dataArr.concat(bufferEmail);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send20");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {string} userId
 */
export function sendView50(userId) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(50);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send20");
  socket.send(new Uint8Array(result).buffer);
}

/**
 *
 * @param {string} userId
 */
export function sendView2001(userId) {
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);

  let bufferCloudId = new Array(64);
  for (let i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (let i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);
  let bufferConnection = [];
  let j = 0;
  for (let i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }

  let globalmessId = parseInt("0x06", 16);
  let globalmessFlag = parseInt("0x20", 16);

  // ---VIEW-----
  let viewId = int16ToLittleEndian(2001);

  let viewMessCode = parseInt("0x00", 16);
  let viewRequestId = int16ToLittleEndian(0);
  let viewWindowId = intToLittleEndian(0);

  let viewDataLength = 0;

  let bufferUserId = new Array(24);
  for (let i = 0; i < 24; i++) {
    bufferUserId[i] = 0;
  }
  for (let i = 0; i < userId.length; i++) {
    bufferUserId[i] = userId.charCodeAt(i);
  }

  let dataArr = [];
  dataArr = dataArr.concat(bufferUserId);

  viewDataLength = intToLittleEndian(dataArr.length);

  let dataResult = viewDataLength.concat(dataArr);
  // --------------

  let viewArr = [];
  viewArr = viewArr.concat(viewId);
  viewArr[viewArr.length] = viewMessCode;
  viewArr = viewArr.concat(viewRequestId);
  viewArr = viewArr.concat(viewWindowId);

  let viewResult = viewArr.concat(dataResult);

  let globalArr = [];
  globalArr[0] = globalmessId;
  globalArr[1] = globalmessFlag;

  globalArr = globalArr.concat(viewResult);

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("send20");
  socket.send(new Uint8Array(result).buffer);
}

//=====END VIEW=======

function registerCloud() {
  let messId = parseInt("0x51", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "C".charCodeAt(0);
  let i = 0;

  // var cloudId = '190DBC9AA9';

  let bufferCloudId = new Array(64);
  for (i = 0; i < bufferCloudId.length; i++) {
    bufferCloudId[i] = 0;
  }

  for (i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);

  let length = intToLittleEndian(arr.length);
  let result = length.concat(arr);
  console.log("register");
  socket.send(new Uint8Array(result).buffer);
}

function loginGateway() {
  // send10
  let messId = parseInt("0x10", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "G".charCodeAt(0);
  let i = 0;

  let bufferCloudId = new Array(64);
  for (i = 0; i < 64; i++) {
    bufferCloudId[i] = 0;
  }
  for (i = 0; i < socketConfig.cloudId.length; i++) {
    bufferCloudId[i] = socketConfig.cloudId.charCodeAt(i);
  }

  let bufferServerId = intToLittleEndian(socketConfig.serverId);
  // console.log(bufferServerId);

  let tmpBuffer = longToByteArray(socketConfig.connectionId);

  let bufferConnection = [];
  let j = 0;
  for (i = tmpBuffer.length - 1; i >= 0; i--) {
    bufferConnection[j] = tmpBuffer[i];
    j++;
  }
  // console.log(bufferConnection);

  let globalMessId = parseInt("0x02", 16);
  let globalMessFlag = parseInt("0x20", 16);

  //let user = 'ADMIN'
  let user = gatewayConfig.user;
  let globalBufferUser = new Array(24);
  for (let i = 0; i < globalBufferUser.length; i++) {
    globalBufferUser[i] = 0;
  }
  for (let i = 0; i < user.length; i++) {
    globalBufferUser[i] = user.charCodeAt(i);
  }

  //let password = '88888888'
  let password = gatewayConfig.pass;
  let globalBufferPass = new Array(64);
  for (let i = 0; i < globalBufferPass.length; i++) {
    globalBufferPass[i] = 0;
  }
  for (let i = 0; i < password.length; i++) {
    globalBufferPass[i] = password.charCodeAt(i);
  }

  let globalAppId = "A".charCodeAt(0);

  let buildNumber = "100";
  let globalBufferBuildNumber = new Array(128);
  for (let i = 0; i < globalBufferBuildNumber.length; i++) {
    globalBufferBuildNumber[i] = 0;
  }
  for (let i = 0; i < buildNumber.length; i++) {
    globalBufferBuildNumber[i] = buildNumber.charCodeAt(i);
  }

  let deviceType = "Desktop";
  let globalBufferDeviceType = new Array(128);
  for (let i = 0; i < globalBufferDeviceType.length; i++) {
    globalBufferDeviceType[i] = 0;
  }
  for (let i = 0; i < deviceType.length; i++) {
    globalBufferDeviceType[i] = deviceType.charCodeAt(i);
  }

  let deviceName = "IOTPark";
  let globalBufferDeviceName = new Array(128);
  for (let i = 0; i < globalBufferDeviceName.length; i++) {
    globalBufferDeviceName[i] = 0;
  }
  for (let i = 0; i < deviceName.length; i++) {
    globalBufferDeviceName[i] = deviceName.charCodeAt(i);
  }

  let language = "en";
  let globalBufferLanguage = new Array(8);
  for (let i = 0; i < globalBufferLanguage.length; i++) {
    globalBufferLanguage[i] = 0;
  }
  for (let i = 0; i < language.length; i++) {
    globalBufferLanguage[i] = language.charCodeAt(i);
  }

  let loginFlag = "M".charCodeAt(0);

  let globalArr = [];
  globalArr[0] = globalMessId;
  globalArr[1] = globalMessFlag;

  globalArr = globalArr.concat(globalBufferUser);
  globalArr = globalArr.concat(globalBufferPass);

  globalArr[globalArr.length] = globalAppId;

  globalArr = globalArr.concat(globalBufferBuildNumber);
  globalArr = globalArr.concat(globalBufferDeviceType);
  globalArr = globalArr.concat(globalBufferDeviceName);
  globalArr = globalArr.concat(globalBufferLanguage);

  globalArr[globalArr.length] = loginFlag;

  let globalLength = intToLittleEndian(globalArr.length);

  let globalResult = globalLength.concat(globalArr);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  arr = arr.concat(bufferCloudId);
  arr = arr.concat(bufferServerId);
  arr = arr.concat(bufferConnection);

  arr = arr.concat(globalResult);

  let length = intToLittleEndian(arr.length);

  let result = length.concat(arr);
  console.log("sendlogin");
  socket.send(new Uint8Array(result).buffer);
}

function sendHB() {
  let messId = parseInt("0x44", 16);
  let senderId = "X".charCodeAt(0);
  let targetId = "C".charCodeAt(0);

  let arr = [];
  arr[0] = messId;
  arr[1] = senderId;
  arr[2] = targetId;

  // arr.unshift(intToLittleEndian(arr.length));

  let length = intToLittleEndian(arr.length);

  let result = length.concat(arr);

  console.log("send HB", result);
  socket.send(new Uint8Array(result).buffer);
}

//=====UTILITY===================
// convert arraybuffer to hex
function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

/* int64ToStr=(a, signed) => {
    const negative = signed && a[0] >= 128
    const H = 0x100000000, D = 1000000000
    let h = a[3] + a[2] * 0x100 + a[1] * 0x10000 + a[0] * 0x1000000
    let l = a[7] + a[6] * 0x100 + a[5] * 0x10000 + a[4] * 0x1000000
    if (negative) {
        h = H - 1 - h
        l = H - l
    }
    const hd = Math.floor(h * H / D + l / D)
    const ld = (((h % D) * (H % D)) % D + l) % D
    const ldStr = ld + ''
    return (negative ? '-' : '') +
           (hd != 0 ? hd + '0'.repeat(9 - ldStr.length) : '') + ldStr
} */

function longToByteArray(/* long */ long) {
  // we want to represent the input as a 8-bytes array
  let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let index = 0; index < byteArray.length; index++) {
    let byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return byteArray;
}

function byteArrayToLong(/* byte[] */ byteArray) {
  let value = 0;
  for (let i = byteArray.length - 1; i >= 0; i--) {
    value = value * 256 + byteArray[i];
  }

  return value;
}

function intToLittleEndian(numero) {
  let b = [4];
  b[3] = numero & 0xff;
  b[2] = (numero >> 8) & 0xff;
  b[1] = (numero >> 16) & 0xff;
  b[0] = (numero >> 24) & 0xff;
  return b;
}

function int16ToLittleEndian(numero) {
  let b = [2];
  b[1] = numero & 0xff;
  b[0] = (numero >> 8) & 0xff;
  return b;
}

function intFromBytes(x) {
  let val = 0;
  for (let i = 0; i < x.length; ++i) {
    val += x[i];
    if (i < x.length - 1) {
      val = val << 8;
    }
  }
  return val;
}

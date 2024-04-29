const [app, apiUtil] = [getApp(), require("../../../utils/apiUtil.js")];
const { wxAlert } = require("../../../utils/apiUtil.js");
Page({

  data: {
    isName: true,
    tel: "",
    codeFlag: false,
    sendText: "获取验证码",
    isChatTel: true,
    showPrivacy: false,
  },
  customData: {
    app: getApp(),
    util: require("../../../utils/util.js"),
    apiUtil: require("../../../utils/apiUtil.js"),
    name: "",
    tel: "",
    trueTel: "",
    code: "",
    stopTap: false,
    smsCode: "",
    from: "",
    flag: "",
    registerFlag: true
  },
  onLoad(e) {
    if (e.from) this.customData.from = e.from;
    if (e.flag) this.customData.flag = e.flag;
    console.log(e.from)
    if (e.from === "个人中心" && e.flag === "2") {
      this.setData({
        isName: false,
        PhoneLogin: false
      });
    } else {
      // wx.checkSession({
      //     fail: () => {
      //         wx.login({
      //             success: res => {
      //                 this.customData.apiUtil.login(res.code).then(res => wx.setStorageSync("session_key", res.session_key));
      //             }
      //         });
      //     }
      // });
      wx.login({
        success: res => {
          apiUtil.login(res.code).then(res1 => {
            wx.setStorageSync('openId', res1.openId)
            wx.setStorageSync('session_key', res1.session_key)
            if (res1.role === 2 || res1.role === 3) this.setData({
              staffFlag: true
            });
            else this.setData({
              staffFlag: false
            });
          });
        }
      });
    }
  },
  goPhoneLogin(){
    this.setData({
      PhoneLogin: true,
    });
  },
  getName(e) {
    this.customData.name = e.detail.value;
  },
  getTel(e) {
    this.customData.tel = e.detail.value.replace(/\s/g, "");
    if (this.customData.tel.length === 11) this.setData({
      codeFlag: true
    });
    else this.setData({
      codeFlag: false
    });
  },
  getCode(e) {
    this.customData.code = e.detail.value;
  },
  sendTel(e) {
    if (this.customData.stopTap) return false;
    let tel = this.customData.tel;
    if (!this.customData.util.comfirmTel(tel)) {
      wxAlert('请填写正确的手机号', 'none');
      return false;
    }
    this.customData.stopTap = true;
    let num = 120;
    this.setData({
      sendText: "120s后重发"
    });
    let timer = setInterval(() => {
      if (num) this.setData({
        sendText: `${--num}s后重发`
      });
      else {
        clearInterval(timer);
        this.customData.stopTap = false;
        this.setData({
          sendText: "获取验证码"
        });
      }
    }, 1000);
    this.customData.apiUtil.sendCode(tel).then(res => {
      this.customData.trueTel = tel;
      this.customData.smsCode = res;
    }).catch(() => {
      this.customData.stopTap = false;
      this.setData({
        sendText: "获取验证码"
      });
    });
  },

  submit: async function () {
    let {
      name,
      tel,
      code
    } = this.customData;
    if (!name) {
      wxAlert('请输入您的姓名', 'none');
      return false;
    }
    if (!tel) {
      wxAlert('请输入您的手机号', 'none');
      return false;
    }
    if (!this.customData.util.comfirmTel(tel)) {
      wxAlert('请填写正确的手机号', 'none');
      return false;
    }
    if (!code) {
      wxAlert('请输入您收到的验证码', 'none');
      return false;
    }
    let status = await this.customData.apiUtil.checkyzm(tel, code)
    if (status.data.code == 1) {
      if (this.customData.flag === "2") {
        //修改手机号
        this.customData.apiUtil.changeTel(wx.getStorageSync("openId"), this.customData.trueTel).then(res => {
          wx.setStorageSync("userTel", this.customData.trueTel);
          wx.setStorageSync("role", res);
          return this.customData.util.wxAlert("修改成功！", "ok");
        }).then(wx.navigateBack);
      } else if (this.customData.registerFlag) {
        this.customData.registerFlag = false;
        let option = {
          openid: wx.getStorageSync("openId"),
          name: name,
          tel: tel,
          refer_page: this.customData.from
        };
        if (this.customData.app.globalData.referrerTel) {
          option.refer_by = this.customData.app.globalData.referrerTel;
          option.refer_role = this.customData.app.globalData.referrerRole;
        }
        this.customData.apiUtil.registered(option).then(res => {
          wx.setStorageSync("userId", res.insid);
          wx.setStorageSync("userName", option.name);
          wx.setStorageSync("userTel", option.tel);
          wx.setStorageSync("role", res.user_role);
          if (this.customData.from.slice(1, 3) === "活动") this.customData.app.globalData.registeredTempFlag = 1;
          wx.reLaunch({
            url: '/pages/mine/mine'
          })
        }).then(wx.navigateBack).catch(() => this.customData.registerFlag = true);
      }
    } else {
      wxAlert('验证码错误', 'none');
    }

  }
});
const [app, apiUtil] = [getApp(), require("../../utils/apiUtil.js")];
const {
  wxAlert
} = require("../../utils/apiUtil.js");
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
    util: require("../../utils/util.js"),
    apiUtil: require("../../utils/apiUtil.js"),
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
  },
  goPhoneLogin() {
    wx.navigateTo({
      url: `/pages/registered/login/login?from=${this.customData.from}&?from=${this.customData.flag}`
    });
  },
  getChatTel(e) {
    let that = this
    console.log(e)
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    let check = () => {
      return new Promise((resolve, reject) => {
        wx.checkSession({
          success: resolve,
          fail: () => {
            reject(1);
          }
        });
      });
    };
    let wxLogin = () => {
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res.code);
          },
          fail: reject
        });
      });
    };
    check().then(() => {
      return that.customData.apiUtil.decrypt(wx.getStorageSync("session_key"), e.detail.encryptedData, e.detail.iv);
    }).then(res => {
      that.setData({
        tel: res,
        codeFlag: false
      });
      that.customData.tel = res;
      wx.hideLoading();
      let {
        tel
      } = that.customData;
      let option = {
        openid: wx.getStorageSync("openId"),
        tel: tel,
        refer_page: that.customData.from
      };
      wx.showLoading({
        title: "加载中...",
        mask: true
      });
      that.customData.apiUtil.registered(option).then(res => {
        wx.setStorageSync("userId", res.insid);
        wx.setStorageSync("userTel", option.tel);
        wx.setStorageSync("role", res.user_role);
        wx.navigateBack({
          delta: 1, // 返回上一页
          success: function (res) {
            wx.hideLoading();
          }
        })
      })
    }).catch(res => {
      if (res === 1) return wxLogin();
    }).then(res => {
      if (typeof (res) === "string") return this.customData.apiUtil.login(res);
    }).then(res => {
      if (res) {
        wx.setStorageSync("session_key", res.session_key);
        wx.hideLoading();
      }
    });
  },
});
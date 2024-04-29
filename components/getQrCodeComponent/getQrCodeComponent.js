const [app, apiUtil] = [getApp(), require("../../utils/apiUtil.js")];
let flag = true;
Component({
  properties: {
    path: {
      type: String,
      value: ""
    },
    atype: {
      type: String,
      value: ""
    },
    aid: {
      type: String,
      value: ""
    }
  },
  data: {
    staffFlag: false,
    flagX: 0,
    flagY: 0,
    animationFlag: false,
    popHidden: true,
    qrCode: ""
  },
  lifetimes: {
    attached() {
      if (!app.globalData.screenWidth) {
        let info = wx.getSystemInfoSync();
        app.globalData.screenWidth = info.screenWidth;
      }
      this.setData({
        flagX: 672 * app.globalData.screenWidth / 750,
        flagY: 960 * app.globalData.screenWidth / 750
      });
    }
  },
  pageLifetimes: {
    show() {
      if (flag) {
        flag = false;
        let [role, tel] = [wx.getStorageSync("role"), wx.getStorageSync("userTel")];
        if (!role) {
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
        } else if (tel) {
          apiUtil.getUserRole(tel).then(res => {
            if (res === 1) this.setData({
              staffFlag: false
            });
            else if (res === 2 || res === 3) this.setData({
              staffFlag: true
            });
          });
        } else this.setData({
          staffFlag: false
        });
      } else if (wx.getStorageSync("role") === 2 || wx.getStorageSync("role") === 3) this.setData({
        staffFlag: true
      });
      else this.setData({
        staffFlag: false
      });
    }
  },
  methods: {
    showCode() {
      let url = this.data.path;
      if (url.indexOf("?") === -1) url += "?";
      else url += "&";
      url += `tel=${wx.getStorageSync("userTel")}&role=${wx.getStorageSync("role")}`;
      if (this.data.atype === "courselist") url += "&page=courselist";
      console.log(url)
      apiUtil.getQrCode({
        url: url,
        userId: wx.getStorageSync("userId"),
        type: this.data.atype,
        id: this.data.aid
      }).then(res => {
        this.setData({
          qrCode: res,
          popHidden: false
        });
      });
    },
    flagChange(e) {
      this.data.flagX = e.detail.x;
      this.data.flagY = e.detail.y;
    },
    flagEnd() {
      this.setData({
        flagX: 672 * app.globalData.screenWidth / 750,
        flagY: this.data.flagY
      });
    },
    saveQrCode() {
      wx.previewImage({
        current: this.data.qrCode,
        urls: [this.data.qrCode]
      });
    },
    closePop() {
      this.setData({
        popHidden: true
      });
    }
  }
});
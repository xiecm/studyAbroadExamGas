
App({
  globalData: {
    titleBarHeight: 0,
    statusHeight: 0,
    screenWidth: 0,
    apiUrl: "https://ssl.xt.cn/api_lxkpmall/ajax.php",
    apiUrl2: "https://ssl.xt.cn/ajax2.php",
    referrerTel: "",
    referrerRole: "",
    yuyueTempFlag: 0, //0无操作  1预约成功
    registeredTempFlag: 0 //0无操作  1注册成功
  },
  onLaunch() {
    let wxLogin = () => {
      wx.login({
        success: res => {
          apiUtil.login(res.code).then(res1 => {
            console.log(res1)
            wx.setStorageSync("isLogin", "true")
            wx.setStorageSync("openId", res1.openId);
            wx.setStorageSync("userId", res1.userId);
            wx.setStorageSync("userName", res1.userName);
            wx.setStorageSync("userTel", res1.userTel);
            wx.setStorageSync("role", res1.role);
            wx.setStorageSync("session_key", res1.session_key);
            // wx.setStorageSync("cityArr", res1.cityArr);
            wx.setStorageSync("formName", res1.formName);
            wx.setStorageSync("formTel", res1.formTel);
            wx.setStorageSync("formCityArr", res1.formTel);
          });
        },
        fail: err => console.log(err)
      });
    };
    wx.checkSession({
      success: () => {
        console.log(1)
        let [openId, key, tel] = [wx.getStorageSync("openId"), wx.getStorageSync("session_key"), wx.getStorageSync("userTel")];
        if (openId && key) {
          if (tel) apiUtil.getUserRole(tel).then(res => wx.setStorageSync("role", res));
        }
      },
      fail: wxLogin
    });
    wx.getSystemInfo({
      success: res => {
        //导航高度
        // this.globalData.navHeight = res.statusBarHeight;
        this.globalData.titleBarHeight = res.screenHeight - res.windowHeight;
        this.globalData.statusHeight = res.statusBarHeight;
        console.log(res)
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  onload() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '请稍后重试',
        icon: 'error',
        duration: 1000
      })
    })
  }

});
const [util, apiUtil] = [require("utils/util.js"), require("utils/apiUtil.js")];
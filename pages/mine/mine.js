Page({
    data: {
      username:"",
        staffFlag: 1,  //1其他，2新通员工，3分销人员
        signFlag: false,
        tel: "",
        markNum1: 0,
        markNum2: 0,
        downFlag: false,
        down1Flag: false,
        down2Flag: false,
        down3Flag: false,
        down1HeadCss: "",
        down2HeadCss: "",
        down3HeadCss: "",
        down1Css: "",
        down2Css: "",
        down3Css: "",
        down1List: ["澳大利亚", "美国", "英国", "加拿大", "欧洲", "亚洲"],
        down2List: ["雅思", "托福", "小语种"],
        down3List: ["就业力", "学术力"]
    },
    customData: {
        app: getApp(),
        apiUtil: require("../../utils/apiUtil.js")
    },
    onLoad () {
        
    },
    onShow () {
        if (wx.getStorageSync("userId")) {
            this.setData({
                signFlag: true,
                tel: wx.getStorageSync("userTel")
            });
            this.customData.apiUtil.getUserInfo(wx.getStorageSync("openId")).then(res => {
                let obj = {};
                res.USER_ROLE === "2" ? obj.staffFlag = 2 : res.USER_ROLE === "3" ? obj.staffFlag = 3 : obj.staffFlag = 1;
                if (res.FAVS - 0) obj.markNum1 = res.FAVS;
                if (res.YYS - 0) obj.markNum2 = res.YYS;
                if (res.LXCATS.length || res.YPCATS.length || res.JZLCATS.length) obj.downFlag = true;
                obj.username = res.USER_NAME || "微信用户"
                wx.setStorageSync("userName", obj.username);
                if (res.LXCATS.length) {
                    obj.down1Flag = true;
                    obj.down1List = res.LXCATS;
                }
                if (res.YPCATS.length) {
                    obj.down2Flag = true;
                    obj.down2List = res.YPCATS;
                }
                if (res.JZLCATS.length) {
                    obj.down3Flag = true;
                    obj.down3List = res.JZLCATS;
                }
                if (Object.keys(obj).length) this.setData(obj);
            });
        }
    },
    toRegistered (e) {
      if(e.currentTarget.dataset.flag==2){
        wx.navigateTo({ url: `/pages/registered/login/login?from=个人中心&flag=${e.currentTarget.dataset.flag}` });
      }else{
        wx.navigateTo({ url: `/pages/registered/registered?from=个人中心&flag=${e.currentTarget.dataset.flag}` });
      }
    },
    exitLogin () {
      wx.showModal({
          title: '提示', //提示的标题
          content: '确定退出吗', //提示的内容
          success: function(res) {
            if(res.confirm) {
              wx.setStorageSync("isLogin","false")
          wx.hideLoading()
          wx.clearStorage()
          wx.reLaunch({url: '/pages/index/index'})
            } else if(res.cancel) {
              
            }
          }
        })
  },
    toMarkList (e) {
        let flag = e.currentTarget.dataset.flag;
        wx.navigateTo({ url: `/pages/markList/markList?flag=${flag}` });
        // if (flag === "mark" && this.data.markNum1 || flag === "reservation" && this.data.markNum2) wx.navigateTo({ url: `/pages/markList/markList?flag=${flag}` });
    },
    switchDown (e) {
        let fnObj = {
            item1: () => {
                if (this.data.down1Css === "") {
                    this.setData({
                        down1HeadCss: "",
                        down1Css: " down-after"
                    });
                } else {
                    this.setData({
                        down1HeadCss: " down-head-after",
                        down1Css: ""
                    });
                }
            },
            item2: () => {
                if (this.data.down2Css === "") {
                    this.setData({
                        down2HeadCss: "",
                        down2Css: " down-after"
                    });
                } else {
                    this.setData({
                        down2HeadCss: " down-head-after",
                        down2Css: ""
                    });
                }
            },
            item3: () => {
                if (this.data.down3Css === "") {
                    this.setData({
                        down3HeadCss: "",
                        down3Css: " down-after"
                    });
                } else {
                    this.setData({
                        down3HeadCss: " down-head-after",
                        down3Css: ""
                    });
                }
            }
        };
        fnObj[e.currentTarget.dataset.flag]();
    },
    toDownDataList (e) {
      console.log(e)
        wx.navigateTo({ url: `/pages/downDataList/downDataList?type=${e.currentTarget.dataset.type}` });
    }
});
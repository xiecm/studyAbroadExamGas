Page({
    data: {
        pic: "",
        path: "",
        id: "",
        markSrc: "/icon/active_mark.png",
        markText: "收藏",
        reText: "立即预约"
    },
    customData: {
        app: getApp(),
        util: require("../../utils/util.js"),
        apiUtil: require("../../utils/apiUtil.js"),
        title: "",
        markId: ""
    },
    onLoad (e) {
        if (!this.customData.app.globalData.titleBarHeight) {
            let info = wx.getSystemInfoSync();
            [this.customData.app.globalData.titleBarHeight, this.customData.app.globalData.statusHeight] = [info.screenHeight - info.windowHeight, info.statusBarHeight];
        }
        this.setData({
            path: `/pages/activeDetail/activeDetail?id=${e.id}`,
            id: e.id
        });
        if (e.tel) {
            this.customData.app.globalData.referrerTel = e.tel;
            this.customData.app.globalData.referrerRole = e.role;
        }
        this.customData.apiUtil.getActiveDetail(e.id, wx.getStorageSync("userId")).then(res => {
            wx.setNavigationBarTitle({ title: res.title });
            this.customData.title = res.title;
            let obj = {
                pic: res.pic
            };
            if (res.fav_id) {
                this.customData.markId = res.fav_id;
                obj.markSrc = "/icon/active_marked.png";
                obj.markText = "已收藏";
            }
            if (res.yy) obj.reText = "已预约";
            this.setData(obj);
        });
    },
    onShow () {
        if (this.customData.app.globalData.yuyueTempFlag) {
            this.setData({
                reText: "已预约"
            });
            this.customData.app.globalData.yuyueTempFlag = 0;
        } else if (this.customData.app.globalData.registeredTempFlag) {
            wx.navigateTo({ url: `reservation/reservation?id=${this.data.id}&title=${this.customData.title}` });
            this.customData.app.globalData.registeredTempFlag = 0;
        }
    },
    mark () {
        let userId = wx.getStorageSync("userId");
        if (userId) {
            if (this.data.markText === "收藏") {
                this.customData.apiUtil.addMask("act", this.data.id, userId).then(res => {
                    this.customData.markId = res;
                    this.setData({
                        markText: "已收藏",
                        markSrc: "/icon/active_marked.png"
                    });
                });
            } else {
                this.customData.apiUtil.removeMask(this.customData.markId).then(() => {
                    this.setData({
                        markText: "收藏",
                        markSrc: "/icon/active_mark.png"
                    });
                });
            }
        } else {
            this.customData.util.wxModal("提示", "请先登录后再收藏").then(() => wx.navigateTo({ url: `/pages/registered/registered?from=【活动】${this.customData.title}` }));
        }
    },
    toReservation () {
        if (wx.getStorageSync("userId")) {
            if (this.data.reText === "立即预约") {
                wx.navigateTo({ url: `reservation/reservation?id=${this.data.id}&title=${this.customData.title}` });
            }
        } else {
            this.customData.util.wxModal("提示", "请先登录后再预约").then(() => wx.navigateTo({ url: `/pages/registered/registered?from=【活动】${this.customData.title}` }));
        }
    },
    onShareAppMessage () {
        let [tel, role, path] = [wx.getStorageSync("userTel"), wx.getStorageSync("role"), `/pages/activeDetail/activeDetail?id=${this.data.id}`];
        if (tel) path += `&tel=${tel}&role=${role}`;
        return {
            title: this.customData.title,
            path: path
        }
    },
    onShareTimeline() {
      let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
      return {
        title: this.customData.title,
        query: `tel=${tel}&role=${role}&id=${this.data.id}`
      }
    }
});
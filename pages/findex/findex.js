Page({
    data: {},
    customData: {
        app: getApp()
    },
    onLoad (e) {
        if (e.tel) {
            this.customData.app.globalData.referrerTel = e.tel;
            this.customData.app.globalData.referrerRole = e.role;
        }
        let info = wx.getSystemInfoSync();
        [this.customData.app.globalData.titleBarHeight, this.customData.app.globalData.statusHeight, this.customData.app.globalData.screenWidth] = [info.screenHeight - info.windowHeight, info.statusBarHeight, info.screenWidth];
        let url = e.page === "courselist" ? "/pages/courseList/courseList" : "/pages/index/index";
        wx.reLaunch({ url: url });
    }
});
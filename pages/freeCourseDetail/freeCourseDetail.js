Page({
    data: {
        title: "",
        flagList: [],
        courseNum: 0,
        markIcon: "/icon/active_mark.png",
        markText: "收藏",
        coverHidden: false,
        intro: "",
        videoPic: "",
        videoSrc: "",
        videoList: [],
        v_satus:false
    },
    customData: {
        app: getApp(),
        util: require("../../utils/util.js"),
        apiUtil: require("../../utils/apiUtil.js"),
        id: "",
        maskId: "",
        videoContext: {},
        currentVideoIndex: 0,
        videoFirstFlag: true,
        currentPlaySrc: "",
        videoFirstPlay: true
    },
    onLoad (e) {
        if (!this.customData.app.globalData.titleBarHeight) {
            let info = wx.getSystemInfoSync();
            [this.customData.app.globalData.titleBarHeight, this.customData.app.globalData.statusHeight] = [info.screenHeight - info.windowHeight, info.statusBarHeight];
        }
        if (e.tel) {
            this.customData.app.globalData.referrerTel = e.tel;
            this.customData.app.globalData.referrerRole = e.role;
        }
        this.customData.id = e.id;
        this.customData.videoContext = wx.createVideoContext("myVideo");
        if (wx.getStorageSync("userId")) {
            this.customData.apiUtil.isMask("video", e.id, wx.getStorageSync("userId")).then(res => {
                if (res) {
                    this.customData.maskId = res;
                    this.setData({
                        markIcon: "/icon/active_marked.png",
                        markText: "已收藏"
                    });
                }
            });
        }
        this.customData.apiUtil.getFreeCourseDetail(e.id).then(res => {
          const that = this
            wx.setNavigationBarTitle({ title: res.MINA_TITLE });
            let obj = {
                title: that.customData.apiUtil.escapeHtml(res.V_NAME), 
                flagList: [res.V_CAT],
                courseNum: res.V_LINKS.length,
                intro: that.customData.apiUtil.escapeHtml(res.V_DESC),
                videoPic: res.V_PIC,
                videoSrc: res.V_LINKS[0],
                videoList: [],
                v_satus:res.V_LINKS.length!==0?'true':'false'
            };
            if (res.V_SUBCAT) obj.flagList.push(res.V_SUBCAT);
            res.V_LINKS.forEach(d => {
                obj.videoList.push({
                    css: "",
                    src: d
                });
            });
            obj.videoList[0].css = " active";
            this.setData(obj);
            this.customData.currentPlaySrc = res.V_LINKS[0];
        });
    },
    onShow () {
        if (wx.getStorageSync("userId")) this.setData({ coverHidden: true });
    },
    mask () {
        if (wx.getStorageSync("userId")) {
            if (this.data.markText === "收藏") {
                this.customData.apiUtil.addMask("video", this.customData.id, wx.getStorageSync("userId")).then(res => {
                    this.customData.maskId = res;
                    this.setData({
                        markIcon: "/icon/active_marked.png",
                        markText: "已收藏"
                    });
                });
            } else {
                this.customData.apiUtil.removeMask(this.customData.maskId).then(() => {
                    this.setData({
                        markIcon: "/icon/active_mark.png",
                        markText: "收藏"
                    });
                });
            }
        } else this.customData.util.wxModal("提示", "请先登录后再收藏").then(() => wx.navigateTo({ url: `/pages/registered/registered?from=【视频课】${this.data.title}` }));
    },
    toRegistered () {
        this.customData.util.wxModal("提示", "请先登录后再播放视频").then(() => wx.navigateTo({ url: `/pages/registered/registered?from=【视频课】${this.data.title}` }));
    },
    play (e) {
        let [prev, index] = [this.customData.currentVideoIndex, e.currentTarget.dataset.index];
        if (prev !== index) {
            let [prevCss, indexCss, obj] = [`videoList[${prev}].css`, `videoList[${index}].css`, {}];
            [obj[prevCss], obj[indexCss], obj.videoSrc, this.customData.currentVideoIndex] = ["", " active", this.data.videoList[index].src, index];
            this.setData(obj);
        }
    },
    startPlay () {
        if (this.customData.videoFirstPlay) {
            this.customData.apiUtil.addVideoCount(this.customData.id);
            this.customData.videoFirstPlay = false;
            this.customData.currentPlaySrc = this.data.videoSrc;
        } else if (this.customData.currentPlaySrc !== this.data.videoSrc) {
            this.customData.apiUtil.addVideoCount(this.customData.id);
            this.customData.currentPlaySrc = this.data.videoSrc;
        }
    },
    videoLoad () {
        if (this.customData.videoFirstFlag) this.customData.videoFirstFlag = false;
        else this.customData.videoContext.play();
    },
    onShareAppMessage () {
        let [tel, role, path] = [wx.getStorageSync("userTel"), wx.getStorageSync("role"), `/pages/freeCourseDetail/freeCourseDetail?id=${this.customData.id}`];
        if (tel) path += `&tel=${tel}&role=${role}`;
        return {
            title: this.data.title,
            path: path
        }
    },
    onShareTimeline() {
      let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
      return {
        title: this.data.title,
        query: `tel=${tel}&role=${role}&id=${this.customData.id}`
      }
    }
});
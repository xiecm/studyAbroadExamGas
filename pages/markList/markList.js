Page({
    data: {
        titCss1: " tit-active1",
        titCss2: "",
        titIcon1: "/icon/markList_tit_icon1_2.png",
        titText1: "预约的课程",
        titIcon2: "/icon/markList_tit_icon2_1.png",
        titText2: "预约的活动",
        wrapHidden: false,
        markFlag: false,
        list1: [],
        list2: [],
        wrap1NoneFlag: true,
        wrap2NoneFlag: true,
        wrap1NoneText: "您还没有预约的课程",
        wrap2NoneText: "您还没有预约的活动"
    },
    customData: {
        currentIndex: 0,
        apiUtil: require("../../utils/apiUtil.js"),
        flag: ""
    },
    showList (res) {
        let [list1, list2, wrap1NoneFlag, wrap2NoneFlag] = [[], [], true, true];
        console.log(res);
        if (res.video.length) {
            res.video.forEach(d => {
                let obj = {
                    id: d.V_ID,
                    src: d.V_IMG,
                    title: d.V_NAME,
                    markId: d.FAV_ID,
                    flag: [d.V_CAT],
                    icon: "/icon/active_marked.png"
                };
                if (d.V_SUBCAT) obj.flag.push(d.V_SUBCAT);
                obj.flag.push(`课时：${d.HOURS}节课`);
                list1.push(obj);
            });
        } else wrap1NoneFlag = false;
        if (res.act.length) {
            res.act.forEach(d => {
                list2.push({
                    id: d.ACT_ID,
                    src: d.ACT_IMG,
                    title: d.ACT_NAME,
                    markId: d.FAV_ID,
                    time: d.ACT_TIMESTART,
                    icon: "/icon/active_marked.png"
                });
            });
        } else wrap2NoneFlag = false;
        this.setData({ list1, list2, wrap1NoneFlag, wrap2NoneFlag });
    },
    onLoad (e) {
        this.customData.flag = e.flag;
        if (e.flag === "mark") {
            this.setData({
                markFlag: true,
                titText1: "收藏的课程",
                titText2: "收藏的活动",
                wrap1NoneText: "您还没有收藏的课程",
                wrap2NoneText: "您还没有收藏的活动"
            });
            wx.setNavigationBarTitle({ title: "我的收藏" });
        } else wx.setNavigationBarTitle({ title: "我的预约" });
    },
    onShow () {
        if (this.customData.flag === "mark") this.customData.apiUtil.getMarkList(wx.getStorageSync("openId")).then(res => this.showList(res));
        else this.customData.apiUtil.getReservationList(wx.getStorageSync("openId")).then(res => this.showList(res));
    },
    titChange (e) {
        let [prev, index] = [this.customData.currentIndex, e.currentTarget.dataset.index - 0];
        if (prev !== index) {
            if (index) {
                this.setData({
                    titCss1: "",
                    titIcon1: "/icon/markList_tit_icon1_1.png",
                    titCss2: " tit-active2",
                    titIcon2: "/icon/markList_tit_icon2_2.png",
                    wrapHidden: true
                });
            } else {
                this.setData({
                    titCss1: " tit-active1",
                    titIcon1: "/icon/markList_tit_icon1_2.png",
                    titCss2: "",
                    titIcon2: "/icon/markList_tit_icon2_1.png",
                    wrapHidden: false
                });
            }
            this.customData.currentIndex = index;
        }
    },
    mark (e) {
        let {type, index} = e.currentTarget.dataset;
        let obj = {};
        if (type === "video") {
            let icon = `list1[${index}].icon`;
            if (this.data.list1[index].icon === "/icon/active_marked.png") {
                this.customData.apiUtil.removeMask(this.data.list1[index].markId).then(() => {
                    obj[icon] = "/icon/active_mark.png";
                    this.setData(obj);
                });
            } else {
                this.customData.apiUtil.addMask(type, this.data.list1[index].id, wx.getStorageSync("userId")).then(res => {
                    let mark = `list1[${index}].markId`;
                    [obj[icon], obj[mark]] = ["/icon/active_marked.png", res];
                    this.setData(obj);
                });
            }
        } else {
            let icon = `list2[${index}].icon`;
            if (this.data.list2[index].icon === "/icon/active_marked.png") {
                this.customData.apiUtil.removeMask(this.data.list2[index].markId).then(() => {
                    obj[icon] = "/icon/active_mark.png";
                    this.setData(obj);
                });
            } else {
                this.customData.apiUtil.addMask(type, this.data.list2[index].id, wx.getStorageSync("userId")).then(res => {
                    let mark = `list2[${index}].markId`;
                    [obj[icon], obj[mark]] = ["/icon/active_marked.png", res];
                    this.setData(obj);
                });
            }
        }
    },
    toFreeCourseDetail (e) {
        wx.navigateTo({ url: `/pages/freeCourseDetail/freeCourseDetail?id=${e.currentTarget.dataset.id}` });
    },
    toActiveDetail (e) {
        wx.navigateTo({ url: `/pages/activeDetail/activeDetail?id=${e.currentTarget.dataset.id}` });
    }
});
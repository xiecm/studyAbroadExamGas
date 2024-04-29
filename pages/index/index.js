Page({
    data: {
        headHeight: 0,
        titleTop: 0,
        swiper1List: [],
        swiper2List: [],
        fixedTitle: "",
        recommendTitleTop: "",
        recommendTitleWidth: 0,
        recommendTitleList: [
            {
                tit: "留学",
                text: "全球求学方案",
                type: "留学",
                titActive: " title1-active",
                textActive: " title2-active"
            }, {
                tit: "雅思",
                text: "7分冲刺班",
                type: "7",
                titActive: "",
                textActive: ""
            }, {
                tit: "托福",
                text: "100分晋级班",
                type: "8",
                titActive: "",
                textActive: ""
            }, {
                tit: "小语种",
                text: "兴趣、留学两不误",
                type: "9",
                titActive: "",
                textActive: ""
            }, {
                tit: "求职就业",
                text: "名企高管分享",
                type: "求职就业",
                titActive: "",
                textActive: ""
            },
            // {
            //     tit: "学术提升",
            //     text: "名校教授指导",
            //     titActive: "",
            //     textActive: ""
            // },
            {
                tit: "更多",
                text: "精品好课",
                titActive: "",
                textActive: ""
            }
        ],
        recommendList: []
    },
    customData: {
        app: getApp(),
        apiUtil: require("../../utils/apiUtil.js"),
        currentSwiper1Index: 0,
        currentSwiper2Index: 0,
        recommendTitleTop: 0,
        currentRecommendIndex: 0,
        list: [
            [
                {
                    id: 3,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_lx_America1.jpg",
                    title: "如何规划冲刺美国硕士名校"
                }, {
                    id: 20,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_lx_AN1.jpg",
                    title: "澳洲新西兰高考后留学解析"
                }, {
                    id: 13,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_lx_Britain1.jpg",
                    title: "2020英国名校录取新趋势盘点"
                }, {
                    id: 16,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_lx_Canada1.jpg",
                    title: "用高考分数留学加拿大名校"
                }, {
                    id: 22,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_lx_Germany1.jpg",
                    title: "德国名校申请技巧揭秘"
                }, {
                    id: 26,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_lx_Korea1.jpg",
                    title: "韩国名校&热门专业大解析"
                }
            ], [
                {
                    id: 45,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain1.jpg",
                    title: "详解高分标准，get雅思出题套路"
                }, {
                    id: 46,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain2.jpg",
                    title: "2小时拿下雅思核心词汇"
                }, {
                    id: 47,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain3.jpg",
                    title: "你不知道的雅思口语7＋秘密"
                }, {
                    id: 48,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain4.jpg",
                    title: "雅思听力满分必杀技"
                }, {
                    id: 49,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain5.jpg",
                    title: "用逻辑助你攻克9分雅思阅读"
                }, {
                    id: 50,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain6.jpg",
                    title: "雅思写作短期高效备考技巧"
                }
            ], [
                {
                    id: 51,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain7.jpg",
                    title: "从0到1认识托福考试"
                }, {
                    id: 52,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain8.jpg",
                    title: "托福听力高分秘密指南"
                }, {
                    id: 53,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain9.jpg",
                    title: "托福高分阅读养成记"
                }, {
                    id: 54,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain10.jpg",
                    title: "托福写作的高分“套路”"
                }, {
                    id: 55,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_langtrain11.jpg",
                    title: "流利托福口语脱口而出"
                }
            ], [
                {
                    id: 39,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_minlang_France1.jpg",
                    title: "法语语音初体验"
                }, {
                    id: 36,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_minlang_Germany1.jpg",
                    title: "德语发音大揭秘"
                }, {
                    id: 42,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_minlang_Italy1.jpg",
                    title: "意大利语入门及文化解读"
                }, {
                    id: 29,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_minlang_Japan1.jpg",
                    title: "日语入门五十音"
                }, {
                    id: 33,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_minlang_Korea1.jpg",
                    title: "30分钟开口说韩语"
                }, {
                    id: 43,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_minlang_Spain1.jpg",
                    title: "西班牙语的魅力解读"
                }
            ], [
                {
                    id: 56,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_job1.jpg",
                    title: "大学生职业规划解析"
                }, {
                    id: 57,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_job2.jpg",
                    title: "简历撰写与面试的黄金法则"
                }, {
                    id: 58,
                    pic: "https://m.igo.cn/gasminiprogram/710_230_job3.jpg",
                    title: "小白职场进阶必修课"
                }
            ]
        ]
    },
    initRecommendList (type) {
      const that  = this
        this.customData.apiUtil.getRecommendList(type).then(res => {
            let recommendList = [];
            res.forEach(d => {
                recommendList.push({
                    id: d.V_ID,
                    pic: d.V_INDEXPIC,
                    title: that.customData.apiUtil.escapeHtml(d.V_NAME)
                });
            });
            this.setData({ recommendList });
        });
    },
    onLoad (e) {
        if (e.tel) {
            this.customData.app.globalData.referrerTel = e.tel;
            this.customData.app.globalData.referrerRole = e.role;
        }
        this.setData({
            headHeight: this.customData.app.globalData.titleBarHeight,
            titleTop: this.customData.app.globalData.statusHeight,
            flagY: 960 * this.customData.app.globalData.screenWidth / 750
        });
        console.log(this.customData.app.globalData)
        this.customData.apiUtil.getActiveList().then(res => {
            let swiper1List = [];
            res.forEach(d => {
                swiper1List.push({
                    id: d.ACT_ID,
                    src: d.ACT_IMG,
                    css: ""
                });
            });
            swiper1List[0].css = " dot-active";
            this.setData({ swiper1List });
        });
        this.customData.apiUtil.getAdList().then(res => {
            let swiper2List = [{
              id: "",
              url: '/pages/zyEvaluation/zyEvaluation',
              src: "https://xcx.xt.cn/filemanager/uploads/images/2024/04/28/77181.jpg",
              css: ""
          }];
            res.forEach(d => {
                swiper2List.push({
                    id: d.P_AID,
                    url: d.P_LINK,
                    src: d.P_PIC,
                    css: ""
                });
            });
            swiper2List[0].css = " dot-active";
            this.setData({ swiper2List });
        });
        this.initRecommendList("留学");
        let $w = wx.createSelectorQuery();
        $w.select(".recommend-title").boundingClientRect();
        $w.selectAll(".recommend-title-item").boundingClientRect();
        $w.exec(res => {
            let recommendTitleWidth = 0;
            res[1].forEach(d => recommendTitleWidth += d.width );
            this.setData({ recommendTitleWidth: Math.ceil(recommendTitleWidth) });
            this.customData.recommendTitleTop = res[0].top;
        });
    },
    doScroll (e) {
        if (e.detail.scrollTop >= this.customData.recommendTitleTop - this.data.headHeight) {
            this.setData({
                fixedTitle: " recommend-fixed-title",
                recommendTitleTop: `${this.data.headHeight}px`
            });
        } else {
            this.setData({
                fixedTitle: "",
                recommendTitleTop: ""
            });
        }
    },
    swiper1Change (e) {
        let [prev, index] = [this.customData.currentSwiper1Index, e.detail.current];
        let [prevCss, indexCss, obj] = [`swiper1List[${prev}].css`, `swiper1List[${index}].css`, {}];
        [obj[prevCss], obj[indexCss], this.customData.currentSwiper1Index] = ["", " dot-active", index];
        this.setData(obj);
    },
    swiper2Change (e) {
        let [prev, index] = [this.customData.currentSwiper2Index, e.detail.current];
        let [prevCss, indexCss, obj] = [`swiper2List[${prev}].css`, `swiper2List[${index}].css`, {}];
        [obj[prevCss], obj[indexCss], this.customData.currentSwiper2Index] = ["", " dot-active", index];
        this.setData(obj);
    },
    toActiveDetail (e) {
        wx.navigateTo({ url: `/pages/activeDetail/activeDetail?id=${e.currentTarget.dataset.id}` });
    },
    toDataList (e) {
        console.log(e)
        wx.navigateTo({ url: `/pages/dataList/dataList?index=${e.currentTarget.dataset.index}&t=0` });
    },
    toCourseList () {
        wx.switchTab({ url: "/pages/courseList/courseList" });
    },
    courseChange (e) {
        let [prev, index] = [this.customData.currentRecommendIndex, e.currentTarget.dataset.index];
        if (index === 5) this.toCourseList();
        else if (prev !== index) {
            let type = e.currentTarget.dataset.type;
            let [prevTit, prevText, indexTit, indexText, obj] = [`recommendTitleList[${prev}].titActive`, `recommendTitleList[${prev}].textActive`, `recommendTitleList[${index}].titActive`, `recommendTitleList[${index}].textActive`, {}];
            [obj[prevTit], obj[prevText], obj[indexTit], obj[indexText], this.customData.currentRecommendIndex] = ["", "", " title1-active", " title2-active", index];
            this.initRecommendList(type);
            this.setData(obj);
        }
    },
    toFreeCourseDetail (e) {
        wx.navigateTo({ url: `/pages/freeCourseDetail/freeCourseDetail?id=${e.currentTarget.dataset.id}` });
    },
    flagChange (e) {
        this.data.flagX = e.detail.x;
        this.data.flagY = e.detail.y;
    },
    flagEnd (e) {
        if (this.data.flagX > 336 * this.customData.app.globalData.screenWidth / 750) {
            this.setData({
                flagX: 672 * this.customData.app.globalData.screenWidth / 750,
                flagY: this.data.flagY
            });
        } else {
            this.setData({
                flagX: 0,
                flagY: this.data.flagY
            });
        }
    },
    onShareAppMessage () {
        let [tel, role, path] = [wx.getStorageSync("userTel"), wx.getStorageSync("role"), "/pages/findex/findex"];
        if (tel) path += `?tel=${tel}&role=${role}`;
        return {
            title: "新通留学考试加油站",
            path: path
        }
    },
    onShareTimeline() {
      let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
      return {
        title: '新通留学考试加油站',
        query: `tel=${tel}&role=${role}`
      }
    }
});
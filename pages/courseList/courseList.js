Page({
    data: {
        headHeight: 0,
        titleTop: 0,
        title1Top: 0,
        title1WrapCss: "",
        title1List: [
            {
                text: "全部",
                css: " title1-active",
                flag: false
            }, {
                text: "留学方案",
                css: "",
                flag: true
            }, {
                text: "出国考试",
                css: "",
                flag: true
            }, {  
                text: "竞争力提升",
                css: "",
                flag: true
            }
        ],
        swiperList: [],
        title2Hidden: false,
        fixedTitle: "",
        title2Top: "",
        courseWrapCss: "",
        title2HiddenList: [false, true, true],
        // title2WrapWidth: 0,
        title2List1: [
          {
            text: "综合",
            css: " title2-active"
        },
            {
                text: "英国",
                css: ""
            }, {
                text: "澳大利亚",
                css: ""
            }, {
                text: "加拿大",
                css: ""
            }, {
                text: "美国",
                css: ""
            }, {
                text: "欧洲",
                css: ""
            }, {
                text: "亚洲",
                css: ""
            }
        ],
        title2List2: [
          {
            text: "综合",
            css: " title2-active"
        },
            {
                text: "雅思",
                css: ""
            }, {
                text: "托福",
                css: ""
            }, {
                text: "小语种",
                css: ""
            }, {
              text: "国际高中",
              css: ""
          }, 
        ],
        title2List3: [
            {
                text: "就业力",
                css: " title2-active"
            }, {
                text: "学术力",
                css: ""
            }
        ],
        courseList: []
    },
    customData: {
        app: getApp(),
        apiUtil: require("../../utils/apiUtil.js"),
        currentSwiperIndex: 0,
        title1Flag: false,
        currentTitle1Index: 0,
        title1Arr: ["", "留学", "语培", "竞争力提升"],
        currentTitle2Item1Index: 0,
        title2Item1Arr: [13,3, 4, 2, 1, 5, 6],
        currentTitle2Item2Index: 0,
        title2Item2Arr: [14,7, 8, 9,12],
        currentTitle2Item3Index: 0,
        title2Item3Arr: [10, 11],
        title1Height: 0,
        title2Top: 0,
        page: 1
    },
    initList (class1, class2) {
        wx.showLoading({ title: "加载中...", mask: true });
        this.customData.page = 1;
        this.customData.apiUtil.getFreeCourseList(1, class1, class2).then(res => {
            let courseList = [];
            const that = this
            res.forEach(d => {
                let obj = {
                    id: d.V_ID,
                    pic: d.V_IMG,
                    title: that.customData.apiUtil.escapeHtml(d.V_NAME),
                    flag: [d.V_CAT]
                };
                if (d.V_SUBCAT) obj.flag.push(d.V_SUBCAT);
                obj.flag.push(`课时：${d.HOURS}节课`);
                courseList.push(obj);
            });
            this.setData({ courseList }, wx.hideLoading);
        }).catch(wx.hideLoading);
    },
    onLoad (e) {
        if (e.tel) {
            this.customData.app.globalData.referrerTel = e.tel;
            this.customData.app.globalData.referrerRole = e.role;
        }
        this.setData({
            headHeight: this.customData.app.globalData.titleBarHeight,
            titleTop: this.customData.app.globalData.statusHeight,
            title1Top: this.customData.app.globalData.titleBarHeight
        });
        this.customData.apiUtil.getActiveList().then(res => {
            let swiperList = [];
            res.forEach(d => {
                swiperList.push({
                    id: d.ACT_ID,
                    src: d.ACT_IMG,
                    css: ""
                });
            });
            swiperList[0].css = " dot-active";
            this.setData({ swiperList });
        });
        let $w = wx.createSelectorQuery();
        $w.select(".title1-wrap").boundingClientRect();
        $w.select(".title2-box").boundingClientRect();
        // $w.selectAll(".title2-text1").boundingClientRect();
        $w.exec(res => {
            // let width = 0;
            // res[2].forEach(d => width += d.width );
            this.setData({
                // title2WrapWidth: Math.ceil(width),
                title2Hidden: true
            });
            this.customData.title1Height = res[0].height;
            this.customData.title2Top = res[1].top;
        });
        this.initList();
    },
    doScroll (e) {
        let obj = {};
        if (e.detail.scrollTop > 5) {
            this.customData.title1Flag = true;
            obj.title1WrapCss = " title1-wrap-change";
            obj[`title1List[${this.customData.currentTitle1Index}].css`] = " title1-active1";
            this.setData(obj);
        } else {
            this.customData.title1Flag = false;
            obj.title1WrapCss = "";
            obj[`title1List[${this.customData.currentTitle1Index}].css`] = " title1-active";
            this.setData(obj);
        }
        if (e.detail.scrollTop >= this.customData.title2Top - this.data.headHeight - this.customData.title1Height) {
            this.setData({
                fixedTitle: " title2-fixed",
                title2Top: `${this.data.headHeight}px`
            });
        } else {
            this.setData({
                fixedTitle: "",
                title2Top: ""
            });
        }
    },
    swiperChange (e) {
        let [prev, index] = [this.customData.currentSwiperIndex, e.detail.current];
        let [prevCss, indexCss, obj] = [`swiperList[${prev}].css`, `swiperList[${index}].css`, {}];
        [obj[prevCss], obj[indexCss], this.customData.currentSwiperIndex] = ["", " dot-active", index];
        this.setData(obj);
    },
    title1Change (e) {
        let [prev, index] = [this.customData.currentTitle1Index, e.currentTarget.dataset.index];
        if (prev !== index) {
            let [prevCss, prevHidden, indexCss, indexHidden, obj] = [`title1List[${prev}].css`, `title1List[${prev}].flag`, `title1List[${index}].css`, `title1List[${index}].flag`, {}];
            [obj[prevCss], obj[prevHidden], obj[indexHidden], this.customData.currentTitle1Index] = ["", true, false, index];
            if (this.customData.title1Flag) obj[indexCss] = " title1-active1";
            else obj[indexCss] = " title1-active";
            let class2 = "";
            if (index) {
                [obj.title2Hidden, obj.courseWrapCss, obj.title2HiddenList] = [false, " course-wrap-active", [true, true, true]];
                obj.title2HiddenList[index - 1] = false;
                let [class2Item, class2Index] = [`title2Item${index}Arr`, `currentTitle2Item${index}Index`];
                class2 = this.customData[class2Item][this.customData[class2Index]];
            } else [obj.title2Hidden, obj.courseWrapCss] = [true, ""];
            this.initList(this.customData.title1Arr[index], class2);
            this.setData(obj);
        }
    },
    toActiveDetail (e) {
        wx.navigateTo({ url: `/pages/activeDetail/activeDetail?id=${e.currentTarget.dataset.id}` });
    },
    toFreeCourseDetail (e) {
        wx.navigateTo({ url: `/pages/freeCourseDetail/freeCourseDetail?id=${e.currentTarget.dataset.id}` });
    },
    title2Change (e) {
        let { index, flag } = e.currentTarget.dataset;
        let [prev, prevCss, indexCss, obj, class1, class2] = [0, "", "", {}, "", ""];
        let fnObj = {
            item1: {
                setPrev: () => prev = this.customData.currentTitle2Item1Index,
                change: () => {
                    [prevCss, indexCss, this.customData.currentTitle2Item1Index, class1, class2] = [`title2List1[${prev}].css`, `title2List1[${index}].css`, index, this.customData.title1Arr[1], this.customData.title2Item1Arr[index]];
                }
            },
            item2: {
                setPrev: () => prev = this.customData.currentTitle2Item2Index,
                change: () => {
                    [prevCss, indexCss, this.customData.currentTitle2Item2Index, class1, class2] = [`title2List2[${prev}].css`, `title2List2[${index}].css`, index, this.customData.title1Arr[2], this.customData.title2Item2Arr[index]];
                }
            },
            item3: {
                setPrev: () => prev = this.customData.currentTitle2Item3Index,
                change: () => {
                    [prevCss, indexCss, this.customData.currentTitle2Item3Index, class1, class2] = [`title2List3[${prev}].css`, `title2List3[${index}].css`, index, this.customData.title1Arr[3], this.customData.title2Item3Arr[index]];
                }
            }
        };
        fnObj[flag].setPrev();
        if (prev !== index) {
            fnObj[flag].change();
            [obj[prevCss], obj[indexCss]] = ["", " title2-active"];
            this.initList(class1, class2);
            this.setData(obj);
        }
    },
    onShareAppMessage () {
        let [tel, role, path] = [wx.getStorageSync("userTel"), wx.getStorageSync("role"), "/pages/findex/findex?page=courselist"];
        if (tel) path += `&tel=${tel}&role=${role}`;
        return {
            title: "新通名师好课，在线免费学！",
            path: path
        }
    },
    onShareTimeline() {
      let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
      return {
        title: '新通名师好课，在线免费学！',
        query: `tel=${tel}&role=${role}`
      }
    }
});
const { wxAlert } = require("../../utils/apiUtil.js");

Page({
    data: {
        path: "",
        title1List: [
            {
                text: "留学方案",
                css: ""
            }, {
                text: "出国考试",
                css: ""
            }, {
                text: "竞争力提升",
                css: ""
            }
        ],
        title2HiddenList: [false, true, true],
        // title2WrapWidth1: 480,
        // title2WrapWidth2: 590,
        title2List0: [
            {
                text: "全部",
                css: ""
            }, {
              text: "综合",
              css: ""
          },{
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
        title2List1: [
          {
            text: "全部",
            css: ""
        }, 
          {
            text: "综合",
            css: ""
        },
            {
                text: "雅思",
                css: " "
            }, {
                text: "托福",
                css: ""
            },{
              text: "GRE",
              css: ""
          }, {
                text: "小语种",
                css: ""
            }, {
              text: "国际高中",
              css: ""
          }, 
        ],
        title2List2: [
            {
                text: "全部",
                css: ""
            }, {
                text: "就业力",
                css: ""
            }, {
                text: "学术力",
                css: ""
            }
        ],
        dataList: []
    },
    customData: {
        app: getApp(),
        util: require("../../utils/util.js"),
        apiUtil: require("../../utils/apiUtil.js"),
        currentTitle1Index: 0,
        currentTitle2Index: 0,
        title1Arr: ["留学", "考培", "竞争力提升"],
        currentTitle2Item1Index: 0,
        title2Item1Arr: ["",13, 3, 4, 2, 1, 5, 6],
        currentTitle2Item2Index: 0,
        title2Item2Arr: ["",14,7, 8,39, 9,12],
        currentTitle2Item3Index: 0,
        title2Item3Arr: ["", 10, 11],
        page: 1
    },
    initList (class1, class2) {
        wx.showLoading({ title: "加载中...", mask: true });
        this.customData.page = 1;
        const that =this
        this.customData.apiUtil.getDataList(1, class1, class2, wx.getStorageSync("userId")).then(res => {
            let dataList = [];
            res.forEach(d => {
                let obj = {
                    id: d.FILE_ID,
                    pic: d.FILE_PIC,
                    title:  that.customData.apiUtil.escapeHtml(d.FILE_NAME),
                    flagList: d.FILE_TAGS,
                    icon: "/icon/dataList_icon1.png",
                    type: d.FILE_CAT =="综合" && class1=="留学" ? "l综合":d.FILE_CAT
                };
                if (d.FAVS - 0) obj.icon = "/icon/dataList_icon2.png";
                dataList.push(obj);
            });
            this.setData({ dataList }, wx.hideLoading);
        }).catch(wx.hideLoading);
    },
    onLoad (e) {
        // onShareAppMessage()
        console.log(e)
        let exclusiveQrcode = this.onShareAppMessage();
        if (!this.customData.app.globalData.titleBarHeight) {
            let info = wx.getSystemInfoSync();
            [this.customData.app.globalData.titleBarHeight, this.customData.app.globalData.statusHeight] = [info.screenHeight - info.windowHeight, info.statusBarHeight];
        }
        if (e.tel) {
            this.customData.app.globalData.referrerTel = e.tel;
            this.customData.app.globalData.referrerRole = e.role;
        }

        if(!e.t){
          e.t=0
        }
        this.customData.currentTitle1Index = e.index - 0;
        this.customData.currentTitle2Index = e.t - 0;
        let [title1Css,title2Css,obj] = [`title1List[${e.index}].css`,`title2List${e.index}[${e.t}].css`, {}];
        obj[title1Css] = " title1-active";
        obj[title2Css] = " title2-active";
        if (e.index !== "0") {
            let [title2PrevHidden, title2IndexHidden] = ["title2HiddenList[0]", `title2HiddenList[${e.index}]`];
            [obj[title2PrevHidden], obj[title2IndexHidden]] = [true, false];
        }
        // let $w = wx.createSelectorQuery();
        // $w.selectAll(".title2-text1").boundingClientRect();
        // $w.exec(res => {
        //     let width = 0;
        //     res[0].forEach(d => width += d.width );
        //     obj.title2WrapWidth = Math.ceil(width);
        //     this.setData(obj);
        // });
        this.setData(obj);
        let class2Item = `title2Item${e.index - 0 + 1}Arr`;
        this.initList(this.customData.title1Arr[e.index], this.customData[class2Item][e.t]);
        this.setData({ path: `/pages/dataList/dataList?index=${e.index}` });
        // this.setData({ path: `/pages/dataList/dataList?${exclusiveQrcode.path}` });
        console.log(this.data)
    },
    title1Change (e) {
        let [prev, index] = [this.customData.currentTitle1Index, e.currentTarget.dataset.index];
        if (prev !== index) {
            let [prevCss, prevHidden, indexCss, indexHidden, obj,title2List] = [`title1List[${prev}].css`, `title2HiddenList[${prev}]`, `title1List[${index}].css`, `title2HiddenList[${index}]`, {},`title2List${index}[0].css`];
            [obj[prevCss], obj[prevHidden], obj[indexCss], obj[indexHidden], obj.path, this.customData.currentTitle1Index,obj[title2List]] = ["", true, " title1-active", false, `/pages/dataList/dataList?index=${index}`, index," title2-active"];
            let [class2Item, class2Index] = [`title2Item${index + 1}Arr`, `currentTitle2Item${index + 1}Index`];
            this.initList(this.customData.title1Arr[index], this.customData[class2Item][this.customData[class2Index]]);
            this.setData(obj);
        }
    },
    title2Change (e) {
        let { index, flag } = e.currentTarget.dataset;
        let [prev, prevCss, indexCss, obj, class1, class2] = [0, "", "", {}, "", ""];
        let fnObj = {
            item1: {
                setPrev: () => prev = this.customData.currentTitle2Item1Index,
                change: () => {
                    [prevCss, indexCss, this.customData.currentTitle2Item1Index, class1, class2,obj.path] = [`title2List0[${prev}].css`, `title2List0[${index}].css`, index, this.customData.title1Arr[0], this.customData.title2Item1Arr[index],`/pages/dataList/dataList?index=${this.customData.currentTitle1Index}&t=${index}`];
                }
            },
            item2: {
                setPrev: () => prev = this.customData.currentTitle2Item2Index,
                change: () => {
                    [prevCss, indexCss, this.customData.currentTitle2Item2Index, class1, class2,obj.path] = [`title2List1[${prev}].css`, `title2List1[${index}].css`, index, this.customData.title1Arr[1], this.customData.title2Item2Arr[index],`/pages/dataList/dataList?index=${this.customData.currentTitle1Index}&t=${index}`];
                }
            },
            item3: {
                setPrev: () => prev = this.customData.currentTitle2Item3Index,
                change: () => {
                    [prevCss, indexCss, this.customData.currentTitle2Item3Index, class1, class2,obj.path] = [`title2List2[${prev}].css`, `title2List2[${index}].css`, index, this.customData.title1Arr[2], this.customData.title2Item3Arr[index],`/pages/dataList/dataList?index=${this.customData.currentTitle1Index}&t=${index}`];
                }
            }
        };
        fnObj[flag].setPrev();
        if (prev !== index) {
            fnObj[flag].change();
            [obj[prevCss], obj[indexCss]] = ["", " title2-active"];
            this.initList(class1, class2);
            this.customData.currentTitle2Index = index
            this.setData(obj);
        }
    },
    download (e) {
        let index = e.currentTarget.dataset.index;
        if (wx.getStorageSync("userId")) {
            if (this.data.dataList[index].icon === "/icon/dataList_icon1.png") {
                this.customData.apiUtil.addMask("file", this.data.dataList[index].id, wx.getStorageSync("userId")).then(() => {
                    let [icon, obj] = [`dataList[${index}].icon`, {}];
                    obj[icon] = "/icon/dataList_icon2.png";
                    this.setData(obj);
                    this.customData.util.wxAlert("下载成功！", "ok");
                });
            } else wx.navigateTo({ url: `/pages/downDataList/downDataList?type=${this.data.dataList[index].type}` });
        } else {
            this.customData.util.wxModal("提示", "请先登录后再下载资料").then(() => wx.navigateTo({ url: `/pages/registered/registered?from=【资料列表】${this.data.dataList[index].title.replace(/&/g, "@")}` }));
        }
    },
    onShareAppMessage () {
        let [tel, role, path] = [wx.getStorageSync("userTel"), wx.getStorageSync("role"), `/pages/dataList/dataList?index=${this.customData.currentTitle1Index}&t=${this.customData.currentTitle2Index}`];
        if (tel) path += `&tel=${tel}&role=${role}`;
        console.log(this.customData)

        return {
            title: "留学攻略、考试锦囊、求职宝典...你想要的都在这里！",
            path: path
        }
    },
    onShareTimeline() {
      let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
      return {
        title: '留学攻略、考试锦囊、求职宝典...你想要的都在这里！',
        query: `tel=${tel}&role=${role}&index=${this.customData.currentTitle1Index}&t=${this.customData.currentTitle2Index}`
      }
    }
});
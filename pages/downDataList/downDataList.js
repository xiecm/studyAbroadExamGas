Page({
    data: {
        title: "",
        headIcon: "",
        list: []
    },
    customData: {
        apiUtil: require("../../utils/apiUtil.js"),
        typeObj: {
            "英国": {
                id: 3,
                icon: "/icon/country_Britain.png"
            },
            "澳大利亚": {
                id: 4,
                icon: "/icon/country_Australia.png"
            },
            "加拿大": {
                id: 2,
                icon: "/icon/country_Canada.png"
            },
            "美国": {
                id: 1,
                icon: "/icon/country_America.png"
            },
            "欧洲": {
                id: 5,
                icon: "/icon/country_Europe.png"
            },
            "亚洲": {
                id: 6,
                icon: "/icon/country_Asia.png"
            },
            "l综合": {
              id: 13,
              icon: "/icon/country_Asia.png"
          },
            "综合": {
              id: 14,
              icon: "/icon/downDataList_head_icon3.png"
          },
            "雅思": {
                id: 7,
                icon: "/icon/downDataList_head_icon1.png"
            },
            "托福": {
                id: 8,
                icon: "/icon/downDataList_head_icon2.png"
            },
            "GRE": {
                 id: 39,
                 icon: "/icon/downDataList_head_icon3.png"
            },
            "小语种": {
                id: 9,
                icon: "/icon/downDataList_head_icon3.png"
            },
            "国际高中": {
              id: 12,
              icon: "/icon/downDataList_head_icon3.png"
          },
            "就业力": {
                id: 10,
                icon: "/icon/downDataList_head_icon5.png"
            },
            "学术力": {
                id: 11,
                icon: "/icon/downDataList_head_icon4.png"
            }
        }
    },
    onLoad (e) {
        console.log(e)
        this.setData({
            title: e.type=="l综合" || e.type=="k综合" ?"综合":e.type,
            headIcon: this.customData.typeObj[e.type].icon
        });
        let that = this
        this.customData.apiUtil.getDownDataList(wx.getStorageSync("openId"), this.customData.typeObj[e.type].id).then(res => {
            let list = [];
            res.forEach(d => {
                d.FILE_LIST.forEach(d1 => {
                    list.push({
                        title: that.customData.apiUtil.escapeHtml(d1.NAME),
                        url: d1.PATH
                    });
                });
            });
            this.setData({ list });
        });
    },
    openFile (e) {
        let url = e.currentTarget.dataset.url;
        wx.showLoading({ title: "文件加载中..." });
        wx.downloadFile({
            url: url,
            success: res => {
                let tempUrl = res.tempFilePath;
                wx.openDocument({
                    filePath: tempUrl,
                    complete: () => wx.hideLoading()
                });
            },
            complete: () => wx.hideLoading()
        });
    }
});
Page({
    data: {
        title: "",
        telChangeFlag: false,
        focusFlag: false,
        name: "",
        tel: "",
        codeText: "获取",
        cityArr:["北京","上海","广州","深圳","杭州","宁波","温州","天津","厦门","福州","泉州","南京","苏州","成都","重庆","长春","济南","西安","武汉","合肥","南昌","太原","郑州","舟山"]
    },
    customData: {
        app: getApp(),
        util: require("../../../utils/util.js"),
        apiUtil: require("../../../utils/apiUtil.js"),
        id: "",
        stopTap: false,
        trueTel: "",
        smsCode: ""
    },
    onLoad (e) {
        this.customData.id = e.id;
        let name = wx.getStorageSync("formName"), tel = "";
        if (name) tel = wx.getStorageSync("formTel");
        else {
            name = wx.getStorageSync("userName");
            tel = wx.getStorageSync("userTel");
        }
        this.setData({
            title: e.title,
            name: name,
            tel: tel
        });
    },
    change () {
        this.setData({
            telChangeFlag: true,
            focusFlag: true
        });
    },
    getTel (e) {
        this.data.tel = e.detail.value.replace(/\s/g, "");
    },
    sendTel () {
        if (this.customData.stopTap) return false;
        let tel = this.data.tel;
        if (!tel) {
            this.customData.util.wxModal("提示", "请填写手机号");
            return false;
        }
        if (!this.customData.util.comfirmTel(tel)) {
            this.customData.util.wxModal("提示", "请填写正确的手机号");
            return false;
        }
        let num = 120;
        this.setData({ codeText: "120s" });
        let timer = setInterval(() => {
            if (num) this.setData({ codeText: `${--num}s` });
            else {
                clearInterval(timer);
                this.customData.stopTap = false;
                this.setData({ codeText: "获取" });
            }
        }, 1000);
        this.customData.stopTap = true;
        this.customData.apiUtil.sendCode(tel).then(res => {
            this.customData.trueTel = tel;
            this.customData.smsCode = res;
        }).catch(() => {
            this.customData.stopTap = false;
            this.setData({ sendText: "获取" });
        });
    },
    selectCity (e){
      console.log('picker发送选择改变，携带值为', e.detail.value)
    },
    submit (e) {
        let obj = e.detail.value;
        if (!obj.name.trim()) {
            this.customData.util.wxModal("提示", "请填写姓名");
            return false;
        }
        let data = {
            openId: wx.getStorageSync("openId"),
            userId: wx.getStorageSync("userId"),
            id: this.customData.id,
            name: obj.name,
            partName: `【活动】${this.data.title}`,
            refer: this.customData.app.globalData.referrerRole,
            referTel: this.customData.app.globalData.referrerTel
        };
        if (this.data.telChangeFlag) {
            if (!obj.code) {
                this.customData.util.wxModal("提示", "请填写验证码");
                return false;
            }
            if (obj.code !== this.customData.smsCode) {
                this.customData.util.wxModal("提示", "验证码错误");
                return false;
            }
            data.tel = this.customData.trueTel;
        } else data.tel = this.data.tel;
        this.customData.apiUtil.toReservation(data).then(() => this.customData.util.wxAlert("预约成功！", "ok")).then(() => {
            this.customData.app.globalData.yuyueTempFlag = 1;
            wx.setStorageSync("formName", data.name);
            wx.setStorageSync("formTel", data.tel);
            wx.navigateBack();
        });
    }
});
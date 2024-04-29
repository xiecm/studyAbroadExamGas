const {
  wxAlert
} = require("../../../utils/apiUtil.js");

// Q1 Q2 Q3 教育背景
// Q4 学术能力
// Q5 语言能力
// Q6 职业能力
// Q7 领导力
// Q8 个人魅力

// ●如果单项分数10分以上，以最高10分计算
// ●多选项目为不定项选择，如果选择以上都没有，就是没有任何选择
// ●最终分数为：教育背景*25%+学术能力*15%+语言能力*15%+职业能力*30%+领导力*10%+个人魅力*5%
Page({
  data: {
    startFlag: true,
    finPoint: [],
    nextdisabled: true,
    idx: 0,
    hasLogin: true,
    questionList: [{
        choseType: "radio",
        q: "你的教育背景如何？",
        a: [{
            txt: "A：博士及以上",
            point: "4"
          },
          {
            txt: "B：硕士",
            point: "3"
          }, {
            txt: "C：本科",
            point: "2"
          },
          {
            txt: "D：专科及以下",
            point: "1"
          },
        ],
      },
      {
        choseType: "radio",
        q: "你的第一学历的院校级别属于？",
        a: [{
            txt: "A： C9 / QS 前100 / US News 前20",
            point: "4"
          },
          {
            txt: "B： 985 / 211 / QS前200 / US News 前50",
            point: "3"
          },
          {
            txt: "C： 一本 / QS 前500",
            point: "2"
          },
          {
            txt: "D： 其他",
            point: "1"
          },
        ],
      },
      {
        choseType: "radio",
        q: "你的最高学历的院校级别属于？",
        a: [{
            txt: "A： C9 / QS 前100 / US News 前20",
            point: "4"
          },
          {
            txt: "B： 985 / 211 / QS前200 / US News 前50",
            point: "3"
          },
          {
            txt: "C： 一本 / QS 前500",
            point: "2"
          },
          {
            txt: "D： 其他",
            point: "1"
          },
        ],
      },
      {
        q: "关于你的学术能力，以下符合的是：",
        a: [{
            txt: "A： GPA均分90 % 以上（ 3.6 / 4.0） 或年级前15 %",
            point: "40"
          },
          {
            txt: "B： 有过多次校级奖学金",
            point: "31"
          },
          {
            txt: "C： 发表过期刊署名作者论文",
            point: "32"
          },
          {
            txt: "D： 以上都没有",
            point: "13"
          },
        ],
      },
      {
        q: "关于你的语言能力，以下符合的是：",
        a: [{
            txt: "A： 雅思7 .0 / 托福100 / 六级650 或其他英语测试及以上",
            point: "50"
          },
          {
            txt: "B： 雅思6 .5 / 托福90 / 六级550 或其他英语测试及以上",
            point: "41"
          },
          {
            txt: "C： 雅思6 .0 / 托福80 / 六级480 或其他英语测试及以上",
            point: "32"
          },
          {
            txt: "D： 海外学习 / 生活经历3年及以上",
            point: "43"
          },
          {
            txt: "E： 海外学习 / 生活经历1年及以上",
            point: "34"
          },
          {
            txt: "F： 以上都没有",
            point: "15"
          },
        ],
      },
      {
        choseType: "radio",
        q: "关于你的实习经历，以下符合的是：",
        a: [{
            txt: "A： 有过3段及以上500强企业或行业知名企业2 - 3 个月的实习经历",
            point: "10"
          },
          {
            txt: "B： 有过1 - 2 段500强企业或行业知名企业2 - 3 个月的实习经历",
            point: "8"
          },
          {
            txt: "C： 有过1 - 2 段普通企业或中小公司2 - 3 个月的实习经历",
            point: "6"
          },
          {
            txt: "D： 以上都没有",
            point: "1"
          },
        ],
      },
      {
        q: "关于你的校园经历，以下符合的是：",
        a: [{
            txt: "A： 有过学生组织领导经历， 例如社团会长、 学生会长等",
            point: "50"
          },
          {
            txt: "B： 有过学生组织参与经历， 例如社团成员、 学生会成员等",
            point: "31"
          },
          {
            txt: "C： 有过校园活动组织经历， 例如迎新活动、 赛事活动等",
            point: "42"
          },
          {
            txt: "D： 有过赛事类参与获奖经历， 例如贝恩杯、 挑战杯、 欧莱雅商赛等",
            point: "43"
          },
          {
            txt: "E： 以上都没有",
            point: "14"
          },
        ],
      },
      {
        q: "关于你的其他经历，以下符合的是：",
        a: [{
            txt: "A： 微信好友2000人以上， 或小红书 / Ins关注5K人以上",
            point: "40"
          },
          {
            txt: "B： 有过超过10个国家的旅行经历",
            point: "31"
          },
          {
            txt: "C： 有2个或以上职业技能类证书， 例如CFA / ACCA等",
            point: "42"
          },
          {
            txt: "D： 有其他赛事类获奖经历， 例如马拉松、 桥牌、 奥数等",
            point: "33"
          },
          {
            txt: "E： 以上都没有",
            point: "14"
          },
        ],
      }
    ],
    checkPoint: [],
    radioPoint: 0,
    question: [],
    total: 8,
    nowIdx: 0,
    pass: false,
    util: require("../../../utils/util.js"),
    apiUtil: require("../../../utils/apiUtil.js"),

  },
  customData: {
    app: getApp(),
    name: "",
    tel: "",
    trueTel: "",
    code: "",
    stopTap: false,
    smsCode: "",
    from: "",
    flag: "",
    registerFlag: true,
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let arr = []
    arr.length = 8
    if (options.tel) {
      this.customData.referrerTel = options.tel
      this.customData.referrerRole = options.referrerRole
    }
    this.setData({
      question: this.data.questionList[0],
      finPoint: arr,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  checkboxChange(e) {
    const values = e.detail.value; // 添加空数组作为默认值，以避免undefined
    const items = this.data.question; // 添加空数组作为默认值，以避免undefined
    const idx = this.data.nowIdx
    items.a.forEach((item) => {
      item.checked = values.some(value => item.point === value);
    });
    let arr = this.data.finPoint
    arr.splice(idx, 1, values)
    let disabled = values.length != 0 ? false : true
    console.log(disabled)
    this.setData({
      question: items,
      finPoint: arr,
      nextdisabled: disabled,
      prevdisabled: disabled,
    })
  },

  radioChange(e) {
    let items = this.data.question
    let idx = this.data.nowIdx
    for (let i = 0, len = items.a.length; i < len; ++i) {
      items.a[i].checked = items.a[i].point === e.detail.value
    }
    let arr = this.data.finPoint
    arr.splice(idx, 1, e.detail.value)
    console.log(arr)
    const disabled = e.detail.value ? false : true
    this.setData({
      question: items,
      finPoint: arr,
      nextdisabled: disabled,
      nowIdx: idx
    })
  },

  next(e) {
    let idx = this.data.nowIdx
    let arr = this.data.finPoint
    let obj = {}
    if (idx == 0) {
      if (arr[0] == 3 || arr[0] == 4) {} else {
        idx++
        arr.splice(idx, 1, '0')
      }
    }
    idx++

    if (idx == 7) {
      if (wx.getStorageSync("userId")) {

      } else {
        this.setData({
          hasLogin: false
        })
      }
    }
    const disabled = arr[idx] ? false : true
    obj.nowIdx = idx
    obj.question = this.data.questionList[idx]
    obj.nextdisabled = disabled
    obj.finPoint = arr
    this.setData(obj)
  },
  prev(e) {
    let idx = this.data.nowIdx
    let arr = this.data.finPoint
    if (idx == 2) {
      if (arr[0] == 3 || arr[0] == 4) {} else {
        idx--
      }
    }
    idx--
    const disabled = arr[idx] ? false : true

    this.setData({
      nowIdx: idx,
      question: this.data.questionList[idx],
      nextdisabled: disabled
    })
  },

  modifiedPoints(finPoint) {
    const modifiedPoints = [];
    finPoint.forEach((item, idx) => {
      if (Array.isArray(item)) {
        const newItem = item.map((e) => e.substring(0, 1));
        if (newItem.includes('1')) {
          newItem.length = 0; // 清空数组
          newItem.push(1); // 添加 1 到数组
        }
        modifiedPoints.push(newItem);
      } else {
        modifiedPoints.push(item);
      }
    });
    return modifiedPoints
  },

  submit() {
    const finPoint = this.data.finPoint
    const modifiedPoints = this.modifiedPoints(finPoint);
    console.log(this.customData.app.globalData.referrerTel)
    console.log(this.customData.app.globalData.referrerRole)
    wx.navigateTo({
      url: `/pages/zyResult/zyResult?finPoint=${JSON.stringify(modifiedPoints)}`
    })

  },
  getChatTel(e) {
    let that = this
    const finPoint = this.data.finPoint
    console.log(finPoint)
    const modifiedPoints = this.modifiedPoints(finPoint);
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    let wxLogin = () => {
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res.code);
          },
          fail: reject
        });
      });
    };
    that.data.apiUtil.decrypt(wx.getStorageSync("session_key"), e.detail.encryptedData, e.detail.iv).then(res => {
      console.log(res)
      that.setData({
        tel: res,
        codeFlag: false
      });
      that.customData.tel = res;
      wx.hideLoading();
      let {
        tel
      } = that.customData;
      let option = {
        openid: wx.getStorageSync("openId"),
        tel: tel,
        refer_page: '大学生职业测评工具，询问求职意向',
        referrerTel:that.customData.app.globalData.referrerTel,
        referrerRole:that.customData.app.globalData.referrerRole,
      };
      wx.showLoading({
        title: "加载中...",
        mask: true
      });
      that.data.apiUtil.registered(option).then(res => {
        wx.hideLoading();
        wx.setStorageSync("userId", res.insid);
        wx.setStorageSync("userTel", option.tel);
        wx.setStorageSync("role", res.user_role);
        wx.navigateTo({
          url: `/pages/zyResult/zyResult?finPoint=${JSON.stringify(modifiedPoints)}`
        })
      })
    }).catch(res => {
      if (res === 1) return wxLogin();
    }).then(res => {
      if (typeof (res) === "string") return this.data.apiUtil.login(res);
    }).then(res => {
      if (res) {
        wx.setStorageSync("session_key", res.session_key);
        wx.hideLoading();
      }
    });
  },
})
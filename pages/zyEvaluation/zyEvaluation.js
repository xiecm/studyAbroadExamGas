const {
  wxAlert
} = require("../../utils/apiUtil.js");
const [app, apiUtil] = [getApp(), require("../../utils/apiUtil.js")];

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
    util: require("../../utils/util.js"),
    apiUtil: require("../../utils/apiUtil.js"),
  },
  customData:{
    app: getApp(),
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    console.log(e)
    if (e.tel) {
      this.customData.app.globalData.referrerTel = e.tel;
      this.customData.app.globalData.referrerRole = e.role;
    }
    wx.login({
      success: res => {
        apiUtil.login(res.code).then(res1 => {
          wx.setStorageSync('openId', res1.openId)
          wx.setStorageSync('session_key', res1.session_key)
          // if (res1.role === 2 || res1.role === 3) this.setData({
          //   staffFlag: true
          // });
          // else this.setData({
          //   staffFlag: false
          // });
        });
      }
    });
  },


  start() {
    if(this.customData.app.globalData.referrerTel){
      wx.navigateTo({
        url: `/pages/zyEvaluation/zyEvaluationList/zyEvaluationList?tel=${this.customData.app.globalData.referrerTel}&role=${this.customData.app.globalData.referrerRole}`
      })
    }else{
      wx.navigateTo({
        url: `/pages/zyEvaluation/zyEvaluationList/zyEvaluationList`
      })
    }

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
    return {
      title: "羡慕身边那些春风得意的offer收割机？不如测测自己斩获offer有几分胜算。",
      path: `/pages/zyEvaluation/zyEvaluation?tel=${tel}&role=${role}`,
      query: `tel=${tel}&role=${role}`
    }
  },

  onShareTimeline() {
    let [tel, role] = [wx.getStorageSync("userTel"), wx.getStorageSync("role")];
    return {
      title: "羡慕身边那些春风得意的offer收割机？不如测测自己斩获offer有几分胜算。",
      query: `tel=${tel}&role=${role}`
    }
  }
})
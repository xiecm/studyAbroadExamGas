import * as echarts from '../../ec-canvas/echarts';

//   分数	结果
// 9分及以上	击败了95%的小伙伴
// 【8-9）分	击败了85%的小伙伴
// 【7.5-8）分	击败了75%的小伙伴
// 【7-7.5）分	击败了60%的小伙伴
// 【6.5-7）分	击败了50%的小伙伴
// 【6-6.5）分	击败了35%的小伙伴
// 【5.5-6）分	击败了20%的小伙伴
// 【5-5.5）分	击败了10%的小伙伴
// 【0-5）分	击败了5%的小伙伴

// ●如果单项分数10分以上，以最高10分计算
// ●多选项目为不定项选择，如果选择以上都没有，就是没有任何选择
// ●最终分数为：教育背景*25%+学术能力*15%+语言能力*15%+职业能力*30%+领导力*10%+个人魅力*5%




Page({
  data: {
    ec: {
      onInit: ''
    },
    typeList: ['教育背景', '学术能力', '语言能力', '职业能力', '领导力', '个人魅力'],
    pointObj: {},
    point: 0,
    beat: 0,
    type: '',
    txt: '',
    lay: true,
    fin:'',
    src: ""
  },

  onLoad(option) {
    const finPoint = JSON.parse(option.finPoint)
    this.setData({
      fin: finPoint,
    })
    this.getPoint(finPoint)
    // this.tobase()
  },

  onShow() {
   this.tobase()
  },
  tobase() {
    const that = this
    let seTime = setInterval(() => {
      if (that.data.src) {
        clearInterval(seTime)
      } else {
        const ecComponent = this.selectComponent('#mychart-dom-graph'); //找到echarts
        // 先保存图片到临时的本地文件，
        ecComponent.canvasToTempFilePath({
          success: res => {
            console.log(res)
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath, //图片路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                that.setData({
                  src: 'data:image/png;base64,' + res.data
                })
              }
            })

            return
          },
          fail: res => console.log(res)
        });
      }


    }, 2000);
  },

  // 设置图表信息
  setSeries(d) {
    return new Promise((resolve) => {
      function initChart(canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        const option = {
          backgroundColor: "#ffffff",
          xAxis: {
            show: false
          },
          yAxis: {
            show: false
          },

          radar: {
            // shape: 'circle',
            radius: '68%',

            name: {
              "textStyle": {
                "color": "#949494",
                fontSize: "13",
              }
            },
            indicator: [{
                name: '教育背景',
                max: 10
              },
              {
                name: '学术能力',
                max: 10
              },
              {
                name: '语言能力',
                max: 10
              },
              {
                name: '职业能力',
                max: 10
              },
              {
                name: '领导力',
                max: 10
              },
              {
                name: '个人魅力',
                max: 10
              }
            ],
            axisLine: { // 设置雷达图中间射线的颜色
              lineStyle: {
                color: '#e0e7ff',
              },
            },
            // splitArea: { //设置图表颜色，show的值为true
            //   show: true,
            //   areaStyle: {
            //     //color:"#c1ddf8", //一般设置方式
            //     //设置渐变背景色 new echarts.graphic.LinearGradient(a,b,c,d,arr)
            //     //a ,b,c,d值可为0，1 a:1表示arr中的颜色右到左；c:1 arr中的颜色左到右
            //     //b:1表示arr中的颜色下到上；d:1表示arr中的颜色上到下
            //     color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            //         offset: 0,
            //         color: '#ffffff'
            //       }, // 0% 处的颜色 
            //       {
            //         offset: 0,
            //         color: '#ffffff'
            //       } // 100% 处的颜色
            //     ], false)
            //   }
            // },
          },
          series: [{
            type: 'radar',
            symbolSize: 6,
            lineStyle: {
              width: 4,
              color: 'rgba(130,161,255,1)', //边框颜色
            },
            data: [{
              value: d,
              itemStyle: { //该数值区域样式设置
                normal: {
                  color: 'rgba(255,233,48,1)', //背景颜色，还需设置areaStyle
                  borderColor: "rgba(46,95,255,1)",
                  borderWidth: 2,
                },
              },
              areaStyle: { //设置区域背景颜色透明度
                normal: {
                  width: 1,
                  opacity: .6,
                },
              },
            }]
          }]
        };
        chart.setOption(option);
        return chart;
      }
      resolve(initChart)
    })
  },



  getPoint(finPoint) {
    const that = this
    let pointObj = this.data.pointObj
    console.log(finPoint)
    function sum(arr) {
      let num = parseInt(arr.reduce((prev, cur) => parseInt(prev) + parseInt(cur)))
      return num >= 10 ? 10 : num
    }
    pointObj['教育背景'] = sum(finPoint.splice(0, 3))
    pointObj['学术能力'] = sum(finPoint[0])
    pointObj['语言能力'] = sum(finPoint[1])
    pointObj['职业能力'] = parseInt(finPoint[2])
    pointObj['领导力'] = sum(finPoint[3])
    pointObj['个人魅力'] = sum(finPoint[4])
    const point = pointObj['教育背景'] * 25 / 100 + pointObj['学术能力'] * 15 / 100 + pointObj['语言能力'] * 15 / 100 + pointObj['职业能力'] * 30 / 100 + pointObj['领导力'] * 10 / 100 + pointObj['个人魅力'] * 5 / 100
    let beat;
    if (point > 9) {
      beat = '95%';
    } else if (point >= 8 && point <= 9) {
      beat = '85%';
    } else if (point >= 7.5 && point <= 8) {
      beat = '75%';
    } else if (point >= 7 && point <= 7.5) {
      beat = '60%';
    } else if (point >= 6.5 && point <= 7) {
      beat = '50%';
    } else if (point >= 6 && point <= 6.5) {
      beat = '35%';
    } else if (point >= 5.5 && point <= 6) {
      beat = '20%';
    } else if (point >= 5 && point <= 5.5) {
      beat = '10%';
    } else {
      beat = '5%';
    }
    const pointArr = Object.values(pointObj);
    this.setSeries(pointArr).then((e) => {
      that.setData({
        ec: {
          onInit: e
        },
        pointObj: pointObj,
        point: point.toFixed(1),
        beat: beat
      })
    })

  },

  showLay(e) {
    const id = e.currentTarget.dataset.id
    const pointObj = this.data.pointObj
    const point = pointObj[id]
    let txt;
    if (point >= 9) {
      if (id == '教育背景') {
        txt = '非常出色！具备非常强的竞争力';
      } else if (id == '学术能力') {
        txt = '非常扎实！具备非常强的竞争力';
      } else if (id == '语言能力') {
        txt = '非常优秀！具备非常强的竞争力';
      } else if (id == '职业能力') {
        txt = '非常丰富！具备非常强的竞争力';
      } else if (id == '领导力') {
        txt = '非常突出！具备非常强的竞争力';
      } else {
        txt = '非常出色！具备非常强的竞争力';
      }
    } else {
      if (id == '教育背景') {
        txt = '有待提升，可以通过提升最高学历进行强化！';
      } else if (id == '学术能力') {
        txt = '有待提升，进一步提升在校成绩或者参与一些学术项目进行论文发表';
      } else if (id == '语言能力') {
        txt = '有待提升，可以参加语言类培训进一步提升语言考试成绩';
      } else if (id == '职业能力') {
        txt = '有待提升，可以利用寒暑假参与500强企业的实习丰富经历';
      } else if (id == '领导力') {
        txt = '有待提升，可以参与校园活动或者赛事，进一步提升组织及领导经历';
      } else {
        txt = '有待提升，可以通过建立自媒体账号或者发展1-2个兴趣爱好提升';
      }
    }
    this.setData({
      lay: false,
      type: id,
      txt: txt,
    })

  },
  e_close() {
    const fin = JSON.parse(this.options.finPoint)
    this.getPoint(fin)
    this.setData({
      lay: true,
    })
  },
  // 微信客服
  toCustomerService() {
    // try {
    //   wx.openCustomerServiceChat({
    //     extInfo: {
    //       url: "" //客服链接
    //     },
    //     corpId: 'wx6c4f6654f1a4cc9f', //企业微信ID
    //     success(res) {}
    //   })
    // } catch (error) {
    //   showToast("请更新至微信最新版本")
    // }
    wx.navigateTo({
      url: `/pages/53kf/53kf`
    })
  },
  saveQr() {
    wx.previewImage({
      current: 'https://xcx.xt.cn/filemanager/uploads/images/2024/04/26/74097.png',
      urls: ['https://xcx.xt.cn/filemanager/uploads/images/2024/04/26/74097.png']
    });
  },
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
}
});
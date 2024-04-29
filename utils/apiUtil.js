const [app, util] = [getApp(), require("util.js")];
//微信登录
const login = code => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "wxlogin",
                code: code
            },
            success: res => {
                if (res.data.code === 1) {
                    let obj = {
                        userId: res.data.user_id,
                        openId: res.data.openid,
                        userName: res.data.user_name,
                        userTel: res.data.tel,
                        role: res.data.user_role ? res.data.user_role - 0 : 1,
                        session_key: res.data.session_key,
                        cityArr: [res.data.user_prov, res.data.user_city, res.data.user_district],
                        formName: res.data.form_name,
                        formTel: res.data.form_tel,
                        formCityArr: [res.data.form_prov, res.data.form_city, res.data.form_district]
                    };
                    resolve(obj);
                } else {
                    util.wxAlert("登录失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//发送验证码
const sendCode = tel => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl2,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "sendyzm",
                tel: tel
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.smscode);
                else {
                    util.wxAlert("验证码发送失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//注册
const registered = option => {
    option.action = "adduser";
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: option,
            success: res => {
                if (res.data.code === 1){
                    resolve(res.data);
                    util.wxAlert("注册成功！", "ok");
                } 
                else {
                    if (res.data.code === 4){
                        resolve(res.data)
                        // util.wxAlert("该手机号已被注册！")
                    }
                    else {
                        util.wxAlert("注册失败！");
                        console.error(res);
                    }
                    reject(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};

const checkyzm = (tel,code) =>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: app.globalData.apiUrl2,
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        action:'checkyzm',
        tel:tel,
        yzm:code
      },
      success: res => {
        resolve(res)
      },
      fail: err => {
          util.wxModal("错误", "接口调用失败！");
          reject(err);
          console.error(err);
      }
  });
  })
}
//修改手机号
const changeTel = (openid, tel) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "updateuser",
                openid: openid,
                tel: tel
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.user_role);
                else {
                    if (res.data.code === 4) util.wxAlert("该手机号已被注册！");
                    else {
                        util.wxAlert("修改失败！");
                        console.error(res);
                    }
                    reject(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//解密手机号
const decrypt = (key, data, iv) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "decrypt",
                sessionkey: key,
                encryptedData: data,
                iv: iv
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.data.phoneNumber);
                else {
                    util.wxAlert("获取手机号失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取用户信息
const getUserInfo = openid => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getuserdata",
                openid: openid
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.detail);
                else {
                    util.wxAlert("获取个人信息失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取身份标识
const getUserRole = tel => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getuserrole",
                tel: tel
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.info.USER_ROLE - 0);
                else {
                    util.wxAlert("获取身份标识失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取已下载资料列表
const getDownDataList = (openid, typeid) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getuserdownloads",
                openid: openid,
                file_catid: typeid
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取资料失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
const escapeHtml = (text)=> {
  return text.replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&amp;/g, '&');
}
//获取活动轮播图
const getActiveList = () => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "indexslide"
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取活动失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取推广位轮播图
const getAdList = () => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "indexpos"
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取推广位失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        })
    });
};
//获取首页推荐列表
const getRecommendList = (type) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "indexrec",
                type: type
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取推荐列表失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取活动详情
const getActiveDetail = (id, userid) => {
    let data = {
        action: "getactdetail",
        id: id
    };
    if (userid) data.userid = userid;
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: data,
            success: res => {
                if (res.data.code === 1) {
                    resolve({
                        fav_id: res.data.fav_id,
                        yy: res.data.yycount,
                        title: res.data.detail.ACT_NAME,
                        pic: res.data.detail.ACT_DETAILPIC
                    });
                } else {
                    util.wxAlert("获取活动失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//预约报名
// option = {
//     openId, userId, id, name, tel, cityArr, partName, refer, referTel
// }
const toReservation = option => {
    let data = {
        action: "addformdata",
        partId: "gasMiniprogram",
        addform: "y",
        linktype: "act"
    };
    data.openid = option.openId;
    data.partName = option.partName;
    // data.prov = option.cityArr[0];
    // data.city = option.cityArr[1];
    // data.district = option.cityArr[2];
    data.name = option.name;
    data.tel = option.tel;
    data.linkid = option.id;
    data.userid = option.userId;
    if (option.referTel) {
        data.refer_role = option.refer;
        data.refer_tel = option.referTel;
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: data,
            success: res => {
                if (res.data.code === 1) resolve();
                else {
                    util.wxAlert("预约活动失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取免费课列表
const getFreeCourseList = (page, class1, class2) => {
    let data = {
        action: "getvideolist",
        v_status: 1,
        page: page,
        perpage: 100
    };
    if (class1) {
        data.v_biztype = class1;
        data.v_catid = class2;
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: data,
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取课程失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取免费课详情
const getFreeCourseDetail = id => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getvideodetail",
                id: id
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.detail);
                else {
                    util.wxAlert("获取视频课失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//收藏
const addMask = (type, id, userid) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "addfav",
                atype: type,
                aid: id,
                userid: userid
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.insid);
                else {
                    util.wxAlert("收藏失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//取消收藏
const removeMask = id => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "removefav",
                fav_id: id
            },
            success: res => {
                if (res.data.code === 1) resolve();
                else {
                    util.wxAlert("取消收藏失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//判断是否收藏
const isMask = (type, id, userid) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "isfav",
                atype: type,
                aid: id,
                userid: userid
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.FAV_ID);
                else {
                    util.wxAlert("判断收藏失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取资料列表
const getDataList = (page, class1, class2, userid) => {
    let data = {
        action: "getfilelist",
        file_biztype: class1,
        file_status: 1,
        page: page,
        perpage: 100
    };
    if (class2) data.file_catid = class2;
    if (userid) data.user_id = userid;
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: data,
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取资料失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取资料详情
const getDataDetail = id => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getfiledetail",
                file_id: id
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.detail);
                else {
                    util.wxAlert("获取资料失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//生成二维码
// option = { url, userId, type, id, width }
const getQrCode = option => {
    let data = {
        action: "getqrimg",
        actid: option.id,
        atype: option.type,
        userid: option.userId,
        actpath: option.url
    };
    if (option.width) data.actwidth = option.width;
    return new Promise((resolve, reject) => {
        wx.request({
            url: "https://ssl.xt.cn/api_lxkpmall/act_qr.php",
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: data,
            success: res => {
                if (res.data.code === "1") resolve(res.data.actpath);
                else {
                    util.wxAlert("小程序码生成失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取收藏列表
const getMarkList = (openid, type) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getuserfavs",
                openid: openid,
                atype: type
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取列表失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//获取预约列表
const getReservationList = (openid, type) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            data: {
                action: "getuserreserve",
                openid: openid,
                atype: type
            },
            success: res => {
                if (res.data.code === 1) resolve(res.data.list);
                else {
                    util.wxAlert("获取列表失败！");
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};
//增加视频课播放量
const addVideoCount = id => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.apiUrl,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
                action: "addvideoclicks",
                id: id
            },
            success: res => {
                if (res.data.code === 1) resolve();
                else {
                    reject(res);
                    console.error(res);
                }
            },
            fail: err => {
                util.wxModal("错误", "接口调用失败！");
                reject(err);
                console.error(err);
            }
        });
    });
};

const wxAlert = (message, type, callback) => {
  // let icon = (type == 'ok') ? 'success' : 'loading';
  let delay = (type == 'ok') ? 500 : 800;
  wx.showToast({
      title: message,
      icon: type
  });
  setTimeout(() => {
      wx.hideToast();
      if (callback) callback();
  }, delay);
};
module.exports = { login, sendCode, registered,checkyzm, changeTel, decrypt, getUserInfo, getUserRole, getDownDataList,escapeHtml, getActiveList, getAdList, getRecommendList, getActiveDetail, toReservation, getFreeCourseList, getFreeCourseDetail, addMask, removeMask, isMask, getDataList, getDataDetail, getQrCode, getMarkList, getReservationList, addVideoCount,wxAlert};
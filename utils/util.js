const app = getApp();
const wxAlert = (msg, tp) => {
    let [icon, duration] = ["none", 800];
    if (tp === "ok") [icon, duration] = ["success", 500];
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: msg,
            icon: icon,
            duration: duration,
            mask: true,
            fail: err => reject(err)
        });
        setTimeout(resolve, duration);
    });
};
const wxModal = (tit, msg, buttonFlag = false) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            showCancel: buttonFlag,
            title: tit,
            content: msg,
            success: res => {
                if (res.confirm) resolve();
                else if (res.cancel) reject("取消");
            },
            fail: err => reject(err)
        });
    });
};
const comfirmTel = tel => {
    let reg = /^0{0,1}(1)[0-9]{10}$/;
    if (reg.test(tel)) return true;
    return false;
};
module.exports = { wxAlert, wxModal, comfirmTel };

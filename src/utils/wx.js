import Vue from 'vue'
import qs from "qs";
const vp = Vue.prototype
const root = process.env.VUE_APP_BASE_URL

// 微信业务
export default {
  postMsg:(to)=>{ // webview 与 小程序通信
    // window.parent.postMessage( { text: 'Hello from WebView', url: window.location.href }, '*');  // 小程序不支持接收
    const win = window;
    win.wx && win.wx.miniProgram && win.wx.miniProgram.postMessage({
      data: {
        data:to  // 把所有数据都传过去
      },
    });
  },
  getSign(){
    return new Promise((resolve,rej)=>{
      vp.$http({
        method: "post",
        url: root + "wx/signature",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        transformRequest: [
          (data) => {
            data = qs.stringify(data);
            return data;
          },
        ],
        data: {
          url: encodeURIComponent(location.href.split("#")[0]),
        },
      })
        .then((data) => {
          let rawData = data.data,
            code = rawData.code,
            res = rawData.data;
          if (!code) {
            resolve(res);
          } else {
            console.log(rawData);
            rej(rawData);
          }
        })
        .catch((err) => {
          rej(err)
        });
    })
  },
  registerShare(data,shareData, cb) {
    let win = window;
    if (win.wx) {
      win.wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          "checkJsApi",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
        ],
      });
      win.wx.ready(() => {
        win.wx.onMenuShareAppMessage(shareData);
        win.wx.onMenuShareTimeline(shareData);
        cb && cb();
      });
      win.wx.error((res) => {
        console.log(res.errMsg);
      });
    }
  },
  getUserInfo(openId,actId){
    return new Promise((resolve,reject)=>{
      vp.$http({
        url: root + "user/info",
        params: {
          openId,
          actId
        },
      }).then((data) => {
        let rawData = data.data,
          code = rawData.code,
          res = rawData.data;
        if (!code) {
          resolve(res);
        } else {
          console.log(rawData);
          reject(rawData);
        }
      }).catch((err) => {
        console.log(err);
        reject(err)
      });
    })
  },
  go2auth(url) {
    console.log("跳转前的url:", url);
    let target = root + "wx/authorize" + "?redirect=" + encodeURIComponent(url);
    location.replace(target);
  },
}
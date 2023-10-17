<template>
  <div class="page-index">
    首页
    <p>{{loadingTxt}}</p>
    <br/>
    <br/>
    <img :src="require('../images/hi.jpg')" class="avatar">
    <img :src="require('../images/hi.jpg?inline')" class="avatar">
    <br>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

const PAGEURL = location.href;
const TESTMODE =
  PAGEURL.indexOf("testMode=true") > -1 ||
  PAGEURL.indexOf("localhost") > -1 ||
  PAGEURL.indexOf(":808") > -1;

const docEle = document.documentElement;
const dclientWidth = docEle.clientWidth;
const dclientHeight = docEle.clientHeight;

let _title = document.title;
let _desc = "自定义描述";
let _pureLink = PAGEURL.split("?")[0];

export default {
  name: "pageIndex",
  data() {
    return {
      actId:null, // 记得和后端确认活动id
      loadingTxt: 0,
      pageScale: 1,
      cssText: "",
      testMode: false,

      root: PAGEURL.indexOf("//csbj.linkroutes") > -1 ? "https://csbj.linkroutes.com/api/" : "https://t-csbj.linkroutes.com/api/", // 城市便捷正式环境,测试环境都是t-csbj
      auth: "wx/authorize",
      signature: "wx/signature",
      userInfo: "user/info",

      isWeixin: navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1,
      shareData: {
        title: _title,
        desc: _desc,
        link: _pureLink,
        imgUrl: "https://www1.pcbaby.com.cn/test/gz/project/img/20210904/cover.jpg",
        success: (data) => {
          window._czc &&
            window._czc.push([
              "_trackEvent",
              "shareSuccess",
              "微信分享成功",
              this.SRC,
            ]);
        },
        cancel: (data) => {
          window._czc &&
            window._czc.push([
              "_trackEvent",
              "shareFailed",
              "微信分享取消",
              this.SRC,
            ]);
        },
      },
      openId: "",
      sid: "",
      username: "测试狗",
      avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
      pageIndex: 0,
    };
  },
  created() {
    this.testMode = TESTMODE;
    // 埋点事件注册，使用方法在标签加：data-points="shareSuccess（事件名）,微信分享成功（事件中文解释）,其他参数"
    // this.$tool.uploadPoint();
  },
  mounted() {
    let urlData = this.$tool.tool.parseURL(location.href).params;
    console.log("页面携带的参数：", urlData);
    this.openId = urlData.openId;
    this.sid = urlData.sid;

    // 进入页面首选检查授权
    this.checkAuth(this.openId);

    this.fixPage(true);

    this.init(()=>{
      // 加载完毕显示页面
    })

    this.setShare(() => {
      // this.Jbgm.play(); // 按需音频加载
    });

  },
  methods: {
    init(cb) {
      this.$tool.preload.init({
        list: [{ src: require("../images/hi.jpg") }],
        progress: (percent) => {
          this.loadingTxt = percent;
        },
        success: () => {
          this.$toast("加载完毕!");
          let t = setTimeout(() => {
            cb && cb();
            clearTimeout(t);
            t = null;
          }, 1000);
        },
      });
    },
    fixPage(force) {
      if (force) {
        let rootEle = document.documentElement;
        window.pageRadio = +(
          rootEle.clientWidth / rootEle.clientHeight
        ).toFixed(2);
        console.log("强制fixPage(pageRadio)：", window.pageRadio);
      }
      if (window.pageRadio > window.psdRadio) {
        this.pageScale = +(window.psdRadio / window.pageRadio).toFixed(2);
        this.cssText = `transform:scale(${this.pageScale});transform-origin: 50% 0 0 `;
      }
    },
    go2auth(url) {
      console.log("跳转前的url:", url);
      let target =
        this.root + this.auth + "?"+(this.actId? `actId=${this.actId}&` :'' )+"redirect=" + encodeURIComponent(url);
      location.replace(target);
    },
    checkAuth(openId) {
      if (this.testMode) {
        console.log(
          "testMode:",
          this.testMode,
          " 不做网页授权跳转或获取微信用户信息"
        );
        return;
      }
      console.log("是否有openId:", openId);
      if (openId && this.isWeixin) {
        this.getUserInfo(openId);
        window._czc &&
          window._czc.push(["_trackEvent", "pageView", "展示页面", this.SRC]);
      } else {
        this.go2auth(location.href);
      }
    },
    getUserInfo(openId) {
      if (this.testMode) {
        console.log("testMode:", this.testMode, " 不请求用户微信数据接口");
        return;
      }
      axios({
        url: this.root + this.userInfo,
        params: {
          openId,
          actId: this.actId
        },
      })
        .then((data) => {
          let rawData = data.data,
            code = rawData.code,
            res = rawData.data;
          if (!code) {
            console.log("微信数据:", res);
            this.username = res.nickname;
            this.avatar = res.headImgUrl;

            // this.fixPage(true);  // ios微信浏览器网页授权之后，底部会多出一个工具条，导致页面高度变化，单页面(非滚动)需要重新fixPage
          } else {
            console.log(rawData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setShare(cb) {
      if (this.testMode) {
        console.log("testMode:", this.testMode, " 不请求微信signature");
        return;
      }
      axios({
        method: "post",
        url: this.root + this.signature,
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
            this.registerWx(res, () => {
              cb && cb();
            });
          } else {
            console.log(rawData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    registerWx(data, cb) {
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
          win.wx.onMenuShareAppMessage(this.shareData);
          win.wx.onMenuShareTimeline(this.shareData);
          cb && cb();
        });
        win.wx.error((res) => {
          console.log(res.errMsg);
        });
      }
    },
  },
};
</script>

<style lang="scss" >
@import "@/assets/scss/app.scss";
@import "./index.scss";
</style>
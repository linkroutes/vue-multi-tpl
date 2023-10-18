<template>
  <div class="page-index">
    首页
    <p>{{loadingTxt}}</p>
    <br/>
    <br/>
    <img :src="require('../../images/hi.jpg')" class="avatar">
    <img :src="require('../../images/hi.jpg?inline')" class="avatar">
    <br>

    <bgm  ref="Jbgm" :visible="true" :autoPlay="true"/>
  </div>
</template>

<script>
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

import bgm from "@/components/bgm.vue";
export default {
  name: "pageIndex",
  components:{
    bgm
  },
  data() {
    return {
      actId:null, // 记得和后端确认活动id
      loadingTxt: 0,
      pageScale: 1,
      cssText: "",
      testMode: false,

      root: process.env.VUE_APP_BASE_URL,
      auth: "wx/authorize",
      userInfo: "user/info",

      isWeixin: navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1,
      shareData: {
        title: _title,
        desc: _desc,
        link: _pureLink,
        imgUrl: "https://www1.pcbaby.com.cn/test/gz/project/img/20210904/cover.jpg",
        success: (data) => {
          window._czc && window._czc.push([ "_trackEvent", "shareSuccess", "微信分享成功",this.SRC,]);
        },
        cancel: (data) => {
          window._czc && window._czc.push(["_trackEvent","shareFailed","微信分享取消",this.SRC,]);
        },
      },

      openId: "", // 要求后端加密
      username: "测试狗",
      avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
    };
  },
  created() {
    this.testMode = TESTMODE;
    // 埋点事件注册，使用方法在标签加：data-points="shareSuccess（事件名）,微信分享成功（事件中文解释）,其他参数"
    // this.$tool.track.uploadPoint();
  },
  mounted() {
    let urlData = this.$tool.tool.parseURL(location.href).params;
    console.log("页面携带的参数：", urlData);
    this.openId = urlData.openId;
    this.sid = urlData.sid;

    // 进入页面首选检查授权
    // this.checkAuth(this.openId); // 按需开启

    // this.fixPage(true); // 按需开启

    this.init(()=>{
      // 加载完毕显示页面
    })

    // 微信分享
    this.setShare(() => {
      // this.Jbgm.play(); // 按需音频加载
    });

  },
  methods: {
    init(cb) {
      this.$tool.preload.init({
        list: [{ src: require("@/images/hi.jpg") }],
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
    checkAuth(openId) {
      if (this.testMode) {
        console.log("testMode:",this.testMode," 不做网页授权跳转或获取微信用户信息");
        return;
      }

      console.log("是否有openId:", openId);
      if (openId && this.isWeixin) {
        this.$tool.wx.getUserInfo(openId, this.actId).then((data)=>{

          console.log("微信用户数据:", data);
          this.username = data.nickname;
          this.avatar = data.headImgUrl;

          // this.fixPage(true);  // ios微信浏览器网页授权之后，底部会多出一个工具条，导致页面高度变化，单页面(非滚动)需要重新fixPage
        }).catch((err)=>{
          console.log(err);
        })

        window._czc && window._czc.push(["_trackEvent", "pageView", "展示页面", this.SRC]);
      } else {
        this.$tool.wx.go2auth(location.href);
      }
    },
    setShare(cb) {
      if (this.testMode) {
        console.log("testMode:", this.testMode, " 不请求微信signature");
        return;
      }

      this.$tool.wx.getSign().then((res)=>{
        this.$tool.wx.registerShare(res,this.shareData, cb);
      }).catch((err)=>{
        console.log(err);
      })
    },
  },
};
</script>

<style lang="scss" >
@import "@/assets/scss/app.scss";
@import "./index.scss";
</style>
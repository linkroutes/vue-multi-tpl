<template>
  <div class="page-index">
    首页
    <p>{{loadingTxt}}</p>
    <br/>
    <br/>
    <img src="" class="avatar">
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'

  import Toast from 'vant/lib/toast';
  import 'vant/lib/toast/style';

  const pageUrl = location.href;
  let _title = document.title;
  let _desc = "自定义描述"
  let _pureLink = pageUrl.split('?')[0]
  
  export default {
    name:'pageIndex',
    data(){
      return {
        root:( pageUrl.indexOf('t-csbj')>-1 || pageUrl.indexOf('thinkerchan')>-1 || pageUrl.indexOf(':808')> - 1 ) ? 'https://t-csbj.linkroutes.com/api/' : 'https://csbj.linkroutes.com/api/',
        auth:'wx/authorize',
        signature:'wx/signature',
        userInfo:'user/info',
        testMode:false,
        isWeixin: navigator.userAgent.toLowerCase().indexOf('micromessenger')>-1,
        shareData:{ // 分享数据
          title: _title,
          desc: _desc,
          link: _pureLink,
          imgUrl: 'https://www1.pcbaby.com.cn/test/gz/202101271000/img/cover.jpg',
          success: (data)=> {
            console.log('success',data);
            // window._czc &&  window._czc.push(["_trackEvent", "shareSuccess", "微信分享成功"]);
          },
          cancel: (data)=>{
            console.log('cancel:',data);
            // window._czc &&  window._czc.push(["_trackEvent", "shareFailed", "微信分享取消"]);
          }
        },
        openid:'',
        token:'',

        loadingTxt:0,
      }
    },
    created(){
      this.$tool.preload({
        list:[
          {src:require("../images/hi.png")},
        ],
        progress:(percent)=>{
          this.loadingTxt = percent;
        },
        success:()=>{
          Toast('加载完毕!')
        },
      })
    },
    methods:{
      
    }
  }
</script>

<style lang="scss" >
  @import '@/assets/scss/app.scss';
  .page-index{
    .avatar{
      width: 2rem;
      height: 2rem;
      @include gPlaceholder();
      margin: 0 auto;
    }
  }
</style>
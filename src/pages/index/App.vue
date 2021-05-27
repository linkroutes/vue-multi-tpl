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

  export default {
    name:'pageIndex',
    data(){
      return {
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
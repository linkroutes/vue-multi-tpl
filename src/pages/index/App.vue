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


  export default {
    name:'pageIndex',
    data(){
      return {
        loadingTxt:0,
      }
    },
    created(){
      this.$tool.preload.init({
        list:[
          {src:require("../images/hi.png")},
        ],
        progress:(percent)=>{
          this.loadingTxt = percent;
        },
        success:()=>{
          this.$toast('加载完毕!')
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
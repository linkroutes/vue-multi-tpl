<template>
  <div class="page-index">
    首页
    <p>{{loadingTxt}}</p>
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
      this.preload(()=>{
        Toast('加载完毕!')
      })
    },
    methods:{
      preload(cb){
        let list=[
          {src:require("../images/hi.png")},
        ]

        const loader = new createjs.LoadQueue(false);
        loader.loadManifest(list);
        loader.on("progress",(p)=>{
            let percent = parseInt(p.progress*100);
            this.loadingTxt = percent;
        });

        loader.on("complete",()=>{
          cb && cb()
        });
      },
    }
  }
</script>

<style lang="scss" >

</style>
<!-- musicBg -->
<template>
  <div class="music-bg" :class="{'hidden':!visible}">

    <div class="audio-wrap" :class="{'audio-wrap-active':isPlaying}" @click="toggle">
      <div v-show="isPlaying" class="musice-icon"></div>
    </div>

    <div class="audio-box">
      <!-- 点击音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz/202101271000/audio/click.mp3" ref="clickMp3" preload="auto"></audio>
      <!-- 风音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/wind.mp3" ref="windMp3" preload="auto"></audio>
      <!-- 穿梭音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/shuttle2.mp3" ref="shuttleMp3" preload="auto"></audio>
      <!-- 电梯音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/elevator2.mp3" ref="elevatorMp3" preload="auto"></audio>
      <!-- 鼠标音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/mouse.mp3" ref="mouseMp3" preload="auto"></audio>
      <!-- 风吹树音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/wind-tree.mp3" ref="windTreeMp3" preload="auto"></audio>
      <!-- 开灯 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz/20220518/gkh/audiokl/light.mp3" ref="lightMp3" preload="auto"></audio>
      <!-- 环境声音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/environ2.mp3" ref="environMp3" preload="auto" loop="true"></audio>
      <!-- 窗帘声音效 -->
      <audio src="https://www1.pcbaby.com.cn/test/gz20220815/dl/zgjj/mp3/curtain.mp3" ref="curtainMp3" preload="auto"></audio>
    </div>
  </div>
</template>
<script >

export default {
    data() {
      return{
        isPlaying:false,
        bgMp3:'https://www1.pcbaby.com.cn/test/gz/202209211130/audio/bgbgm.mp3?v=20220921',
        isIos:!/(Android)/i.test(navigator.userAgent),
        soundsArr:[
          'clickMp3',
          'windMp3',
          'shuttleMp3',
          'elevatorMp3',
          'mouseMp3',
          'windTreeMp3',
          'lightMp3',
          'environMp3',
          'curtainMp3'
        ],
      }
    },
    props:{
      visible:{
        type:Boolean,
        default:true,
      },
      autoPlay:{
        type:Boolean,
        default:true,
      }
    },
    mounted() {
      this.bgmInstance = new this.$tool.bgm({
        url:this.bgMp3,
        autoPlay:this.autoPlay,
      }, (isPlaying)=>{
        this.isPlaying = isPlaying
      });
    },
    methods:{
      toggle(){
        this.bgmInstance.toggleBGM((isPlaying)=>{
          this.isPlaying = isPlaying;
        });
      },
      preloadSounds(){
        this.soundsArr.map((item,index)=>{
          let curMp3 = this.$refs[item];
          curMp3.load();
          curMp3.play();
          curMp3.pause();
        })
      },
      playSound(item){
        let curMp3 = this.$refs[item];
        curMp3.load();
        curMp3.play();
      },
      pauseSound(item){
        this.$refs[item].pause();
      }
    }
  };
</script>
<style lang='scss'>
.music-bg{
  width: 0.6rem;
  height: 0.6rem;
  position: fixed;
  top: 0.2rem;
  right: 0.2rem;
  z-index: 50;

  &.hidden{
    width: 0rem;
    height:0rem;
  }
  .audio-wrap{
    width: 100%;
    height: 100%;
    display: block;
    @include gSetBg('data:image/png;base64,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');
  }
  .audio-wrap-active{
    animation: audioRotate 10s infinite linear;
    display: block;
    @include gSetBg('data:image/png;base64,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');
    .musice-icon {
      display: block;
      width: 100%;
      height: 100%;
      @include gSetBg('~@/images/bgm-active.gif')
    }
  }

  .audio-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -10;
    audio{
      opacity: 0;
    }
  }
}
@keyframes audioRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

@-webkit-keyframes audioRotate {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(359deg);
  }
}
</style>
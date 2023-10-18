export default function (config,cb) {
  this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  this.sourceNode = null;
  this.buffer = null;
  this.isPlayingBGM = false;
  this.toggleBGM = function (callback) {
    if (typeof this.sourceNode == 'object' && this.sourceNode != null) {
      if (this.isPlayingBGM) {
        this.sourceNode.stop();
        this.isPlayingBGM = false;
        callback && callback(this.isPlayingBGM)
      } else this._playSourceNode(callback);
    }
  }
  this._playSourceNode = function (callback) {

    const audioContext = this.audioContext;
    audioContext.resume();
    const _sourceNode = audioContext.createBufferSource();
    _sourceNode.buffer = this.buffer;
    _sourceNode.loop = true;
    _sourceNode.connect(audioContext.destination);
    _sourceNode.start(0);
    this.sourceNode = _sourceNode;
    this.isPlayingBGM = true;
    callback && callback(this.isPlayingBGM)
  }

  let loadAndAutoPlay = (audioUrl) => {
    const audioContext = this.audioContext;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', audioUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = () => {
      if (xhr.status < 400 && xhr.status >= 200 && xhr.readyState === 4) {
        audioContext.decodeAudioData(xhr.response, buffer => {
          this.buffer = buffer;
          if(typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function"){
            WeixinJSBridge.invoke("getNetworkType", {}, () => this._playSourceNode(cb));
          }else{
            this._playSourceNode(cb);
          }
        });
      }
    }
    xhr.send();
  }

  if(config.autoPlay!==false) {
    loadAndAutoPlay(config.url);
    loadAndAutoPlay = null;
  }
}
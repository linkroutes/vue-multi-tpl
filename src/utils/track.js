export default {
  //埋点
  uploadPoint() {
    let body = document.querySelector('html');
    body.addEventListener('click', (e) => {
      this.dispatch(e)
    }, false)
  },
  dispatch(e) {
    const path = e.path || e.composedPath();
    if (path && path.length) {
      let target = this.getTarget(e);
      if (target) {
        let data = this._parse(target.dataset.points);
        data = data.split(',');
        console.log('埋点的数据为：', ['_trackEvent', ...data])
        window._czc && window._czc.push(['_trackEvent', ...data]);
      }
    }
  }
}
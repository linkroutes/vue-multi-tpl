export default {
  preload(config) {
    const loader = new createjs.LoadQueue(false);
    loader.loadManifest(config.list);
    loader.on("progress", (p) => {
      let percent = parseInt(p.progress * 100);
      config.progress && config.progress(percent)
    });

    loader.on("complete", () => {
      config.success && config.success()
    });
  },
  parseURL(url) {
    let a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.host,
      hostname: a.hostname,
      port: a.port,
      query: a.search,
      params: (() => {
        let ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  },
  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  //埋点
  uploadPoint() {
    let body = document.querySelector('html');
    body.addEventListener('click', (e) => {
      this.dispatch(e)
    }, false)
  },
  getTarget(e) {
    let target = null;
    let eleArray = Array.from(e.path || e.composedPath());
    for (let index = 0; index < eleArray.length; index++) {
      const element = eleArray[index];
      if (element.dataset && element.dataset.points) {
        target = element
        break;
      }
    }
    return target
  },
  _parse(data) {
    if ( data.indexOf("{")!=-1 && data.indexOf("}") !=-1) {
      return (new Function("return " + data))()
    } else {
      return data
    }
  },
  dispatch(e) {
    const path = e.path || e.composedPath();
    if (path && path.length) {
      let target = this.getTarget(e);
      if (target) {
        let data = this._parse(target.dataset.points);
        data = data.split(',');
        console.log('埋点的数据为：', ['_trackEvent', ...data])
        window._czc && window._czc.push(['_trackEvent',...data]);
      }
    }
  }
}
// 封装一些常用的业务逻辑
export default {
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
    if (data.indexOf("{") != -1 && data.indexOf("}") != -1) {
      return (new Function("return " + data))()
    } else {
      return data
    }
  },
}
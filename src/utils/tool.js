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
}
export default {
  init(config) {
    let _imgArr =config.list
    let loader = new PxLoader();
    for (let index = 0; index < _imgArr.length; index++) {
      const img = _imgArr[index].src;
      loader.addImage(img);
    }

    loader.addProgressListener((e)=>{
      let percent = ~~((e.completedCount / e.totalCount)*100)
      config.progress && config.progress(percent)
    })

    loader.addCompletionListener(()=>{
      config.success &&  config.success()
    });

    loader.start();
  }
}

window.onload = function() {
  const vm = new Vue({
    el: '#app',
    data() {
      return {
        imgUrls: [],
        backgroundImgUrls: [],
        isBatchDownload: false,
        batchDownloadUrls: [],
        imgWidth: 0,
        imgHeight: 0,
      };
    },
    methods: {
      sendMessage() {
        // 接收getImgUrl.js传递的数据
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {}, (response) => {
            // 重新组装所有img图片信息
            response.imgUrls.forEach( url => {
              this.imgNatureSize( this.imgUrls, url )
            } )
            // 重新组装所有背景图的信息
            response.backgroundImgUrls.forEach( url => {
              this.imgNatureSize( this.backgroundImgUrls, url )
            } )
          });
        });
      },
      imgNatureSize(container, src) {
        let image = new Image();
        image.src = src;
        image.onload = function() {
            container.push({
                src,
                width: image.width,
                height: image.height,
            });
        };
      },
      downLoad(url) {
        chrome.downloads.download({ url }, (downloadId) => {
          chrome.downloads.open(downloadId);
          chrome.downloads.showDefaultFolder()
          chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'image/logo.png',
            title: '下载成功',
            message: '图片下载地址：' + url,
          });
        })
      },
      onCheckUrl(url, event) {
        if(event.target.checked){
          this.batchDownloadUrls.push( url );
        } else {
          this.batchDownloadUrls = this.batchDownloadUrls.filter(item => item!=url);
        }
      },
      onBatchDownload() {
        this.batchDownloadUrls.forEach( url => this.downLoad(url));
        this.isBatchDownload = !this.isBatchDownload;
        this.batchDownloadUrls = [];
      },
    },
    ready() {
      this.sendMessage();
    }
  });

};



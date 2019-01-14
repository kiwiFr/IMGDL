(() => {
    // 获取所有 img
    const getUrl = function() {
        const urls = [];
        const imgs = document.querySelectorAll("img");
        imgs.forEach(img => {
            urls.push( img.src );
        });
        return urls;
    };
    // 获取所有背景图片
    const getBackgroundImage = function() {
        const allDoms = document.querySelectorAll('*');
        const allBgImageUrl = [];
        allDoms.forEach((element) => {
            let url = window.getComputedStyle(element)['background-image'].match(/url\("(.+)"\)$/);
            if (url && url[1]) {
                allBgImageUrl.push(url[1]);
            }
        })
        return allBgImageUrl;
    }
    // 向popup.js传递数据
    chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
        sendResponse({
            imgUrls: [...new Set( getUrl() )],
            backgroundImgUrls: [...new Set( getBackgroundImage() )],
        })
    });
})();



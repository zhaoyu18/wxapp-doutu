//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    displayurls: [],
    urls: [],
    keyword: "",
    loading: false,
    showActionsSheet: false,
    imageInAction: '',
    // 是否显示loading
    showLoading: false,

    // loading提示语
    loadingMessage: '正在保存..',

    // 是否显示toast
    showToast: false,

    // 提示消息
    toastMessage: '',
    displayMoreImage: false,
    showMoreButton: false,
  },
  //事件处理函数
  bindViewTap: function() {
    var that = this
    this.setData({
      loading: true,
    })
    wx.request({
      url: 'https://www.doutula.com/search?keyword=' + this.data.keyword,
      data: {},
      method: 'GET',
      success: function(res){
        //console.log(res.data)
        var html = res.data
        var reg = /(data-original=".*?:\/\/(.+?)")/g
        var urls = [], found

        while(found = reg.exec(html)) {
          console.log(found[2])
          urls.push("http://" + found[2])
          reg.lastIndex = found.index + 1
        }
        that.setData({
          urls: urls,
          displayurls: [urls[0]],
          loading: false,
          showMoreButton: true,
          displayMoreImage: false,
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        that.setData({
          loading: false,
        })
      }
    })
  },
  onLoad: function () {

  },

  bindInput: function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  imagetap: function() {
    wx.previewImage({
      current: this.data.urls[0],
      urls: this.data.urls
    })
  },

  hideActionSheet() {
    this.setData({ showActionsSheet: false, imageInAction: '' });
  },

  showActions(event) {
    var index = event.target.id
    this.setData({ showActionsSheet: true, imageInAction: this.data.urls[index]});
  },

  downloadImage() {
    this.showLoading('正在保存图片…');
    console.log('download_image_url', this.data.imageInAction);

    wx.downloadFile({
      url: this.data.imageInAction,
      type: 'image',
      success: (resp) => {
        wx.saveFile({
          tempFilePath: resp.tempFilePath,
          success: (resp) => {
            this.showToast('图片保存成功');
          },

          fail: (resp) => {
            console.log('fail', resp);
            this.hideLoading();
          },

          complete: (resp) => {
            console.log('complete', resp);
            this.hideLoading();
          },
        });
      },

      fail: (resp) => {
        console.log('fail', resp);
      },
    });

    this.setData({ showActionsSheet: false, imageInAction: '' });
  },

  // 显示loading提示
  showLoading(loadingMessage) {
    this.setData({ showLoading: true, loadingMessage });
  },

  // 隐藏loading提示
  hideLoading() {
    this.setData({ showLoading: false, loadingMessage: '' });
  },

  // 显示toast消息
  showToast(toastMessage) {
    this.setData({ showToast: true, toastMessage });
  },

  // 隐藏toast消息
  hideToast() {
    this.setData({ showToast: false, toastMessage: '' });
  },

  displayMoreImage() {
    console.log('display more image')
    if(this.data.displayMoreImage == true) {
      this.setData({
        displayurls: [this.data.urls[0]],
        displayMoreImage: false,
      })
    } else {
     this.setData({
        displayurls: this.data.urls,
        displayMoreImage: true,
        showMoreButton: false,
      })
    }
  },
})

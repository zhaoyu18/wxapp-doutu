//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    url: "",
    keyword: "",
  },
  //事件处理函数
  bindViewTap: function() {
    var that = this
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
          url: urls[0]
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
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
})

//index.js
//获取应用实例
var app = getApp();
var Bmob = require('../../utils/bmob.js')
Bmob.initialize("2a65ba7f76d377d0c9d7f6dca12eaf38", "d3bc995f5d19c76247876946b8cabce8");

var Article = Bmob.Object.extend("article");
var u = new Bmob.Query(Article);
// 查询所有数据


Page({
  data: {},
  onLoad(){
    var _this = this
    var cloudData = [];
    u.find({
      success(results) {
        // 循环处理查询到的数据
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          let res = {}
          res['id'] = object.id;
          res['title'] = object.get('title');
          res['imgSrc'] = object.get('imgSrc');
          res['description'] = object.get('description');
          res['article'] = object.get('article');
          res['tips'] = object.get('tips');
          res['createdAt'] = object.createdAt;
          res['updatedAt'] = object.updatedAt;
          if (object.get('type') == "1") {
            cloudData.push(res)
          }
        }

        _this.setData({
          data: cloudData,
        })

      },
      error(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })
  },
  hrefLink(e) {
    let data = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?id=' + data
    })
  }
})

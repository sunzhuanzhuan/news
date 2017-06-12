// pages/MsgList/MsgList.js
var Bmob = require('../../utils/bmob.js')
Bmob.initialize("2a65ba7f76d377d0c9d7f6dca12eaf38", "d3bc995f5d19c76247876946b8cabce8");

var startY=0;
var msg = Bmob.Object.extend("msg");
var query = new Bmob.Query(msg);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    list:[],
    openid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var newOpenid = wx.getStorageSync('openid')
    var queryData=[];
    var _this=this
    this.setData({
      openid: newOpenid
    })
    // 查询所有数据
    query.limit(10);
    query.find({
      success: function (results) {
        // 循环处理查询到的数据
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          let res = {};
          res['id'] = object.id;
          res['userPic'] = object.get('userPic');
          res['title'] = object.get('title');
          res['imgSrc'] = object.get('imgSrc');
          res['content'] = object.get('content');
          res['author'] = object.get('author');

          res['date'] = object.createdAt;
          if (object.get('like') == undefined || object.get('like').length == 0){
            res['like'] = [];
            res['likeImg'] = "../../images/like2.png";
          }else{
            res['like'] = object.get('like');
            for (let i = 0; i < res['like'].length; i++ ){
              if (newOpenid == object.get('like')[i]){
                res['likeImg'] = "../../images/like1.png";
              }else{
                res['likeImg'] = "../../images/like2.png";
              }
            }
          }
          if (object.get('msg') == undefined || object.get('msg').length == 0){
            res['msg'] = [];
          }else{
            res['msg'] = object.get('msg');
          }
          

          queryData.push(res);
        }
        _this.setData({
          list: queryData
        })
      },
      error: function (error) {

        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  //页面滑动效果
  pageMove(e){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })

    this.animation = animation

   let moveY=e.touches[0].clientY;
   let isY = moveY - startY
   if (isY>0){
     animation.bottom(20).step()
   }else{
     animation.bottom(-80).step()
   }
   this.setData({
     animationData: animation.export()
   })

  },
  //记录初始坐标
  pageStat(e){
    startY=e.touches[0].clientY
  },
  //点赞
  likeEvent(e){ 
    let index = e.currentTarget.dataset.index;
    let openid = this.data.openid;
    let likeArr = this.data.list[index].like;
    let list = this.data.list;

    let _this=this
    let subscript = likeArr.indexOf(openid)
    if (subscript >= 0 ){
      list[index].like.splice(subscript,1);
      likeArr.splice(subscript, 1)
      list[index].likeImg = "../../images/like2.png";
    }else{
      list[index].like.push(openid);
      list[index].likeImg = "../../images/like1.png";
    }
    query.get(this.data.list[index].id, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('like', likeArr);
        result.save();
        _this.setData({
          list: list
        })
      },
      error: function (object, error) {
        console.log("点赞失败")
      }
    });
  },
  articleEvent(e){
    let data = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../MsgArticle/MsgArticle?id=' + data
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
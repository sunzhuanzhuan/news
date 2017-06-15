// pages/MsgArticle/MsgArticle.js
var Bmob = require('../../utils/bmob.js')
Bmob.initialize("2a65ba7f76d377d0c9d7f6dca12eaf38", "d3bc995f5d19c76247876946b8cabce8");

var Diary = Bmob.Object.extend("msg");
var query = new Bmob.Query(Diary);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    openid:'',
    objectID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    let objectID = options.id;
    let newOpenid = wx.getStorageSync('openid');

    this.setData({
      openid: newOpenid,
      objectID: objectID
    })
  },
  onShow(){
    let res = {};
    let _this = this;
    let objectID = this.data.objectID;
    let newOpenid = this.data.openid;
    
    console.log(objectID)

    query.get(objectID, {
      success(results) {
        res['userPic'] = results.get('userPic');
        res['content'] = results.get('content');
        res['author'] = results.get('author');
        res['title'] = results.get('title');
        if ( results.get('imgSrc') == undefined || results.get('imgSrc') == 0){
          res['imgSrc'] = [];
        }else{
          res['imgSrc'] = results.get('imgSrc');
        }
        res['date'] = results.createdAt;
        if (results.get('msg') == undefined || results.get('msg').length <=0 ){
          res['msg'] = []
        }else{
          res['msg'] = results.get('msg');
          console.log(res['msg'])
          
          if (res['msg'].length == 0) {
            res['msg'][0]['likeImg'] = "../../images/like2.png";
          } else {
            for (var i = 0; i < res['msg'].length; i++) {
              if (res['msg'][i].like.indexOf(newOpenid) >= 0 ){
                res['msg'][i]['likeImg'] = "../../images/like1.png";
              }else{
                res['msg'][i]['likeImg'] = "../../images/like2.png";
              }
            }
          }
        }
        if (results.get('like') == undefined || results.get('like').length <= 0 ) {
          res['like'] = 0;
          _this.setData({
            data: res
          })
        }else{
          res['like'] = results.get('like');
          likeUserPic(res)
        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });

    function likeUserPic(res){
      let userPic = [];
      let Diary = Bmob.Object.extend("_User");
      let query = new Bmob.Query(Diary);
      for (let i = 0; i < res.like.length; i++){
        query.equalTo("openid", res.like[i]);
        query.find({
          success: function (results) {
            for (let i = 0; i < results.length; i++) {
              let object = results[i];
              userPic.push(object.get('userPic'));
            }
            res['likeUser'] = userPic;
            res['like'] = userPic.length;
            _this.setData({
              data: res
            })
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      }
    }
  },
  likeEvent(e){
    let index = e.currentTarget.dataset.index;
    let openid = this.data.openid;
    let likeArr = this.data.data.msg[index].like;
    let list = this.data.data;

    let _this = this
    let subscript = likeArr.indexOf(openid)
    if (subscript >= 0) {
      list['msg'][index].like.splice(subscript, 1);
      likeArr.splice(subscript, 1)
      list['msg'][index].likeImg = "../../images/like2.png";
      wx.showToast({
        title: '点赞取消',
        icon: 'success',
        duration: 1000
      })
    } else {
      list['msg'][index].like.push(openid);
      list['msg'][index].likeImg = "../../images/like1.png";
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 1000
      })
    }

    query.get(this.data.objectID, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('msg', list.msg);
        result.save();
        _this.setData({
          data: list
        })
      },
      error: function (object, error) {
        console.log("点赞失败")
      }
    });
  },
  replyEvent(e) {
    let data = this.data.objectID;
    let index = e.currentTarget.dataset.index
    let replayName = this.data.data.msg[index].nickName

    wx.navigateTo({
      url: '../replyMsg/replyMsg?id=' + data + '&replayName=' + replayName
    })
  }
})
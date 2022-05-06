// 导入express
const express = require( 'express' );
// 创建路由对象
const router = express.Router();


//引入用户信息的处理含数模块
const userinfo_handler = require( '../router_handler/userinfo.js' );

//导入验证数据合法性的中间件
const expressJoi = require( '@escook/express-joi' );

//导入更新用户信息需要的验证规则对象
const { update_userinfo_schema } = require( '../schema/user' );

//导入更新密码需要的验证规则对象
const { update_password_schema } = require( '../schema/user' );

//导入更新头像的验证规则对象
const { update_avatar_schema } = require( '../schema/user' );

//获取用户基本信息
router.get( '/userinfo', userinfo_handler.getUserInfo );

//更新用户基本信息的路由
router.post( '/userinfo',expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo );


//更新密码的路由
router.post( '/updatepwd', expressJoi(update_password_schema),userinfo_handler.updatePassword );


//更新用户头像的路由
router.post( '/update/avatar', expressJoi(update_avatar_schema),userinfo_handler.updateAvatar );


// 向外共享路由
module.exports = router;
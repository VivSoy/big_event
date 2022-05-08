// 导入express
const express = require( 'express' );

// 创建路由对象
const router = express.Router();

//导入验证数据的中间件
const expressJoi = require( '@escook/express-joi' );

// 导入文章分类列表数据的处理函数
const artcate_hander = require( '../router_handler/artcate' );

//导入文章分类的验证模块
const{add_cate_schema} = require('../schema/artcate')

// 导入删除文章分类的验证模块
const{delete_cate_schema} = require('../schema/artcate')

// 导入根据id获取文章分类的验证模块
const { get_cate_schema } = require( '../schema/artcate' );


// 导入根据id更新文章分类数据的验证模块
const { update_cate_schema } = require( '../schema/artcate' );

// 获取文章分类的列表数据的路由

router.get( '/cates', artcate_hander.getArticleCates );


// 根据id获取文章分类的路由
router.get( '/cates/:id',expressJoi( get_cate_schema ) ,artcate_hander.getArtCateById );

//新增文章分类的路由
router.post( '/addcates', expressJoi(add_cate_schema) ,artcate_hander.addArticleCates );


//删除文章分类的路由
router.post( '/deletecate/:id',expressJoi(delete_cate_schema), artcate_hander.deleteCateById );

// 根据id值更新文章分类
router.post('/updatecate',expressJoi(update_cate_schema),artcate_hander.updateCateById)










// 共享路由
module.exports = router;


// 导入express
const express = require( 'express' );

// 创建路由对象
const router = express.Router(); 

//导入解析formdata格式表单数据的包
const multer = require( 'multer' );

// 导入路径处理模块   node.js 内置模块
const path = require( 'path' );

// 引入验证数据的中间件
const expressJoi = require( '@escook/express-joi' );

//创建multer的实例对比，通过dest属性指定文件的存放路径
const upload =multer({dest:path.join(__dirname,'../upload')})


// 引入文章的路由处理函数
const article_handler = require( '../router_handler/article' );

//引入增加文章的验证模块
const { add_article_schema } = require( '../schema/article' );


// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post( '/add', upload.single('cover_img'),expressJoi(add_article_schema),article_handler.addArticle );



// 向外共享路由
module.exports = router;
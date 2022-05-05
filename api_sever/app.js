// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入表单验证模块
const joi = require( '@hapi/joi' );

//导入cors中间件
const cors = require( 'cors' );
//将cors注册为全局中间件
app.use( cors() );


// 配置解析表单数据中间件,只能解析application/x-www-form-urlencoded格式数据
app.use( express.urlencoded( { extended: false } ) );


//手动封装res.cc()函数，来向客户端响应处理失败的结果
// 响应数据的中间件
app.use( ( req, res, next ) => {
    // status=0为成功，status=1为失败；默认将status的值设为1，方便处理失败的情况
    res.cc = function ( err, status = 1 ) {
        res.send( {
            // 状态
            status,
            //状态描述：判断err是错误对象还是字符串
            message:err instanceof Error? err.message:err
        })
    }
    next();
})

// 配置解析token中间件
// 导入秘钥文件
const config = require( './config' );
//解析token中间件
const expressJWT = require( 'express-jwt' );
//使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use( expressJWT( { secret: config.jwtSecretKey } ).unless( { path: [ /^\/api\// ] } ) );


// 定义错误级别的中间件
app.use( ( err, req, res, next ) => {
    // 数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
  
    // 捕获身份认证失败的错误
    if ( err.name === 'UnauthorizedError' ) return res.cc( '身份认证失败' );

    // 未知错误
    res.cc( err );
})


// 导入和使用用户路由模块
const userRouter = require( './router/user' );
app.use( '/api', userRouter );


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})

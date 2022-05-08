//目的：为了保证 路由模块 的纯粹性，所有的 路由处理函数，必须抽离到对应的 路由处理函数模块 中

/* 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用 */

//导入数据库模块
const db = require( '../db/index' );

//导入bcryptjs密码加密模块
const bcrypt = require( 'bcryptjs' );

//导入jsonwebtoken包
const jwt = require( 'jsonwebtoken' );
//导入秘钥文件
const config = require( '../config' );

// 注册用户的处理函数
exports.regUser = ( req, res ) => {
    // 接受表单数据
    const userinfo = req.body;

    //判断数据是否合法
    // if ( !userinfo.username || !userinfo.password ) {
    // //    return res.send({status:1,message:'用户名或密码不能为空！'})
    //     return res.cc( '用户名或密码不能为空！' );
    // }

    // 检测用户名是否被占用
 
    // 定义sql语句
    const sql = 'select * from ev_users where username=?';
    //执行sql语句并根据结果判断用户名是否被占用
    db.query( sql, [ userinfo.username ], ( err, results ) => {
        // 执行sql语句失败
        if ( err ) {
            return res.cc( err );
        }
        // 用户名被占用
        if ( results.length > 0 ) {
            // return res.send( {
            //     status: 1,
            //     message: '用户名被占用'
            // } )
            return res.cc( '用户名被占用' );
        }
    } );
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync( userinfo.password, 10 );

    // 定义插入新用户的语句
    const inserSql = 'insert into ev_users set ?';
    db.query( inserSql, { username: userinfo.username, password: userinfo.password }, ( err, results ) => {
        // 执行inserSql语句失败
        if ( err ) return res.cc( err );
        if ( results.affectedRows !== 1 ) {
            // return res.send( {
            //     status:1,
            //     message:'注册用户失败，请稍后重试'
            // })
            return res.cc( '注册用户失败，请稍后重试' );
        }
        res.send( {
            status:0,
            message:'注册成功！'
        })
    })
}


//登录的处理函数
exports.login = ( req, res ) => {
    // 接受表单数据
    const userinfo = req.body;
    // 定义sql语句
    const sql = 'select * from ev_users where username=?';
    // 执行SQL语句，查询用户数据
    db.query( sql, userinfo.username, ( err, results ) => {
        // 执行sql语句失败
        if ( err ) {
            return res.cc( err );
        }
        // 查询数据库中数据不等于1
        if ( results.length !== 1 ) {
            return res.cc( '登录失败' );
        }
        // 用户名查询成功，验证登录密码
        // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        const compareResult = bcrypt.compareSync( userinfo.password, results[ 0 ].password );
        // 如果比较的结果为false，则输出密码错误
        if ( !compareResult ) {
           return res.cc( '密码错误' );     //加入return，避免服务器多次响应报错
        }
        // 生成JWT的token字符串
        //利用扩展运算符，剔除密码和头像的值
        const user = { ...results[ 0 ], password: '', user_pic: '' };
        //对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign( user, config.jwtSecretKey, {
            expiresIn:'10h' // token有效期10小时
        })
        res.send( {
            status:0,
            message: '登录成功',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token:'Bearer' +" "+ tokenStr,
        })
    })

}

// 导入数据库
const db = require( '../db/index' );

// 导入bcryptjs验证密码
const bcrypt = require( 'bcryptjs' );

//定义sql语句
// 根据用户的id，查询用户的基本信息
// 注：为防止用户密码泄露，需排除password
const sql = 'select id, username, nickname, user_pic from ev_users where id=?';

// 获取用户基本信息的处理函数
exports.getUserInfo = ( req, res ) => {
  
    //执行sql语句
    // 只要身份认证成功，express-jwt中间件会挂载一个新的属性req.user(固定写法)
    db.query( sql, req.user.id, ( err, results ) => {
        // 执行语句失败
        if ( err ) return res.cc( err );

        // 执行语句成功，但查询数据条数不为1
        if ( results.length !== 1 ) {
            return res.cc( '获取用户信息失败' );
        }

        // 将用户信息响应给客户端
        res.send( {
            status:0,
            message:'获取用户信息成功',
            data: results[ 0 ]
        })

    })
}


// 实现更新用户基本信息的功能
//  定义sql语句
const sqlStr = 'update ev_users set? where id=?';

// 更新用户基本信息的处理函数
exports.updateUserInfo = ( req, res ) => {
    // req.body指的更新的数据，req.user.id指的该登录用户的id
    db.query( sqlStr, [ req.body, req.user.id ], ( err, results ) => {
        
        //执行sql语句失败
        if ( err ) return res.cc( err );

        //执行sql语句成功，但影响行数不为1
        if ( results.affectedRows !== 1 ) {
            return res.cc( '修改用户基本信息失败' );
        }

        //修改用户信息成功
        return res.cc( '修改用户基本信息成功', 0 );
    })
}


//  实现密码更新的功能
// 定义查询用户数据的sql语句
    const sqldate = 'select * from ev_users where id=?';
// 定义更新用户密码的sql语句
const sqlpwd = 'update ev_users set password=? where id=?';

// 更新密码的处理函数
exports.updatePassword = ( req, res ) => {
    
    //首先查询用户是否存在
    db.query( sqldate, req.user.id, ( err, results ) => {
        // 执行sql语句失败
        if ( err ) return res.cc( err );

        // 检查指定id的用户是否存在
        if ( results.length !== 1 ) {
            return res.cc( '用户不存在' );
        }

        // 判断提交的新密码是否符合规则
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if ( !compareResult ) return res.cc( '原密码错误！' );
        

        //对新密码进行bcrypt加密处理
        const newPwd = bcrypt.hashSync( req.body.newPwd, 10 );

        // 根据用户id更新密码
        db.query( sqlpwd, [ newPwd, req.user.id ], ( err, results ) => {
            // sql语句执行失败
            if ( err ) return res.cc( err );

            //sql语句执行成功，但影响行数不为1
            if ( results.affectedRows !== 1 ) {
                return res.cc( '更新密码失败' );
            }

            // 更新密码成功
            res.cc( '更新密码成功！', 0 );
        })

    })
}


//实现更新用户头像的功能
exports.updateAvatar = ( req, res ) => {
    // 定义更新头像的sql语句
    const sql = 'update ev_users set user_pic=? where id=?';

    // 调用语句，更新用户头像
    db.query( sql, [ req.body.avatar, req.user.id ], ( err, results ) => {
        // 执行sql语句失败
        if ( err ) return res.cc( err );

        // 执行SQL语句成功，但影响函数不等于1
        if ( results.affectedRows !== 1 ) {
            return res.cc( '更新头像失败' );
        }

        // 更新用户头像成功
        return res.cc( '更新用户头像成功',0 );
    })
}

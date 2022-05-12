// 导入数据库
const db = require( '../db/index' );




// 获取文章分类列表数据的处理函数
exports.getArticleCates = ( req, res ) => {
    // 定义sql语句
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc';
    //执行SQL语句
    db.query( sql, ( err, results ) => {
        if ( err ) return res.cc( err );
        res.send( {
            status: 0,
            message: '获取文章分类列表成功',
            data: results,
        } )
    } )
}


// 根据ID获取文章分类的处理函数
exports.getArtCateById = ( req, res ) => {
    // 根据id获取信息的sql语句
    const sql = 'select * from ev_article_cate where id=?'

    // 执行SQL语句
    db.query( sql, req.params.id, ( err, results ) => {
        // 执行SQL语句失败
        if ( err ) return res.cc( err );
        //执行语句成功，但没有查询到数据
        if ( results.length !== 1 ) return res.cc( '获取文章分类数据失败' );
        res.send( {
            status: 0,
            message: '获取文章分类数据成功',
            data: results[ 0 ]
        } )
    } )
}

//新增的文章分类的路由处理函数
exports.addArticleCates = ( req, res ) => {
    // 定义sql语句
    const sql = 'select * from ev_article_cate where name=? or alias=?'

    // 执行sql语句
    db.query( sql, [ req.body.name, req.body.alias ], ( err, results ) => {
        if ( err ) return res.cc( err );

        // 对提交的分类进行查重
        // 分类名称和分类别名都被占用
        if ( results.length === 2 ) return res.cc( '分类名称和别名分别被占用，请更换后再试' );
        if ( results.length === 1 && results[ 0 ].name === req.body.name && results[ 0 ].alias === req.body.alias ) return res.cc( '分类名称和别名被占用，请更换后再试' );
        //分类名称或分类别名被占用
        if ( results.length === 1 && results[ 0 ].name === req.body.name ) return res.cc( '分类名称被占用，请更换再试' )
        if ( results.length === 1 && results[ 0 ].alias === req.body.alias ) return res.cc( '分类别名被占用，请更换再试' )

        // 新增文章分类
        // 定义分类sql语句
        const sqlStr = 'insert into ev_article_cate set ?';

        // 执行sql语句
        db.query( sqlStr, req.body, ( err, results ) => {
            // 执行语句失败
            if ( err ) return res.cc( err )

            // 执行语句成功，但影响行数不为1
            if ( results.affectedRows !== 1 ) return res.cc( '新增文章类别失败！' )

            // 新增文章类别成功
            res.cc( '新增文章分类成功！', 0 );
        } )
    } )
}


// 删除文章分类的处理函数
exports.deleteCateById = ( req, res ) => {
    // 定义sql语句
    const sql = 'update ev_article_cate set is_delete=1 where id=?';

    // 执行SQL语句
    db.query( sql, req.params.id, ( err, results ) => {
        // 执行sql语句失败
        if ( err ) return res.cc( err );

        // 执行SQL语句成功，但影响行数不为1
        if ( results.affectedRows !== 1 ) {
            return res.cc( '删除文章分类失败！' );
        }
        res.cc( '删除文章分类成功', 0)

    } )
}


// 根据id值更新文章分类
exports.updateCateById = ( req, res ) => {
    // 定义sql语句  <>不等号
    const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
    //进行查重
    db.query( sql, [ req.body.id, req.body.name, req.body.alias ], ( err, results ) => {
        // 执行 SQL 语句失败
        if ( err ) return res.cc( err )

        // 分类名称 和 分类别名 都被占用
        if ( results.length === 2 ) return res.cc( '分类名称与别名被占用，请更换后重试！' )
        if ( results.length === 1 && results[ 0 ].name === req.body.name && results[ 0 ].alias === req.body.alias ) return res.cc( '分类名称与别名被占用，请更换后重试！' )
        // 分类名称 或 分类别名 被占用
        if ( results.length === 1 && results[ 0 ].name === req.body.name ) return res.cc( '分类名称被占用，请更换后重试！' )
        if ( results.length === 1 && results[ 0 ].alias === req.body.alias ) return res.cc( '分类别名被占用，请更换后重试！' )
    } )

    // 定义更新分类的sql语句
    const sqlStr = 'update ev_article_cate set? where id=?';
    //  执行分类的更新
    db.query( sqlStr, [ req.body, req.body.id ], ( err, results ) => {
        // 执行SQL语句失败
        if ( err ) return res.cc( err );
        // 执行SQL语句成功，但影响的行数不为1
        if ( results.affectedRows !== 1 ) {
            return res.cc( '更新分类失败！' );
        }
        res.cc( '更新文章分类成功', 0 );
    } )
}
    // 导入数据库
    const db = require( '../db/index' );
    //导入路径处理模块
    const path = require( 'path' );

    // 发布新文章的处理函数
    exports.addArticle = ( req, res ) => {
        // 手动判断是否上传了文章封面
        if ( !req.file || req.file.fieldname !== 'cover_img' ) return res.cc( '文章封面是必选参数！' )

        // 整理要插入数据库的文章信息对象
        const articleInfo = {
            // 标题、内容、状态、所属的分类的id
            ...req.body,
            //文章封面在服务器端存放的路径
            cover_img: path.join( '../upload/', req.file.filename ),
            // 文章发布时间
            pub_date: new Date(),
            // 文章作者的id
            author_id: req.user.id
        }

        // 定义发布文章的SQL语句
        const sql = 'insert  into ev_article set ?';

        // 执行SQL语句
        db.query( sql, articleInfo, ( err, results ) => {
            // 执行SQL失败
            if ( err ) return res.cc( err )
            //执行SQL语句成功，但被影响的行数不为1
            if ( results.affectedRows !== 1 ) {
                return res.cc( '发布文章失败' );
            }
            res.cc( '发布文章成功', 0 );
        } )
    }

    // 查询文章列表的处理函数
    exports.getArticleList = ( req, res ) => {
        //定义SQL语句
        const sql = 'select * from ev_article where is_delete=0 order by id asc'
        // 执行SQL语句
        db.query( sql, ( err, results ) => {
            // 执行SQL语句失败
            if ( err ) return res.cc( err );
            //执行SQL语句成功
            res.send( {
                status: 0,
                message: '获取文章列表成功',
                data: results
            } )
        } )
    }

    // 根据id删除文章数据
    exports.deleteArticleById = ( req, res ) => {
        // 定义sql语句
        const sql = 'update ev_article set is_delete=1 where id=?';
        // 执行SQL语句
        db.query( sql, req.params.id, ( err, results ) => {
            // 执行SQL语句失败
            if ( err ) return res.cc( err );
            // 执行SQL语句成功，但影响行数不为1
            if ( results.affectedRows !== 1 ) {
                return res.cc( '删除文章失败' );
            }
            // 删除文章成功
            res.cc( '删除文章成功', 0 );
        } )
    }

    //根据id获取文章数据
    exports.getArticleById = ( req, res ) => {
        // 定义sql语句
        const sql = 'select * from ev_article where id=?';

        // 执行SQL语句
        db.query( sql, req.params.id, ( err, results ) => {
            // 执行SQL语句失败
            if ( err ) return res.cc( err );
            // 执行SQL语句成功，但未查询到任何数据
            if ( results.length !== 1 ) return res.cc( '获取文章数据失败' );

            // 查询成功
            res.send( {
                status: 0,
                message: '获取文章数据成功',
                data: results[ 0 ]
            } )

        } )
    }

    // 根据id更新文章信息
    exports.updateArticleById = ( req, res ) => {

           // 手动判断是否上传了文章封面
           if ( !req.file || req.file.fieldname !== 'cover_img' ) return res.cc( '文章封面是必选参数！' )
        // 整理需要更新的数据
        const newArticleInfo = {
            title: req.body.title,
            cate_id:req.body.cate_id,
            content: req.body.content,
            state:req.body.state,
            //文章封面在服务器端存放的路径
            cover_img: path.join( '../upload/', req.file.filename ),
            // 文章发布时间
            pub_date: new Date(),
        }
        // 定义sql语句
        const sql = 'update ev_article set ? where id=?';
        //执行SQL语句
        db.query( sql, [ newArticleInfo, req.body.id ], ( err, results ) => {
            //执行sql语句失败
            if ( err ) return res.cc( err );
            // 执行sql语句成功，但影响行数不为1
            if ( results.affectedRows !== 1 ) {
                return res.cc('更新文章信息失败')
            }
            res.cc( '更新文章信息成功', 0 );
        })
    }
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
        cover_img:path.join( '../upload/', req.file.filename ),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的id
        author_id :req.user.id
    }

    // 定义发布文章的SQL语句
    const sql = 'insert  into ev_article set ?';

    // 执行SQL语句
    db.query( sql, articleInfo, ( err, results ) => {
        // 执行SQL失败
        if(err) return res.cc(err)
        //执行SQL语句成功，但被影响的行数不为1
        if ( results.affectedRows !== 1 ) {
            return res.cc( '发布文章失败' );
        }
        res.cc( '发布文章成功', 0 );
    })
}
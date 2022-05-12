//实现思路：通过 express-joi 自动验证 req.body 中的文本数据；通过 if 判断手动验证 req.file 中的文件数据

// 导入验证规则模块
const joi = require( 'joi' );

// 定义标题、分类id、内容、发布状态的验证规则
const title = joi.string().required();
const cate_id = joi.number().integer().min( 1 ).required();
const content = joi.string().required().allow( '' );
const state = joi.string().valid( '已发布', '草稿' ).required();

exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

// 定义id的验证规则
const id = joi.number().integer().min( 1 ).required();

exports.delete_article_schema = {
    params: {
        id
    }
}

exports.get_article_schema = {
    params: {
        id
    }
}

exports.update_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state
    }
}
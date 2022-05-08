// 文章分类数据验证模块

//导入验证规则模块
const joi = require( 'joi' );

//定义 分类名称和分类类别的校验规则 
const name = joi.string().required();
const alias = joi.string().alphanum().required();

//校验规则对象 -添加分类
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}


// 定义id的校验规则
const id = joi.number().integer().min( 1 ).required();

//校验规则对象  -删除分类
exports.delete_cate_schema = {
    params: {       //params包含映射到指定的路线“参数”属性的对象 例如：，如果你有route/user/：name，那么“name”属性可作为req.params.name。
        id
    }
}


//校验规则对象 根据ID获取分类
exports.get_cate_schema = {
    params: {
        id
    }
}

//校验规则对象 根据id更新分类
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}
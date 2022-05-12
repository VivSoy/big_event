$( function () {

    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    //获取文章列表
    function initArtCateList () {
        $.ajax( {
            method:'GET',
            url:'/my/article/cates',
            success: function ( res ) {
                // 通过模板引擎得到字符串
                var htmlStr = template( 'tpl-table', res );
                $( 'tbody' ).html( htmlStr );

                // 不使用模板引擎渲染文章分类
                // res.data.forEach( item => {
                //     $('tbody').prepend('<tr><td>'+ item.name+'</td><td>'+item.alias +'</td><td><button type="button" class="layui-btn layui-btn-xs">编辑</button><button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button></td></tr>')
                // });
                // res.data.forEach( item => {
                //     $('tbody').prepend(` <tr>
                //     <td>item.name</td>
                //     <td>item.alias</td>
                //     <td>
                //         <button type="button" class="layui-btn layui-btn-xs">编辑</button>
                //         <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
                //     </td>
                // </tr>`)
                // });
            }

        })
    }

    // 添加文章分类
    // 为添加类别按钮绑定事件
    var indexAdd = null;
    $( '#btnAddCate' ).on( 'click', function () {
        indexAdd = layer.open( {
            type:1,
            area:['500px', '250px'],
            title:'添加文章分类',
            content: $( '#dialog-add' ).html()
        })
    } )
    
    // 添加的表单是通过script动态生成的，通过代理的方式，为form-add表单绑定submit事件
    $( 'body' ).on( 'submit', '#form-add', function ( e ) {
        e.preventDefault();
        $.ajax( {
            method:"POST",
            url:'/my/article/addcates',
            data: $( this ).serialize(),
            success: function ( res ) {
                if ( res.status !== 0 ) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功')
                layer.close( indexAdd );
            }
        })
    })


    // 修改文章分类
    var  indexEdit = null;
    // 通过代理的形式，为btn-edit按钮绑定点击事件
    $( 'tbody' ).on( 'click', '.btn-edit', function () {
       
        // 弹出编辑层
        indexEdit = layer.open( {
            type: 1,
            area: [ '500px', '250px' ],
            title: '修改文章分类',
            content: $( '#dialog-edit' ).html()
        })

        var id = $( this ).attr( 'data-id' );
        // 发起请求获取对应分类
        $.ajax( {
            method:'GET',
            url:'/my/article/cates/' + id,
            success: function ( res ) {
                form.val('form-edit',res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定提交事件
    $( 'body' ).on( 'submit', '#form-edit', function ( e ) {
        e.preventDefault();
        $.ajax( {
            method:'POST',
            url:'/my/article/updatecate',
            data: $( this ).serialize(),
            success: function ( res ) {
                if ( res.status !== 0 ) return layer.msg( '更新分类失败！' );
                initArtCateList();
                layer.msg( '更新分类成功！' );
                layer.close( indexEdit );
            }
        })
    })


    // 删除文章分类
    // 通过代理方式为删除按钮绑定点击事件
    $( 'tbody' ).on( 'click', '.btn-delete', function () {
        let id = $( this ).attr( 'data-id' );

        // 提示用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
        // 发送请求，删除该数据
            $.ajax( {
                method:'POST',
                url:'/my/article/deletecate/' + id,
                success: function (res) {
                    if ( res.status !== 0 ) {
                        return layer.msg( '删除文章失败' )
                    }
                    layer.msg( '删除分类成功' );
                    layer.close(index);
                    initArtCateList();
                }
            })
          });
    })
})
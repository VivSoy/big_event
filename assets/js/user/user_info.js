$( function () {

    /* 定义layui正的属性 */
    var form = layui.form;
    var layer = layui.layer;

    // 表单验证规则
    form.verify( {
        nickname: function ( value ) {
            if ( value.length > 6 ) {
                return '用户昵称必须在1~6个字符之间';
            }
        }
    } )

    initUserInfo();


    // 初始化用户基本信息函数
    function initUserInfo() {
        $.ajax( {
            method: 'GET',
            url: '/my/userinfo',
            success: function ( res ) {
                if ( res.status !== 0 ) {
                    return layer.msg( '获取用户信息失败' )
                } else {
                    //调用form.val()快速赋值
                    form.val( 'formUserInfo', res.data );
                }
            }
        } )
    }


    // 重置表单的数据
    $( '#btnReset' ).on( 'click', function ( e ) {
        //重置按钮默认清空表单，先阻止默认行为
        e.preventDefault();

        // 再次调用initUserInfo方法
        initUserInfo();

    } )

    // 监听表单的提交事件
    $( ".layui-form" ).on( 'submit', function ( e ) {
        // 阻止表单默认提交行为
        e.preventDefault();

        //发起post请求，更新表单事件
        $.ajax( {
            method: "POST",
            url: '/my/userinfo',
            data: $( this ).serialize(),
            success: function ( res ) {
                if ( res.status !== 0 ) {
                    return layer.msg( '更新用户失败' )
                }
                layer.msg( '更新用户信息成功' )
                // 调用父函数重新渲染昵称和头像 当前处于iframe区域，它的窗口父元素就是indx
                window.parent.getUserInfo();
            }
        } )
    } )
} )
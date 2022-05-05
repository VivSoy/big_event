
$( function () {
    // 点击注册账号的链接
    $( "#link_reg" ).on( 'click', function () {
        $( '.login-box' ).hide();
        $( '.reg-box' ).show();
    })

    // 点击去登录的链接
    $( '#link_login' ).on( 'click', function () {
        $( '.login-box' ).show();
        $( '.reg-box' ).hide();
    } )
    
    // 从layui中获取form对象
    var form = layui.form;
    // 获取layer对象
    var layer = layui.layer;
    // 通过from.verify()函数自定义校验规则
    form.verify( {
        username: [
            /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
            '用户名必须是中文、英文、数字包括下划线'
        ],
        password: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 检验两次密码是否一致
        repassword: function (value) {
            //通过形参拿到确认密码框中的内容，与密码框的内容进行判断
            var pwd = $('.reg-box [name=password]').val();  //属性选择器
            if ( value !== pwd ) {
                return '两次密码不一致';
            }
        }
    })



    // 监听注册表单的提交事件
    $( '#form_reg' ).on( 'submit', function ( e ) {
        e.preventDefault();
        $.post( '/api/reguser', { username: $( '#form_reg [name=username]' ).val(), password: $( '#form_reg [name=password]' ).val() }, function ( res ) {
            if ( res.status !== 0 ) {
                return layer.msg( res.message );
            }
            layer.msg( '注册成功，请登录！' );
            // 注册成功后跳转登录界面
            $( '#link_login' ).click();
        },)
    })

    // 登录表单事件
    $( '#form_login' ).on( 'submit', function ( e ) {
        e.preventDefault();
        $.ajax( {
            url:'/api/login',
            method: 'post',
            // 快速获取表单中的数据
            data: $( this ).serialize(),
            success: function (res) {
                if ( res.status !== 0 ) {
                    return layer.msg( '登录失败' );
                }
                layer.msg( '登录成功！' );
                // 将登陆成功得到的token字符串，保存到localStorage中
                localStorage.setItem( 'token', res.token );
                // 跳转到后台主页
                location.href = '/index.html';
            }   
        })
    })
})
$( function () {
    
    //调用getUserInfo获取用户信息
    getUserInfo();

    var layer = layui.layer;
    // 退出用户功能
    $( '#btnLogout' ).on( 'click', function () {

        // 提示用户是否退出
        layer.confirm('确认退出登录吗?', {icon: 3, title:'提示'}, function(index){

            // 清空本地存储的token
            localStorage.removeItem('token');
            // 重新跳转到登录页面
            location.href = '/login.html';

            // 关闭提示框
            layer.close(index);
          });
    })
})



// 获取用户基本信息
function getUserInfo () {
    $.ajax( {
        method:'get',
        url: '/my/userinfo',
        // 请求头
        // headers: {
        //     Authorization: localStorage.getItem( 'token' )||''
        // },
        success: function ( res ) {
            if ( res.status !== 0 ) {
                return layui.layer.msg( '获取用户信息失败' );
            }    
            // 调用渲染用户头像函数
            renderAvatar(res.data);
        },


        // // 无论成功或者失败，最终都会调用complete回调函数
        // complete: function ( res ) {
        //     // console.log('执行力complete回调');
        //     console.log(res);

        //     // 在complete回调中，可以使用res.responseJSON 拿到服务器相应的数据
        //     if ( res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败' ) {
        //         //1、强制清空token
        //         localStorage.removeItem( 'token' );
        //         //2、强制跳转到登录页
        //         location.href = '/login.html';
        //     }
        // }
        
    })
}


// 渲染用户头像函数
function renderAvatar ( user ) {
    // 获取用户名称，昵称优先于用户名
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $( '.welcome' ).html( '欢迎&nbsp;&nbsp;' + name );

    // 按需渲染用户头像
    if ( user.user_pic !== null ) {
        // 渲染图片头像
        $( '.layui-nav-img' ).attr( 'src', user.user_pic ).show();
        $( '.text-avatar' ).hide();
    } else {
        // 渲染文本头像
        $( '.layui-nav-img' ).hide();
        // 获取用户名的第一个大写字符
        var first = name[ 0 ].toUpperCase();
        $( '.text-avatar' ).html( first ).show();
    }
}
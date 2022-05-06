// 每次调用$.get()或$.post()或$.ajax()的时候，会先调用以下函数
$.ajaxPrefilter( function ( options ) {
    // 发起真正的Ajax请求之前，统一拼接请求的路径
    options.url = 'http://127.0.0.1:3007' + options.url;

    // 统一为有权限的接口设置headers请求头
    if ( options.url.indexOf( '/my/' ) !== -1 ) {
        options.headers = {
            Authorization: localStorage.getItem( 'token' ) || ''
        }
    }


    // 全局统一挂载complete回调函数
    options.complete = function (res) {
        // 在complete回调中，可以使用res.responseJSON 拿到服务器相应的数据
        if ( res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败' ) {
            //1、强制清空token
            localStorage.removeItem( 'token' );
            //2、强制跳转到登录页
            location.href = '/login.html';
        }
    }
} )
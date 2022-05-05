// 每次调用$.get()或$.post()或$.ajax()的时候，会先调用以下函数
$.ajaxPrefilter( function (options) {
    // 发起真正的Ajax请求之前，统一拼接请求的路径
    options.url = 'http://127.0.0.1:3007' + options.url;
})

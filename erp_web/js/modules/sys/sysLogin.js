/*!
 * Copyright (c) 2013-Now 葫芦娃ERP All rights reserved.
 *
 * @author jishenghua
 * @version 2019-09-14
 */
$("#loginName, #password").on("focus blur", function () {
    var a = this;
    setTimeout(function () {
        var b = $(a).css("borderColor");
        if (b != "") {
            $(a).prev().css("color", b)
        }
    }, 100)
}).blur();

var loginName = localStorage.getItem("loginName");
var password = localStorage.getItem("password");
if(loginName){
    $("#loginName").val(loginName);
    setTimeout(function() {
        $("#rememberUserCode").parent().addClass("checked");
    },200);
}
if(password){
    $("#password").val(password);
    setTimeout(function() {
        $("#rememberMe").parent().addClass("checked");
    },200);
}

//初始化键盘enter事件
$(document).keydown(function (event) {
    //兼容 IE和firefox 事件
    var e = window.event || event;
    var k = e.keyCode || e.which || e.charCode;
    //兼容 IE,firefox 兼容
    var obj = e.srcElement ? e.srcElement : e.target;
    //绑定键盘事件为 loginName 和password的输入框才可以触发键盘事件 13键盘事件
    if (k == "13" && (obj.id == "loginName" || obj.id == "password"))
        loginFun();
});

//登录按钮绑定处理事件
$('#btnSubmit').off("click").on("click", function () {
    var rememberUserCode = $("#rememberUserCode").parent().hasClass("checked");
    var rememberMe = $("#rememberMe").parent().hasClass("checked");
    localStorage.removeItem("loginName");
    localStorage.removeItem("password");
    if(rememberUserCode) {
        localStorage.setItem("loginName",$("#loginName").val());
    }
    if(rememberMe) {
        localStorage.setItem("loginName",$("#loginName").val());
        localStorage.setItem("password",$("#password").val());
    }
    loginFun();
});
//检测用户输入数据
function loginFun() {
    var loginName = $.trim($('#loginName').val());
    var password = $.trim($('#password').val());
    if (null == loginName || 0 == loginName.length) {
        $("#loginName").val("").focus();
        return;
    }
    if (null == password || 0 == password.length) {
        $("#password").val("").focus();
        return;
    }
    if (loginName != null && loginName.length != 0
        && password != null && password.length != 0) {
        $("#loginName").focus();
        $.ajax({
            type: "post",
            url: "/user/login",
            dataType: "json",
            data: ({
                loginName: loginName,
                password:  hex_md5(password)
            }),
            success: function (res) {
                if(res) {
                    var loginInfoTip = res.data.msgTip;
                    //用户名不存在，清空输入框并定位到用户名输入框
                    if (loginInfoTip.indexOf("user is not exist") != -1) {
                        $("#loginName").val("").focus();
                        $("#password").val("");
                        alert("用户名不存在");
                        return;
                    }
                    else if (loginInfoTip.indexOf("user password error") != -1) {
                        alert("密码错误");
                        return;
                    }
                    else if (loginInfoTip.indexOf("access service error") != -1) {
                        alert("后台访问错误");
                        return;
                    }
                    //跳转到用户管理界面
                    else if (loginInfoTip.indexOf("user can login") != -1 || loginInfoTip == "user already login") {
                        $.ajax({
                            type: "get",
                            url: "/user/getUserSession",
                            dataType: "json",
                            success: function (res) {
                                if(res && res.code === 200) {
                                    if(res.data.user) {
                                        var user = res.data.user;
                                        sessionStorage.setItem("userId", user.id);
                                        sessionStorage.setItem("loginName", user.loginName);
                                        top.location.href = "/index.html";
                                    }
                                }
                            },
                            //此处添加错误处理
                            error: function () {
                                alert("后台访问错误，请联系管理员！");
                            }
                        });
                    }
                }
            },
            //此处添加错误处理
            error: function () {
                alert("后台访问错误，请联系管理员！");
            }
        });
    }
}
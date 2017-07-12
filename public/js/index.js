/**
 * Created by majie on 17-6-22.
 */
$(() => {
    const $loginButton = $('.login'),
        $registerButton = $('.register'),
        $userInfo = $('.userInfo');
    $loginButton.find('a').on('click', () => {
        $registerButton.show();
        $loginButton.hide()
    });
    $registerButton.find('a').on('click', () => {
        $loginButton.show();
        $registerButton.hide()
    });

    //点击注册提交按钮 通过 ajax提交
    $registerButton.find('.register-button').on('click', () => {
        $.ajax({
            type : 'post',
            url : '/api/user/register',
            data : {
                username : $registerButton.find('[name=username]').val(),
                password : $registerButton.find('[name=password]').val(),
                repassword: $registerButton.find('[name=repassword]').val()
            },
            dataType : 'json',
            success : function (result) {
                $registerButton.find('.colWarning').html(result.message);
                if(!result.code) {
                    setTimeout(() => {
                        $loginButton.show();
                        $registerButton.hide();
                    }, 1000)
                }
            }
        })
    })

    $loginButton.find('.login-button').on('click', () => {
        $.ajax({
            type : 'post',
            url : '/api/user/login',
            data : {
                username : $loginButton.find('[name=username]').val(),
                password : $loginButton.find('[name=password]').val()
            },
            dataType : 'json',
            success : function (result) {
                $loginButton.find('.colWarning').html(result.message);
                if(!result.code) {
                   window.location.reload();
                }
            }
        })
    })

    $('#logout').on('click', () => {
        $.ajax({
            url : '/api/user/logout',
            success : (result) => {
                if(!result.code) {
                    window.location.reload();
                }
            }
        })
    })

});
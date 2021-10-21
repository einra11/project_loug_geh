var memberLoginGlobal = new MemberLogin();

$(function() {
    memberLoginGlobal.InitMemberLoginComponents();
})

function MemberLogin() {
    this.InitMemberLoginComponents = function() {
        if (localStorage.getItem('GKKIS_Member_Details') == null) {
            $('#member-login .form-container.im-hidden').removeClass('im-hidden');
        }

        $('#txtMemberUsername').focus();

        $('#txtMemberUsername, #txtMemberPassword').keypress(function(e) {
            if (e.which == 13) {
                $("#btnMemberLogin").click();
            }
        });

        $('#btnMemberLogin').unbind('click').click(function() {
            memberLoginGlobal.GetMemberCredentials();
        });
    }

    this.GetMemberCredentials = function() {
        var username = $('#txtMemberUsername').val();
        var password = $('#txtMemberPassword').val();

        if (username.trim() != '' && password.trim() != '') {
            $.ajax({
                url: "../content/functions/member/memberlogin.php",
                type: "POST",
                dataType: "JSON",
                data: { username: username, password: password },
                success: function(data) {
                    if (data.status == 1) {
                        var memberDetails = {
                            username: username,
                            dataMember: data.dataMember[0]
                        }
                        localStorage.setItem('GKKIS_Member_Details', JSON.stringify(memberDetails));
                        alert('Login successful!');
                        window.top.location.reload();
                    } else {
                        alert('Wrong username or password');
                    }
                }
            });
        } else {
            alert('Please fill in all fieds.');
        }
    }
}
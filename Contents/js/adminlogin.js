var adminLoginGlobal = new AdminLogin();

$(function() {
    adminLoginGlobal.InitAdminLoginComponents();
})

function AdminLogin() {
    this.InitAdminLoginComponents = function() {
        if (localStorage.getItem('GKKIS_Admin_Details') == null) {
            $('#admin-login .form-container.im-hidden').removeClass('im-hidden');
        }

        $('#txtAdminUsername').focus();

        $('#txtAdminUsername, #txtAdminPassword').keypress(function(e) {
            if (e.which == 13) {
                $("#btnAdminLogin").click();
            }
        });

        $('#btnAdminLogin').unbind('click').click(function() {
            adminLoginGlobal.GetAdminCredentials();
        });
    }

    this.GetAdminCredentials = function() {
        var username = $('#txtAdminUsername').val();
        var password = $('#txtAdminPassword').val();

        if (username.trim() != '' && password.trim() != '') {
            $.ajax({
                url: "../content/functions/admin/adminlogin.php",
                type: "POST",
                dataType: "JSON",
                data: { username: username, password: password },
                success: function(data) {
                    if (data.status == 1) {
                        var adminDetails = {
                            username: username,
                            dataAdmin: data.dataAdmin[0]
                        }
                        localStorage.setItem('GKKIS_Admin_Details', JSON.stringify(adminDetails));
                        alert('Login successful!');
                        window.top.location.href = "../admin.html";
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
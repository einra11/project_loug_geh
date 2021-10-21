$(function() {
    if (localStorage.getItem('GKKIS_Admin_Details') != null) {
        $('#welcome-admin .form-container.im-hidden').removeClass('im-hidden');
    }
})
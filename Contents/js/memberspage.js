$(function() {
    if (localStorage.getItem('GKKIS_Member_Details') != null) {
        $('#mainFrame').attr('src', "Pages/membershome.html");
    } else {
        $('#mainFrame').attr('src', "Pages/memberslogin.html");
    }
})
function CheckLocalStorageAndPage() {
    var pathName = window.location.pathname;
  
    if(pathName.indexOf("adminlogin.html") != -1){
      if (localStorage.getItem('GKKIS_Admin_Details') != null) {
        window.location.href = 'admin.html';
      }
    } else if(pathName.indexOf("admin.html") != -1){
      if (localStorage.getItem('GKKIS_Admin_Details') == null) {
        window.location.href = 'adminlogin.html';
      }
    }
  }
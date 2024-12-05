import {handleChangePass} from '../../services/auth'

function header({ children }){
    checkAdmin();
    return(
        <div class="sb-nav-fixed">
            <nav id="top" class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <a class="navbar-brand ps-3" href="#">Quản trị hệ thống</a>
                <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
                <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
                <ul id="menuleft" class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                </ul>
            </nav>
            
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div class="sb-sidenav-menu">
                            <div class="nav">
                                <a class="nav-link" href="index">
                                    <div class="sb-nav-link-icon"><i class="fa fa-database iconmenu"></i></div>
                                    Tổng quan
                                </a>
                                <a class="nav-link" href="user">
                                    <div class="sb-nav-link-icon"><i class="fas fa-user-alt iconmenu"></i></div>
                                    Tài khoản
                                </a>
                                <a class="nav-link" href="category">
                                    <div class="sb-nav-link-icon"><i class="fas fa-list iconmenu"></i></div>
                                    Danh mục
                                </a>
                                <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div class="sb-nav-link-icon"><i class="fas fa-table iconmenu"></i></div>
                                    Phòng
                                    <div class="sb-sidenav-arrow"> <i class="fa fa-angle-down"></i></div>
                                </a>
                                <div class="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav class="sb-sidenav-menu-nested nav">
                                        <a class="nav-link" href="room">Tất cả phòng</a>
                                        <a class="nav-link" href="empty-room">Phòng còn trống</a>
                                    </nav>
                                </div>
                                <a class="nav-link" href="dichvu">
                                    <div class="sb-nav-link-icon"><i class="fas fa-shopping-bag iconmenu"></i></div>
                                    Dịch vụ
                                </a>
                                <a class="nav-link" href="tienich">
                                    <div class="sb-nav-link-icon"><i class="fa fa-shopping-cart iconmenu"></i></div>
                                    Tiện ích
                                </a>
                                <a class="nav-link" href="blog">
                                    <div class="sb-nav-link-icon"><i class="fas fa-newspaper iconmenu"></i></div>
                                    Bài viết
                                </a>
                                <a class="nav-link" href="booking">
                                    <div class="sb-nav-link-icon"><i class="fas fa-file iconmenu"></i></div>
                                    Lịch đặt
                                </a>
                                <a class="nav-link" href="doanhthu">
                                    <div class="sb-nav-link-icon"><i class="fas fa-chart-bar iconmenu"></i></div>
                                    Doanh thu
                                </a>
                                <a data-bs-toggle="modal" data-bs-target="#changepassword" class="nav-link" href="#">
                                    <div class="sb-nav-link-icon"><i class="fa fa-key iconmenu"></i></div>
                                    Mật khẩu
                                </a>
                                <a onClick={logout} class="nav-link" href="#">
                                    <div class="sb-nav-link-icon"><i class="fas fa-sign-out-alt iconmenu"></i></div>
                                    Đăng xuất
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
                <div id="layoutSidenav_content">
                    <main class="main">
                        {children}
                    </main>
                </div>
            </div>

            <div class="modal fade" id="changepassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Đổi mật khẩu</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form method='post' onSubmit={handleChangePass}>
                                <label class="lbacc">Mật khẩu hiện tại *</label>
                                <input required name='currentpass' type="password" class="form-control" />
                                <label class="lbacc">Mật khẩu mới *</label>
                                <input required name='newpass' type="password" class="form-control"/>
                                <label class="lbacc">Xác nhận mật khẩu mới *</label>
                                <input required name='renewpass' type="password" class="form-control"/>
                                <button type="submit" class="btntt">LƯU</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function checkAdmin(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login')
}

export default header;
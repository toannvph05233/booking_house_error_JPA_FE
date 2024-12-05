import styles from './header.scss';
import logo from '../../../assest/images/logo.png';

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('/login')
}

function header (){
    var token = localStorage.getItem('token');
    var authen = <a href="login" class="pointermenu gvs menulink"><i class="fa fa-user"></i> Đăng ký/ Đăng nhập</a>
    if(token != null){
        authen = <span class="nav-item dropdown pointermenu gvs menulink">
                    <span class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-user"></i> Tài khoản</span>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="account">Tài khoản</a></li>
                        <li onClick={()=>logout()}><a class="dropdown-item" href="#">Đăng xuất</a></li>
                    </ul>
                </span>
    }
    return(
        <div id='menu'>
           <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <a class="navbar-brand navbar-toggler" href="index"><img class="imglogo" src={logo}/></a>
                    <span>
                        <i data-bs-toggle="modal" data-bs-target="#modalsearch" class="fa fa-search navbar-toggler"></i>
                        <i class="fa fa-shopping-bag navbar-toggler"> <span class="slcartmenusm">0</span></i>
                    </span>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="linktop" href='index'><img class="imglogo" src={logo}/></a></li>
                        <li class="nav-item"><a class="nav-link menulink" href="index">Trang chủ</a></li>
                        <li class="nav-item"><a class="nav-link menulink" href="blog">Bài viểt</a></li>
                        <li class="nav-item"><a class="nav-link menulink" href="service">Dịch vụ</a></li>
                        <li class="nav-item"><a class="nav-link menulink" href="booking-room">Đặt phòng</a></li>
                    </ul>
                    <div class="d-flex right10p">
                        {authen}
                    </div>
                    {/* <div class="d-flex right10p">
                        <a href="tel:1900%201833" class="phonemenu"><i class="fa fa-phone"></i> 1900 1833</a>
                    </div> */}
                    <div class="d-flex">
                        <a href="" class="linkidmenu"><i class="fab fa-facebook icmenu pointer"></i></a>
                        <a href="" class="linkidmenu"><i class="fab fa-youtube icmenu pointer"></i></a>
                        <a href="" class="linkidmenu"><i class="fab fa-instagram pointer"></i></a>
                    </div>
                    </div>
                </div>
            </nav>
        </div>
    );

    
}

export default header;
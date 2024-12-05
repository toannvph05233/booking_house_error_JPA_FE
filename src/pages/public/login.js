import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/loginimg.jpg'
import {handleLogin} from '../../services/auth';


function login(){
    return(
        <div class="contentmain">
            <div class="loginform row" style={{  
                backgroundImage: "url(" + logologin + ")",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
                }}>
                <div class="col-sm-7">

                </div>
                <div class="contentlogin col-sm-5">
                    <p class="titellogin">Chào mừng bạn đến với website du lịch!</p>
                    <p class="plogintl"><span class="dangtl">ĐĂNG </span><span class="kytl">NHẬP</span></p>
                    <form autocomplete="on" class="inputloginform" onSubmit={handleLogin}>
                        <input name="username" id="username" placeholder="Email" class="inputform" />
                        <input name="password" required id="password" placeholder="Mật khẩu" class="inputform" type="password"/>
                        <button type="submit" class="btndn">Đăng Nhập</button>
                        <p class="linkquenmk"><a href="forgot" class="aquenmk">Quên mật khẩu</a></p>
                        <p class="nothvaccount"><span>Bạn chưa có tài khoản? </span><a href="regis" class="aquenmk">Đăng ký ngay</a></p>
                    </form>
                </div>
            </div>
        </div>
        
    );
}
export default login;
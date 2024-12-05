import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import indeximg from '../../assest/images/index1.jpg'
import momo from '../../assest/images/momo.webp'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.jpg'
import { json } from 'react-router-dom'
import {toast } from 'react-toastify';

var size = 6
var token = localStorage.getItem("token");

async function requestPayMentMomo() {
    var cart = JSON.parse(localStorage.getItem("bookingcart"));
    var obj = {
        "ghichu":document.getElementById("ghichu").value,
        "fullname":document.getElementById("fullname").value,
        "phone":document.getElementById("phone").value,
        "cccd":document.getElementById("cccd").value,
        "fromdate":cart.fromdate,
        "songay":cart.songay,
        "listroom":cart.listroom,
    }
    window.localStorage.setItem('payinfor', JSON.stringify(obj));

    var returnurl = 'http://localhost:3000/payment';

    var urlinit = 'http://localhost:8080/api/booking/user/create-payment';

    var paymentDto = {
        "content": "thanh toán đặt cọc phòng",
        "soNgay": cart.songay,
        "returnUrl": returnurl,
        "listRoomId": cart.listroom,
    }
    console.log(paymentDto)
    const res = await fetch(urlinit, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(paymentDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        window.open(result.url, '_blank');
    }
    if (res.status == 417) {
        toast.warning(result.defaultMessage);
    }

}

function PublicCheckout(){
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState(null);
    const [point, setPoint] = useState(0);
    const [totalAm, setTotalAm] = useState(0);
    const [tienCoc, setTienCoc] = useState(0);
    const [tamTinh, setTamTinh] = useState(0);

    useEffect(()=>{
        loadRoomCheckout();
        loadInitBooking();
  }, []);


async function loadRoomCheckout() {
    if(token == null){
        window.location.href = 'login';return;
    }
    var cart = localStorage.getItem("bookingcart");
    if(cart == null){
        window.location.href = 'booking-room';return;
    }
    cart = JSON.parse(cart);
    setCart(cart);
    var url = 'http://localhost:8080/api/booking/public/get-room-by-listId';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(cart.listroom)
    });
    var list = await response.json();
    setItems(list)
    var totalAmount = 0;
    for (var i = 0; i < list.length; i++) {
        totalAmount = Number(totalAmount) + Number(list[i].price) * cart.songay
    }
    setTotalAm(totalAmount)
    setTienCoc(totalAmount*30/100)
}

async function loadInitBooking(){
    var url = 'http://localhost:8080/api/user/user-logged';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var user = await response.json();
    document.getElementById("fullname").value = user.fullname
    document.getElementById("phone").value = user.phone
    document.getElementById("tichdiem").innerHTML = user.point + ' điểm (Tích đủ 100 điểm, bạn sẽ được giảm giá 5%)'
    if(user.point != null){
        setPoint(user.point);
        setTamTinh(totalAm * 5 % 100)
    }
}

    return(
        <div class="container contentmain">
        <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-12 col-12 checkoutdiv">
                <div class="inforship">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                            <br/><span class="titlecheckout">Thông tin nhận phòng</span>
                            <input id="fullname" class="form-control fomd" placeholder="Họ tên"/>
                            <input id="phone" class="form-control fomd" placeholder="Số điện thoại"/>
                            <input id="cccd" class="form-control fomd" placeholder="Số cmnd/ cccd"/>
                            <textarea id="ghichu" class="form-control fomd" placeholder="ghi chú"></textarea>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                            <br/><span class="titlecheckout">Thanh toán</span>
                            <br/><br/><span>(Để đặt phòng, bạn cần đặt cọc 30% giá phòng)</span>
                            <table class="table tablepay">
                                <tr>
                                    <td><label class="radiocustom">	Thanh toán qua Ví MoMo</label></td>
                                    <td><img src={momo} class="momopayicon"/></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
    
                <div class="notecheckout">
                    <hr/>
                    <span>Sau khi hoàn tất đặt cọc (trong giờ hành chính), chúng tôi sẽ nhanh chóng gọi điện xác nhận lại với bạn. Chúng tôi xin cảm ơn!</span>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-12" id="checkright">
                <div class="infordoncheck">
                    <span class="dhcheck">Thông tin phòng đã chọn</span>
                    <div id="listRoomselect">
                        {items.map((item, index)=>{
                            return <div class="row">
                            <div class="col-lg-2 col-md-3 col-sm-3 col-3 colimgcheck">
                                <img src={item.image} class="procheckout"/>
                            </div>
                            <div class="col-lg-7 col-md-6 col-sm-6 col-6">
                                <span class="namecheck">{item.name}</span>
                                <span class="colorcheck">Ngày đặt: {cart==null?'':cart.fromdate}, {cart==null?'':cart.songay} ngày</span>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 col-3 pricecheck">
                                <span>{formatMoney(item.price)}</span>
                            </div>
                        </div>
                        })}
                    </div>
                    <div class="magg">
                        <table class="table">
                            <tr>
                                <th>Tạm tính</th>
                                <td class="colright" id="totalAmount">{formatMoney(totalAm)} {point < 100 ? '' : ', giảm giá: 5%: '+ formatMoney(totalAm * 5 / 100)+', tiền giảm giá sẽ được trả lại sau khi trả phòng' }</td>
                            </tr>
                            <tr>
                                <th>Tiền cọc</th>
                                <td class="colright" id="tiencoc">{formatMoney(tienCoc)}</td>
                            </tr>
                            <tr>
                                <th>Tích điểm</th>
                                <td class="colright" id="tichdiem">0đ</td>
                            </tr>
                        </table>
                        <button onClick={()=>requestPayMentMomo()} class="btndathangmobile">Đặt cọc</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default PublicCheckout;

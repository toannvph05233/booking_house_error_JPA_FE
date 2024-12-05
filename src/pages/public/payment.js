import { useState, useEffect } from 'react'
import $ from 'jquery'; 

var size = 6
var token = localStorage.getItem("token");

async function createBooking() {
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");

    var obj = JSON.parse(window.localStorage.getItem("payinfor"));

    var bookingDto = {
        "fromDate": obj.fromdate,
        "numDate": obj.songay,
        "fullname": obj.fullname,
        "phone": obj.phone,
        "cccd": obj.cccd,
        "note": obj.ghichu,
        "requestId": requestId,
        "orderId": orderId,
        "listRoomId": obj.listroom,
    }
    var url = 'http://localhost:8080/api/booking/user/create-booking';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(bookingDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
    }
    if (res.status == 417) {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }

    }

$( document ).ready(function() {
    // createBooking();
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");
    if(orderId != null && requestId != null){
        createBooking();
    }
});

function PublicPayment(){

  
    return(
        <div class="contentmain"><br/><br/><br/>
        <div>
            <div id="thanhcong">
                <h3>Đặt thành công</h3>
                <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
                <p>Hãy kiểm tra thông tin đặt phòng của bạn trong lịch sử đặt</p>
                <a href="account" class="btn btn-danger">Xem lịch sử đặt phòng</a>
            </div>

            <div id="thatbai">
                <h3>Thông báo</h3>
                <p id="errormess">Bạn chưa hoàn thành thanh toán.</p>
                <p>Quay về <a href="index">trang chủ</a></p>
            </div>
        </div>
    </div> 
    );
}

export default PublicPayment;

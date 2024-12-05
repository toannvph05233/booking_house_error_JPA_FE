import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import pass from '../../assest/images/pass.svg'
import avatar from '../../assest/images/avatar.webp'
import invoice from '../../assest/images/invoice.svg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { getMethodByToken ,getMethodPostByToken,getMethodDeleteByToken,getMethodPostPayload} from '../../services/request';
import {handleChangePass} from '../../services/auth';


var token = localStorage.getItem("token");
function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('/login')
}
function PublicAccount(){
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [itemBookingRoom, setItemBookingRoom] = useState([]);
    const [itemBookingService, setItemBookingService] = useState([]);
    useEffect(()=>{
        if(token == null){
            window.location.href = 'login';return;
        }
        var user = localStorage.getItem('user');
        user = JSON.parse(user);
        document.getElementById("fullnamacc").innerHTML = user.fullname
        const getBooking= async() =>{
            var response = await getMethodPostByToken('http://localhost:8080/api/booking/user/my-booking');
            var list = await response.json();
            setItems(list)
            setTotal(list.length)
        };
        getBooking();
  }, []);
    console.log(items);
    function changeLink(e, idtab, idtabdong){
        document.getElementById(idtab).style.display = 'block';
        document.getElementById(idtabdong).style.display = 'none';
        var tabs = document.getElementsByClassName("tabdv");
        for (var i = 0; i < tabs.length; i++) {
            document.getElementsByClassName("tabdv")[i].classList.remove("activetabdv");
        }
        e.target.classList.add('activetabdv')
    }


    function loadTrangThai(name){
        if(name == "DEPOSITED"){
            return "<span class='dadatcoc'>Đã đặt cọc</span>";
        }
        if(name == "PAID"){
            return "<span class='dathanhtoan'>Đã thanh toán</span>";
        }
        if(name == "CANCELLED"){
            return "<span class='dahuy'>Đã hủy</span>";
        }
    }

    async function getBookingRoomAndService(idBooking){
        var response = await getMethodPostByToken('http://localhost:8080/api/booking-room/public/find-by-booking?id='+idBooking);
        var list = await response.json();
        setItemBookingRoom(list)

        var response = await getMethodPostByToken('http://localhost:8080/api/booking-service/public/find-by-booking?id='+idBooking);
        var list = await response.json();
        setItemBookingService(list)
    }

    return(
        
        <div class="contentmain">
        <div class="row cartbds">
            <div class="col-lg-3 col-md-3 col-sm-12 col-12 collistcart">
                <div class="navleft">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-6 col-6">
                            <div class="avaaccount">
                                <img src={avatar} class="avataracc"/>
                                <p class="fullnamacc" id='fullnamacc'>jj</p>
                                <button onClick={()=>logout()} class="btnlogoutacc">Đăng xuất</button>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-6 col-6 sinv">
                            <div onClick={(event)=>changeLink(event,'invoice', "changepass")} class="tabdv activetabdv">
                                <img class="imgau" src={invoice}/> Lịch đặt của tôi
                            </div>
                            <div onClick={(event)=>changeLink(event,'changepass','invoice')} class="tabdv">
                                <img class="imgau" src={pass}/> Đổi mật khẩu
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12 col-12 collistcart">
                <div class="navright">
                    <div class="tab-content contentab">
                        <div role="tabpanel" class="tab-pane active" id="invoice">
                            <div class="headeraccount">
                                <p class="fontyel">Lịch sử đặt phòng</p>
                                <div class="right_flex">
                                    <span class="textrf" id="sldonhang">{total} đơn đặt phòng</span>
                                </div>
                            </div>
                            <table class="table table-cart table-order" id="my-orders-table">
                                <thead class="thead-default">
                                    <tr>
                                        <th>Mã đặt phòng</th>
                                        <th class="floatr">Ngày đặt</th>
                                        <th>Ngày nhận phòng</th>
                                        <th class="floatr">Số ngày</th>
                                        <th>Họ tên</th>
                                        <th class="floatr">Số điện thoại</th>
                                        <th>Trạng thái thanh toán</th>
                                        <th class="floatr">Tổng số tiền</th>
                                        <th>Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody id="listBooking">
                                    {items.map((item, index)=>{
                                    return <tr>
                                        <td><a onClick={()=>getBookingRoomAndService(item.id)} data-bs-toggle="modal" data-bs-target="#modaldeail" class="yls pointer-event">{item.id}</a></td>
                                        <td class="floatr">{item.createdTime} {item.createdDate}</td>
                                        <td>{item.fromDate}</td>
                                        <td class="floatr">{item.numDate}</td>
                                        <td><span class="span_pending">{item.user.fullname}</span></td>
                                        <td class="floatr">{item.phone}</td>
                                        <td><span class="span_pending" dangerouslySetInnerHTML={{__html:loadTrangThai(item.payStatus)}}></span></td>
                                        <td class="floatr"><span class="span_"><span class="yls">{formatMoney(item.amountRoom + item.amountService)}</span></span></td>
                                        <td><button onClick={()=>getBookingRoomAndService(item.id)} data-bs-toggle="modal" data-bs-target="#modaldeail" class="btn btn-primary">Chi tiết</button></td>
                                    </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="changepass">
                            <div class="headeraccount">
                                <span class="fontyel">Đổi mật khẩu</span><span class="smyl"> (Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác)</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-12 passacc">
                                <form onSubmit={handleChangePass}>
                                    <label class="lbacc">Mật khẩu hiện tại *</label>
                                    <input name="currentpass" type="password" class="form-control"/>
                                    <label class="lbacc">Mật khẩu mới *</label>
                                    <input name="newpass" type="password" class="form-control"/>
                                    <label class="lbacc">Xác nhận mật khẩu mới *</label>
                                    <input name="renewpass" type="password" class="form-control"/>
                                    <br/>
                                    <button type="submit" class="btntt">LƯU</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chi tiết đặt phòng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                            <tr>
                                <th>Ảnh Phòng</th>
                                <th>Tên Phòng</th>
                                <th>Giá tiền</th>
                            </tr>
                        </thead>
                        <tbody id="listBookingRoom">
                            {itemBookingRoom.map((item=>{
                                    return <tr>
                                    <td><img src={item.room.image} class="imgdetailacc"/></td>
                                    <td>{item.room.name}</td>
                                    <td class="sldetailacc">{formatMoney(item.price)}</td>
                                </tr>
                            }))}
                        </tbody>
                    </table><br/><br/>
    
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên dịch vụ</th>
                            <th>Giá tiền</th>
                            <th>Ngày đặt</th>
                            <th>Số lượng</th>
                        </tr>
                        </thead>
                        <tbody id="listBookingService">
                            {itemBookingService.map((item=>{
                                    return <tr>
                                    <td><img src={item.services.image} class="imgdetailacc"/></td>
                                    <td>{item.services.name}</td>
                                    <td class="sldetailacc">{formatMoney(item.price)}</td>
                                    <td>{item.createdDate} {item.createdTime}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            }))}
                        </tbody>
                    </table><br/><br/><br/><br/>
    
                </div>
            </div>
        </div>
    </div>
    </div>
    );
}

export default PublicAccount;

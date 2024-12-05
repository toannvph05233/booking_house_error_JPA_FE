import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,getMethodPostByToken,getMethodDeleteByToken,getMethodPostPayload} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';
import AsyncSelect from 'react-select/async';
import { usePDF } from 'react-to-pdf';

var token = localStorage.getItem("token");



const AdminBooking = ()=>{
    const [items, setItems] = useState([]);
    const [itemService, setItemService] = useState([]);
    const [itemBookingRoom, setItemBookingRoom] = useState([]);
    const [itemBookingService, setItemBookingService] = useState([]);
    const [itemBookingId, setItemBookingId] = useState(null);
    const [itemServiceDaChon, setItemServiceDaChon] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [bookingRoom, setBookingRoom] = useState([]);
    const [bookingService, setBookingService] = useState([]);
    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

    useEffect(()=>{
        const getBooking= async() =>{
            var response = await getMethodPostByToken('http://localhost:8080/api/booking/admin/all-room');
            var list = await response.json();
            console.log(list);
            setItems(list)
        };
        getBooking();
        const getService= async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/services/public/findAll');
            var list = await response.json();
            setItemService(list)
        };
        getService();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });

    function loadTrangThai(name){
        if(name == "DEPOSITED"){
            return <span class='dadatcoc'>Đã đặt cọc</span>;
        }
        if(name == "PAID"){
            return <span class='dathanhtoan'>Đã thanh toán</span>;
        }
        if(name == "CANCELLED"){
            return <span class='dahuy'>Đã hủy</span>;
        }
    }

    async function locBk(){
        var from = document.getElementById("from").value
        var to = document.getElementById("to").value
        if(from == "" || to == ""){
            toast.error("Hãy chọn thời gian cần lọc");
        }
        $('#example').DataTable().destroy();
        var response = await getMethodPostByToken('http://localhost:8080/api/booking/admin/all-room?from='+from+'&to='+to);
        var list = await response.json();
        setItems(list)
    }

    function setBookingRs(item){
        setInvoice(item);
        setBookingRoom(item.bookingRooms);
        setBookingService(item.bookingServices);
    }

    async function updateStatus() {
        var sstname = document.getElementById("sstname").value
        var res = await getMethodPostByToken('http://localhost:8080/api/booking/admin/update-status?id=' + itemBookingId + '&status=' + sstname)
        if (res.status < 300) {
            toast.success("Cập nhật trạng thái thành công!");
            var response = await getMethodPostByToken('http://localhost:8080/api/booking/admin/all-room');
            var list = await response.json();
            setItems(list)
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.warning(result.defaultMessage);
        }
    }

    async function getBookingRoomAndService(idBooking){
        setItemBookingId(idBooking)
        var response = await getMethodPostByToken('http://localhost:8080/api/booking-room/public/find-by-booking?id='+idBooking);
        var list = await response.json();
        setItemBookingRoom(list)

        var response = await getMethodPostByToken('http://localhost:8080/api/booking-service/public/find-by-booking?id='+idBooking);
        var list = await response.json();
        setItemBookingService(list)
    }

    async function deleteBkService(id){
        var con = window.confirm("Xác nhận xóa dịch vụ này?")
        if (con == false) {
            return;
        }
        var response = await getMethodDeleteByToken('http://localhost:8080/api/booking-service/admin/delete?id='+id);
        if(response.status < 300){
            toast.success("Xóa thành công");
            var response = await getMethodPostByToken('http://localhost:8080/api/booking-service/public/find-by-booking?id='+itemBookingId);
            var list = await response.json();
            setItemBookingService(list)
            $('#example').DataTable().destroy();
            var response = await getMethodPostByToken('http://localhost:8080/api/booking/admin/all-room');
            var list = await response.json();
            setItems(list)
        }
    }


    function loadTableService(service){
        setItemServiceDaChon(service)
    }

    async function saveBookingService(){
        var listId = []
        for(var i=0; i<itemServiceDaChon.length; i++){
            listId.push(itemServiceDaChon[i].id)
        }
        var list = [];
        for(var i=0; i< listId.length; i++){
            var obj = {
                "id":listId[i],
                "quantity":document.getElementById("quantityser"+listId[i]).value
            }
            list.push(obj);
        }
        console.log(list);
        var response = await getMethodPostPayload('http://localhost:8080/api/booking-service/admin/create?id='+itemBookingId, list);
        if (response.status < 300) {
            toast.success("Thành công");
            var response = await getMethodPostByToken('http://localhost:8080/api/booking/admin/all-room');
            var list = await response.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    function setItembooking(itbooking){
        document.getElementById("sstname").value = itbooking.payStatus
        setItemBookingId(itbooking.id)
    }


    async function deleteBooking(id, sttName){
        var con = window.confirm("Xác nhận xóa lịch đặt này?")
        if (con == false) {
            return;
        }
        if(sttName == "PAID"){
            toast.warning("Đã thanh toán đủ, không thể xóa");
            return;
        }
        var response = await getMethodDeleteByToken('http://localhost:8080/api/booking/admin/delete?id=' + id)
        if (response.status < 300) {
            toast.success("Thành công");
            var response = await getMethodPostByToken('http://localhost:8080/api/booking/admin/all-room');
            var list = await response.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }
    

    return (
        <div>
            <div class="col-sm-12 header-sp">
                <div class="row">
                    <div class="col-md-3">
                        <label class="lb-form">Từ ngày</label>
                        <input id="from" type="date" class="form-control"/>
                    </div>
                    <div class="col-md-3">
                        <label class="lb-form">Đến ngày</label>
                        <input id="to" type="date" class="form-control"/>
                    </div>
                    <div class="col-md-2">
                        <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label><br/>
                        <button onClick={()=>locBk()} class="btn btn-success form-control">Lọc</button>
                    </div>
                </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                    <table id="example" class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>Mã đặt phòng</th>
                                    <th>Ngày đặt</th>
                                    <th>Ngày nhận phòng</th>
                                    <th>Số ngày</th>
                                    <th>Họ tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Trạng thái thanh toán</th>
                                    <th>Tổng số tiền</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                                {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdTime} {item.createdDate}</td>
                                    <td>{item.fromDate}</td>
                                    <td>{item.numDate}</td>
                                    <td>{item.fullname}</td>
                                    <td>{item.phone}</td>
                                    <td>{loadTrangThai(item.payStatus)}</td>
                                    <td>{formatMoney(item.amountRoom * item.numDate + item.amountService)}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>getBookingRoomAndService(item.id)} data-bs-toggle="modal" data-bs-target="#modaldeail" class="fa fa-eye iconaction"></i>
                                        <i onClick={()=>setItembooking(item)} data-bs-toggle="modal" data-bs-target="#capnhattrangthai" class="fa fa-edit iconaction"></i><br/>
                                        <br/><i onClick={()=>deleteBooking(item.id, item.payStatus)} class="fa fa-trash iconaction"></i>
                                        <i onClick={()=>setItemBookingId(item.id)} data-bs-toggle="modal" data-bs-target="#addService" class="fa fa-plus iconaction"></i><br/>

                                        {item.payStatus != 'PAID'?'':<><br/><i onClick={()=>setBookingRs(item)} data-bs-toggle="modal" data-bs-target="#modalprint" className='fa fa-print iconaction'></i></>}
                                    </td>
                                </tr>
                                }))}
                            </tbody>
                        </table>
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
                            <th>Xóa</th>
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
                                    <td><i onClick={()=>deleteBkService(item.id)} class="fa fa-trash iconaction"></i></td>
                                </tr>
                            }))}
                        </tbody>
                    </table><br/><br/><br/><br/>
    
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="capnhattrangthai" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Cập nhật trạng thái</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body">
                    <input type="hidden" id="idbooking"/>
                    <select class="form-control" id="sstname">
                        <option value="DEPOSITED">Đã đặt cọc</option>
                        <option value="PAID">Đã thanh toán đủ</option>
                        <option value="CANCELLED">Hủy phòng</option>
                    </select><br/><br/>
                    <button onClick={()=>updateStatus()} class="btn btn-primary form-control action-btn">Cập nhật</button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="addService" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Thêm dịch vụ</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body">
                    <AsyncSelect
                    isMulti
                    onChange={(item) => {
                        loadTableService(item);
                    }}
                    defaultOptions={itemService} 
                    getOptionLabel={(itemService)=>itemService.name+ formatMoney(itemService.price)} 
                    getOptionValue={(itemService)=>itemService.id}  
                    placeholder="Chọn dịch vụ"/>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Tên dịch vụ</th>
                                <th>Giá tiền</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody id="listServiceSelect">
                            {itemServiceDaChon.map((item=>{
                                    return <tr>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td><input id={"quantityser"+item.id} type='number' defaultValue={0}/></td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                    <br/><br/>
                    <button onClick={()=>saveBookingService()} class="btn btn-primary">Thêm dịch vụ</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalprint" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">In hóa đơn</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" ref={targetRef}>
        <h5 className='titleprint'>Hóa đơn đặt phòng khách sạn</h5>
        <hr></hr>
        <div className='inforkhdiv'>
            <div className='headerinfor'>
                Thông tin khách hàng
            </div>
            <div className='contentinfor'>
                <table className='table table-border-less'>
                    <tr>
                        <td>Họ tên</td>
                        <td>{invoice == null?'':invoice.fullname}</td>
                    </tr>
                    <tr>
                        <td>Số điện thoại</td>
                        <td>{invoice == null?'':invoice.phone}</td>
                    </tr>
                    <tr>
                        <td>Checkin</td>
                        <td>{invoice == null?'':invoice.fromDate}</td>
                    </tr>
                    <tr>
                        <td>Checkout</td>
                        <td>{invoice == null?'':invoice.toDate}</td>
                    </tr>
                    <tr>
                        <td>Số ngày ở</td>
                        <td>{invoice == null?'':invoice.numDate}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div className='inforkhdiv'>
            <div className='headerinfor'>
                Thông tin chi tiết
            </div>
            <div className='contentinfor'>
                <table className='table table-border-less'>
                    {bookingRoom.map((item=>{
                        return  <tr>
                        <td>Tên: {item.room.name}</td>
                        <td>Loại: {item.room.category.name}</td>
                        <td>Giá: {formatMoney(item.price)}</td>
                    </tr>
                    }))}
                    {bookingService.map((item=>{
                        return  <tr>
                        <td>Tên: {item.services.name}</td>
                        <td>Loại: {item.services.category.name}</td>
                        <td>Giá: {formatMoney(item.price)}</td>
                    </tr>
                    }))}
                </table>
            </div>
        </div>
        <div className='inforkhdiv'>
            <div className='headerinfor'>
                Tổng tiền thanh toán
            </div>
            <div className='contentinfor'>
            <table className='table table-border-less'>
                <tr>
                    <td>Tổng tiền</td>
                    <td>{invoice == null?'':formatMoney(invoice.numDate * invoice.amountRoom + invoice.amountService)}</td>
                </tr>
                <tr>
                    <td>Tiền cọc</td>
                    <td>{invoice == null?'':formatMoney((invoice.numDate * invoice.amountRoom) - (invoice.numDate * invoice.amountRoom * 70 /100))} - <span className='dacoc'>30%</span></td>
                </tr>
                <tr>
                    <td>Tiền phải thanh toán</td>
                    <td>{invoice == null?'':formatMoney((invoice.numDate * invoice.amountRoom) - (invoice.numDate * invoice.amountRoom * 30 /100) + invoice.amountService)}</td>
                </tr>
            </table>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button onClick={() => toPDF()} class="btn btn-primary">Tạo</button>
      </div>
    </div>
  </div>
</div>
        </div>
    );
}

export default AdminBooking;
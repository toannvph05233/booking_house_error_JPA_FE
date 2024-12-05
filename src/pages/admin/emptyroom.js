import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';


var token = localStorage.getItem("token");

var listRoomArr = [];

function loadDaySelect(){
    var main = '';
    var curdate = new Date()
    for(var i=1; i< 11; i++){
        var dateObj = new Date();
        dateObj.setDate(curdate.getDate() + i);

        let month = dateObj.getUTCMonth() + 1;
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        var newdate = day + "/" + month + "/" + year;

        main += `<option value="${i}">${i} Ngày - ${newdate}</option>`
    }
    document.getElementById("songay").innerHTML = main;
}


async function createBooking() {
    if(listRoomArr.length == 0){
        alert("Chưa có phòng nào được chọn!")
        return;
    }
    var ls = [];
    for(var i=0; i<listRoomArr.length; i++){
        ls.push(listRoomArr[i].id);
    }
    
    var bookingDto = {
        "fromDate": document.getElementById("fromDatecr").value,
        "numDate": document.getElementById("numDatecr").value,
        "fullname": document.getElementById("fullname").value,
        "phone": document.getElementById("phone").value,
        "cccd": document.getElementById("cccd").value,
        "note": document.getElementById("note").value,
        "listRoomId": ls
    }
    var url = 'http://localhost:8080/api/booking/admin/create-booking';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(bookingDto)
    });
    if (res.status < 300) {
        toast.success("Thành công");
        await new Promise(r => setTimeout(r, 1000));
        window.location.reload();
    }
    else{
        toast.error("Thất bại");
    }

}

const AdminEmptyRoom = ()=>{
    const [items, setItems] = useState([]);
    const [itemTam, setItemTam] = useState([]);
    const [itemCategory, setItemCategory] = useState([]);
    useEffect(()=>{
        khoiTao();
        const getCategory= async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/category/public/findAll?type=ROOM");
            var list = await response.json();
            var arr = [{"id":-1,"name":"Tất cả loại phòng","image":""}]
            arr = arr.concat(list)
            setItemCategory(arr)
        };
        getCategory();
        loadDaySelect();
        loadEmptyRoom();
    }, []);
    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });
    function khoiTao() {
        document.getElementById('fromdate').valueAsDate = new Date();
        document.getElementById('fromDatecr').valueAsDate = new Date();
        var dateObj = new Date();
        dateObj.setDate(new Date().getDate() + 1);
        console.log(dateObj);
        var day = dateObj.getDay();
        var month = dateObj.getUTCMonth() + 1;
        var year = dateObj.getUTCFullYear();
        var dates = dateObj.getUTCDate();
        var str = "Thứ "+day+ ", "+dates+" thg "+month+", "+year;
        document.getElementById("ngaytraphong").innerHTML = str
    };

    async function loadEmptyRoom() {
        $('#example').DataTable().destroy();
        var cateId = document.getElementById("listcategoryselect").value
        var from = document.getElementById("fromdate").value
        var songay = document.getElementById("songay").value
        var url = 'http://localhost:8080/api/booking/public/cal-date?from='+from+'&numDate='+songay;
        if(cateId != -1){
            url += '&id='+cateId
        }
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        var list = result.rooms
        setItems(list)
        document.getElementById("slphong").innerHTML = "("+list.length + " phòng)"
        document.getElementById("ngaytraphong").innerHTML = result.detailDate
        document.getElementById("fromDatecr").value = from
        document.getElementById("numDatecr").value = songay
        loadRoomSelect();
    }
    
    async function pushToList(id, roomname, price){
        var e = document.getElementById("inputcheck"+id);
        if(e.checked == false){
            removeRoom(id);
        }
        else{
            var obj = {
                "id":id,
                "roomname":roomname,
                "price":price,
            }
            listRoomArr.push(obj);
        }
        loadRoomSelect();
    }

    function removeRoom(id){
        listRoomArr = listRoomArr.filter(data => data.id != id);
        loadRoomSelect();
        document.getElementById("inputcheck"+id).checked = false;
    }

    function loadRoomSelect(){
        var main = '';
        for(var i=0; i<listRoomArr.length;i++){
            main += `<div class="row">
            <div class="col-7"><span>${listRoomArr[i].roomname}</span></div>
            <div class="col-3"><span>${formatMoney(listRoomArr[i].price)}</span></div>
        </div>`;
        try {
            document.getElementById("inputcheck"+listRoomArr[i].id).checked = true;
        } catch (error) {}
        }

        document.getElementById("listroomdc").innerHTML = main;
    }
    

    return (
        <div>
             <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div class="col-md-12">
                            <h3>Danh sách phòng còn trống <span id="slphong"></span></h3>
                        </div>
                        <div class="col-md-3">
                            <label class="lbbooking">Chọn loại phòng</label>
                            <select class="form-control" id="listcategoryselect">
                                {itemCategory.map((item=>{
                                    return <option value={item.id}>{item.name}</option>
                                }))}
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="lbbooking">Thời gian nhận phòng</label>
                            <input onchange="setDate()" type="date" class="form-control" id="fromdate" />
                        </div>
                        <div class="col-md-3">
                            <label class="lbbooking">Số ngày</label>
                            <select onchange="setNumDay()" class="form-control" id="songay">
                                <option value="1">1 Ngày</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="lbbooking whitespace" dangerouslySetInnerHTML={{__html: '<span>&ThinSpace;</span>'}}></label>
                            <button onClick={()=>loadEmptyRoom()} class="btn btn-primary form-control"><i class="fa fa-search"></i> Tìm kiếm phòng</button>
                        </div>
                        <div class="contenttimebk col-sm-4">
                            <br/><label class="lbbooking">Trả phòng</label>
                            <span id="ngaytraphong" class="ngaytraphong">Thứ 5, 16 thg 1, 2023</span>
                        </div>
                        <div class="col-md-3">
                        <br/><button onclick="clearData()" data-bs-toggle="modal" data-bs-target="#addBookingForm" class="btn btn-primary">
                                <i class="fa fa-plus"></i> Thêm nhận phòng
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                    <table id="example" class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Ảnh</th>
                                    <th>Tên phòng</th>
                                    <th>Giá tiền</th>
                                    <th>Số giường</th>
                                    <th>Số người tối đa</th>
                                    <th>Danh mục</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                                {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.image} className='imgadmin' /></td>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td>{item.numBed}</td>
                                    <td>{item.maxPeople}</td>
                                    <td>{item.category.name}</td>
                                    <td class="sticky-col">
                                    <label class="checkbox-custom"> Chọn
                                        <input id={"inputcheck"+item.id} onChange={()=>pushToList(item.id,item.name,item.price)} type="checkbox"/><span class="checkmark-checkbox"></span>
                                    </label>
                                    </td>
                                </tr>
                                }))}
                            </tbody>
                        </table>


                    </div>
                </div>

                <div class="modal fade" id="addBookingForm" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Đặt phòng</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div class="modal-body row">
                <div class="col-sm-5">
                    <label>Từ ngày</label>
                    <input readOnly={true} id="fromDatecr" type="date" class="form-control"/>
                    <label>Số ngày</label>
                    <input readOnly={true} id="numDatecr" class="form-control"/>
                    <label>Họ tên</label>
                    <input id="fullname" class="form-control"/>
                    <label>Số điện thoại</label>
                    <input id="phone" class="form-control"/>
                    <label>Số cmnd/ cccd</label>
                    <input id="cccd" class="form-control"/>
                    <label>Ghi chú</label>
                    <input id="note" class="form-control"/>
                    <button onClick={()=>createBooking()} class="btn btn-success form-control action-btn">Đặt phòng</button>
                </div>
                <div class="col-sm-7">
                    <h4>Phòng đã chọn</h4>
                    <div class="row" id="listroomdc">
                        <div class="row">
                            <div class="col-7"><span>Phòng Medium 102</span></div>
                            <div class="col-3"><span>5600000</span></div>
                            <div class="col-2"><i class="fa fa-trash pointer"></i></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
        </div>
    );
}
export default AdminEmptyRoom;
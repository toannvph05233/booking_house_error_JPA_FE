import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/bannerdp.jpg'
import nangtam from '../../assest/images/nangtam.png'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.jpg'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';


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


var token = localStorage.getItem("token");

var listRoomArr = [];

function PublicBookingRoom(){
    const [items, setItems] = useState([]);
    const [itemCategory, setCategory] = useState([]);
    const [room, setRoom] = useState(null);
    useEffect(()=>{
        khoiTao();
        const getCategory = async() =>{
            var result = await getMethod('http://localhost:8080/api/category/public/findAll?type=ROOM');
            setCategory(result)
        };
        getCategory();
        loadDaySelect();
        loadAllRoom();
  }, []);

    function khoiTao() {
        document.getElementById('fromdate').valueAsDate = new Date();
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


    async function loadAllRoom() {
        var cateId = document.getElementById("listcategoryselect").value
        var from = document.getElementById("fromdate").value
        var songay = document.getElementById("songay").value
        var url = 'http://localhost:8080/api/booking/public/cal-date?from='+from+'&numDate='+songay;
        if(cateId != -1){
            url += '&id='+cateId
        }
        var result = await getMethod(url);
        var list = result.rooms
        setItems(list)
        document.getElementById("sophongtrong").innerHTML = "("+list.length +' phòng)'
        document.getElementById("ngaytraphong").innerHTML = result.detailDate
        // loadRoomSelect();
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


    function checkOut(){
        if(token == null){
            toast.warning("Bạn chưa đăng nhập");
            return;
        }
        var fromdate = document.getElementById("fromdate").value
        var songay = document.getElementById("songay").value
    
        if(listRoomArr.length == 0){
            toast.warning("Bạn hãy chọn ít nhất 1 phòng");
            return;
        }
        var listId = [];
        for(var i=0; i<listRoomArr.length; i++){
            listId.push(listRoomArr[i].id);
        }
        var obj = {
            "fromdate":fromdate,
            "songay":songay,
            "listroom":listId,
        }
        window.localStorage.setItem("bookingcart", JSON.stringify(obj));
        window.location.href = 'checkout';
    }

    return(
        <div class="contentmain">
        <section>
            <div class="bannerdatphong">
                <img src={banner} class="bannerdp" />
                <div class="blockbookingtime">
                    <div class="row">
                        <div class="col-sm-12">
                            <label class="lbbookingsp">Chọn loại phòng</label>
                            <select class="form-control" id="listcategoryselect">
                                <option value="-1">Tất cả loại phòng</option>
                                {itemCategory.map((item=>{
                                    return <option value={item.id}>{item.name}</option>
                                }))}
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <label class="lbbookingsp">Thời gian nhận phòng</label>
                            <input type="date" class="form-control" id="fromdate"/>
                        </div>
                        <div class="contenttimebk col-sm-4">
                            <label class="lbbookingsp">Số ngày</label>
                            <select class="form-control" id="songay">
                                <option value="">1 Ngày</option>
                            </select>
                        </div>
                        <div class="contenttimebk col-sm-4">
                            <label class="lbbooking">Trả phòng</label>
                            <span id="ngaytraphong" class="ngaytraphong">Thứ 5, 16 thg 1, 2023</span>
                        </div>
                        <div class="divbtnsearchrooms">
                            <button onClick={()=>loadAllRoom()} class="btnsearchroom"><i class="fa fa-search"></i> Tìm kiếm phòng</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-8">
                    <p class="titlept">Danh sách phòng trống <span id="sophongtrong"></span></p>
                    <div class="row" id="listRoom">
                        {items.map((item=>{
                            return <div class="row singleroom">
                            <div class="col-4">
                                <img onClick={()=>setRoom(item)} src={item.image} data-bs-toggle="modal" data-bs-target="#modaldeail" class="imgroom pointer"/>
                            </div>
                            <div class="col-8">
                                <div class="nameroomdiv">
                                    <span class="roomnames pointer">{item.name}</span>
                                    <span onClick={()=>setRoom(item)}  data-bs-toggle="modal" data-bs-target="#modaldeail" class="motaroom pointer">Xem mô tả & ảnh phòng</span>
                                </div>
                                <div class="d-flex numbedroom">
                                    <span><i class="fa fa-bed"></i> Số giường: {item.namenumBed}</span>
                                    <span><i class="fa fa-users"></i> Số người tối đa: {item.maxPeople}</span>
                                </div>
                                <div class="row">
                                    <div class="col-8">
                                        <div class="row">
                                            {item.roomUtilities.map((tienich=>{
                                                return <div class="col-sm-6 singletich">
                                                <i class={tienich.utilities.icon}></i> {tienich.utilities.name}
                                            </div>
                                            }))}
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <span class="priceroom">{formatMoney(item.price)}</span>
                                        <span class="phongdem">/ phòng / đêm</span>
                                        <label class="checkbox-custom"> Chọn phòng
                                            <input id={"inputcheck"+item.id} onChange={()=>pushToList(item.id,item.name,item.price)} type="checkbox"/><span class="checkmark-checkbox"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }))}
                    </div>
                </div>
                <div class="col-sm-4 toppad">
                    <div class="timebooking row">
                        <div class="headertimebk">
                            Phòng đã chọn
                        </div>
                        <div class="contenttimebooking">
                            <div class="row" id="listroomdc">
                                {/* <div class="row">
                                    <div class="col-7"><span>Phòng Medium 102</span></div>
                                    <div class="col-3"><span>5600000</span></div>
                                    <div class="col-2"><i class="fa fa-trash pointer"></i></div>
                                </div> */}
                            </div>
                            <br/><button onClick={()=>checkOut()} class="btn btn-primary form-control">Đặt lịch</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="modal fade" id="modaldeail" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Thông tin phòng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div dangerouslySetInnerHTML={{__html:room==null?'':room.description}}></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
    </div>
    );
}

export default PublicBookingRoom;
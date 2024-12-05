import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,uploadSingleFile, uploadMultipleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';


var token = localStorage.getItem("token");

const listFile = [];
var linkbanner = '';
var description = '';
async function saveRoom(event) {
    event.preventDefault();
    var listTienIch = event.target.elements.tienich;
    var listUt = [];
    var i=0;
    for(i=0; i<listTienIch.length; i++){
        listUt.push(listTienIch[i].value)
    }
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var listLinkImg = await uploadMultipleFile(listFile);
    var ims = await uploadSingleFile(document.getElementById("imgbanner"))
    if(ims != null){
        linkbanner = ims
    }
    var room = {
        "room":{
            "id": id,
            "name": event.target.elements.tenphong.value,
            "image": linkbanner,
            "price": event.target.elements.price.value,
            "maxPeople": event.target.elements.maxPeople.value,
            "description": description,
            "numBed": event.target.elements.numBed.value,
            "category": {
                "id":event.target.elements.danhmuc.value
            },
        },
        "listImage":listLinkImg,
        "listUtilityId":listUt
    }
    console.log(room)
    const response = await fetch('http://localhost:8080/api/room/admin/create', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(room)
    });
    var result = await response.json();
    console.log(result)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm phòng thành công!",
            preConfirm: () => {
                window.location.href = 'room'
            }
        });
    } else {
        toast.error("Thêm/ sửa phòng thất bại");
        document.getElementById("loading").style.display = 'none'
    }
}


const AdminRoom = ()=>{
    const editorRef = useRef(null);
    const [itemTienIch, setItemTienIch] = useState([]);
    const [itemDanhmuc, setItemDanhMuc] = useState([]);
    const [room, setRoom] = useState(null);
    const [itemul, setItemUl] = useState([]);
    const [des, setDest] = useState('');
    useEffect(()=>{
        const getTienIch= async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/utilities/public/findAll");
            var list = await response.json();
            setItemTienIch(list)
        };
        getTienIch();
        const getDanhMuc= async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/category/public/findAll?type=ROOM");
            var list = await response.json();
            setItemDanhMuc(list)
        };
        getDanhMuc();
        const getRoom= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethodByToken('http://localhost:8080/api/room/admin/findById?id=' + id);
                var result = await response.json();
                setRoom(result)
                document.getElementById("anhdathem").style.display = 'block'
                linkbanner = result.image
                var listim = [];
                for(var i=0; i< result.roomUtilities.length; i++){
                    listim.push(result.roomUtilities[i].utilities)
                }
                setItemUl(listim)
                description = result.description;
            }
        };
        getRoom();
    }, []);

    function openChonAnh(){
        document.getElementById("choosefile").click();
    }

    function handleEditorChange(content, editor) {
        description = content;
    }
    console.log(room);


    function handleItemSelectChange(e){
        setItemUl(e);
    }

    async function deleteImage(id) {
        var con = window.confirm("Bạn muốn xóa ảnh này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/room-image/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa ảnh thành công!");
            document.getElementById("imgdathem" + id).style.display = 'none';
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <p>Thêm/ cập nhật phòng</p>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveRoom} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Tên phòng</label>
                                <input name="tenphong" defaultValue={room==null?'':room.name} class="form-control"/>
                                <label class="lb-form">Giá tiền</label>
                                <input name="price" defaultValue={room==null?'':room.price} class="form-control"/>
                                <label class="lb-form">Số giường</label>
                                <input name="numBed" defaultValue={room==null?'':room.numBed} class="form-control"/>
                                <label class="lb-form">Số người tối đa</label>
                                <input name="maxPeople" defaultValue={room==null?'':room.maxPeople} class="form-control"/>
                                <label class="lb-form">Danh mục phòng</label>
                                <select name="danhmuc" class="form-control">
                                    {itemDanhmuc.map((item=>{
                                         var s = room==null?'':room.category.id == item.id?'selected':''
                                        return <option selected={s} value={item.id}>{item.name}</option>
                                    }))}
                                </select>
                                <label class="lb-form">Tiện ích</label>
                                <AsyncSelect  name='tienich'
                                isMulti
                                value={itemul}
                                onChange={(item) => {
                                    handleItemSelectChange(item);
                                  }}
                                defaultOptions={itemTienIch} 
                                getOptionLabel={(itemTienIch)=>itemTienIch.name} 
                                getOptionValue={(itemTienIch)=>itemTienIch.id}  
                                placeholder="Chọn tiện ích"/>
                                <br/>
                                <div class="loading" id="loading">
                                    <div class="bar1 bar"></div>
                                </div><br/>
                                <button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-8 col-sm-12 col-12">
                                <label class="lb-form">Ảnh nền</label>
                                <input id="imgbanner" type="file" class="form-control"/>
                                <img src={room==null?'':room.image} id="imgpreproduct" className='imgadmin'/>
                                <br/><br/><label class="lb-form">Ảnh phụ</label>
                                <input accept="image/*" onChange={()=>previewImages()} id="choosefile" multiple type="file" className='hidden'/>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="row" id="preview">
                                            <div class="col-md-3" id="chon-anhs">
                                                <div id="choose-image" class="choose-image" onClick={()=>openChonAnh()}>
                                                    <p><i class="fas fa-camera" id="camera"></i></p>
                                                    <p id="numimage">Chọn ảnh phụ cho phòng</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="row" id="anhdathem" >
                                        <div class="col-sm-12">
                                            <h4 className='lbanhdathem'>Ảnh đã thêm</h4>
                                        </div>
                                        <div id="listanhdathem" class="row">
                                            {room==null?'': 
                                            room.roomImages.map((item=>{
                                                return <div id={"imgdathem"+item.id} class="col-md-3 col-sm-4 col-4">
                                                <img  src={item.image} class="image-upload"/>
                                                <button type='button' onClick={()=>deleteImage(item.id)} class="btn btn-danger form-control">Xóa ảnh</button>
                                            </div>
                                            })) }
                                        </div>
                                    </div>
                                </div>
                                <label class="lb-form lbmotadv">Mô tả dịch vụ</label>
                                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={room==null?'':room.description}
                                        value={room==null?'':room.description}
                                        onEditorChange={handleEditorChange}/>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}


function previewImages() {
    var files = document.getElementById("choosefile").files;
    for (var i = 0; i < files.length; i++) {
        listFile.push(files[i]);
    }

    var preview = document.querySelector('#preview');

    for (i = 0; i < files.length; i++) {
        readAndPreview(files[i]);
    }

    function readAndPreview(file) {

        var reader = new FileReader(file);

        reader.addEventListener("load", function() {
            document.getElementById("chon-anhs").className = 'col-sm-3';
            document.getElementById("chon-anhs").style.height = '100px';
            document.getElementById("chon-anhs").style.marginTop = '5px';
            document.getElementById("choose-image").style.height = '120px';
            document.getElementById("numimage").innerHTML = '';
            document.getElementById("camera").style.fontSize = '20px';
            document.getElementById("camera").style.marginTop = '40px';
            document.getElementById("camera").className = 'fas fa-plus';
            document.getElementById("choose-image").style.width = '90%';

            var div = document.createElement('div');
            div.className = 'col-md-3 col-sm-6 col-6';
            div.style.height = '120px';
            div.style.paddingTop = '5px';
            div.marginTop = '100px';
            preview.appendChild(div);

            var img = document.createElement('img');
            img.src = this.result;
            img.style.height = '85px';
            img.style.width = '90%';
            img.className = 'image-upload';
            img.style.marginTop = '5px';
            div.appendChild(img);

            var button = document.createElement('button');
            button.style.height = '30px';
            button.style.width = '90%';
            button.innerHTML = 'xóa'
            button.className = 'btn btn-warning';
            div.appendChild(button);

            button.addEventListener("click", function() {
                div.remove();
                console.log(listFile.length)
                for (i = 0; i < listFile.length; i++) {
                    if (listFile[i] === file) {
                        listFile.splice(i, 1);
                    }
                }
                console.log(listFile.length)
            });
        });

        reader.readAsDataURL(file);

    }

}

export default AdminRoom;
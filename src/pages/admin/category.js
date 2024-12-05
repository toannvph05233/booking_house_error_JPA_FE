import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';


var token = localStorage.getItem("token");

var imgbanner = '';
async function saveCategory(event) {
    event.preventDefault();
    var anh = await uploadSingleFile(document.getElementById("fileimage"))
    if(anh != null){
        imgbanner = anh;
    }
    const payload = {
        id: event.target.elements.idcate.value,
        name: event.target.elements.catename.value,
        image: imgbanner,
        categoryType: event.target.elements.typecate.value
    };
    const res = await fetch('http://localhost:8080/api/category/admin/create', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    if(res.status < 300){
        toast.success('Thành công!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
    }
};


const AdminCateory = ()=>{
    const [items, setItems] = useState([]);
    const [itemsType, setItemsType] = useState([]);
    const [cate, setCate] = useState(null);
    useEffect(()=>{
        const getCategrory = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/category/public/findAll");
            var list = await response.json();
            setItems(list)
        };
        getCategrory();
        const getCategroryType = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/category/public/get-all-type-category");
            var list = await response.json();
            setItemsType(list)
        };
        getCategroryType();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });


    async function deleteCategory(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa danh mục này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/category/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa danh mục thành công!");
            $('#example').DataTable().destroy();
            const getCategrory = async() =>{
                var response = await getMethodByToken("http://localhost:8080/api/category/public/findAll");
                var list = await response.json();
                setItems(list)
            };
            getCategrory();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    async function loadACategory(id){
        var response = await getMethodByToken("http://localhost:8080/api/category/admin/findById?id="+id);
        var result = await response.json();
        imgbanner = result.image
        setCate(result)
    }

    function clearInput(){
        // document.getElementById("idcate").value = ""
        // document.getElementById("catename").value = ""
        setCate(null);
        imgbanner = '';
    }

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div class="col-md-3">
                            <a onClick={()=>clearInput()} data-bs-toggle="modal" data-bs-target="#themdanhmuc" class="btn btn-success"><i class="fa fa-plus"></i> Thêm danh mục</a>
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
                                    <th>Tên danh mục</th>
                                    <th>Loại</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                                {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.image} className='imgadmin'/></td>
                                    <td>{item.name}</td>
                                    <td>{item.categoryType}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>deleteCategory(item.id)} class="fa fa-trash iconaction"></i>
                                        <a onClick={()=>loadACategory(item.id)} data-bs-toggle="modal" data-bs-target="#themdanhmuc"><i class="fa fa-edit iconaction"></i></a>
                                    </td>
                                </tr>
                                }))}
                            </tbody>
                        </table>

                    </div>
                </div>


                <div class="modal fade" id="themdanhmuc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Thêm/ cập nhật danh mục</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div class="modal-body">
                <form class="col-sm-5 marginauto" onSubmit={saveCategory} method='post'>
                    <input defaultValue={cate==null?'':cate.id} name="idcate" id='idcate' type="hidden" />
                    <label>Tên danh mục</label>
                    <input defaultValue={cate==null?'':cate.name} name="catename" id='catename' type="text" class="form-control" />
                    <label>Loại danh mục</label>
                    <select name="typecate" class="form-control">
                        {itemsType.map((item=>{
                            var s = cate==null?'':cate.categoryType == item?'selected':''
                            return <option selected={s} value={item}>{item}</option>
                        }))}
                    </select>
                    <label>Ảnh</label>
                    <input id='fileimage' name="fileimage" type="file" class="form-control" />
                    <img src={cate==null?'':cate.image} id="imgpreview" className='imgadmin'/>
                    <br/><br/>
                    <button onclick="saveCategory()" class="btn btn-success form-control action-btn">Thêm/ Cập nhật danh mục</button>
                </form>
            </div>
          </div>
        </div>
    </div>
        </div>
    );
}

export default AdminCateory;
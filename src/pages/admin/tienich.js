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

async function saveTienIch(event) {
    event.preventDefault();
    const payload = {
        id: event.target.elements.idti.value,
        name: event.target.elements.tentienich.value,
        icon: event.target.elements.icon.value
    };
    const res = await fetch('http://localhost:8080/api/utilities/admin/create', {
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


const AdminUlti = ()=>{
    const [items, setItems] = useState([]);
    const [tienich, setCate] = useState(null);
    useEffect(()=>{
        const getTi= async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/utilities/public/findAll");
            var list = await response.json();
            setItems(list)
        };
        getTi();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });


    async function deleteTienich(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa tiện ích này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/utilities/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethodByToken("http://localhost:8080/api/utilities/public/findAll");
            var list = await res.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    async function loadATienIch(id){
        var response = await getMethodByToken("http://localhost:8080/api/utilities/admin/findById?id="+id);
        var result = await response.json();
        setCate(result)
    }

    function clearInput(){
        setCate(null);
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
                                    <th>Icon</th>
                                    <th>Tên tiện ích</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                                {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><i className={item.icon}/></td>
                                    <td>{item.name}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>deleteTienich(item.id)} class="fa fa-trash iconaction"></i>
                                        <a onClick={()=>loadATienIch(item.id)} data-bs-toggle="modal" data-bs-target="#themdanhmuc"><i class="fa fa-edit iconaction"></i></a>
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
            <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Thêm/ cập nhật tiện ích</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div class="modal-body">
                <form class="col-sm-5 marginauto" onSubmit={saveTienIch} method='post'>
                    <input defaultValue={tienich==null?'':tienich.id} name="idti" type="hidden" />
                    <label>Tên tiện ích</label>
                    <input defaultValue={tienich==null?'':tienich.name} name="tentienich" type="text" class="form-control"/>
                    <label>Icon</label>
                    <input defaultValue={tienich==null?'':tienich.icon} name="icon" type="text" placeholder='fa fa-...' class="form-control"/>
                    <br/><br/>
                    <button class="btn btn-success form-control action-btn">Thêm/ Cập nhật tiện ích</button>
                </form>
            </div>
          </div>
        </div>
    </div>
        </div>
    );
}

export default AdminUlti;
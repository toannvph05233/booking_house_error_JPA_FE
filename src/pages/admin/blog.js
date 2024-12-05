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



const AdminBlog = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getBlog= async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/blog/public/findAll-list');
            var list = await response.json();
            setItems(list)
        };
        getBlog();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });


    async function deleteBlog(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa bài viết này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/blog/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethodByToken('http://localhost:8080/api/blog/public/findAll-list');
            var list = await res.json();
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
                            <a href='addblog' class="btn btn-success"><i class="fa fa-plus"></i> Thêm bài viết</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                    <table id="example" class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id bài viết</th>
                                    <th>Ảnh bìa</th>
                                    <th>ngày tạo</th>
                                    <th>Người tạo</th>
                                    <th>tiêu đề bài viết</th>
                                    <th>Lượt xem</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                                {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.imageBanner} className='imgadmin'/></td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.user.username}</td>
                                    <td>{item.title}</td>
                                    <td>{item.numView}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>deleteBlog(item.id)} class="fa fa-trash iconaction"></i>
                                        <a href={"addblog?id="+item.id}><i class="fa fa-edit iconaction"></i></a>
                                    </td>
                                </tr>
                                }))}
                            </tbody>
                        </table>

                    </div>
                </div>
        </div>
    );
}

export default AdminBlog;
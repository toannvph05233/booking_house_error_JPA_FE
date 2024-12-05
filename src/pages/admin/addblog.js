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

var linkbanner = '';
var description = '';
async function saveBlog(event) {
    event.preventDefault();
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var ims = await uploadSingleFile(document.getElementById("imgbanner"))
    if(ims != null){
        linkbanner = ims
    }
    var blog = {
        "id": id,
        "title": event.target.elements.title.value,
        "description": event.target.elements.description.value,
        "content": description,
        "imageBanner": linkbanner,
        "primaryBlog": document.getElementById("primaryBlog").checked,
    }
    console.log(blog)
    const response = await fetch('http://localhost:8080/api/blog/admin/create-or-update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(blog)
    });
    var result = await response.json();
    console.log(result)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'blog'
            }
        });
    } else {
        toast.error("Thêm/ sửa bài viết thất bại");
        document.getElementById("loading").style.display = 'none'
    }
}


const AdminAddBlog = ()=>{
    const editorRef = useRef(null);
    const [blog, setBlog] = useState(null);
    useEffect(()=>{
        const getBlog= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethodByToken('http://localhost:8080/api/blog/public/findById?id=' + id);
                var result = await response.json();
                setBlog(result)
                linkbanner = result.imageBanner
                description = result.content;
                document.getElementById("primaryBlog").checked = result.primaryBlog
            }
        };
        getBlog();
    }, []);

    function handleEditorChange(content, editor) {
        description = content;
    }

    console.log(blog);
    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <p>Thêm/ cập nhật bài viết</p>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveBlog} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Tiêu đề blog</label>
                                <input defaultValue={blog==null?'':blog.title} name="title" type="text" class="form-control"/>
                                <label class="checkbox-custom">Blog chính 
                                    <input defaultChecked={blog==null?false:blog.primaryBlog} id="primaryBlog" type="checkbox"/>
                                    <span class="checkmark-checkbox"></span>
                                </label><br/>
                                <label class="lb-form">Ảnh bài viết</label>
                                <input id="imgbanner" type="file" class="form-control"/>
                                <img id="imgpreview" className='imgadmin'/>
                                <label class="lb-form">Mô tả</label>
                                <textarea defaultValue={blog==null?'':blog.description} name="description" class="form-control"></textarea>
                                <div id="loading">
                                    <div class="bar1 bar"></div>
                                </div>
                                <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-8 col-sm-12 col-12">
                                <label class="lb-form lbmotadv">Nội dung bài viết</label>
                                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={blog==null?'':blog.content}
                                        onEditorChange={handleEditorChange}/>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}



export default AdminAddBlog;
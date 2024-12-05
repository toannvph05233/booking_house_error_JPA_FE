import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import defaulavt from '../../assest/images/avatar.jpg'

var token = localStorage.getItem('token');

async function loadStudentByToken(){
    var url = 'http://localhost:8080/api/student/student/my-infor';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}


function MyAccountInfor(){
    const [items, setItems] = useState(null);

    useEffect(()=>{
        const getMyInfor = async() =>{
            const response = await loadStudentByToken();
            var result = await response.json();
            setItems(result)
        };
        getMyInfor();
    }, []);

    return (
        <div className='container contentmain'>
            <h3 className='text-center'>THÔNG TIN SINH VIÊN</h3><br/>
            <div className='row'>
                <div className='col-sm-3'>
                    <div className='imgdivavt'>
                        <img className='avataracc' src={defaulavt}/>
                    </div>
                    <br/><span className='bold'>Số cmnd/ cccd</span>
                    <div className='blockcccd'>{items==null?"":items.profile.citizenIdentity==""?"":"Không"}</div>
                </div>
                <div className='col-sm-9 row'>
                    <div className='col-sm-4'>
                        <label>Họ và tên</label>
                        <div className='blockcccd'>{items==null?"":items.profile.fullname}</div>
                        <label>Ngày sinh</label>
                        <div className='blockcccd'>{items==null?"":items.profile.dob?.split("T")[0]}</div>
                        <label>Năm tốt nghiệp</label>
                        <div className='blockcccd'>{items==null?"":items.studentInfor.graduationYear}</div>
                        <label>Dân tộc</label>
                        <div className='blockcccd'>{items==null?"":items.studentInfor.ethnicity}</div>
                    </div>
                    <div className='col-sm-4'>
                        <label>Lớp</label>
                        <div className='blockcccd'>{items==null?"":items.classes==null?"Chưa có lớp":items.classes.name}</div>
                        <label>Giới tính</label>
                        <div className='blockcccd'>{items==null?"":items.profile.gender==true?"Nam":"Nữ"}</div>
                        <label>Loại tốt nghiệp</label>
                        <div className='blockcccd'>{items==null?"":items.studentInfor.rankedAcademic}</div>
                    </div>
                    <div className='col-sm-4'>
                        <label>Mã sinh viên</label>
                        <div className='blockcccd'>{items==null?"":items.user.username}</div>
                        <label>Ngành học</label>
                        <div className='blockcccd'>{items==null?"":items.facultyName}</div>
                        <label>Mã trường thpt</label>
                        <div className='blockcccd'>{items==null?"":items.studentInfor.schoolCode}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAccountInfor;
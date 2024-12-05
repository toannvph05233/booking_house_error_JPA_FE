import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';

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

async function loadSubject(param){
    if(param == null){
        param = "";
    }
    var url = 'http://localhost:8080/api/subject-faculty/student/get-subject-facultyId-or-name?search='+param;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}


function LoadCurriculum(){
    const [items, setItems] = useState(null);
    const [itemSubject, setItemSubject] = useState([]);

    useEffect(()=>{
        const getMyInfor = async() =>{
            const response = await loadStudentByToken();
            var result = await response.json();
            setItems(result)
        };
        getMyInfor();
        const getSubject = async() =>{
            const response = await loadSubject(null);
            var result = await response.json();
            setItemSubject(result)
        };
        getSubject();
    }, []);

    async function searchByParam(){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        const response = await loadSubject(param);
        var result = await response.json();
        setItemSubject(result)
    }

    return (
        <div className='container'>
            <div className='col-sm-6 std-block'>
                <div className='inner-std-block'>
                    <table className='table'>
                        <tr>
                            <td>Mã sinh viên</td>
                            <td className='textblod'>{items==null?"":items.user.username}</td>
                        </tr>
                        <tr>
                            <td>Tên sinh viên</td>
                            <td className='textblod'>{items==null?"":items.profile.fullname}</td>
                        </tr>
                        <tr>
                            <td>Giới tính</td>
                            <td>{items==null?"":items.profile.gender==true?"Nam":"Nữ"}</td>
                        </tr>
                        <tr>
                            <td>Quê quán</td>
                            <td>{items==null?"":items.profile.address}</td>
                        </tr>
                        <tr>
                            <td>Lớp</td>
                            <td>{items==null?"":items.classes==null?"":items.classes.name}</td>
                        </tr>
                        <tr>
                            <td>Ngành</td>
                            <td className='textblod'>{items==null?"":items.facultyName}</td>
                        </tr>
                        <tr>
                            <td>Khóa học</td>
                            <td className='textblod'>{items==null?"":items.academicYear+"-"+Number(Number(items.academicYear)+4)}</td>
                        </tr>
                        <tr>
                            <td>Hệ đào tạo</td>
                            <td>Đại học chính quy</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div className='ctdt-block'>
                <input onKeyUp={searchByParam} id='searchtable' className='inputsearchdt' placeholder='Tìm kiém'/>
                <table className='table tablectdt'>
                    <thead className='theadblue'>
                        <tr>
                            <th>STT</th>
                            <th>Mã môn học</th>
                            <th>Tên môn học</th>
                            <th>Số TC</th>
                            <th>Số LT</th>
                            <th>Số TH</th>
                            <th>Số BT</th>
                            <th>Môn tiên quyết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemSubject.map((item, index)=>{
                            return <tr>
                            <td>{index+1}</td>
                            <td>{item.subject.subjectCode}</td>
                            <td>{item.subject.name}</td>
                            <td>{item.subject.creditNum}</td>
                            <td>{item.subject.theoryNum}</td>
                            <td>{item.subject.practicalNum}</td>
                            <td>{item.subject.numExercise}</td>
                            <td>{item.subject.prerequisite==null?"":item.subject.prerequisite.subjectCode}</td>
                        </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LoadCurriculum;
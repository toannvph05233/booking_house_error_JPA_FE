import lich from '../../assest/images/lich.png'
import { useState, useEffect } from 'react'
import {getMethodByToken} from '../../services/request'
import {formatMoney} from '../../services/money'



const HomeAdmin = ()=>{
    const [doanhthu, setDoanhThu] = useState(null);
    const [quantri, setQt] = useState(null);
    const [sophong, setSoPhong] = useState(null);
    useEffect(()=>{
        const getDoanhThu = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/statistic/admin/revenue-this-month");
            var result = await response.text();
            setDoanhThu(result)
        };
        getDoanhThu();
        const getQt = async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/statistic/admin/number-admin');
            var result = await response.text();
            setQt(result)
        };
        getQt();
        const getPhong = async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/statistic/admin/number-room');
            var result = await response.text();
            setSoPhong(result)
        };
        getPhong();
    }, []);

    function getDateTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds(); //
        var a = 0;
        //
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (day.toString().length == 1) {
            day = '0' + day;
        }
        if (hour.toString().length == 1) {
            hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            second = '0' + second;
        }
        var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' +
            minute + ':' + second;
        return dateTime;
    }
    setInterval(function() {
        var currentTime = getDateTime();
        document.getElementById("digital-clock").innerHTML = currentTime;
    }, 1000);
    
    var date = new Date();
    
    var current_day = date.getDay();
    
    var day_name = '';
    
    switch (current_day) {
        case 0:
            day_name = "Chủ nhật";
            break;
        case 1:
            day_name = "Thứ hai";
            break;
        case 2:
            day_name = "Thứ ba";
            break;
        case 3:
            day_name = "Thứ tư";
            break;
        case 4:
            day_name = "Thứ năm";
            break;
        case 5:
            day_name = "Thứ sáu";
            break;
        case 6:
            day_name = "Thứ bảy";
    }
    return(
        <div class="main-component">
                    <div class="col-md-9 animated bounce">
                        <div class="d-flex align-items-center mb-4 pb-4 border-bottom">
                            <div class="ms-3">
                                <img alt="" src={lich} />
                                <h2 class=" text-uppercase fw-weight-bold mb-0">
                                    <script language="javascript">
                                        document.write(day_name);
                                    </script>
                                </h2>
                                <p class="text-gray fst-italic mb-0">
                                    <div id="digital-clock"></div>
                                </p>
                            </div>
                        </div>
                        
                        <div class="thongke">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="thongke1">
                                        <div class="texts">Doanh thu tháng này (VND)</div>
                                        <div>
                                        </div>
                                        <div class="soluong">
                                            <b id="doanhThu">{formatMoney(doanhthu)}</b>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="thongke2">
                                        <div class="texts">Số lượng quản trị</div>
                                        <div>
                                        </div>
                                        <div class="soluong">
                                            <b id="soLuongNV">{quantri}</b>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="thongke3">
                                        <div class="texts">Số lượng phòng hiện có</div>
                                        <div>
                                        </div>
                                        <div class="soluong">
                                            <b id="soLuongMH">{sophong}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
    );
}
export default HomeAdmin;
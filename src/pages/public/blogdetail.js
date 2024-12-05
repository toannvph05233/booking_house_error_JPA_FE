import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import indeximg from '../../assest/images/index1.jpg'
import index2img from '../../assest/images/index2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.jpg'

var size = 6

function PublicCheckOut(){
    const [items, setItems] = useState(null);
    useEffect(()=>{
      const getBlog = async() =>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var result = await getMethod('http://localhost:8080/api/blog/public/findById?id=' + id);
        setItems(result)
      };
      getBlog();
  }, []);

    return(
        <div class="contentmain">
        <div class="contentdtbg">
            <p class="titledtblog" id="title">{items==null?'':items.title}</p>
            <div class="userblog">
                <img src={items==null?'':avatar} class="avatardeblog"/>
                <span class="">Biên tập bởi : <span id="userbldt">{items==null?'':items.user.fullname}</span></span>
                <span class="timedtblog"><i class="fa fa-clock"></i> <span id="ngaydang">{items==null?'':items.createdDate}</span></span>
            </div>
            <img id="imgbanner" src="image/blog.webp" alt="" class="imgbldt"/><br/> <br/>
            <span class="desdetailblog">{items==null?'':items.description}</span>

            <div id="contentdetailblog" dangerouslySetInnerHTML={{__html: items==null?'':items.content}}>

            </div>
        </div>
    </div>
    );
}

export default PublicCheckOut;

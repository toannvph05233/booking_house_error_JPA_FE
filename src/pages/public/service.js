import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import indeximg from '../../assest/images/index1.jpg'
import nangtam from '../../assest/images/nangtam.png'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.jpg'
import ReactPaginate from 'react-paginate';

var size = 6

function PublicService(){
    const [items, setItems] = useState([]);
    const [itemCateService, setItemCateService] = useState([]);
    const [itemCateRoom, setItemCateRoom] = useState([]);
    const [itemDv, setItemDve] = useState(null);
    useEffect(()=>{
      const getCategory = async() =>{
          var result = await getMethod('http://localhost:8080/api/category/public/findAll?type=SERVICE');
          setItemCateService(result)
          var result = await getMethod('http://localhost:8080/api/category/public/findAll?type=ROOM');
          setItemCateRoom(result)
      };
      getCategory();
      const getService = async() =>{
          var result = await getMethod('http://localhost:8080/api/services/public/findAll');
          setItems(result)
      };
      getService();
  }, []);

    async function getDv(idblog){
        const result = await getMethod('http://localhost:8080/api/services/public/findById?id='+idblog);
        setItemDve(result)
    };
    async function loadServiceByCategory(idcategory){
        const result = await getMethod('http://localhost:8080/api/services/public/findByCategory?id='+idcategory);
        setItems(result)
    }

    return(
        <div class="contentmain">
        <div class="classnt">
            <img src={nangtam} class="imgnt"/>
        </div>
        <div class="row listcateservicename" id="listcateroomname">
            {itemCateRoom.map((item, index)=>{
              return <div class="col-sm-4">
                        <p class="cateservicename"><a href={"booking-room?room="+item.id}>{item.name}</a></p>
                        <a href={"booking-room?room="+item.id}><img src={item.image} class="imgcategory"/></a>
                    </div>
            })}
        </div>


        <p class="title-section"><span>DỊCH VỤ</span></p>
        <div class="row listcateservicename" id="listcateservicename">
            {itemCateService.map((item, index)=>{
              return <div onClick={()=>loadServiceByCategory(item.id)} class="col-sm-4">
                        <p class="cateservicename">{item.name}</p>
                    </div>
            })}
        </div>

        <div class="row" id="listserviceindex">
            {items.map((item, index)=>{
              return <div onClick={()=>getDv(item.id)} class="col-sm-4 singledv pointer" data-bs-toggle="modal" data-bs-target="#modaldeail">
              <p class="titledv">{item.category.name}</p>
              <a><img src={item.image} class="blogimg"/></a>
              <div class="contentbl">
                <a href="" class="titleblog">{item.name}</a>
                <span class="desdichvu" dangerouslySetInnerHTML={{__html:item.description}}></span>
              </div>
            </div>
            })}
        </div>


        
      <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-fullscreen-sm-down">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chi tiết dịch vụ</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="row contentdetailproduct">
                    <div class="col-sm-6">
                        <img id="imgdetailpro" src={itemDv==null?'':itemDv.image} class="imgdetailpro"/>
                        <div class="listimgdetail row" id="listimgdetail">
                          {itemDv==null?'':
                            itemDv.serviceImages.map((item, index)=>{
                                return <div class="col-sm-3 singdimg">
                                <br/><img onclick="clickImgdetail(this)" src={item.image} class="imgldetail"/>
                            </div>
                            })
                          }
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <span class="detailnamepro" id="detailnamepro">{itemDv==null?'':itemDv.name}</span>
                        <div class="blockdetailpro">
                            <span class="codepro" id="codepro">{itemDv==null?'':itemDv.category.name}</span>
                            <span class="quansale" id="quansale">Lượt đặt 5.0K</span>
                        </div>
                        <p class="pricedetail" id="pricedetail">{itemDv==null?'':formatMoney(itemDv.price)}</p>
                    </div>
                    <div class="col-lg-12 motasp">
                        <p class="titledes">Mô tả dịch vụ</p>
                        <div id="descriptiondetail" dangerouslySetInnerHTML={ {__html: itemDv==null?'':itemDv.description} } >
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    );
}

export default PublicService;

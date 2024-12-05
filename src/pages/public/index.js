import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import indeximg from '../../assest/images/index1.jpg'
import index2img from '../../assest/images/index2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";



function Home(){
    const [itemsblog, setItemsBlog] = useState([]);
    const [itemsservice, setItemsService] = useState([]);
    const [itemDv, setItemDve] = useState(null);
    useEffect(()=>{
      const getBlog = async() =>{
          const result = await getMethod('http://localhost:8080/api/blog/public/top-8-blog');
          setItemsBlog(result)
      };
      getBlog();
      const getService = async() =>{
          const result = await getMethod('http://localhost:8080/api/services/public/findAll');
          setItemsService(result)
      };
      getService();
  }, []);

  async function getDv(idblog){
      const result = await getMethod('http://localhost:8080/api/services/public/findById?id='+idblog);
      setItemDve(result)
  };

    return(
        <div class="contentmain">
      <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <a href="#"><img src={banner} class="d-block w-100"/></a>
            </div>
            <div class="carousel-item">
                <a href="#"><img src={banner} class="d-block w-100"/></a>
            </div>
            <div class="carousel-item">
                <a href="#"><img src={banner} class="d-block w-100"/></a>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      <section>
        <p class="title-section"><span>BÀI VIẾT</span></p>
        <div class="row" id="listblogindex">
          
          {itemsblog.map((item, index)=>{
              return <div class="col-sm-3 singleblog">
              <a href={"blogdetail?id="+item.id}><img src={item.imageBanner} class="blogimg"/></a>
              <div class="contentbl">
                <a href={"blogdetail?id="+item.id} class="titleblog">{item.title}</a>
                <span class="desblog">{item.description}</span>
                <span class="blogdate">{item.createdDate}</span>
              </div>
            </div>
          })}
        </div>
      </section>


      <section>
        <p class="title-section"><span>DỊCH VỤ</span></p>
        <div class="row" id="listserviceindex">
          {itemsservice?.map((item, index)=>{
              return <div onClick={()=>getDv(item.id)}  data-bs-toggle="modal" data-bs-target="#modaldeail" class="col-sm-4 singledv">
              <p class="titledv">{item.category.name}</p>
              <a><img src={item.image} class="blogimg"/></a>
              <div class="contentbl">
                <a class="titleblog">{item.name}</a>
                <div class="desdichvu">
                <div dangerouslySetInnerHTML={ {__html: item.description} } />
                </div>
              </div>
            </div>
          })}
        </div>
      </section>


      <section class="desindexs">
        <div class="row">
          <div class="col-sm-6 singimgsindex">
            <img src={indeximg} class="imgindex"/>
          </div>
          <div class="col-sm-6 singimgsindex">
            <img src={index2img} class="imgindex"/>
          </div>
        </div>
      </section>

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

export default Home;

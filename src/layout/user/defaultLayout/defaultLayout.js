import Headers from "../header/header";
import Footer from "../footer/footer"

function DefaultLayout({children}){
    return (
        <div>
            <Headers/>
            {children}
            <Footer/>
        </div>
    );
}

export default DefaultLayout;
import layoutAdmin from '../layout/admin/Layout'
import layoutEmployee from '../layout/employee/LayoutEmployee'
import layoutLogin from '../layout/user/loginlayout/login'

//admin
import homeAdmin from '../pages/admin/index'
import userAdmin from '../pages/admin/user'
import AdminCateory from '../pages/admin/category'
import AdminUlti from '../pages/admin/tienich'
import AdminRoom from '../pages/admin/room'
import AdminAddRoom from '../pages/admin/addroom'
import AdminEmptyRoom from '../pages/admin/emptyroom'
import AdminService from '../pages/admin/service'
import AdminAddService from '../pages/admin/addservice'
import AdminBlog from '../pages/admin/blog'
import AdminAddBlog from '../pages/admin/addblog'
import AdminBooking from '../pages/admin/booking'
import AdminDoanhThu from '../pages/admin/doanhthu'


//public
import login from '../pages/public/login'
import index from '../pages/public/index'
import regis from '../pages/public/regis'
import confirm from '../pages/public/confirm'
import PublicBlog from '../pages/public/blog'
import PublicBlogDetail from '../pages/public/blogdetail'
import PublicService from '../pages/public/service'
import PublicBookingRoom from '../pages/public/bookingroom'
import PublicForgot from '../pages/public/forgot'
import PublicCheckOut from '../pages/public/checkout'
import PublicPayment from '../pages/public/payment'
import PublicAccount from '../pages/public/account'

//private
import DefaultLayout from '../layout/user/defaultLayout/defaultLayout'
import curriculum from '../pages/student/curriculum'
import accountStudent from '../pages/student/account'

const publicRoutes = [
    { path: "/", component: index},
    { path: "/index", component: index},
    { path: "/login", component: login, layout: layoutLogin },
    { path: "/regis", component: regis, layout: layoutLogin },
    { path: "/confirm", component: confirm, layout: layoutLogin },
    { path: "/blog", component: PublicBlog},
    { path: "/blogdetail", component: PublicBlogDetail},
    { path: "/service", component: PublicService},
    { path: "/booking-room", component: PublicBookingRoom},
    { path: "/forgot", component: PublicForgot, layout: layoutLogin},
    { path: "/checkout", component: PublicCheckOut, layout: layoutLogin},
    { path: "/payment", component: PublicPayment, layout: layoutLogin},
    { path: "/account", component: PublicAccount},
];

const privateRoutes = [
    { path: "/dao-tao/student", component: curriculum, layout: DefaultLayout},
    { path: "/account-student", component: accountStudent, layout: DefaultLayout},
];

const adminRoutes = [
    { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCateory, layout: layoutAdmin },
    { path: "/admin/tienich", component: AdminUlti, layout: layoutAdmin },
    { path: "/admin/room", component: AdminRoom, layout: layoutAdmin },
    { path: "/admin/addroom", component: AdminAddRoom, layout: layoutAdmin },
    { path: "/admin/empty-room", component: AdminEmptyRoom, layout: layoutAdmin },
    { path: "/admin/dichvu", component: AdminService, layout: layoutAdmin },
    { path: "/admin/adddichvu", component: AdminAddService, layout: layoutAdmin },
    { path: "/admin/blog", component: AdminBlog, layout: layoutAdmin },
    { path: "/admin/addblog", component: AdminAddBlog, layout: layoutAdmin },
    { path: "/admin/booking", component: AdminBooking, layout: layoutAdmin },
    { path: "/admin/doanhthu", component: AdminDoanhThu, layout: layoutAdmin },
];



export { publicRoutes, privateRoutes, adminRoutes};

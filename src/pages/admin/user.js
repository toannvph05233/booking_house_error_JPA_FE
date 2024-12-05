import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

async function loadUser(role) {
    const url = role
        ? `http://localhost:8080/api/admin/get-user-by-role?role=${role}`
        : `http://localhost:8080/api/admin/get-user-by-role`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}
const UserDetailModal = ({ user, onClose }) => {
    const [userType, setUserType] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user_type/${user.id}/type`);
                const data = await response.text();
                setUserType(data);
            } catch (error) {
                console.error("Error fetching user type:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserType();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thông tin chi tiết</h5>
                        <button type="button" className="close" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : (
                            <>
                                <p><strong>Họ tên:</strong> {user.fullname}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Số điện thoại:</strong> {user.phone}</p>
                                <p><strong>Loại khách hàng:</strong> {userType}</p>
                                <p><strong>Ngày tạo:</strong> {user.createdDate}</p>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminUser = () => {
    const [items, setItems] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getUser = async (role) => {
            var response = await loadUser(role);
            var listUser = await response.json();
            setItems(listUser);
        };
        getUser("");
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            $("#example").DataTable();
        }
    }, [items]);

    async function filterUser() {
        $("#example").DataTable().destroy();
        var role = document.getElementById("role").value;
        var response = await loadUser(role);
        var listUser = await response.json();
        setItems(listUser);
    }

    async function lockOrUnlock(id, type) {
        const confirmAction = window.confirm("Xác nhận hành động?");
        if (!confirmAction) return;

        const url = `http://localhost:8080/api/admin/lockOrUnlockUser?id=${id}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status < 300) {
            const message = type === 1 ? "Khóa thành công" : "Mở khóa thành công";
            toast.success(message);
            filterUser();
        } else {
            toast.error("Thất bại");
        }
    }

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setShowModal(false);
    };

    return (
        <div>
            <div className="col-sm-12 header-sp">
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-6">
                        <label className="lb-form">Chọn quyền</label>
                        <select onChange={() => filterUser()} id="role" className="form-control">
                            <option value="">Tất cả quyền</option>
                            <option value="ROLE_USER">Tài khoản người dùng</option>
                            <option value="ROLE_ADMIN">Tài khoản admin</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="wrapper">
                    <table id="example" className="table table-striped tablefix">
                        <thead className="thead-tablefix">
                        <tr>
                            <th>id</th>
                            <th>Email</th>
                            <th>Họ tên</th>
                            <th>Số điện thoại</th>
                            <th>Ngày tạo</th>
                            <th>Loại khách hàng</th>
                            <th>Quyền</th>
                            <th>Khóa</th>
                        </tr>
                        </thead>
                        <tbody id="listuser">
                        {items.map((item) => {
                            const btn = item.actived ? (
                                <button onClick={() => lockOrUnlock(item.id, 1)} className="btn btn-primary">
                                    <i className="fa fa-lock"></i> Khóa
                                </button>
                            ) : (
                                <button onClick={() => lockOrUnlock(item.id, 0)} className="btn btn-danger">
                                    <i className="fa fa-unlock"></i> mở khóa
                                </button>
                            );

                            return (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <button onClick={() => openModal(item)} className="btn btn-link">
                                            {item.fullname}
                                        </button>
                                    </td>
                                    <td>{item.phone}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.type}</td>
                                    <td>{item.authorities?.name}</td>
                                    <td className="sticky-col">{btn}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && <UserDetailModal user={selectedUser} onClose={closeModal} />}
        </div>
    );
};

export default AdminUser;

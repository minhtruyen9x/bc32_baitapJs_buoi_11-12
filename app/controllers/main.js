updateUI();


// Lấy dữ liệu nhập từ form
function getFormData() {
    let account = dom("#TaiKhoan").value.trim()
    let name = dom("#HoTen").value.trim()
    let password = dom("#MatKhau").value.trim()
    let email = dom("#Email").value.trim()
    let avatar = dom("#HinhAnh").value.trim()
    let role = dom("#loaiNguoiDung").value.trim()
    let language = dom("#loaiNgonNgu").value.trim()
    let description = dom("#MoTa").value.trim()

    let user = new User(null, account, name, password, email, avatar, role, language, description)
    return user
}
// reset form data
function resetForm() {
    dom("#accountID").value = ''
    dom("#TaiKhoan").value = ''
    dom("#HoTen").value = ''
    dom("#MatKhau").value = ''
    dom("#Email").value = ''
    dom("#HinhAnh").value = ''
    dom("#loaiNguoiDung").value = ''
    dom("#loaiNgonNgu").value = ''
    dom("#MoTa").value = ''
    dom("#TaiKhoan").disabled = false

    resetErrorMess()
}

//hàm close form-modal
function closeForm() {
    dom(".close[data-dismiss='modal']").click()
}

function render(users) {
    let htmls = users.reduce((result, user, index) => {
        return result + `
            <tr data-id=${user.id}>
                <td>${index}</td>
                <td>${user.account}</td>
                <td>${user.password}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.language}</td>
                <td>${user.role}</td>
                <td>
                    <button
                        class="btn btn-warning"
                        data-type="delete"
                    >
                        Delete
                    </button>
                <button
                    class="btn btn-info"
                    data-toggle="modal"
                    data-target="#myModal"
                    data-type="edit"
                >
                    Edit
                </button>
                </td>
            </tr>
        `
    }, "")

    dom("#tblDanhSachNguoiDung").innerHTML = htmls;
}


function updateUI(searchTerm) {
    getUser(searchTerm)
        .then(users => {
            render(users)
        })
        .catch(error => {
            sendErrorMess("ERROR:Can not update UI")
        })
}
// xử lý khi nhấn nút mở modal thêm người dùng
dom("#btnThemNguoiDung").addEventListener("click", () => {
    resetForm()
    dom(".modal-title").innerText = "Thêm người dùng"
    dom(".modal-footer").innerHTML = `
        <button 
            class="btn btn-info"
            data-dismiss="modal"
        >
            Cancel
        </button>
        <button 
            class="btn btn-success"
            data-type="add"
        >
            Xác nhận
        </button>
    `
})

// xử lý khi nhấn các nút trong modal-dialog
dom("body").addEventListener("click", event => {
    let target = event.target
    let targetType = target.dataset.type

    if (!targetType) return

    // xử lý khi nhấn nút thêm
    if (targetType === "add") {
        target.disabled = true
        let user = getFormData()
        validateForm()
            .then(() => {
                return addUser(user)
            })
            .then(user => {
                updateUI()
                closeForm()
                sendSuccessMess(`You've added account [${user.account}] successfully`)
            })
            .catch(error => {
                target.disabled = false
                sendErrorMess(`Add account has been denied`)
            })
    }

    // xử lý khi nhấn nút delete
    if (targetType === "delete") {
        target.disabled = true
        let userID = target.closest("tr").dataset.id
        deleteUser(userID)
            .then(user => {
                updateUI()
                sendSuccessMess(`You've deleted account [${user.account}] successfully`)
            })
            .catch(err => {
                target.disabled = false
                sendErrorMess("Delete account has been denied")
            })
    }

    // xử lý khi nhấn nút edit
    if (targetType == "edit") {
        resetForm()
        dom("#TaiKhoan").disabled = true
        dom(".modal-title").innerText = "Cập nhật người dùng"
        dom(".modal-footer").innerHTML = `
            <button 
                class="btn btn-info"
                data-dismiss="modal"
            >
                Cancel
            </button>
            <button 
                class="btn btn-success"
                data-type="update"
            >
                Cập nhật
            </button>
        `

        let userID = target.closest("tr").dataset.id

        getUserByID(userID)
            .then(user => {
                dom("#accountID").value = user.id
                dom("#TaiKhoan").value = user.account
                dom("#HoTen").value = user.name
                dom("#MatKhau").value = user.password
                dom("#Email").value = user.email
                dom("#HinhAnh").value = user.avatar
                dom("#loaiNguoiDung").value = user.role
                dom("#loaiNgonNgu").value = user.language
                dom("#MoTa").value = user.description
            })
            .catch(err => {
                sendErrorMess("server not found")
            })
    }

    // xử lý khi nhấn nút Cập nhật
    if (targetType === "update") {
        target.disabled = true
        let userID = dom("#accountID").value
        let user = getFormData()
        validateForm("edit")
            .then(() => {
                return updateUserByID(userID, user)
            })
            .then(user => {
                updateUI()
                closeForm()
                sendSuccessMess(`You've updated account [${user.account}] successfully`)
            })
            .catch(error => {
                target.disabled = false
                sendErrorMess(`Update account has been denied`)
            })
    }

})

// xử lý khi tìm kiếm user bằng name
function searchUser() {
    let searchTerm = dom("#searchInput").value
    updateUI(searchTerm)
}
dom("#basic-addon2").addEventListener("click", searchUser)
dom("#searchInput").addEventListener("keydown", event => {
    if (event.key !== "Enter") return
    searchUser()
})

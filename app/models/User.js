function User(id, account, name, password, email, avatar, role, language, description) {
    this.id = id
    this.account = account
    this.name = name
    this.password = password
    this.email = email
    this.avatar = avatar
    this.role = role
    this.language = language
    this.description = description
}

function getUser(searchTerm) {
    return apiGetUser(searchTerm)
        .then(respones => {
            let users = respones.data.map(user => {
                return new User(
                    user.id,
                    user.account,
                    user.name,
                    user.password,
                    user.email,
                    user.avatar,
                    user.role,
                    user.language,
                    user.description)
            })
            return Promise.resolve(users)
        })
        .catch(error => {
            console.log("Không lấy được data do có lỗi phát sinh")
            return Promise.reject(error)
        })
}

function addUser(user) {
    return apiAddUser(user)
        .then(response => {
            return Promise.resolve(response.data)
        })
        .catch(error => {
            console.log("Không thể thêm account do có lỗi phát sinh")
            return Promise.reject(error)
        })
}

function deleteUser(userID) {
    return apiDeleteUser(userID)
        .then(response => {
            return Promise.resolve(response.data)
        })
        .catch(error => {
            console.log("Không thể xóa account do có lỗi phát sinh")
            return Promise.reject(error)
        })
}

function getUserByID(userID) {
    return apiGetUserByID(userID)
        .then(response => {
            return Promise.resolve(response.data)
        })
        .catch(error => {
            console.log("Không lấy được data account do có lỗi phát sinh")
            return Promise.reject(error)
        })
}

function updateUserByID(userID, user) {
    return apiUpdateUserByID(userID, user)
        .then(response => {
            return Promise.resolve(response.data)
        })
        .catch(error => {
            console.log("Không update được data account do có lỗi phát sinh")
            return Promise.reject(error)
        })
}
function apiGetUser(searchTerm) {
    return axios({
        url: "https://62f50942535c0c50e7684902.mockapi.io/users",
        method: "GET",
        params: {
            name: searchTerm
        }
    })
}

function apiGetUserByID(userID) {
    return axios({
        url: `https://62f50942535c0c50e7684902.mockapi.io/users/${userID}`,
        method: "GET"
    })
}

function apiAddUser(user) {
    return axios({
        url: "https://62f50942535c0c50e7684902.mockapi.io/users",
        method: "POST",
        data: user
    })
}

function apiDeleteUser(userID) {
    return axios({
        url: `https://62f50942535c0c50e7684902.mockapi.io/users/${userID}`,
        method: "DELETE",
    })
}

function apiUpdateUserByID(userID, user) {
    return axios({
        url: `https://62f50942535c0c50e7684902.mockapi.io/users/${userID}`,
        method: "PUT",
        data: user
    })
}
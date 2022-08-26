function dom(selector) {
    return document.querySelector(selector)
}

function domAll(selector) {
    return document.querySelectorAll(selector)
}


//**************** Validator************************* */


function sameIDRule(value, array, prop, message) {
    return new Promise((resolve, reject) => {
        if (array.find(element => element[prop] === value)) {
            reject(message || "ID bị trùng không thể thêm mới")
        } else {
            resolve()
        }
    })
}
function emptyRule(value, message) {
    return new Promise((resolve, reject) => {
        if (!value) {
            reject(message || "Trường này chưa nhập thông tin")
        } else {
            resolve()
        }
    })
    // return Promise.resolve()
}
function rangeCharactorRule(value, min, max, message) {
    return new Promise((resolve, reject) => {
        if (value.length < min || value.length > max) {
            reject(message || `Giá trị nhập phải nằm từ ${min} đến ${max}`)
        } else {
            resolve()
        }
    })
}

function urlRule(value, message) {
    return new Promise((resolve, reject) => {
        axios({
            url: value,
            method: "GET"
        })
            .then(() => resolve())
            .catch(() => reject(message || `Your url image is not valid`))
    })
}
function characterRule(value, message) {
    return new Promise((resolve, reject) => {
        let regex = /\b([A-ZÀ-ÿ][-,a-z. '][a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+[ ]*)+/
        if (!regex.test(value)) {
            reject(message || "Nhập tên không chính xác")
        } else {
            resolve()
        }
    })
}

function emailRule(value, message) {
    return new Promise((resolve, reject) => {
        let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (!regex.test(value)) {
            reject(message || "Email nhập không hợp lệ")
        } else {
            resolve()
        }
    })
}

function passwordRule(value, message) {
    return new Promise((resolve, reject) => {
        let regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,8}$/
        if (!regex.test(value)) {
            reject(message || "Trường này phải có từ 6-8 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)")
        } else {
            resolve()
        }
    })
}

function validateForm() {
    return Promise.allSettled([validateAccount(), validateName(), validatePass(), validateEmail(), validateAvatar(), validateRole(), validateLanguage(), validateDescription()])
}

function validateAccount() {
    return new Promise((resolve, reject) => {
        const accountEl = dom("#TaiKhoan")
        const spanEl = accountEl.closest(".form-group").querySelector(".form-message")
        Promise.all([emptyRule(accountEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })
    })
}

function validateName() {
    return new Promise((resolve, reject) => {
        const nameEl = dom("#HoTen")
        const spanEl = nameEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(nameEl.value.trim()), characterRule(nameEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })

    })
}

function validatePass() {
    return new Promise((resolve, reject) => {
        const passEl = dom("#MatKhau")
        const spanEl = passEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(passEl.value.trim()), passwordRule(passEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })

    })
}

function validateEmail() {
    return new Promise((resolve, reject) => {
        const emailEl = dom("#Email")
        const spanEl = emailEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(emailEl.value.trim()), emailRule(emailEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })

    })
}



function validateAvatar() {
    return new Promise((resolve, reject) => {
        const avatarEl = dom("#HinhAnh")
        const spanEl = avatarEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(avatarEl.value.trim()), urlRule(avatarEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })
    })
}


function validateRole() {
    return new Promise((resolve, reject) => {
        const roleEl = dom("#loaiNguoiDung")
        const spanEl = roleEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(roleEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })
    })
}

function validateLanguage() {
    return new Promise((resolve, reject) => {
        const languageEl = dom("#loaiNgonNgu")
        const spanEl = languageEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(languageEl.value.trim())])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })
    })
}

function validateDescription() {
    return new Promise((resolve, reject) => {
        const descriptionEl = dom("#MoTa")
        const spanEl = descriptionEl.closest(".form-group").querySelector(".form-message")

        Promise.all([emptyRule(descriptionEl.value.trim()), rangeCharactorRule(descriptionEl.value.trim(), 1, 60)])
            .then(() => {
                spanEl.innerText = ""
                resolve(true)
            })
            .catch(message => {
                spanEl.innerText = message
                reject(false)
            })
    })
}


function dom(selector) {
    return document.querySelector(selector)
}

function domAll(selector) {
    return document.querySelectorAll(selector)
}

//**************** Validator************************* */
// Hàm validate
function validate(inputID, rules) {
    if (!Array.isArray(rules)) rules = [rules]
    const inputEl = dom(inputID)
    const spanEl = inputEl.closest(".form-group").querySelector(".form-message")
    let errorMess
    for (const rule of rules) {
        errorMess = rule(inputEl.value.trim())
        if (errorMess) {
            spanEl.innerText = errorMess
            return false
        }
    }
    spanEl.innerText = ""
    return true
}
// =============== Tạo các rule kiểm tra value của input nhầm tái sử dụng các rule ===============
function emptyRule(message) {
    return (value) => {
        if (!value) {
            return message || "Trường này chưa nhập thông tin"
        }
        return undefined
    }
}

function sameIDRule(value, array, prop, message) {
    if (array.find(element => element[prop] === value) || !value) return message || "ID bị trùng không thể thêm mới"
    return undefined
}

function rangeCharactorRule(min, max, message) {
    return (value) => {
        if (value.length < min || value.length > max) return message || `Giá trị nhập phải nằm từ ${min} đến ${max}`
        return undefined
    }
}

function urlRule(value, message) {
    return new Promise((resolve, reject) => {
        if (!value) {
            reject()
            return
        }
        axios({
            url: value,
            method: "GET"
        })
            .then(() => resolve())
            .catch(() => reject(message || `Your url image is not valid`))
    })
}
function characterRule(message) {
    return (value) => {
        let regex = /\b([A-ZÀ-ÿ][-,a-z. '][a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+[ ]*)+/
        let expludeChar = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "[", "]", "\\", "; ", ".", "/", ",", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "{", "}", "|", ":", "\"", "<", ">", "?"]
        let numberChar = value.split("").find(char => expludeChar.includes(char))
        if (!regex.test(value) || numberChar) return message || "Nhập tên không chính xác"
        return undefined
    }
}

function emailRule(message) {
    return (value) => {
        let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (!regex.test(value)) return message || "Email nhập không hợp lệ"
        return undefined
    }
}

function passwordRule(message) {
    return (value) => {
        let regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,8}$/
        if (!regex.test(value)) return message || "Trường này phải có từ 6-8 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)"
        return undefined
    }
}

function typeRule(arrayType, message) {
    return (value) => {
        let isValid = arrayType.includes(value)
        if (!isValid) return message || "Giá trị select không hợp lệ"
        return undefined
    }
}

// =============== Phần validate các input bằng cách sử dụng các rule đã thiết lập ================
function validateForm(type) {
    return new Promise((resolve, reject) => {
        let isFormValid =
            validateAccount() &
            validateName() &
            validatePass() &
            validateEmail() &
            validateAvatar() &
            validateRole() &
            validateLanguage() &
            validateDescription()

        let isNeedValidateAccount = type === "edit" ? () => Promise.resolve() : validateSameAccount
        Promise.all([validateAvatarURL(), isNeedValidateAccount()])
            .then(() => {
                if (!isFormValid) reject()
                resolve()
            })
            .catch(() => {
                reject()
            })

    })
}

function validateAccount() {
    let isValid = validate("#TaiKhoan", emptyRule())
    if (isValid) return true
    return false
}

function validateSameAccount() {
    return new Promise((resolve, reject) => {
        const accountEl = dom("#TaiKhoan")
        const spanEl = accountEl.closest(".form-group").querySelector(".form-message")

        getUser()
            .then(users => {
                let errorMess = sameIDRule(accountEl.value.trim(), users, "account")
                if (errorMess) {
                    if (spanEl.innerText) {
                        reject()
                        return
                    }
                    spanEl.innerText = errorMess
                    reject()
                }
                else {
                    spanEl.innerText = ''
                    resolve()
                }
            })
            .catch(() => {
            })
    })

}

function validateName() {
    let isValid = validate("#HoTen", [emptyRule(), characterRule()])
    if (isValid) return true
    return false
}

function validatePass() {
    let isValid = validate("#MatKhau", [emptyRule(), passwordRule()])
    if (isValid) return true
    return false
}

function validateEmail() {
    let isValid = validate("#Email", [emptyRule(), emailRule()])
    if (isValid) return true
    return false
}

function validateAvatar() {
    let isValid = validate("#HinhAnh", emptyRule())
    if (isValid) return true
    return false
}

function validateAvatarURL() {
    return new Promise((resolve, reject) => {
        const avatarEl = dom("#HinhAnh")
        const spanEl = avatarEl.closest(".form-group").querySelector(".form-message")

        urlRule(avatarEl.value.trim())
            .then(() => {
                spanEl.innerText = ""
                resolve()
            })
            .catch(message => {
                if (spanEl.innerText) {
                    reject()
                    return
                }
                spanEl.innerText = message
                reject()
            })
    })
}

function validateRole() {
    let isValid = validate("#loaiNguoiDung", [emptyRule(), typeRule(['GV', 'HV'])])
    if (isValid) return true
    return false
}

function validateLanguage() {
    let isValid = validate("#loaiNgonNgu", [emptyRule(), typeRule(['ITALIAN', 'FRENCH', 'JAPANESE', 'CHINESE', 'RUSSIAN', 'SWEDEN', 'SPANISH'])])
    if (isValid) return true
}

function validateDescription() {
    let isValid = validate("#MoTa", [emptyRule(), rangeCharactorRule(1, 60)])
    if (isValid) return true
}

// Hàm reset để reset các thông báo lỗi do phần validator thêm vào
function resetErrorMess() {
    document.querySelectorAll(".form-group").forEach(formGroup => {
        formGroup.querySelector(".form-message").innerText = ""
    })
}


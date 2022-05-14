const nameInput = document.querySelector("#name")
const emailInput = document.querySelector("#email")
const jobRoleInput = document.querySelector("#title")
const otherJobRole = document.querySelector("#other-job-role")
const colorInput = document.querySelector("#shirt-colors")
const designInput = document.querySelector("#design")
const total = document.querySelector("#activities-cost")
const activities = document.querySelector("#activities")
const checkBoxes = document.querySelectorAll("#activities-box input")
const paymentInput = document.querySelector("#payment")
const creditCardBox = document.querySelector(".credit-card")
const ccNum = document.querySelector("#cc-num")
const zipNum = document.querySelector("#zip")
const cvvNum = document.querySelector("#cvv")
const form = document.querySelector("form")
const color = document.querySelector("#color")
const actiCost = document.querySelector("#activities-cost")
const nameHint = document.querySelector("#name-hint")
const paypal = document.querySelector("#paypal")
const bitcoin = document.querySelector("#bitcoin")

nameInput.focus()

// Helpers

const show = (element) => {
    return element.style.display = ""
}

const hide = (element) => {
    return element.style.display = "none"
}

const showHint = (element) => {
    element.parentElement.classList.remove("valid")
    element.nextElementSibling.classList.remove("hint")
    element.parentElement.classList.add("not-valid")
}

const hideHint = (element) => {
    element.nextElementSibling.classList.add("hint")
    element.parentElement.classList.remove("not-valid")
    element.parentElement.classList.add("valid")
}


// Setting default value to "none", and toggling regarding to value change

hide(otherJobRole)
jobRoleInput.addEventListener("change", e => {
    if (e.target.value === "other") {
        show(otherJobRole)
    } else {
        hide(otherJobRole)
    }
})

/* 
T-shirt info section - setting default div section to "none", then based 
on value of design input, showing possible color variants.
*/

color.disabled = true
designInput.addEventListener("change", e => {
    color.selectedIndex = 0
    color.disabled = false
    const options = color.children
    for (let i = 0; i < options.length; i++) {
        options[i].hidden = false
        if (!options[i].outerHTML.toLowerCase().includes(e.target.value)) {
            options[i].hidden = true
        }
    }
}) 

// Register for Activities section -

activities.addEventListener("change", e => {
    let totalCost = 0
    // in date must be value, otherwise forEach doesnt start .. 
    let date = ["prevent"]
    regActiVal()
        // gather total cost + getting dates
        checkBoxes.forEach(box => {
            box.removeAttribute("disabled")
            if (box.checked) {
                totalCost += Number.parseInt(box.getAttribute("data-cost"))
                date.push(box.getAttribute("data-day-and-time"))
                }
        })
        // testing for time collision
        checkBoxes.forEach(box => {
            date.forEach(time => {
                if (box.getAttribute("data-day-and-time") === time && !box.checked) {
                    box.setAttribute("disabled", true)
                } 
            })
        }) 
    total.innerHTML = `Total: $${totalCost}`
})

// Payment Info section

paymentInput.selectedIndex = 1
hide(paypal)
hide(bitcoin)
paymentInput.addEventListener("change", e => {
    if (e.target.value === "credit-card") {
        show(creditCardBox)
        hide(paypal)
        hide(bitcoin)
    } else if (e.target.value === "paypal") {
        hide(creditCardBox)
        hide(bitcoin)
        show(paypal)
    } else if (e.target.value === "bitcoin") {
        hide(creditCardBox)
        show(bitcoin)
        hide(paypal)
    }
})


// Name validation

const nameVal = () => {
    const regExName = /^\s+$/g
    const regExName1 = /.{5,}/g
    if (nameInput.value === "") {
        nameHint.innerHTML = "Name field cannot be blank"
        showHint(nameInput)
        return false
    } else if (regExName.test(nameInput.value)) {
        nameHint.innerHTML = "Name cannot be from whitespaces"
        showHint(nameInput)
        return false
    } else if (!regExName1.test(nameInput.value)) {
        nameHint.innerHTML = "Name must be at least 5 characters long"
        showHint(nameInput)
        return false
    } else {
        hideHint(nameInput)
        return true
    }
}

//showHint(nameInput)
nameInput.addEventListener("keyup", e => nameVal() )
nameInput.addEventListener("blur", e => nameVal() )

// Email validation

const emailVal = () => {
    const regExMail = /^[A-z0-9\.\-]+@[A-z0-9\.\-]+\.[A-z0-9]{2,3}$/gi
    if (regExMail.test(emailInput.value)) {
        hideHint(emailInput)
        return true
    } else {
        showHint(emailInput)
        return false
    }

}

emailInput.addEventListener("keyup", e => emailVal())

// Register activities validation + accessibility improvement (focus/blur)

const regActiVal = () => {
    let checked = false
    checkBoxes.forEach(box => box.checked ? checked = true : "")
    if (checked) {
        activities.classList.remove("not-valid")
        actiCost.nextElementSibling.classList.remove("hint")
        return true
    } else {
        activities.classList.add("not-valid")
        actiCost.nextElementSibling.classList.add("hint")
        return false
    } 
}

checkBoxes.forEach(box => box.addEventListener("focus", e => {
        e.target.parentElement.classList.add("focus")
    }
))
checkBoxes.forEach(box => box.addEventListener("blur", e => {
        e.target.parentElement.classList.remove("focus")
    }
))

activities.addEventListener("click", e => regActiVal())

// Card validation
const regExCcNum = /^\d{13,16}$/
const ccVal = () => regExCcNum.test(ccNum.value) ? (hideHint(ccNum), true) : (showHint(ccNum), false)
ccNum.addEventListener("keyup", e => ccVal())

const regExZip = /^\d{5}$/
const zipVal = () => regExZip.test(zipNum.value) ? (hideHint(zipNum), true) : (showHint(zipNum), false)
zipNum.addEventListener("keyup", e => zipVal())

const regExCvv = /^\d{3}$/
const cvvVal = () => regExCvv.test(cvvNum.value) ? (hideHint(cvvNum), true) : (showHint(cvvNum), false)
cvvNum.addEventListener("keyup", e => cvvVal())

// FORM SUBMIT SECTION
form.addEventListener("submit", e => {
    if (nameVal() && emailVal() && regActiVal()) {
        if (paymentInput.value === "credit-card") {
            if (ccVal() && zipVal() && cvvVal()) {
                return true
            } else {
                e.preventDefault()
                return false
            }
        } 
    } else {
        e.preventDefault()
        nameVal()
        emailVal()
        regActiVal()
        if (paymentInput.value === "credit-card") {
            ccVal()
            zipVal()
            cvvVal()
        }
    }

})
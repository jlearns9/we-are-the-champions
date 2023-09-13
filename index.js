// Imported Firebase Tools
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Database
const appSettings = {
    databaseURL: "https://champions-db-2e2e9-default-rtdb.firebaseio.com/"
}

// Firebase Setup
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

// Grabbing Elements
const inputFieldEl = document.getElementById("input-field")
const publishButtonEl = document.getElementById("publish-button")
const endorsementListEl = document.getElementById("endorsement-list")
const toFieldEl = document.getElementById("to-field")
const fromFieldEl = document.getElementById("from-field")

// Publish Button
publishButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value.trim()
    let toValue = toFieldEl.value.trim()
    let fromValue = fromFieldEl.value.trim()
    if (inputValue === "" || toValue === "" || fromValue === "") {
        alert("Error: All fields must be filed")
        return
    }
    let endorsement = {
        message: inputValue,
        to: toValue,
        from: fromValue
    }
    push(endorsementListInDB, endorsement)
    clearInputFieldEl()
})

// Database Listener
onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsementListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToEndorsementListEl(currentItem)
        }
    } else {
        endorsementListEl.innerHTML = "No items here... yet"
    }
})


// Functions
function clearInputFieldEl() {
    inputFieldEl.value = ""
    toFieldEl.value = ""
    fromFieldEl.value = ""
}

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendItemToEndorsementListEl(item) {
    let endorsement = item[1]

    let newEl = document.createElement("li")  // Creates the list Element

    let fromEl = document.createElement("div")  // Creates From: Element
    fromEl.textContent = `From ${endorsement.from}`
    fromEl.classList.add('bold-text')

    let messageEl = document.createElement("div")  // Creates Message Element
    messageEl.textContent = endorsement.message

    let toEl = document.createElement("div")  // Creates To: Element
    toEl.textContent = `To ${endorsement.to}`
    toEl.classList.add('bold-text')

    newEl.append(fromEl, messageEl, toEl)
    if (endorsementListEl.firstChild) {
        endorsementListEl.insertBefore(newEl, endorsementListEl.firstChild);
    } else {
        endorsementListEl.append(newEl);
    }
}
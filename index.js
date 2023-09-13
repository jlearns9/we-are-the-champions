// Imported Firebase Tools
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// My Firebbase Database
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
    let inputValue = inputFieldEl.value.trim()  // Grabbing the values from all the input fields
    let toValue = toFieldEl.value.trim()
    let fromValue = fromFieldEl.value.trim()  
    if (inputValue === "" || toValue === "" || fromValue === "") {  // Error message
        alert("Error: All fields must be filed")
        return
    }
    let endorsement = {  // Creating an object from the input fields
        message: inputValue,
        to: toValue,
        from: fromValue
    }
    push(endorsementListInDB, endorsement)  // Sends object to firebase
    clearInputFieldEl()
})

// Database Listener
onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {  // Checking for firebase entries
        let itemsArray = Object.entries(snapshot.val())  // Turns our items into an array
        clearEndorsementListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToEndorsementListEl(currentItem)
        }
    } else {
        endorsementListEl.innerHTML = "No items here... yet"  // If no DB items then it displays this message
    }
})


// Functions

function clearInputFieldEl() {  // Clears all input fields
    inputFieldEl.value = ""
    toFieldEl.value = ""
    fromFieldEl.value = ""
}

function clearEndorsementListEl() {  // Clears endorsement list
    endorsementListEl.innerHTML = ""
}

function appendItemToEndorsementListEl(item) {  // Sets up endorsement list
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

    newEl.append(toEl, messageEl, fromEl)  // appends the Elements in that order
    if (endorsementListEl.firstChild) {  // places newest endorsement first
        endorsementListEl.insertBefore(newEl, endorsementListEl.firstChild);
    } else {
        endorsementListEl.append(newEl);
    }
}
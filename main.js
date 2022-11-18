
const baseURL = "https://172.104.149.64/"




const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const registerPageButton = document.querySelector("#registerPage")
const loginPageButton = document.querySelector("#loginPage")
const registerAndLoginButtons = document.querySelector("#registerAndLoginButtons")
let token = null



registerPageButton.addEventListener("click", displayRegisterPage)
loginPageButton.addEventListener("click", displayLoginPage)
messagesPageButton.addEventListener("click", displayMessagesPage)




function clearMainContainer(){
    mainContainer.innerHTML= ""
}

function display(content){
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit

    mainContainer.innerHTML=content
}

function getMessageTemplate(message){

    let template = `
                            <div class="border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <div class="messageContent">
                                    <p><strong>${message.content}</strong></p>
                                </div>
                            </div>
                        `

    return template

}

function getMessagesTemplate(messages){

    let messagesTemplate = ""

    messages.forEach(message=>{

      messagesTemplate+=  getMessageTemplate(message)
    })

    return messagesTemplate

}

function getMessageFieldTemplate(){
    let template = `
         <nav class="navbar fixed-bottom bg-dark messageForm container d-flex justify-content-center">
            <input class="newMessageField pt-2 pb-2" type="text" id="messageField" placeholder="input message">
            <button class="btn btn-primary pt-2 pb-2 ps-4 pe-4 ms-2" id="sendMessage"><i class="bi bi-send"></i></button>
        </nav>
        `

    return template
}

function getRegisterTemplate(){
    let template = `
                <div class="register container">
                    <input type="text" id="regUsername" placeholder="username">
                    <input type="password" id="regPassword" placeholder="password">
                    <button type="submit" class="btn btn-primary" id="register">register</button>
                </div>
                `
    return template
}

function getLoginTemplate(){
    let template = `    
    <div class="d-flex justify-content-center flex-column align-items-center ">
        <div class="loginPage text-center p-4">
            <h2>Log In</h2>
            <div class="group">
                <input type="text" id="usernameLogin">
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>Name</label>
            </div>
            <div class="group">
                <input type="password" id="passwordLogin">
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>Email</label>
            </div>
            <button class="btn btn-primary" id="loginButton">log in</button>
        </div>
        
    </div>
`
    return template
}

async function getMessagesFromApi(){

    let url = `${baseURL}api/messages/`

    let fetchParams = {
        method : 'GET',
        headers : {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    }

  return await fetch(url, fetchParams)
        .then(response=>response.json())
        .then(messages=>{

           return messages

        })
}

async function displayMessagesPage(){
    //consiste a afficher les messages + le champ d'entrée d'un nouveau message

    if(!token){
        displayLoginPage()
        const modalNeedToLogin = document.querySelector("#modalNeedToLogin")
        const modal = new bootstrap.Modal(modalNeedToLogin)
        modal.show()
    }else{
        let messagesAndMessageField = ""
        getMessagesFromApi().then(messages=>{
            messagesAndMessageField+=getMessagesTemplate(messages)
            messagesAndMessageField+=getMessageFieldTemplate()
            display(messagesAndMessageField)
            const messageField = document.querySelector("#messageField")
            const sendButton = document.querySelector("#sendMessage")
            sendButton.addEventListener("click", sendMessage)
        })
    }
}

function modalEmptyUsernameOrPassword(){
    const modalEmptyUsernameOrPassword = document.querySelector("#modalUsernameOrPasswordEmpty")
    const modal = new bootstrap.Modal(modalEmptyUsernameOrPassword)
    modal.show()
}

function displayLoginPage(){
    display(getLoginTemplate())
    //buttons conts & event listeners
    const usernameLogin = document.querySelector('#usernameLogin')
    const passwordLogin = document.querySelector('#passwordLogin')
    const loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener("click", ()=>{
        if (usernameLogin.value == null || usernameLogin.value == "", passwordLogin.value == null || passwordLogin.value == ""){
            modalEmptyUsernameOrPassword()
            displayLoginPage()
        }else{
            login()
        }
    })
}

function displayRegisterPage(){

    display(getRegisterTemplate())

    const regUsername = document.querySelector("#regUsername")
    const regPassword = document.querySelector("#regPassword")
    const regButton = document.querySelector("#register")
    regButton.addEventListener("click", ()=>{
        if (regUsername.value == null || regUsername.value =="", regPassword.value == null || regPassword.value =="" ){
            modalEmptyUsernameOrPassword()
            displayRegisterPage()
        }else{
            register(regUsername.value, regPassword.value)
        }
    })

}

function sendMessage(){
    let url = `${baseURL}api/messages/new`
    let body = {
        content : messageField.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        headers:{"Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },
        body: bodySerialise

    }


    fetch(url, fetchParams)

    displayMessagesPage()
}

function register(){
    let url = `${baseURL}register`
    let body = {
        username : regUsername.value,
        password : regPassword.value
    }

    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        body: bodySerialise
    }
        fetch(url, fetchParams)
            .then(response=>response.json())
            .then(data=>{
                if (data =="username already taken"){
                    const modalUsernameTaken = document.querySelector("#modalUsernameTaken")
                    const modal = new bootstrap.Modal(modalUsernameTaken)
                    modal.show()
                    displayRegisterPage()
                }else{
                    console.log(data)
                    displayLoginPage()
                }
            })
}

function login(){
    let url = `${baseURL}login`
    let body = {
        username : usernameLogin.value,
        password : passwordLogin.value
    }

    let bodySerialise = JSON.stringify(body)
    let fetchParams = {
        headers:{"Content-Type":"application/json"},
        method : "POST",
        body: bodySerialise
    }
    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=> {

            if(data.token){
                console.log(data)
                token = data.token
                displayMessagesPage()
            }else{
                const modalWrongUsernameOrPassword = document.querySelector("#modalWrongUsernameOrPassword")
                const modal = new bootstrap.Modal(modalWrongUsernameOrPassword)
                modal.show()
                displayLoginPage()
            }
        })
}

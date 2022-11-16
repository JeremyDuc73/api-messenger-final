
const baseURL = "https://139.162.156.85:8000/"

const userId = 2;


const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const registerPageButton = document.querySelector("#registerPage")
const loginPageButton = document.querySelector("#loginPage")



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
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p><strong>${message.content}</strong></p>
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
         <div class="row messageForm">

                <input type="text" name="" id="messageField" placeholder="input message">
                <button class="btn btn-success" id="sendMessage">Send</button>

        </div>`

    return template
}

function getRegisterTemplate(){
    let template = `
                <div class="register container">
                        <input type="text" id="regUsername" placeholder="username">
                        <input type="password" id="regPassword" placeholder="password">
                        <button class="btn btn-primary" id="register">register</button>
            
                 </div>
    `
    return template
}

function getLoginTemplate(){
    let template = `    <div class="container">
                            <h2>Log In</h2>
                            <input type="text" name="" id="usernameLogin" placeholder="username">
                            <input type="password" name="" id="passwordLogin" placeholder="password">
                            <button class="btn btn-primary" id="login">log in</button>
                    
                        </div>`

    return template
}

async function getMessagesFromApi(){

    let url = `${baseURL}messages/`

  return await fetch(url)
        .then(response=>response.json())
        .then(messages=>{

           return messages

        })
}

async function displayMessagesPage(){
    //consiste a afficher les messages + le champ d'entrée d'un nouveau message

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

function displayLoginPage(){
    display(getLoginTemplate())
    //buttons conts & event listeners
}

function displayRegisterPage(){

    display(getRegisterTemplate())

    const regUsername = document.querySelector("#regUsername")
    const regPassword = document.querySelector("#regPassword")
    const regButton = document.querySelector("#register")
    regButton.addEventListener("click", ()=>{
        register(regUsername.value, regPassword.value)
    })

}

function sendMessage(){
    let url = `${baseURL}messages/${userId}/new`
    let body = {
        content : messageField.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
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
            .then(data=>console.log(data))

            console.log("y'a un truc qui a foiré déso")


}
let messages = [];
let name;
let typedMessage;
let count = 0;
let type;
let to;
let onlineUsers = [];
let verificationOfOnlineUsers;

function joinChatRoom() {
    document.querySelector(".home-screen").classList.add("none");
    document.querySelector(".loading-screen").classList.remove("none")
    name = document.querySelector("input").value;
    const joinChatRoomPromise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", 
    {
        name : name
    });

    joinChatRoomPromise.then(validName);
    joinChatRoomPromise.catch(invalidName);
}

function getMessages() {
    const getMessagesPromise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    getMessagesPromise.then(listMessages);
}

function validName() {
    document.querySelector(".loading-screen").classList.add("none")
    getOnlineUsers()
    getMessages();
    setInterval(() => {
        getMessages();
    }, 3000);    
    setInterval(() => {
        keepOnline();
    }, 5000);
    setInterval(() => {
        getOnlineUsers() ;
    }, 10000);
}

function invalidName (error) {
    if(error.response.status === 400){
        document.querySelector(".loading-screen").classList.add("none")
        document.querySelector(".home-screen").classList.remove("none");
        alert("Nome indisponível, favor tente outro");
    }
}

function listMessages(storedMessages) {
    messages = storedMessages.data;
    renderMessages();
}

function renderMessages() {
    const ulmessages = document.querySelector(".message-list");   
    ulmessages.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        if(messages[i].type === "status"){
            ulmessages.innerHTML += `
            <li class="status">
                <p>
                    <span class="time">(${messages[i].time})</span><strong>${messages[i].from}</strong> 
                    ${messages[i].text}
                </p>
            </li>
            `
        }
        if (messages[i].type === "message") {
            ulmessages.innerHTML += `
            <li class="message">
                <p>
                    <span class="time">(${messages[i].time})</span><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: 
                    ${messages[i].text}
                </p>
            </li>
            `
        }

        if (messages[i].type === "private_message" && (messages[i].from === name || messages[i].to === name)) {
            ulmessages.innerHTML += `
            <li class="private-message">
                <p>
                    <span class="time">(${messages[i].time})</span><strong>${messages[i].from}</strong> reservadamente para <strong>${messages[i].to}</strong>:
                    ${messages[i].text}
                </p>
            </li>
        `
        } 
    }
    let lastMessage = document.querySelector("li:last-child");
    lastMessage.scrollIntoView();
}

function keepOnline(){
    const keepOnlinePromise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: name});
    keepOnlinePromise.catch(errorInKeepOnline);
}

function errorInKeepOnline(){
    console.log("Erro no servidor, recarregue a página.");
}

function getOnlineUsers() {
    verificationOfOnlineUsers = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
    verificationOfOnlineUsers.then(listOnlineUsers)
}

function listOnlineUsers(users) {
    onlineUsers = users.data;
    renderOnlineUsers()
}

function renderOnlineUsers() {
    const ulonlineUsers = document.querySelector(".contact-list");
    ulonlineUsers.innerHTML = `
    <li class="option" onclick="selectContact(this)">
        <ion-icon name="people"></ion-icon>
        Todos
        <ion-icon class="check" name="checkmark-outline"></ion-icon>
    </li>
    `;
    for (let i = 0; i < onlineUsers.length; i++) {
        ulonlineUsers.innerHTML += `
        <li class="option" onclick="selectContact(this)">
            <ion-icon name="person-circle-sharp"></ion-icon>
            ${onlineUsers[i].name}
            <ion-icon class="check" name="checkmark-outline"></ion-icon>
        </li>
        `;
    }
}

function sendMessage() {
    let messagePosted;

    typedMessage = document.querySelector(".write-here").value;
    document.querySelector(".write-here").value = "";

    if(typedMessage === ""){
        return;
    }
    if(typedMessage === "\n"){
        return;
    }

    if(to !== undefined && type === "Público"){
        messagePosted = {
            from: name,
            to: to,
            text: typedMessage,
            type: "message"
        }
    }
    else if(to !== undefined && type === "Reservadamente"){
        messagePosted = {
            from: name,
            to: to,
            text: typedMessage,
            type: "private_message"
        }
    }
    else if((to === undefined && type === "Público") || (to === undefined && type === undefined)){
        messagePosted = {
            from: name,
            to: "Todos",
            text: typedMessage,
            type: "message"
        }
    }
    else if(to === undefined && type === "Reservadamente"){
        messagePosted = {
            from: name,
            to: "Todos",
            text: typedMessage,
            type: "private_message"
        }
    }

    const sendMessagePromise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", messagePosted);
    sendMessagePromise.then(messageSent);
    sendMessagePromise.catch(unsentMessage);
}

function messageSent() {
    console.log("enviou com sucesso")
    document.querySelector(".write-here").value = "";
    getMessages();
}

function unsentMessage(error){
    if(error.response.status === 400){
        window.location.reload();
    }
}

let textBox = document.querySelector(".write-here");
textBox.addEventListener('focus', function(){
    textBox.addEventListener('keydown', function(event){
        if(event.keyCode === 13){
            sendMessage();
        }
    })
})

function showSideBar() {
    let showSideBarBox = document.querySelector(".side-bar-box");
    showSideBarBox.classList.remove("none");
    let showSideBar = document.querySelector(".side-bar");
    showSideBar.classList.remove("none");
}

function hideSideBar() {
    let hideSideBarBox = document.querySelector(".side-bar-box")
    hideSideBarBox.classList.add("none");
    let hideSideBar = document.querySelector(".side-bar");
    hideSideBar.classList.add("none");
    let messageRecipient = document.querySelector(".message-recipient");

    if (to !== undefined && type !== undefined) {
        messageRecipient.innerHTML = `Enviando para ${to} (${type})`;
    }
    else if (to !== undefined && type === undefined) {
        messageRecipient.innerHTML = `Enviando para ${to} (Público)`;
    }
    else if (to === undefined && type !== undefined) {
        messageRecipient.innerHTML = `Enviando para Todos (${type})`;
    }
    else {
        messageRecipient.innerHTML = `Enviando para Todos (Público)`;
    }
}

function selectContact(element) {
    let choiceContact = document.querySelector(".contact-list .option.selected");
    if (choiceContact !== null) {
        choiceContact.classList.remove("selected");
    } else {
        count ++;
    }
    element.classList.add("selected");

    to = element.innerText;
}

function selectVisibility(element) {
    let choiceVisibility = document.querySelector(".visibility-choice-list .option.selected");
    if (choiceVisibility !== null) {
        choiceVisibility.classList.remove("selected");
    } else {
        count ++;
    }
    element.classList.add("selected");

    type = element.innerText;
}


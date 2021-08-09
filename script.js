let name;
let count = 0;

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

function validName() {
    document.querySelector(".loading-screen").classList.add("none")
}

function invalidName (error) {
    if(error.response.status === 400){
        document.querySelector(".loading-screen").classList.add("none")
        document.querySelector(".home-screen").classList.remove("none");
        alert("Nome indisponível, favor tente outro");
    }
}

function keepOnline(){
    const keepOnlinePromise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: name});
    keepOnlinePromise.catch(errorInKeepOnline);
}

function errorInKeepOnline(){
    console.log("Erro no servidor, recarregue a página.");
}

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


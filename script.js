function showSideBar() {
    const sideBar = document.querySelector(".side-bar-box");
    sideBar.classList.remove("none");
}

function selectContact(elemento) {
    document.querySelector(".contact-list .option");
    elemento.classList.add("selected");
}
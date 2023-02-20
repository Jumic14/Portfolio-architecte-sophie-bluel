// Enregistrement de l'URL de l'API, l'emplacement du token et les containers "header", "gallery", "introduction" et "portfolio"
const urlApi = "http://localhost:5678/api";

const token = window.localStorage.getItem("token")

const header = document.querySelector("header");

const divGallery = document.querySelector(".gallery");

const sectionIntroduction = document.querySelector("#introduction");

const sectionPortfolio = document.querySelector("#portfolio");

// Gestion des projets et des filtres

/**
 * Récupération des projets de l'API
 * @returns {Promise<Json>}
 */

const getProjects = async () => {
    let res = await fetch(urlApi + "/works");
    let projects = await res.json();
    return projects;
}

/**
 * Création des éléments HTML des projets
 * @param {JSON} projects
 */
function addProjects(projects) {                        
    for (let project of projects) {
        let newFigure = document.createElement("figure");       
        newFigure.setAttribute("id", project.category.name)
        divGallery.appendChild(newFigure);                     
        let newImage = document.createElement("img");          
        newImage.src = project.imageUrl;                        
        let newTitle = document.createElement("figcaption");    
        newTitle.innerText = project.title;                     
        newFigure.append(newImage, newTitle);                   
    }
}

// On vide le container "gallery"
const emptyGallery = () => {
    while (divGallery.firstChild) {
    divGallery.removeChild(divGallery.firstChild);
    }
}

/**
 * Affichage dynamique et gestion des filtres
 * @param {JSON} projects
 */
function getFilterCategories(projects) {
    const categories = new Set();
    for (let project of projects) {
        const category = project.category;
        categories.add(category.name);
    }
    return categories;
}

/**
 * Création des éléments HTML des filtres
 * @param {JSON} categories
 */
function addFilters(categories) {
    let listFilters = document.createElement("div");
    listFilters.setAttribute("class", "filters");
    sectionPortfolio.insertBefore(listFilters, divGallery);
    if (token !== null) {
        listFilters.setAttribute("style", "display: none;")
    } 
    let filterAll = document.createElement("button");
    filterAll.innerText= "Tous";
    filterAll.setAttribute("class", "filter");
    listFilters.appendChild(filterAll);
    for (let category of categories) {
        let newFilter = document.createElement("button");
        newFilter.setAttribute("class", "filter");
        newFilter.setAttribute("id", category);
        newFilter.innerHTML = category;
        listFilters.appendChild(newFilter);
    }
    return categories;
}

// Gestion des filtres
function activeFilter (event) {
    const currentFilter = document.querySelectorAll(".filter")
    for (let allFilter of currentFilter) {
        allFilter.addEventListener("click", function() {
            for (let allFilterRemove of currentFilter) {
                allFilterRemove.classList.remove("active")
            }
        allFilter.classList.add("active")
        })
    }
}

function onButtonClick (event) {
    let category = this.id;
    const listProjects = document.querySelectorAll(".gallery > figure");
        for (let listProject of listProjects) {
            if (!category) {
                listProject.setAttribute("style", "display:block");
            } else if (listProject.id === category){
                listProject.setAttribute("style", "display:block")
            } else {
                listProject.setAttribute("style", "display:none")
            } 
        }
}

function useFilter() {
    document.querySelectorAll(".filter").forEach(li => {
        li.addEventListener("click", onButtonClick)
        activeFilter();
    })
}

// Génération de l'affichage des projets et des filtres avec 2 appels à l'API
/*
function generateProjects() {
    getProjects().then(json => {
        if (json) {
            emptyGallery();
            addProjects(json)
        } else {
            console.log("Problèmes d'accès au serveur");
        }})
}
   
function generateFilters()  {
    getProjects().then(projects => {
        let categories = getFilterCategories(projects);
        addFilters(categories);
        useFilter(categories);
       })
}
*/ 

// Génération de l'affichage des projets et des filtres avec 1 appel à l'API
function generatePage () {
    getProjects()
    .then(projects => {
        if (projects) {
            emptyGallery();
            addProjects(projects)
            return projects
        } else {
            console.log("Problèmes d'accès au serveur");
        }})
        .then(projects => {
            let categories = getFilterCategories(projects);
            addFilters(categories);
            useFilter(categories);
           })    
}

generatePage();

// Gestion du mode édition
// Création des éléments HTML / Affichage du mode édition / Gestion du logout 
function createEditHeader() {
    header.setAttribute("style", "margin-top: 80px")
    const hH1 = document.querySelector("header > h1")
    let editMenu = document.createElement("div");
    editMenu.setAttribute("class", "edit-menu");
    header.insertBefore(editMenu, hH1);
    let editMod = document.createElement("div");
    editMod.setAttribute("class", "edit-mod");
    editMenu.appendChild(editMod);
    let editIcon = document.createElement("i");
    editIcon.setAttribute("class", "fa-regular fa-pen-to-square");
    let editText = document.createElement("p");
    editText.innerText = ("Mode édition")
    editMod.appendChild(editIcon);
    editMod.appendChild(editText);
    let applyButton = document.createElement("button");
    applyButton.innerText = ("publier les changements");
    editMenu.appendChild(applyButton);
    const hUl = header.querySelector("nav > ul")
    const login = header.querySelector("nav > ul > li > a")
    const loginBtn = login.parentNode;
    let logoutBtn = document.createElement("li");
    let logout = document.createElement("a");
    logout.innerText = "logout";
    logout.setAttribute("href", "")
    logoutBtn.appendChild(logout)
    hUl.replaceChild(logoutBtn, loginBtn)
}

function createEditUserPic () {
    let userPic = sectionIntroduction.querySelector("figure")
    let editPic = document.createElement("div")
    editPic.setAttribute("class", "edit-pic")
    userPic.appendChild(editPic);
    let editPicIcon = document.createElement("i");
    editPicIcon.setAttribute("class", "fa-regular fa-pen-to-square");
    let editPicText = document.createElement("a");
    editPicText.setAttribute("href", "")
    editPicText.innerText = ("modifier");
    editPic.appendChild(editPicIcon);
    editPic.appendChild(editPicText);
}

function createEditProjects () {
    let projects = sectionPortfolio.querySelector("h2")
    let editProjects = document.createElement("div")
    editProjects.setAttribute("class", "edit-projects")
    projects.appendChild(editProjects);
    let editProjectsIcon = document.createElement("i");
    editProjectsIcon.setAttribute("class", "fa-regular fa-pen-to-square");
    let editProjectsText = document.createElement("a");
    editProjectsText.setAttribute("href", "")
    editProjectsText.innerText = ("modifier");
    editProjects.appendChild(editProjectsIcon);
    editProjects.appendChild(editProjectsText);
}

function createEditPage() {
    createEditHeader();
    createEditUserPic();
    createEditProjects();
}

function hideEditPage() {
    header.setAttribute("style", "margin-top: 50px")
    const editMenu = header.querySelector(".edit-menu");
    editMenu.setAttribute("style", "display: none;")
    const editPic = sectionIntroduction.querySelector(".edit-pic")
    editPic.setAttribute("style", "display: none;");
    const editProjects = sectionPortfolio.querySelector(".edit-projects");
    editProjects.setAttribute("style", "display: none;");
    const hUl = header.querySelector("nav > ul")
    const logout = header.querySelector("nav > ul > li > a")
    const logoutBtn = logout.parentNode;
    let loginBtn = document.createElement("li");
    let login = document.createElement("a");
    login.innerText = "login";
    login.setAttribute("href", "login.html")
    loginBtn.appendChild(login);
    hUl.replaceChild(loginBtn, logoutBtn)
}

function logout () {
    const logout = header.querySelector("nav > ul > li > a")
    logout.addEventListener("click", function() {
        window.localStorage.removeItem("token");
        document.location.href=("index.html");
    })
}

function handleEditPage() {
    createEditPage();
if (token !== null) {
    logout()
} else {
    hideEditPage();
}
}

handleEditPage();

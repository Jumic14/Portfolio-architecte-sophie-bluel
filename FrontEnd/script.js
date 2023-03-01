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
 * Récupération des catégories de l'API
 * @returns {Promise<Json>}
 */

const getCategories = async () => {
    let res = await fetch(urlApi + "/categories");
    let categories = await res.json();
    return categories;
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

// Suppression du contenu du container "gallery"
function emptyGallery() {
    divGallery.innerHTML = "";
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
    let editPicText = document.createElement("button");
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
    let editProjectsText = document.createElement("button");
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

// Gestion du logout
function logout () {
    const logout = header.querySelector("nav > ul > li > a")
    logout.addEventListener("click", function() {
        window.localStorage.removeItem("token");
        document.location.href=("index.html");
    })
}

function generateEditPage() {
    createEditPage();
if (token !== null) {
    logout()
} else {
    hideEditPage();
}
}

generateEditPage();

// Gestion de la modale
/**
 * Création des éléments HTML des projets
 * @param {JSON} projects
 */
function addModalProjects(projects) {  
    const modalDiv1 = document.querySelector(".modal-div1")                       
    for (let project of projects) {
        let newFigure = document.createElement("figure");
      
        modalDiv1.appendChild(newFigure);    
        let modalImg = document.createElement("div");
        modalImg.setAttribute("class", "modal-img");
        modalImg.setAttribute("id", project.id)                 
        let newImage = document.createElement("img");          
        newImage.src = project.imageUrl;                        
        let newTitle = document.createElement("figcaption");    
        newTitle.innerText = "éditer";   

        let trashIcon = document.createElement("i");
        trashIcon.setAttribute("class", "fa-solid fa-trash-can");                
        modalImg.append(trashIcon, newImage);
        newFigure.append(modalImg, newTitle);  
    }
    if (modalDiv1.firstChild === null) {
        return
    }
    let moveIcon = document.createElement("i");
    moveIcon.setAttribute("class", "fa-solid fa-arrows-up-down-left-right")
    modalDiv1.firstChild.appendChild(moveIcon);
    
    selectProject();
}

function galleryModal () { 
    getProjects()
    .then(projects => {
        if (document.querySelector(".modal") !== null) {
            addModalProjects(projects)
        } 
})}

// Création de l'ensemble des éléments de la modale
function createModal () {
    let modal = document.createElement("aside");
    modal.setAttribute("class", "modal");
    modal.setAttribute("style", "display: none;");
    document.querySelector("body").appendChild(modal);
    let modalWrapper = document.createElement("section")
    modalWrapper.setAttribute("class", "modal-wrapper");
    modal.appendChild(modalWrapper)
    let modalIcons = document.createElement("div");
    modalIcons.setAttribute("class", "modal-icons")
    let modalReturn = document.createElement("i");
    modalReturn.setAttribute("class", "fa-solid fa-arrow-left");
    modalReturn.setAttribute("id", "modal-return");
    modalReturn.setAttribute("style", "display : none;")
    let modalExit = document.createElement("i");
    modalExit.setAttribute("class", "fa-solid fa-xmark");
    modalExit.setAttribute("id", "modal-exit");
    modalIcons.append(modalExit, modalReturn);
    let modalTitle = document.createElement("p")
    modalTitle.setAttribute("class", "modal-title");
    modalTitle.innerText = ("Galerie photo");
    let modalDiv1 = document.createElement("div");
    modalDiv1.setAttribute("class", "modal-div1");
    modalDiv1.setAttribute("id", "modal-div1")
    let modalDiv2 = document.createElement("div");
    modalDiv2.setAttribute("class", "modal-div2");
    modalDiv2.setAttribute("style", "display: none;");
    let modalForm = document.createElement("form")
    modalForm.setAttribute("action", urlApi + "/works");
    modalForm.setAttribute("method", "post")
    modalForm.setAttribute("class", "modal-form")
    let formImg = document.createElement("div");
    formImg.setAttribute("class", "form-img")
    let previewDiv = document.createElement("div");
    previewDiv.setAttribute("class", "preview-div");
    let previewImg = document.querySelector("i");
    previewImg.setAttribute("class", "fa-regular fa-image");
    previewImg.setAttribute("id", "preview-img");
    let currentImg = document.createElement('img');
    currentImg.setAttribute("class", "current-img")
    currentImg.setAttribute("style", "display: none;")
    previewDiv.append(previewImg, currentImg);
    let labelImg = document.createElement("label");
    labelImg.setAttribute("for", "img");
    labelImg.setAttribute("class", "label-img");
    labelImg.innerText = "+ Ajouter une photo";
    let inputImg = document.createElement("input");
    inputImg.setAttribute("type", "file");
    inputImg.setAttribute("name", "img")
    inputImg.setAttribute("id", "img");
    inputImg.setAttribute("style", "display: none;")
    inputImg.setAttribute("accept", ".jpg, .jpeg, .png")
    let textImg = document.createElement("p");
    textImg.setAttribute("class", "text-img");
    textImg.innerText = "jpg, png : 4mo max"
    formImg.append(previewDiv, labelImg, inputImg, textImg)
    let formName = document.createElement("label");
    formName.setAttribute("for", "name");
    formName.innerText = ("Titre");
    let inputName = document.createElement("input");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "title");
    inputName.setAttribute("id", "title");
    let formCategory = document.createElement("label");
    formCategory.setAttribute("for", "category");
    formCategory.innerText = ("Catégorie");
    let inputCategory = document.createElement("select");
    inputCategory.setAttribute("name", "category")
    inputCategory.setAttribute("id", "category")
    let defaultCategory = document.createElement("option");
    defaultCategory.setAttribute("value", "");
    inputCategory.appendChild(defaultCategory);
    getCategories().then(categories => {
        for (let category of categories) {
            let categoryOption = document.createElement("option");
            categoryOption.setAttribute("value", category.name);
            categoryOption.innerText = category.name;
            inputCategory.appendChild(categoryOption);
        }
       })
    let formSubmit = document.createElement("label");
    formSubmit.setAttribute("for", "submit");
    formSubmit.setAttribute("id", "modal-form-submit");
    let inputSubmit = document.createElement("input");
    inputSubmit.setAttribute("type", "submit");
    inputSubmit.setAttribute("value", "Valider");
    inputSubmit.setAttribute("class", "modal-submit-button"); 
    modalForm.append(formImg, formName, inputName, formCategory, inputCategory, formSubmit, inputSubmit)
    modalDiv2.appendChild(modalForm);
    let modalAddButton = document.createElement("button");
    modalAddButton.setAttribute("class", "modal-add-button");
    modalAddButton.innerText = "Ajouter une photo"
    let modalDeleteButton = document.createElement("button");
    modalDeleteButton.setAttribute("class", "modal-delete-button");
    modalDeleteButton.innerText = "Supprimer la galerie";
    modalWrapper.append(modalIcons, modalTitle, modalDiv1, modalDiv2, modalAddButton, modalDeleteButton, modalDeleteButton)
    document.querySelector("#img").addEventListener('change', updateFormImg);
}

// Gestion de l'affichage de la preview du formulaire modale
function updateFormImg () {
    document.querySelector("#preview-img").setAttribute("style", "display: none;");
    document.querySelector(".label-img").setAttribute("style", "display: none;");
    document.querySelector(".text-img").setAttribute("style", "display: none;");
    let currentFile = document.querySelector("#img").files;
    let currentImg = document.querySelector('.current-img');
    currentImg.removeAttribute("style", "display: none;")
    currentImg.src = window.URL.createObjectURL(currentFile[0]);
}

// Gestion du retour arrière dans la modale
function removeFormElements () {
    document.querySelector("#preview-img").removeAttribute("style", "display: none;");
    document.querySelector(".label-img").removeAttribute("style", "display: none;");
    document.querySelector(".text-img").removeAttribute("style", "display: none;");
    document.querySelector('.current-img').setAttribute("style", "display: none;");
    document.querySelector('.current-img').innerHTML = ""
    document.querySelector("#title").value = ""
    document.querySelector("#category").value = ""
}

let modal = null;

function openModal(event) {
    const target = document.querySelector(".modal")
    target.removeAttribute("style", "display: none;")
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector("#modal-exit").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation)
}

function closeModal(event) {
    document.querySelector(".edit-menu").setAttribute("style", "position: absolute");
    modal.setAttribute("style", "display: none;")
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation)
    emptyModalForm();
    modal = null;
}

function stopPropagation (event) {
    event.stopPropagation();
}

function showModal (event) {
    document.querySelector(".edit-projects").addEventListener("click", openModal)
}

function emptyModal () {
    let modalDiv1 = document.querySelector(".modal-div1")
    modalDiv1.innerHTML = "";
}

// Gestion de la suppression de projets
async function deleteProject(id) {
    try {
    let res = await fetch(urlApi + "/works/" + id, {
        method: "DELETE", 
        headers: {
            "Authorization": "Bearer " + token
        }
    }); 
    if (!res.ok) {
        throw new Error("Erreur lors de la suppression du projet");
    }
    console.log("Le projet a été supprimé avec succès");
    emptyModal();
    galleryModal();
    emptyGallery();
    generateProjects();
    } catch (error) {
        console.log(error);
    }
}

function generateProjects() {
    getProjects().then(json => {
        if (json) {
            emptyGallery();
            addProjects(json)
        } else {
            console.log("Problèmes d'accès au serveur");
        }})
}

function selectProject() {
        const modalDeleteIcons = document.querySelectorAll(".modal-img > i")
        for (let currentDeleteIcon of modalDeleteIcons) {
            currentDeleteIcon.addEventListener("click", function(event) {
                let id = currentDeleteIcon.parentElement.id;
                deleteProject(id);
            })  
        }
    }

function deleteModal() {
    document.querySelector(".modal-delete-button").addEventListener("click", function() {
        let modalProjects = (Array.from(document.querySelectorAll(".modal-img")))
        modalProjects.forEach(function(modalProject) {
            let id = modalProject.id;
            deleteProject(id);
        }
    )}
    )
}

function addImg() {
    document.querySelector(".modal-add-button").addEventListener("click", function() {
        document.querySelector("#modal-return").removeAttribute("style", "display: none;")
        document.querySelector(".modal-title").innerText = ("Ajout photo");
        document.querySelector(".modal-div1").setAttribute("style", "display: none;");
        document.querySelector(".modal-div2").removeAttribute("style", "display: none;")
        document.querySelector(".modal-add-button").setAttribute("style", "display: none;");
        document.querySelector(".modal-delete-button").setAttribute("style", "display: none;");
        returnModalGallery();
    })
}

function returnModalGallery() {
    document.querySelector("#modal-return").addEventListener("click",emptyModalForm)
}

function emptyModalForm () {
    document.querySelector("#modal-return").setAttribute("style", "display: none;")
    document.querySelector(".modal-title").innerText = ("Galerie photo");
    document.querySelector(".modal-div1").removeAttribute("style", "display: none;");
    document.querySelector(".modal-div2").setAttribute("style", "display: none;")
    document.querySelector(".modal-add-button").removeAttribute("style", "display: none;");
    document.querySelector(".modal-delete-button").removeAttribute("style", "display: none;");
    document.querySelector(".modal-submit-button").setAttribute("id", "grey")
    removeFormElements();
}

// Gestion de l'ajout de nouveaux projets
function submitProject() {
    changeInputModalButton();
    let formSubmit = document.querySelector(".modal-form");
    formSubmit.addEventListener("submit", async function(event) {
        event.preventDefault();
        const imageUrl = (formSubmit.img).files[0];
        const title = (formSubmit.title).value;
        const formCategory = (formSubmit.category).value;
        let category = null;
        if (formCategory === "Objets") {
            category = 1
        } else if (formCategory === "Appartements") {
            category = 2
        } else if (formCategory === "Hotels & restaurants") {
            category = 3
        } 

        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", imageUrl);
        formData.append("category", category);
        const res= await fetch(urlApi + "/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
            },
            body: formData,
        })
        
        if (res.ok) {
            console.log("Le projet a été ajouté avec succès !")
            emptyModal();
            galleryModal();
            emptyGallery();
            generateProjects();
            emptyModalForm();
            closeModal();
        } else {
            alert("Vous devez remplir tous les champs")
        }
    })
}

function changeInputModalButton () {
    let submitButton = document.querySelector(".modal-submit-button")
    submitButton.setAttribute("id", "grey")
    let formImgInput = document.querySelector("#img");
    let formImg = document.querySelector(".label-img");
    let previewImg = document.querySelector(".current-img");
    formImgInput.addEventListener("change", function (event) {
        console.log(previewImg)
        console.log(formCategory.value)
        if (formImg.hasAttribute("style") === true) {
            if (formTitle.value && formCategory.value !== "") {
                submitButton.removeAttribute("id", "grey")
            }
        } else {
            submitButton.setAttribute("id", "grey")
        }
    })
    let formTitle = document.querySelector("#title");
    formTitle.addEventListener("change", function (event) {
        console.log(formTitle.value)
        console.log(formCategory.value)
        if (formTitle.value) {
            if (formImg.hasAttribute("style") === true && formCategory.value !== "") {
                submitButton.removeAttribute("id", "grey")
            }
        } else {
            submitButton.setAttribute("id", "grey")
        }
    })
    let formCategory = document.querySelector("#category")
    formCategory.addEventListener("change", function (event) {
        console.log(event.target.value)
        if (formCategory.value !== "") {
            if (formImg.hasAttribute("style") === true && formTitle.value) {
                submitButton.removeAttribute("id", "grey")
            }
        } else {
            submitButton.setAttribute("id", "grey")
        }
    })

}

function generateModal() {
    createModal();
    galleryModal();
    showModal();
    deleteModal();
    addImg();
    submitProject();
}

generateModal();
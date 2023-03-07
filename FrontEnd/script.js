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

// Gestion de la modale
// Création de l'ensemble des éléments de la modale
function createModal () {
    createModalElement()
    let modalWrapper = createModalWrapper();
    let modalIcons = createModalIcons();
    let modalTitle = createModalTitle();
    let modalDiv1 = createModalDiv1();
    let modalDiv2 = createModalDiv2();
    let modalAddButton = createModalAddButton();
    let modalDeleteButton = createModalDeleteButton();
    modalWrapper.append(modalIcons, modalTitle, modalDiv1, modalDiv2, modalAddButton, modalDeleteButton);
    document.querySelector("#img").addEventListener('change', updateFormImg);
    galleryModal();
    showModal();
}

function createModalElement() {
    let modal = document.createElement("aside");
    modal.setAttribute("class", "modal");
    modal.setAttribute("style", "display: none;");
    document.querySelector("body").appendChild(modal);
    return modal
}

function createModalWrapper() {
    let modalWrapper = document.createElement("section");
    modalWrapper.setAttribute("class", "modal-wrapper");
    document.querySelector(".modal").appendChild(modalWrapper);
    return modalWrapper
}

function createModalTitle () {
    let modalTitle = document.createElement("p")
    modalTitle.setAttribute("class", "modal-title");
    modalTitle.innerText = ("Galerie photo");
    return modalTitle
}

function createModalIcons () {
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
    return modalIcons
}

function createModalDiv1 () {
    let modalDiv1 = document.createElement("div");
    modalDiv1.setAttribute("class", "modal-div1");
    modalDiv1.setAttribute("id", "modal-div1")
    return modalDiv1
}

function createModalDiv2 () {
    let modalDiv2 = document.createElement("div");
    modalDiv2.setAttribute("class", "modal-div2");
    modalDiv2.setAttribute("style", "display: none;");
    let modalForm = createModalForm();
    modalDiv2.appendChild(modalForm);
    return modalDiv2
}

function createModalAddButton () {
    let modalAddButton = document.createElement("button");
    modalAddButton.setAttribute("class", "modal-add-button");
    modalAddButton.innerText = "Ajouter une photo";
    return modalAddButton
}

function createModalDeleteButton () {
    let modalDeleteButton = document.createElement("button");
    modalDeleteButton.setAttribute("class", "modal-delete-button");
    modalDeleteButton.innerText = "Supprimer la galerie";
    return modalDeleteButton
}

// Création du formulaire de la modale et des ses éléments
function createModalForm() {
    let modalForm = createModalFormElement();
    let formImg = createFormImg();
    let previewDiv = createFormPreviewDiv();
    let previewImg = createFormPreviewImg();
    let currentImg = createFormCurrentImg();
    previewDiv.append(previewImg, currentImg);
    let labelImg = createFormLabelImg();
    let inputImg = createFormInputImg();
    let textImg = createFormTextImg();
    formImg.append(previewDiv, labelImg, inputImg, textImg);
    let formName = createFormName();
    let inputName = createFormInputName();
    let formCategory = createFormCategory();
    let inputCategory = createFormInputCategory();
    let defaultCategory = createFormDefaultCategory();
    inputCategory.appendChild(defaultCategory);
    getCategories().then(categories => {
        for (let category of categories) {
            let categoryOption = createFormCategoryOption(category);
            inputCategory.appendChild(categoryOption);
        }
       })
    let formSubmit = createFormSubmit();
    let inputSubmit = createFormInputSubmit();
    modalForm.append(formImg, formName, inputName, formCategory, inputCategory, formSubmit, inputSubmit);
    return modalForm
}

function createModalFormElement () {
    let modalForm = document.createElement("form")
    modalForm.setAttribute("action", urlApi + "/works");
    modalForm.setAttribute("method", "post");
    modalForm.setAttribute("class", "modal-form");
    return modalForm
}

function createFormImg () {
    let formImg = document.createElement("div");
    formImg.setAttribute("class", "form-img")
    return formImg
}

function createFormPreviewDiv () {
    let previewDiv = document.createElement("div");
    previewDiv.setAttribute("class", "preview-div");
    return previewDiv
}

function createFormPreviewImg () {
    let previewImg = document.querySelector("i");
    previewImg.setAttribute("class", "fa-regular fa-image");
    previewImg.setAttribute("id", "preview-img");
    return previewImg
}

function createFormCurrentImg () {
    let currentImg = document.createElement('img');
    currentImg.setAttribute("class", "current-img")
    currentImg.setAttribute("style", "display: none;")
    if (!currentImg.style) {
        return
    } else {
    return currentImg
    }
}

function createFormLabelImg () {
    let labelImg = document.createElement("label");
    labelImg.setAttribute("for", "img");
    labelImg.setAttribute("class", "label-img");
    labelImg.innerText = "+ Ajouter une photo";
    return labelImg
}

function createFormInputImg () {
    let inputImg = document.createElement("input");
    inputImg.setAttribute("type", "file");
    inputImg.setAttribute("name", "img")
    inputImg.setAttribute("id", "img");
    inputImg.setAttribute("style", "display: none;")
    inputImg.setAttribute("accept", ".jpg, .jpeg, .png")
    return inputImg
}

function createFormTextImg () {
    let textImg = document.createElement("p");
    textImg.setAttribute("class", "text-img");
    textImg.innerText = "jpg, png : 4mo max"
    return textImg
}

function createFormName () {
    let formName = document.createElement("label");
    formName.setAttribute("for", "name");
    formName.innerText = ("Titre");
    return formName
}

function createFormInputName () {
    let inputName = document.createElement("input");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "title");
    inputName.setAttribute("id", "title");
    return inputName
}

function createFormCategory () {
    let formCategory = document.createElement("label");
    formCategory.setAttribute("for", "category");
    formCategory.innerText = ("Catégorie");
    return formCategory
}

function createFormInputCategory () {
    let inputCategory = document.createElement("select");
    inputCategory.setAttribute("name", "category")
    inputCategory.setAttribute("id", "category")
    return inputCategory
}

function createFormDefaultCategory () {
    let defaultCategory = document.createElement("option");
    defaultCategory.setAttribute("value", "");
    return defaultCategory
}

function createFormCategoryOption (category) {
    let categoryOption = document.createElement("option");
    categoryOption.setAttribute("value", category.name);
    categoryOption.innerText = category.name;
    return categoryOption
}

function createFormSubmit () {
    let formSubmit = document.createElement("label");
    formSubmit.setAttribute("for", "submit");
    formSubmit.setAttribute("id", "modal-form-submit");
    return formSubmit
}

function createFormInputSubmit () {
    let inputSubmit = document.createElement("input");
    inputSubmit.setAttribute("type", "submit");
    inputSubmit.setAttribute("value", "Valider");
    inputSubmit.setAttribute("class", "modal-submit-button"); 
    return inputSubmit
}

/**
 * Création des éléments HTML des projets de la galerie modale
 * @param {JSON} projects
 */
function addModalProjects(projects) {  
    const modalDiv1 = document.querySelector(".modal-div1")  
    modalDiv1.setAttribute("ondragover", "return false");                     
    for (let project of projects) {
        let newFigure = createProjectFigure(project)
        let newCaption = createProjectCaption()
        let projectImage = createProjectImage(project);
        let projectTitle = createProjectTitle(project)
        let projectCategory = createProjectCategory(project)
        newFigure.append(newCaption, projectTitle, projectCategory, projectImage);  
    }
    if (modalDiv1.firstChild === null) {
        return
    }
    let moveIcon = document.createElement("i");
    moveIcon.setAttribute("class", "fa-solid fa-arrows-up-down-left-right")
    moveIcon.setAttribute("id", "move")
    let galleryFirstChild = modalDiv1.firstChild;
    galleryFirstChild.appendChild(moveIcon);
    galleryFirstChild.removeAttribute("class", "target");
    galleryFirstChild.setAttribute("class", "source")
    galleryFirstChild.removeAttribute("ondragstart");
    selectProject();
}

function createModalImg (project) {
    let modalImg = document.createElement("div");
    modalImg.setAttribute("id", project.id)   
    modalImg.setAttribute("class", "modal-img");
    let newImage = document.createElement("img");          
    newImage.src = project.imageUrl; 
    let trashIcon = document.createElement("i");
    trashIcon.setAttribute("class", "fa-solid fa-trash-can");                
    modalImg.append(trashIcon, newImage);
    return modalImg
}

function createProjectFigure (project) {
    let newFigure = document.createElement("figure");
    let modalImg = createModalImg(project) 
        document.querySelector(".modal-div1").appendChild(newFigure);    
        newFigure.setAttribute("id", modalImg.getAttribute("id"));    
        newFigure.setAttribute("class", "target");        
        newFigure.setAttribute("ondragstart", "return false");
        newFigure.appendChild(modalImg)
        return newFigure
}

function createProjectCaption () {
    let newCaption = document.createElement("figcaption");    
    newCaption.innerText = "éditer";  
    return newCaption
}

function createProjectImage (project) {
    let projectImage = document.createElement("img");
    projectImage.src = project.imageUrl;
    projectImage.setAttribute("style", "display: none;");
    projectImage.setAttribute("class", "img");
    return projectImage
}

function createProjectTitle (project) {
    let projectTitle = document.createElement("p");
    projectTitle.value = project.title;
    projectTitle.setAttribute("style", "display: none;")
    projectTitle.setAttribute("class", "title");
    return projectTitle
}

function createProjectCategory (project) {
    let projectCategory = document.createElement("p");
        projectCategory.value = project.category.id;
        projectCategory.setAttribute("style", "display: none;")
        projectCategory.setAttribute("class", "category-id")
        return projectCategory
}

// Gestion du déplacement des projets dans la modale
function moveImg (ev) {
    let source = document.querySelector(".source");
    if (source == null) {
        return
    }
    const targets = document.querySelectorAll(".target")
    for (let target of targets) {
        target.addEventListener("dragover", (ev) => {
            ev.preventDefault();
        })
        target.addEventListener("drop", (ev) => {
            ev.preventDefault();
            let source = document.querySelector(".modal-div1").firstChild;
            let newPosition = (ev.target.parentNode).parentElement;
            newPosition.after(source)
            let newFirstChild = document.querySelector(".modal-div1").firstChild
            let moveIcon = document.createElement("i");
            moveIcon.setAttribute("class", "fa-solid fa-arrows-up-down-left-right")
            moveIcon.setAttribute("id", "move")
            newFirstChild.appendChild(moveIcon)
            newFirstChild.removeAttribute("class", "target");
            newFirstChild.setAttribute("class", "source")
            newFirstChild.removeAttribute("ondragstart");
            source.removeAttribute("class");
            source.querySelector("#move").removeAttribute("class")
            source.setAttribute("class", "target")
            source.setAttribute("ondragstart", "return false");
            let lastChild = source.lastChild
            source.removeChild(lastChild)     
            })
    }
}

function galleryModal () { 
    getProjects()
    .then(projects => {
        if (document.querySelector(".modal") !== null) {
            addModalProjects(projects)
            moveImg()
        } 
    })
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

// Gestion de la suppression de projets
async function deleteProject(id) {
    try {
    await fetch(urlApi + "/works/" + id, {
        method: "DELETE", 
        headers: {
            "Authorization": "Bearer " + token
        }
    })
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
        }
    })
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
        })
    })
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
        if (formCategory.value !== "") {
            if (formImg.hasAttribute("style") === true && formTitle.value) {
                submitButton.removeAttribute("id", "grey")
            }
        } else {
            submitButton.setAttribute("id", "grey")
        }
    })
}

// Fonctions générales pour gérer l'affichage dynamique
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

function generateEditPage() {
    createEditPage();
    if (token !== null) {
        logout()
    } else {
        hideEditPage();
    }
}

function generateModal() {
    createModal();
    deleteModal();
    addImg();
    submitProject();
}

generatePage();
generateEditPage();
generateModal();
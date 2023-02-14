// On enregistre l'URL de l'API et les containers "gallery" et "portfolio"
const urlApi = "http://localhost:5678/api";

const divGallery = document.querySelector(".gallery");

const sectionPortfolio = document.querySelector("#portfolio")

/**
 * On récupère les projets de l'API 
 * @returns {Promise<Json>}
 */

const getProjects = async () => {
    let res = await fetch(urlApi + "/works");
    let projects = await res.json();
    return projects;
}

// Affichage dynamique des projets
/**
 * On crée les éléments HTML des projets et on les ajoute
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

// Affichage dynamique et gestion des filtres
/**
 * On récupère les catégories appelées par la fonction getProjects()
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
 * On crée les éléments HTML des filtres et on les ajoute
 * @param {JSON} categories
 */
function addFilters(categories) {
    let listFilters = document.createElement("div");
    listFilters.setAttribute("class", "filters");
    sectionPortfolio.insertBefore(listFilters, divGallery);
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

// On ajoute l'état "active" puis on l'enlève pour le filtre sélectionné
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

// On filtre les projets en fonction du filtre sélectionné
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

// On rassemble les fonctionnalités des filtres dans une fonction
function useFilter() {
    document.querySelectorAll(".filter").forEach(li => {
        li.addEventListener("click", onButtonClick)
        activeFilter();
    })
}

// On génère l'affichage dynamique des projets
function generateProjects() {
    getProjects().then(json => {
        if (json) {
            emptyGallery();
            addProjects(json)
        } else {
            console.log("Problèmes d'accès au serveur");
        }})
}
   
// On génère l'affichage dynamique des filtres et leur gestion  
function generateFilters()  {
    getProjects().then(projects => {
        let categories = getFilterCategories(projects);
        addFilters(categories);
        useFilter(categories);
       })
}

generateProjects();
generateFilters();

// To-Do : combiner les fonctions generateProjects() et generateFilters()
//         -> 1 seul appel à l'API
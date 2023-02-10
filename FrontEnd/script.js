// On enregistre l'URL de l'API
const urlApi = "http://localhost:5678/api";

// On enregistre le container
const divGallery = document.querySelector(".gallery");

// On récupère les données de l'API (objet Promise en Json)
/**
 * @returns {Promise<Json>}
 */

const getProjects = async () => {
    let res = await fetch(urlApi + "/works");
    let jsonListProject = await res.json();
    return jsonListProject;
}


// On ajoute les données à la page web
/**
 * @param {JSON} projects
 */

const addProjects = (projects) => {                         
    for (let project of projects) {
        let newFigure = document.createElement("figure");       // On crée une nouvelle balise "figure"
        divGallery.appendChild(newFigure);                      // On la rattache au container
        let newImage = document.createElement("img");           // On crée une nouvelle balise "img"
        newImage.src = project.imageUrl;                        // On lui affecte l'Url de l'img récupérée dans l'API
        let newTitle = document.createElement("figcaption");    // On crée une nouvelle balise "figcaption"
        newTitle.innerText = project.title;                     // On lui affecte le titre récupéré dans l'API
        newFigure.append(newImage, newTitle);                   // On rattache les balises "img" et "figcaption" à la balise "figure"
    }
}

// On vide le container :
// Tant que le container contient un élément firstChild, le container supprime le premier élément Child
const emptyGallery = () => {
    while (divGallery.firstChild) {
    divGallery.removeChild(divGallery.firstChild);
    }
}

// On génère l'affichage dynamique de la page
function generateProjects() {
    emptyGallery();
    getProjects().then(json => addProjects(json));
}
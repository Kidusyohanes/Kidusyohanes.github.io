"use strict"

// load the data using variouse methods 
// change the local host to https://kidus.me 
fetch('https://kidus.me/assets/data.json').then(res => {
    console.log("Connected")
    return(res.json());
}).then(data => {

    let projects = data['projects'];
    readProjects(projects);
    
});

// home page
// project reader 
function readProjects(projects) {
    let container = document.getElementById('projects');

    projects.forEach(row => {
        let project = displayRow(row);
        if(project != null) {
            container.appendChild(project);
        }
    });
}

function displayRow(rows) {

    let row = document.createElement('div');
    row.setAttribute('class', 'row');

    let card_deck= document.createElement('div');
    card_deck.setAttribute('class','card-deck');

    rows.forEach(project => {
        card_deck.appendChild(displayProjects(project));
    });

    row.appendChild(card_deck);
    return row;
}


// project displayer 
function displayProjects(project) {

    let card_deck= document.createElement('div');
    card_deck.setAttribute('class','card-deck');

    let card = document.createElement('div');
    card.setAttribute('class', 'card col-lg-4 col-md-4 col-sm-4 col-xs-12');
    
    let img_attrs = [];
    img_attrs.push({'src': project.img});
    img_attrs.push({'class':'card-img-top'});
    img_attrs.push({'alt':'logo'});

    // project img
    let img = document.createElement('img');  
    setAttributes(img, img_attrs);

    let card_body = document.createElement('div');
    card_body.setAttribute('class', 'card-body');

    let h5 = document.createElement("H5");
    h5.setAttribute('class', 'card-title');  // project title 
    h5.innerHTML = project.title;

    // description
    let descr = document.createElement('p');
    descr.setAttribute('class','card-text');
    descr.innerHTML = project.description; 

    // project link
    let link_wrapper = document.createElement('p');
    link_wrapper.setAttribute('class','card-text'); 

    let read_more_link = document.createElement('small');
    read_more_link.setAttribute('class', 'text-muted');
    read_more_link.innerHTML = 'Learn more';

    let link_attrs = [];
    link_attrs.push({'href': project.link});
    link_attrs.push({'target':'_blank'});

    let link = document.createElement('a');
    setAttributes(link, link_attrs);
    link.appendChild(read_more_link);
    link_wrapper.appendChild(link);

    // append all content inside card body
    card_body.appendChild(h5);
    card_body.appendChild(descr);
    card_body.appendChild(link);

    // append card body and img to card
    card.appendChild(img);
    card.appendChild(card_body);

    return card;
}

function setAttributes(ele, attrs) {
    attrs.forEach((attr) => {
        let key = Object.keys(attr)[0];
        ele.setAttribute(key, attr[key]);
    }) 
}



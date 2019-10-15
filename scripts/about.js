"use strict"

// load the data using variouse methods 
// change the local host to https://kidus.me 
fetch('http://127.0.0.1:8080/assets/data.json').then(res => {
    return(res.json());
}).then(data => {

    let skills = data['skills'];
    let books = data['books'];
    let courses = data['courses'];

    readSkills(skills);
    readBooks(books);
    readCourses(courses);
    
});

// about page 
function readSkills(skills) {

    let container = document.getElementById('skills');
    skills.forEach(lang => {
        
        let category = Object.keys(lang)[0];
        let section = deligateSkills(lang, category);
        container.appendChild(section);

    });
}

function deligateSkills(lang, category) {

    let id = ''; 

    if(category === 'Development') {
        id = 'development';
    } else if(category === 'Data Science') {
        id = 'data_science';
    } else {
        id = 'security_tr';
    }

    let section = document.createElement('section');
    section.setAttribute('id', id);

    let title = document.createElement('h6');
    title.innerHTML= category;

    let technologies = lang[category];
    let ul = document.createElement('ul', { class : 'list-group'});
    
    technologies.forEach(tech => {
        let li = displaySkills(tech);
        ul.appendChild(li);
    });
    
    section.appendChild(title);
    section.appendChild(ul);
    return section;
    
}

function displaySkills(tech) {

    let li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
    li.innerHTML = tech.language;

    let span = document.createElement('span');
    span.setAttribute('class', 'badge ' + tech.badge +  ' badge-pill');
    span.innerHTML = tech.status;

    li.appendChild(span);
    return li;
}

// books
function readBooks(books) {
    let container = document.getElementById('books');
    let ul = document.createElement('ul');
    ul.setAttribute('class', 'list-group list-group-horizontal-xl')
    books.forEach(book => {
        let b = displayBooks(book);
        ul.appendChild(b);
    });
    container.appendChild(ul);
}

function setAttributes(ele, attrs) {
    attrs.forEach((attr) => {
        let key = Object.keys(attr)[0];
        ele.setAttribute(key, attr[key]);
    });
}

function displayBooks(book) {
    let a = document.createElement('a');

    let a_attrs = [];
    a_attrs.push({'href': book.link});
    a_attrs.push({'target':'_blank'});
    setAttributes(a, a_attrs);

    let li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');


    let title = document.createElement('h5');
    title.setAttribute('class', 'card-title');
    title.innerHTML = book.title;

    let auth = document.createElement('p');
    auth.setAttribute('class','card-text');

    auth.innerHTML = 'by ' + book.author;

    li.appendChild(title);
    li.appendChild(auth);

    a.appendChild(li);

    return a;
}


// courses
function readCourses(courses) {
    let container = document.getElementById('courses');
    let ul = document.createElement('ul');

    ul.setAttribute('class', 'list-group')
    courses.forEach(course => {
        let c = displayCourses(course);
        ul.appendChild(c);
    });
    container.appendChild(ul);
}

function displayCourses(course) {
    let a = document.createElement('a');
    let a_attrs = [];

    a_attrs.push({'href': course.link});
    a_attrs.push({'target':'_blank'});
    setAttributes(a, a_attrs);

    let li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');

    a.innerHTML = course.course;
    li.appendChild(a);
    return li;
}
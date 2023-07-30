console.log(window.location.pathname)

const global = {
    currentPage: window.location.pathname
}

const movieContainerEl = document.getElementById('popular-movies')
const tvContainerEl = document.getElementById('popular-shows')


function highlightActiveLink(){
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if(global.currentPage.includes(link.getAttribute('href').split('/')[1])){
            link.classList.add('active')
        }
    })
}

// Display Popular Movies/Shows
async function displayPopular(query){
    const {results} = await fetchApiData(`${query}/popular`)
    console.log('result=>', results)
    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="${query === 'movie'? 'movie' : 'tv'}-details.html?id=${result.id}">
        
        ${
            result.poster_path ? 
            `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt=${query === 'movie' ?  result.original_title : result.name} class="card-img-top"></img>`:
            `<img src="./images/no-image.jpg" alt=${query === 'movie' ?  result.original_title : result.name} class="card-img-top">`
        }
        </a>
        <div class="card-body">
            <h5 class="card-title">${query === 'movie' ?  result.original_title : result.name}</h5>
            <p class="card-text">
            <small class="text-muted">${query === 'movie' ? 'Release: ' + result.release_date : 'Air Date: ' + result.first_air_date} </small>
            </p>
        </div>
        `

        query === 'movie' ? movieContainerEl.appendChild(div) : tvContainerEl.appendChild(div);
    })
}

// Display backdrop on Details Page
function displayBackgroundImage(type, path){
    const overlayDiv = document.createElement('div');
    // overlayDiv.style.backgroundImage = 
    // overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
    overlayDiv.style.cssText =  `background-image: url(https://image.tmdb.org/t/p/original/${path});background-size: cover; background-position: center; background-repeat: no-repeat; height: 100vh; width: 100vw; position: absolute; top: 0; left: 0; z-index: -1; opacity: 0.1`
    if(type === 'movie'){
        document.querySelector(`#${type}-details`).appendChild(overlayDiv)
    }else{
        document.querySelector(`#show-details`).appendChild(overlayDiv)
    }
}

//Display Details
async function displayDetails(query){
    const movieId = window.location.search.split('=')[1]
    console.log('movie id' , movieId)
    const result = await fetchApiData(`${query}/${movieId}`)
    console.log('show', result)
    displayBackgroundImage(query, result.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
            <div>
            ${
                result.poster_path ? 
                `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt=${query === 'movie' ?  result.title : result.name} class="card-img-top"></img>`:
                `<img src="./images/no-image.jpg" alt=${query === 'movie' ?  result.title : result.name} class="card-img-top">`
            }
            </div>
            <div>
                <h2>${query === 'movie' ?  result.title : result.name}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${result.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">Release Date: ${query === 'movie' ? result.release_date : result.last_air_date}</p>
                <p>
                   ${result.overview}
                </p>
                <h5>Genres</h5>
                <ul>
                    ${result.genres.map(g => `<li>${g.name}</li>`).join('')}
                </ul>
                <a href="${result.homepage}" target="_blank" class="btn">Visit Movie Home Page</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget: </span> $${addCommasToNumber(result.budget)}</li>
                <li><span class="text-secondary">Revenue: </span> $${addCommasToNumber(result.revenue)}</li>
                <li><span class="text-secondary">Runtime: </span> ${result.runtime} minutes</li>
                <li><span class="text-secondary">Status: </span> ${result.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
                ${result.production_companies.map(c => `<span>'${c.name}'</span>`).join('  ')}
            </div>
        </div>
    `
    if(query === 'movie'){
        document.querySelector('#movie-details').appendChild(div)
    }else{
        document.querySelector('#show-details').appendChild(div)
    }
}

function addCommasToNumber(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Fetch data from the TMDB API
async function fetchApiData(endpoint){
    const API_KEY = '52dc456358741f68bc1349c6c09f7002';
    const API_URL = 'https://api.themoviedb.org/3/';
    const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data;
}

// it will work as router for different pages
function init(){
    switch (global.currentPage){
        case '/movie-flix/index.html':
            console.log('Home');
            displayPopular('movie')
            break;
        case '/movie-flix/shows.html':
            console.log('shows');
            displayPopular('tv')
            break;
        case '/movie-flix/movie-details.html':
            console.log('movie details');
            displayDetails('movie');
            break;
        case '/movie-flix/tv-details.html':
            console.log('tv details');
            displayDetails('tv')
            break;
        case '/movie-flix/search.html':
            console.log('Search');
            break;
    }

    highlightActiveLink()
    
}

function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', init)
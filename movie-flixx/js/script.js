
const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    },
    api: {
        apiKey: '52dc456358741f68bc1349c6c09f7002',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
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

function handleDisplayResults(results, query, isSearch=false){
    // clear previous results
    if(!isSearch){
        query === 'movie' ? movieContainerEl.innerHTML = '' : tvContainerEl.innerHTML = '';
    }else{
        document.querySelector('#search-results').innerHTML = ''
        document.querySelector('#search-results-heading').innerHTML = ''
        document.querySelector('#pagination').innerHTML = ''
    }

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
        if(!isSearch){
            query === 'movie' ? movieContainerEl.appendChild(div) : tvContainerEl.appendChild(div);
        }else{
            document.querySelector('#search-results').appendChild(div)
        }
    })
}

// Display Popular Movies/Shows
async function displayPopular(query){
    const {results} = await fetchApiData(`${query}/popular`)
    handleDisplayResults(results, query)
}

// Display backdrop on Details Page
function displayBackgroundImage(type, path){
    const overlayDiv = document.createElement('div');
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
    const result = await fetchApiData(`${query}/${movieId}`)
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
                ${result.homepage ? 
                `<a href="${result.homepage}" target="_blank" class="btn">Visit ${query === 'movie' ? 'Movie' : 'Show'} Home Page</a>`:
                ``
                }
                
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
            ${query === 'movie' ? 
            `
                <li><span class="text-secondary">Budget: </span> $${addCommasToNumber(result.budget)}</li>
                <li><span class="text-secondary">Revenue: </span> $${addCommasToNumber(result.revenue)}</li>
                <li><span class="text-secondary">Runtime: </span> ${result.runtime} minutes</li>
                <li><span class="text-secondary">Status: </span> ${result.status}</li>
            ` :
            `
                <li><span class="text-secondary">Number of Seasons: </span> ${result.number_of_seasons}</li>
                <li><span class="text-secondary">Number of Episodes: </span> ${result.number_of_episodes}</li>
                <li><span class="text-secondary">Status: </span> ${result.status}</li>
            `}
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
    showSpinner()
    const response = await fetch(`${global.api.apiUrl}/${endpoint}?api_key=${global.api.apiKey}&language=en-US`);
    const data = await response.json();
    hideSpinner()
    return data;
}

async function searchAPIData(){
    showSpinner()
    const response = await fetch(`${global.api.apiUrl}/search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
    const data = await response.json();
    hideSpinner()
    return data;
}

// it will work as router for different pages
function init(){
    switch (global.currentPage){
        case '/movie-flixx/index.html':
            displayPopular('movie');
            displaySlider();
            break;
        case '/movie-flixx/shows.html':
            displayPopular('tv')
            break;
        case '/movie-flixx/movie-details.html':
            displayDetails('movie');
            break;
        case '/movie-flixx/tv-details.html':
            displayDetails('tv')
            break;
        case '/movie-flixx/search.html':
            search()
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

async function displaySlider(){
    const {results} = await fetchApiData('movie/now_playing');
    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide')
        div.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
                <img src="http://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}"/>
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-start text-secondary"></i>
                ${result.vote_average} / 10
            </h4>
        `
        document.querySelector('.swiper-wrapper').appendChild(div)
        initSwiper();
    })
}

function initSwiper(){
    const swiper = new Swiper('.swiper',{
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
    })
}

// Show Alert
function showAlert(message, className = "error"){
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);
    setTimeout(()=> {
        alertEl.remove()
    },3000)
}


// Search Movies/shows
async function search(e){
    const queryString = window.location.search;
    const urlPrams = new URLSearchParams(queryString);
    global.search.type = urlPrams.get('type')
    global.search.term = urlPrams.get('search-term')
    if(global.search.term){
        // making request and showing results
        const {results, total_pages, page, total_results} = await searchAPIData();
        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results
        if(!results.length){
            showAlert('No Data Found', 'error')
            return
        }
        displaySearchResult(results, true);
        document.querySelector('#search-results-heading').innerHTML = `
            <h2>${results.length} of ${global.search.totalResults}</h2>
        `
        document.querySelector('#search-term').value = ''
    }else{
        showAlert('Please Enter a search term', 'error');
    }
}

// Adding pagination for search
function displayPagination(){
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;
    document.querySelector('#pagination').appendChild(div)
    // disable prev btn on first page
    if(global.search.page === 1){
        document.querySelector('#prev').disabled = true;
    }
    // disable next btn on last page
    if(global.search.page === global.search.totalPages){
        document.querySelector('#next').disabled = true;
    }

    // adding event listners for prev and next
    document.querySelector('#next').addEventListener('click', async ()=>{
        global.search.page++;
        const {results} = await searchAPIData();
        displaySearchResult(results, true)
    })
    document.querySelector('#prev').addEventListener('click', async ()=>{
        global.search.page--;
        const {results} = await searchAPIData();
        displaySearchResult(results, true)
    })
}

// show search results
function displaySearchResult(results, isSearch){
    handleDisplayResults(results, global.search.type, isSearch);
    displayPagination();
}


document.addEventListener('DOMContentLoaded', init)
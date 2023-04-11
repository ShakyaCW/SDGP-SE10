//TMDB 
// import { keyImport } from '../../hidekey.js';
// keyImport();

const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

var myData = document.getElementById('results');
var jsonData = myData.innerHTML;
var parsedData = JSON.parse(jsonData);
console.log(parsedData);
console.log(parsedData[0]);
   

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const main2 = document.getElementById('main2');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = []
// setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

const finalData = [];
const posters = [];
const titles = [];
const votes = [];
const overviews = [];

var count = 0;

function displayPoster(name, year){
  var movName = name;
  var movYear = year
  var modifiedName = name.replace(/ /g, '+');
  var urlToPoster = 'http://api.themoviedb.org/3/search/movie?api_key=1cf50e6248dc270629e802686245c2c8&query=' + modifiedName + '&year=' + year;
  getMovies(urlToPoster, movName, movYear);

  if (count == 0){
    firstDiv(urlToPoster,movName);
  }

  count++;

}


var c = 0;

function getMovies(url,movieName, movieYear) {
  
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        
        console.log ( data.results[0]);
        
        if(data.results[0] !== null && data.results[0][poster_path] !== null){
        var {poster_path, vote_average, overview, id} = data.results[0];
        finalData.push(id);
        posters.push(poster_path);
        titles.push(movieName);
        votes.push(vote_average);
        overviews.push(overview);
        
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        
        var link = "https://image.tmdb.org/t/p/w500".concat(poster_path);
        
        
        movieEl.innerHTML = `
             <img src=${link} alt=${movieName}>
             
             <div class="movie-info">
                <h3>${movieName}</h3>
                <h3>${movieYear}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
                
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">View Trailer</button
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(data.results[0])
        })
        
      
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if(currentPage <= 1){
          prev.classList.add('disabled');
          next.classList.remove('disabled')
        }else if(currentPage>= totalPages){
          prev.classList.remove('disabled');
          next.classList.add('disabled')
        }else{
          prev.classList.remove('disabled');
          next.classList.remove('disabled')
        }

      }

      else{
        main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
    }})}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function showMovies(data) {
    main.innerHTML = '';

    var cc = 0;
    posters.forEach(poster => {

      
        
    }
    )
    
}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        var embed = [];
        var dots = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `)

            dots.push(`
              <span class="dot">${idx + 1}</span>
            `)
          }
        })
        
        var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

        <div class="dots">${dots.join('')}</div>
        
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }
    }
  })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length; 
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })
}

const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }

  showVideos()
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})


function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}


function firstDiv(url,movieName){
    fetch(url).then(res => res.json()).then(data => {
        
        console.log ( data.results[0]);
        
        if(data.results[0] !== null && data.results[0][poster_path] !== null){
        var {poster_path, vote_average, overview, id} = data.results[0];
        var link = "https://image.tmdb.org/t/p/w500".concat(poster_path);
        
        
        main2.innerHTML = `

            <div class="movie-poster">
            <img src=${link} alt=${movieName}>
            </div>
            <div class="movie-details">
            <h2 class="movie-title">${parsedData[0].title + " - "+parsedData[0].year} </h2>
            <p class="movie-director"><strong>Director:</strong>${"  "+ parsedData[0].director}</p>
            <p class="movie-cast"><strong>Cast:</strong>${"  "+ parsedData[0].cast}</p>
            <p class="movie-genres"><strong>Genres:</strong>${"  "+ parsedData[0].genre}</p>
            <p class="movie-summary"><strong>Summary:</strong>${"  "+ overview}</p>
            </div>

        `

      }

      
})}


var interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
var promise = Promise.resolve();
for (let i = 0; i < parsedData.length; i++) {
  promise = promise.then(function () {
    console.log(parsedData[i].title + ": " + parsedData[i].year);
    displayPoster(parsedData[i].title,+ parsedData[i].year);
    return new Promise(function (resolve) {
      setTimeout(resolve, interval);
    });
  });
};


var loader = document.getElementById("preloader");
window.addEventListener("load", function(){
  loader.style.display = "none";
})

console.log(parsedData);

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    searchButton.disabled = true;
  } else {
    searchButton.disabled = false;
  }
});


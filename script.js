
 
const API_KEY = 'api_key=18990b2a05ffcf2974107977620ff5be';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;
const watchlistURL=`${BASE_URL}/account/akashgupta_10/watchlist?${API_KEY}`;


const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');


var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;
 
getMovies(API_URL);  // function call for showing moving according to popularity

 function getMovies(url){
    lastUrl=url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        if(data.results.length !== 0){
            showMovies(data.results);
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

            tagsEl.scrollIntoView({behavior : 'smooth'})
 }
 else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
        
   })
}


 function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
         movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${IMG_URL+poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>

            </div>
            

       
            <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <br/> 
            <button class="watchlist" id="${id}">+Add to Watchlist</button>
            
            
          </div>
         `
        
         main.appendChild(movieEl);
       
        document.getElementById(id).addEventListener('click', () => {
             console.log(id);
             
            AddToWatchlist(movie)
        })
      
       
       
       
    })
}




  
 function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "red"
    }else{
        return 'orange'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    selectedGenre=[];
    setGenre();
    const searchTerm = search.value;
    
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
     }else{
    getMovies(API_URL);
     }

})

// setting genre
var selectedGenre = []
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
  const tagsEl=document.getElementById('tags');
  setGenre();
 function setGenre(){
          tagsEl.innerHTML='';
          
          genres.forEach(genre=>{
            const t=document.createElement('div');
            t.classList.add('tag');
            t.id=genre.id;
            t.innerText=genre.name;
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

// pagination
const prev=document.getElementById('prev');
const current=document.getElementById('current');
const next=document.getElementById('next');




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


 
  /* Add movie to watchlist*/

 function AddToWatchlist(_movie){
  data={
   "id":"_movie.id"
  }
  params={
  method:"post",
  body:data


 }
    fetch(watchlistURL,params).then(res => res.json()).then(data => {
      console.log("hi");
      console.log(data);
    })

 }






   


const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const start_btn = document.querySelector(".start_btn button");
const search_container = document.querySelector(".search-container");
const start_btn1 = document.querySelector(".start_btn1 button");
const recentSearch = document.querySelector(".rs");
const container_2 = document.querySelector(".container2");

// if Search Movie button clicked
start_btn.onclick = ()=>{
    search_container.classList.add("search-element"); //show info box
    recentSearch.classList.add("container-rs");
    start_btn.style.display = 'none'; // Hide button
    start_btn1.style.display = 'none'; // Hide button        
}

start_btn1.onclick = ()=>{
    container_2.classList.add("start-question"); //show info box

    start_btn1.style.display = 'none'; // Hide button
    start_btn.style.display = 'none'; // Hide button
}

// function showHide() {
//     if (document.getElementById('search-element').value=='1') {
//         document.getElementById('search-element').style.visibility='block';
//     }
//     else{
//         document.getElementById('search-element').style.visibility='none';
//     }
// }


// start_btn.addEventListener('click', () => {
//     start_btn.style.display = 'none';
// }); // Hide button when it got click it.

// exit_btn.onclick = ()=>{
//     info_box.classList.remove("activeInfo"); //hide info box
// }


// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

$(document).ready(function() {
   
    // On click listener to search a Movie
    $("#form-control").on("#click", "search-list", function(){
        var movie = $(this).text();
        getMovie(movie);
        gitMovie(movie);
        addToRecentSearches(movie);
    })

    // Hide elements til item is searched
    $("#form-control")

    // Load Recent Searches from the local Storage
    getRecentSearches();

    var movies = [];

    function addToRecentSearches(movie) {
        $("#form-control").show();

        // Create Element
        var newMovie = $("<li>");
        newMovie.addClass("search-list");
        newMovie.text(movie);
        // Append to List
        $("#form-control-list").prepend(newMovie);
    
        var movieObj = {
            movie: movie
        };
    
        movies.push(movieObj);
    
        // Save to localStorage with JSON
        localStorage.setItem("searches", JSON.stringify(movies));        
    }

    // Get the Recent Movie Searches
    function getRecentSearches() {
        var searches = JSON.parse(localStorage.getItem("searches"));
        if (searches != null) {
          for (var i = 0; i < searches.length; i++) {
            // Create Element
            var newMovie = $("<li>");
            newMovie.addClass("search-list");
            newMovie.text(searches[i].movie);
            // Append to List
            $("#search-list").prepend(newMovie);
          }
          $("#form-control").show();
        } else {
          $("#form-control").hide();
        }
      }

    
});

//This clears the previous searches when user clicks on clear history button.
$(".clear").on("click", function() {
    localStorage.clear();
    $("#form-control").empty();
});

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "plot"><b>Description:</b> ${details.Plot}</p>

        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
    </div>
    `;
}

// Option to add the awards -> <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

// window.addEventListener('input', (event) => {
//     if(event.target.className != "search-container"){
//         search_container.classList.add('hide-search-container');
//     }
// });

// window.addEventListener('click', (event) => {
//     if(event.target.className != "form-control"){
//        search_container.classList.add('hide-search-container');
//     }
// });

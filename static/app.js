
// Populate the dropdown with movies
const movieList = []; // Populate this with movie titles from `movie_list.pkl`

const selectElement = document.getElementById('movieSelect');
movieList.forEach(movie => {
    const option = document.createElement('option');
    option.value = movie;
    option.textContent = movie;
    selectElement.appendChild(option);
});
//load random movies
function loadMovies() {
    fetch('http://127.0.0.1:5000/random_movies')
        .then(response => response.json())
        .then(data => {
            const movieGrid = document.getElementById('movieGrid');
            movieGrid.innerHTML = ''; // Clear previous results
            data.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie';
                movieDiv.innerHTML = `
                    <button class="movie-button" onclick="handleMovieClick('${movie.name}')">
                        <img src="${movie.poster}" alt="${movie.name}">
                    </button>
                    <p>${movie.name}</p>
                `;
                movieGrid.appendChild(movieDiv);
            });
        })
        .catch(error => console.error('Error fetching random movies:', error));
}


// Fetch recommendations
function getRecommendations() {
    const selectedMovie = selectElement.value;
    fetch('http://127.0.0.1:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: selectedMovie })
    })
        .then(response => response.json())
        .then(data => {
            const movieGrid = document.getElementById('movieGrid');
            movieGrid.innerHTML = ''; // Clear previous results
            data.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie';
                movieDiv.innerHTML = `
                     <button class="movie-button" onclick="handleMovieClick('${movie.name}')">
                        <img src="${movie.poster}" alt="${movie.name}">
                    </button>
                    <p>${movie.name}</p>
                `;
                movieGrid.appendChild(movieDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
 
//Navigate to the movie_details page
function handleMovieClick(movietitle){
    if (!movietitle || typeof movietitle !== 'string') {
        console.error('Invalid movie title provided:', movietitle);
        return;
    }
    const selectedMovie = movietitle;
    fetch('http://127.0.0.1:5000/moviedetails1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: selectedMovie })
    })
    .then(response => response.json())
    .then(data => {
        if(data.tags){
            //store the movie data in localStorage
            localStorage.setItem('movieTitle',JSON.stringify(data.title));
            localStorage.setItem('movieDetails',JSON.stringify(data.tags));
            localStorage.setItem('moviePoster',JSON.stringify(data.poster));
            
            //redirect to the movie details page
            window.location.href='/movie_details';
        }else {
            console.error('movie data not found in response:',data);
        }
    })
    .catch(error => console.error('Error fetching movie details:',error));
}

//Filter movie by its catagory
document.addEventListener('DOMContentLoaded', () => {
    // Get all dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');

    // Add click event listeners to each item
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if href="#"
            
            // Get the selected option text
            const selectedOption = event.target.textContent;

            // Send the selected option to the backend
            fetch('http://127.0.0.1:5000/filter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filter1: selectedOption })
            })
            .then(response => response.json())
            .then(data => {
                // Update the movie grid with the filtered movies
                const movieGrid = document.getElementById('movieGrid');
                movieGrid.innerHTML = ''; // Clear previous results
                data.forEach(movie => {
                    const movieDiv = document.createElement('div');
                    movieDiv.className = 'movie';
                    movieDiv.innerHTML = `
                        <button class="movie-button" onclick="handleMovieClick('${movie.name}')">
                            <img src="${movie.poster}" alt="${movie.name}">
                        </button>
                        <p>${movie.name}</p>
                    `;
                    movieGrid.appendChild(movieDiv);
                });
            })
            .catch(error => console.error('Error:', error));
        });
    });
});



























document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the "movie_details" page
    if (window.location.pathname === '/movie_details') {
        const movieTitle = JSON.parse(localStorage.getItem('movieTitle'));
        const movieDetails = JSON.parse(localStorage.getItem('movieDetails'));
        const moviePoster = JSON.parse(localStorage.getItem('moviePoster'));

        if (movieDetails) {
            // Display movie details
            // const container = document.getElementById('movieDetailsContainer');
            // container.innerHTML = `
            //     <h2>Movie Details</h2>
            //     <ul>
            //         ${movieTitle}<br>
            //         ${movieDetails}
            //         <img src="${moviePoster}" alt="${movieTitle}" class="movie-poster">
            //     </ul>
            // `;
            //Display movie title
            const containerTitle = document.getElementById('movieDetailsContainerTitle');
            containerTitle.innerHTML=`<h2>${movieTitle}</h2>`;
            //Display movie Poster
            const containerPoster = document.getElementById('movieDetailsContainerPoster');
            containerPoster.innerHTML=` <img src="${moviePoster}" alt="${movieTitle}" class="movie-poster">`;
            //Display movie details
            const containerDetails = document.getElementById('movieDetailsContainerDetails');
            containerDetails.innerHTML=`<h5>${movieDetails}</h5>`;
        } else {
            console.error('No movie details found in localStorage.');
        }
    }
});




//Boostrap

AOS.init({
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 900, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  
  });
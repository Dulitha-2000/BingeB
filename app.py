from flask import Flask, request, jsonify,render_template
import pickle
import requests

app = Flask(__name__)

# Load pickled data
movies = pickle.load(open('movie_list.pkl', 'rb'))
similarity_list = pickle.load(open('similarity.pkl', 'rb'))

#test
@app.route('/test',methods=["GET"])
def test():
    if request.method=="GET":
        return jsonify({"response":"Get Request called"})

# Function to fetch movie poster
def fetch_movie_poster(movie_title):
    api_key = '7162c60cb8096b693dd91abc7104708a'  # Your TMDb API key
    base_url = 'https://api.themoviedb.org/3'

    search_url = f'{base_url}/search/movie?api_key={api_key}&query={movie_title}'
    response = requests.get(search_url)
    data = response.json()

    if data['results']:
        movie_id = data['results'][0]['id']
        poster_url = f"https://image.tmdb.org/t/p/w500{data['results'][0]['poster_path']}"
        return poster_url
    return None


# Recommendation endpoint
@app.route('/recommend', methods=['POST'])
def recommend():
    movie = request.json.get('movie')
    index = movies[movies['title'] == movie].index[0]
    distances = sorted(list(enumerate(similarity_list[index])), reverse=True, key=lambda x: x[1])

    recommended_movies = []
    for i in distances[0:10]:
        movie_name = movies.iloc[i[0]].title
        movie_poster = fetch_movie_poster(movie_name)
        recommended_movies.append({'name': movie_name, 'poster': movie_poster})

    response = jsonify(recommended_movies)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

#Movie Filter End point
@app.route('/filter',methods=['POST'])
def filters():
    movie = request.json.get('filter1')
    index = (movies[movies['tags'].str.contains(movie, case=False, na=False)]).index[0]
    distances = sorted(list(enumerate(similarity_list[index])), reverse=True, key=lambda x: x[1])
    recommended_movies = []
    for i in distances[0:12]:
        movie_name = movies.iloc[i[0]].title
        movie_poster = fetch_movie_poster(movie_name)
        recommended_movies.append({'name': movie_name, 'poster': movie_poster})

    response = jsonify(recommended_movies)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# Home endpoint
@app.route('/')
def home_page():
    return render_template("home.html")

#movie details end point
@app.route('/movie_details')
def movie_details_page():
    return render_template("movie_details.html")

#home onload movies
@app.route('/random_movies', methods=['GET'])
def random_movies():
    print("Hi")
    # Randomly selected 10 movies
    ran = movies.sample(21)
    random_movies_with_posters = [
        {'name': movie, 'poster': fetch_movie_poster(movie)}
        for movie in ran['title']
    ]
    return jsonify(random_movies_with_posters)

#Movie details page
@app.route('/moviedetails1', methods=['POST'])
def movie_details1():
    if not request.is_json:
        return jsonify({"error": "Invalid content type, must be application/json"}), 415

    movie = request.json.get('movie')
    if not movie or movie not in movies['title'].values:
        return jsonify({"error": "Movie not found"}), 404

    # Retrieve movie details
    movie_data = movies[movies['title'] == movie].to_dict(orient='records')[0]
    # Retrieve movie poster
    movie_data['poster'] = fetch_movie_poster(movie)
    response = jsonify(movie_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run()
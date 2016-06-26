export const ON_MOVIES_LIST = 'ON_MOVIES_LIST';
export const ON_MOVIE_DETAILS = 'ON_MOVIE_DETAILS';
export const CLEAN_SEARCH = 'CLEAN_SEARCH';
export const SEARCH_MOVIE_START = 'SEARCH_MOVIE_START';
export const SEARCH_MOVIE_ERROR = 'SEARCH_MOVIE_ERROR';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';
export const ADD_MOVIE_START = 'ADD_MOVIE_START';
export const ADD_MOVIE_ERROR = 'ADD_MOVIE_ERROR';
export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';

function prepareSearchURL({ title, year = '', page = '' }) {
  const url = (`http://www.omdbapi.com/?s=${title}&y=${year}&page=${page}&plot=short&r=json`);
  return url;
}

function prepareFetchURL(imdbID) {
  const url = (`http://www.omdbapi.com/?i=${imdbID}&plot=short&r=json`);
  return url;
}

export function onMoviesList(list) {
  // Note how dependency injection ensures pure action.
  return {
    type: ON_MOVIES_LIST,
    payload: { list }
  };
}

export function onMovieDetails(data, movieID) {
  return {
    type: ON_MOVIE_DETAILS,
    payload: { data, movieID }
  };
}

export function cleanSearch() {
  return {
    type: CLEAN_SEARCH,
    payload: null
  };
}

export function searchMovie(params) {
  return ({ fetch, dispatch }) => {
    const getPromise = async () => {
      const query = await fetch(prepareSearchURL(params), {
        method: 'GET'
      });
      const answer = await query.json();
      if (answer.Response === 'False') {
        console.log("can't find any");
        dispatch(cleanSearch);
      }
      return answer;
    };
    return {
      type: 'SEARCH_MOVIE',
      payload: getPromise()
    };
  };
}

async function fetchMovieById(firebase, imdbID) {
  const query = await fetch(prepareFetchURL(imdbID), {
    method: 'GET'
  });
  const answer = await query.json();
  await firebase.child('movies').child(imdbID).set(answer);
}

async function addMovieToUser(firebase, now, imdbID, userID) {
  const movie = {};
  movie[imdbID] = { favourite: false,
                    addedOn: now() };
  await firebase.child('user-movies').child(userID).update(movie);
}

export function addMovie(imdbID, userID) {
  return ({ firebase, now }) => {
    const getPromise = async () => {
      const query = await firebase
        .child('movies')
        .child(imdbID)
        .once('value')
        .then(async snapshot => {
          const checkExists = snapshot.val();
          if (checkExists === null) {
            throw new Error('no movie');
          } else {
            await addMovieToUser(firebase, now, imdbID, userID);
          }
        })
        .catch(async error => {
          console.log(`no movie${error}`);
          await fetchMovieById(firebase, imdbID);
          await addMovieToUser(firebase, imdbID, userID);
        });
      return query;
    };
    return {
      type: 'ADD_MOVIE',
      payload: getPromise()
    };
  };
}

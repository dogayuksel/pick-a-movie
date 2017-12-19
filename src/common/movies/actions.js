export const ON_MOVIES_LIST = 'ON_MOVIES_LIST';
export const ON_MOVIE_DETAILS = 'ON_MOVIE_DETAILS';
export const CLEAN_SEARCH = 'CLEAN_SEARCH';
export const SEARCH_MOVIE_START = 'SEARCH_MOVIE_START';
export const SEARCH_MOVIE_ERROR = 'SEARCH_MOVIE_ERROR';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';
export const ADD_MOVIE_START = 'ADD_MOVIE_START';
export const ADD_MOVIE_ERROR = 'ADD_MOVIE_ERROR';
export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';
export const DELETE_MOVIE_START = 'DELETE_MOVIE_START';
export const DELETE_MOVIE_ERROR = 'DELETE_MOVIE_ERROR';
export const DELETE_MOVIE_SUCCESS = 'DELETE_MOVIE_SUCCESS';


function prepareSearchURL({
  title,
  year = '',
  page = '',
  omdbSecret
}) {
  const url = (`http://www.omdbapi.com/?apikey=${omdbSecret}&s=${title}&y=${year}&page=${page}&plot=short&r=json`);
  return url;
}

function prepareFetchURL(imdbID, omdbSecret) {
  const url = (`http://www.omdbapi.com/?apikey=${omdbSecret}&i=${imdbID}&plot=short&r=json`);
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
      const query = new Promise((resolve) => {
        resolve(fetch(prepareSearchURL(params), { method: 'GET' }));
      });
      const answer = await query.timeout(900).then(value => value.json());
      if (answer.Response === 'False') {
        dispatch(cleanSearch);
        throw new Error("can't find any matching movies");
      }
      return answer;
    };
    return {
      type: 'SEARCH_MOVIE',
      payload: getPromise()
    };
  };
}

async function fetchMovieById(firebase, imdbID, omdbSecret) {
  const query = await fetch(prepareFetchURL(imdbID, omdbSecret), {
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

export function addMovie(imdbID, userID, omdbSecret) {
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
          await fetchMovieById(firebase, imdbID, omdbSecret);
          await addMovieToUser(firebase, now, imdbID, userID);
        });
      return query;
    };
    return {
      type: 'ADD_MOVIE',
      payload: getPromise()
    };
  };
}

export function removeMovie(imdbID, userID) {
  return ({ firebase }) => {
    const getPromise = async () => {
      await firebase
        .child('user-movies')
        .child(userID)
        .child(imdbID)
        .remove()
        .then()
        .catch(error => console.log(`no movie${error}`));
    };
    return {
      type: 'REMOVE_MOVIE',
      payload: getPromise()
    };
  };
}

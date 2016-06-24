export const ON_MOVIES_LIST = 'ON_MOVIES_LIST';
export const ON_MOVIE_DETAILS = 'ON_MOVIE_DETAILS';
export const SEARCH_MOVIE_START = 'SEARCH_MOVIE_START';
export const SEARCH_MOVIE_ERROR = 'SEARCH_MOVIE_ERROR';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';

function prepareURL({ title, year = '' }) {
  const url = (`http://www.omdbapi.com/?s=${title}&y=${year}&plot=short&r=json`);
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

export function searchMovie(title) {
  return ({ fetch }) => {
    const getPromise = async () => {
      const query = await fetch(prepareURL(title), {
        method: 'GET'
      });
      const answer = await query.json();
      console.log(answer);
      if (answer.Response === 'False') {
        console.log('here fucks');
        throw new Error('No good results');
      }
      return answer;
    };
    return {
      type: 'SEARCH_MOVIE',
      payload: getPromise()
    };
  };
}

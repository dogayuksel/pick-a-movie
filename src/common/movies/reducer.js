import * as actions from './actions';
import { Record, Map, List, Seq } from 'immutable';

const InitialState = Record({
  list: List(),
  details: Map(),
  results: List()
});

const reviveList = list => list && Seq(list).map((value, key) => ({
  imdb: key,
  userMeta: Map(value)
})).toList();

const revive = ({ list, details, results }) =>
  new InitialState({
    list: reviveList(list),
    details: Map(details),
    results: List(results),
  });

export default function moviesReducer(state = new InitialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.ON_MOVIES_LIST: {
      let { list } = action.payload;
      if (list != null) {
        list = reviveList(list).sortBy(value =>
          value.userMeta.get('addedOn'), (a, b) => b - a
        );
      } else {
        list = reviveList(list);
      }
      return state.set('list', list);
    }

    case actions.ON_MOVIE_DETAILS: {
      const { data, movieID } = action.payload;
      const movie = {};
      movie[movieID] = data;
      return state.set('details', state.get('details').merge(Map(movie)));
    }

    case actions.SEARCH_MOVIE_START: {
      return state;
    }

    case actions.SEARCH_MOVIE_ERROR: {
      return state;
    }

    case actions.SEARCH_MOVIE_SUCCESS: {
      const result = action.payload;
      return state.set('results', List(result.Search));
    }

    case actions.CLEAN_SEARCH: {
      return state.set('results', null);
    }

    case actions.ADD_MOVIE_SUCCESS: {
      console.log(action.payload);
      return state;
    }

  }

  return state;
}

/* eslint-disable react/jsx-indent */
import './Movies.scss';
import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import Movie from './Movie.react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  addMoreMovies: {
    defaultMessage: 'Add more then two movies',
    id: 'selection.page.addMoreMovies'
  },
  addMovies: {
    defaultMessage: 'Add some movies to your list',
    id: 'selection.page.addMoreMovies'
  }
});

class PickOne extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    movies: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedMovie: null,
    };
  }

  chooseAMovie() {
    const { movies } = this.props;
    const index = Math.ceil(movies.size * Math.random()) - 1;
    this.setState({ selectedMovie: movies.get(index) });
  }

  render() {
    const { movies } = this.props;
    const { selectedMovie } = this.state;

    return (
      <div className="pick-a-movie">
        {movies ?
         <div>
           {movies.size > 1 ?
            <button onClick={() => this.chooseAMovie()}>
              PickAMovie For Me!
            </button>
            :
            <Link to="/movies">
              <FormattedMessage {...messages.addMoreMovies} />
            </Link>
           }
         </div>
         :
         <Link to="/movies">
           <FormattedMessage {...messages.addMovies} />
         </Link>
        }
        {selectedMovie &&
         <div className="selected-movie">
           <Movie movie={selectedMovie} />
         </div>
        }
      </div>
    );
  }
}

PickOne = queryFirebase(PickOne, props => ({
  // Query path to listen. For one user we can use `users/${props.user.id}`.
  path: props.viewer && `user-movies/${props.viewer.id}`,
  // Firebase imperative firebase.com/docs/web/api/query as declarative params.
  params: [
    ['orderByChild', 'addedOn']
  ],
  on: {
    // Value event always rerenders all users. For better granularity, use
    // child_added, child_changed, child_removed, child_changed events.
    value: snap => props.onMoviesList(snap.val())
  }
}));

export default connect(state => ({
  viewer: state.users.viewer,
  movies: state.movies.list
}), movieActions)(PickOne);

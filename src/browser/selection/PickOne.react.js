/* eslint-disable react/jsx-indent */
import './Movies.scss';
import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import Movie from './Movie.react';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class PickOne extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    movies: PropTypes.object
  };

  chooseAMovie() {
    const { movies } = this.props;
    const index = Math.ceil(movies.size * Math.random()) - 1;
    this.setState({ selectedMovie: movies.get(index) });
  }

  render() {
    const selectedMovie = this.state && this.state.selectedMovie;

    return (
      <div className="pick-a-movie">
        <button onClick={() => this.chooseAMovie()}>
          PickAMovie For Me!
        </button>
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

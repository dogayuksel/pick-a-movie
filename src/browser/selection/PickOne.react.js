import './Movies.scss';
import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class PickOne extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    movies: PropTypes.object
  };

  chooseAMovie() {
    const { movies } = this.props;
    const index = Math.ceil(movies.size * Math.random());
    console.log(index);
    console.log(movies.get(index - 1));
  }

  render() {
    console.log('here renders');
    const { viewer, movies } = this.props;
    return (
      <div className="candidate-movies">
        <button onClick={this.chooseAMovie.bind(this)}>
          PickAMovie For Me!
        </button>
        {movies.map((value, key) => {
           console.log(value);
         })}
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

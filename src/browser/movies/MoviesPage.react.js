import * as movieActions from '../../common/movies/actions';
import Movie from './Movie.react';
import AddMovie from './AddMovie.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  userHere: {
    defaultMessage: 'There is a user already.',
    id: 'firebase.page.userHere'
  }
});

class MoviesPage extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    movies: PropTypes.object
  };

  render() {
    const { viewer, movies } = this.props;
    console.log('before render in movies');
    console.log(movies);

    return (
      <div className="firebase-page">
        <FormattedMessage {...linksMessages.firebase}>
          {message => <Helmet title={message} />}
      </FormattedMessage>
      <AddMovie />
        {viewer ?
          <FormattedMessage {...messages.userHere} />
        : null
        }
      {movies ?
       movies.map((value, key) =>
         <Movie key={key} movie={value} />
        )
       : null
       }
      </div>
    );
  }
}

MoviesPage = queryFirebase(MoviesPage, props => ({
  // Query path to listen. For one user we can use `users/${props.user.id}`.
  path: props.viewer && `user-movies/${props.viewer.id}`,
  // Firebase imperative firebase.com/docs/web/api/query as declarative params.
  params: [
    ['limitToLast', 10]
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
}), movieActions)(MoviesPage);

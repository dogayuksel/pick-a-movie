/* eslint-disable react/jsx-indent */
import * as movieActions from '../../common/movies/actions';
import Movie from './Movie.react';
import AddMovie from './AddMovie.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  userHere: {
    defaultMessage: 'My Movies',
    id: 'movies.page.userHere'
  },
  loginFirst: {
    defaultMessage: 'Login to start adding movies',
    id: 'movies.page.loginFirst'
  },
  emptyList: {
    defaultMessage: "Seems like you don't have any movies. Start of by searching and adding one.",
    id: 'movies.page.emptyList'
  }
});

class MoviesPage extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    movies: PropTypes.object,
    intl: PropTypes.object
  };

  render() {
    const { viewer, movies, intl } = this.props;
    const title = intl.formatMessage(linksMessages.movies);

    return (
      <div className="firebase-page">
        <Helmet title={title} />
        <FormattedMessage {...linksMessages.movies}>
          {message => <Helmet title={message} />}
        </FormattedMessage>
        <AddMovie />
        {viewer ?
         <div>
           <h3>
             <FormattedMessage {...messages.userHere} />
           </h3>
           {movies ?
            movies.map((value, key) =>
              <Movie key={key} movie={value} />
            )
            :
            <p>
              <FormattedMessage {...messages.emptyList} />
            </p>
           }
         </div>
         :
         <Link to="/login">
           <FormattedMessage {...messages.loginFirst} />
         </Link>
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
    ['orderByChild', 'addedOn'],
    ['limitToLast', 7]
  ],
  on: {
    // Value event always rerenders all users. For better granularity, use
    // child_added, child_changed, child_removed, child_changed events.
    value: snap => props.onMoviesList(snap.val())
  }
}));

MoviesPage = injectIntl(MoviesPage);

export default connect(state => ({
  viewer: state.users.viewer,
  movies: state.movies.list
}), movieActions)(MoviesPage);

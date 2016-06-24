import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  userHere: {
    defaultMessage: 'There is a user already.',
    id: 'firebase.page.userHere'
  }
});

class Movie extends Component {

  static propTypes = {
    movie: PropTypes.object,
    movieDetails: PropTypes.object,
  };

  render() {
    const { movieDetails } = this.props;

    return (
      <div className="movie-detail">
        {movieDetails ?
          <div>
            <b>{movieDetails.Title} </b>
            <b>{movieDetails.Year}</b>
          </div>
        : null}
      </div>
    );
  }
}

Movie = queryFirebase(Movie, props => {
  const movieID = props.movie.imdb;
  return ({
    path: props.movie && `movies/${movieID}`,
    on: {
      value: snap => props.onMovieDetails(snap.val(), movieID)
    }
  });
});

export default connect((state, props) => ({
  movieDetails: state.movies &&
                state.movies.details.get(props.movie.imdb)
}), movieActions)(Movie);

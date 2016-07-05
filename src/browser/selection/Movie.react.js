import './Movie.scss';
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
    viewer: PropTypes.object,
    removeMovie: PropTypes.func
  };

  render() {
    const { movieDetails, viewer/* , removeMovie*/ } = this.props;

    return (
      <div>
        {(movieDetails && viewer) ?
         <div className="candidate-movie">
           {/* <button
           className="remove-candidate-button"
           onClick={removeMovie.bind(this,
           movieDetails.imdbID,
           viewer.id)}
           >
           X
           </button> */}
           <img
             className="candidate-poster"
             role="presentation"
             src={movieDetails.Poster}
           />
           <div className="candidate-title">
             {`${movieDetails.Title} ${movieDetails.Year}`}
           </div>
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
                state.movies.details.get(props.movie.imdb),
  viewer: state.users.viewer
}), movieActions)(Movie);

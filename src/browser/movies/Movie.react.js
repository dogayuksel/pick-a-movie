/* eslint-disable react/jsx-indent */
import './Movie.scss';
import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class Movie extends Component {

  static propTypes = {
    movie: PropTypes.object,
    movieDetails: PropTypes.object,
    viewer: PropTypes.object,
    removeMovie: PropTypes.func
  };

  render() {
    const { movieDetails, viewer, removeMovie } = this.props;

    return (
      <div>
        {(movieDetails && viewer) ?
         <div className="movie-detail">
           <div className="poster">
             <img
               role="presentation"
               src={movieDetails.Poster}
               width={120} height={190}
             />
           </div>
           <div className="data">
             <button
               onClick={() => removeMovie(
                   movieDetails.imdbID,
                   viewer.id)}
             >
               Remove this from movies
             </button>
             <h4>{movieDetails.Title} {movieDetails.Year}</h4>
             <p>{movieDetails.Runtime} {movieDetails.Genre}</p>
             <p>{movieDetails.Plot}</p>
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

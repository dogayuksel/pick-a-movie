/* eslint-disable react/jsx-indent */
import './AddMovie.scss';
import FieldError from '../lib/FieldError.react';
import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { focusInvalidField, ValidationError } from '../../common/lib/validation';

class AddMovie extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    searchMovie: PropTypes.func,
    cleanSearch: PropTypes.func,
    addMovie: PropTypes.func,
    omdbSecret: PropTypes.string,
    viewer: PropTypes.object,
    results: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      disabled: false,
      error: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { searchMovie, omdbSecret } = this.props;
    const query = {};
    const title = nextProps.fields.movie.value.trim().toLowerCase();
    if (title && title.length > 2 && title !== 'the') {
      query.title = title;
    } else {
      query.title = '';
    }
    const year = nextProps.fields.year.value;
    if (year && year.length === 4 && parseInt(year, 10)) {
      query.year = year;
    } else {
      query.year = '';
    }
    if (!this.state && query.title) {
      searchMovie(query);
    } else if (query.title &&
               (query.title !== this.state.title ||
                query.year !== this.state.year)) {
      searchMovie({ ...query, omdbSecret });
    }
    this.setState(query);
  }

  componentWillUnmount() {
    const { cleanSearch, fields } = this.props;
    cleanSearch();
    fields.$reset();
  }

  async onFormSubmit(e) {
    e.preventDefault();
    const { fields, searchMovie, cleanSearch, omdbSecret } = this.props;
    this.setState({ disabled: true });
    const values = fields.$values();
    await searchMovie({ title: values.movie.trim(),
                        year: values.year.trim(),
                        omdbSecret,
    });
    this.setState({ disabled: false });
    fields.$reset();
  }

  render() {
    const { fields, results, addMovie, viewer, omdbSecret } = this.props;
    const { disabled, error } = this.state;

    return (
      <div className="add-movie">
        <form
          onSubmit={this.onFormSubmit}>
          <fieldset
            disabled={disabled}
            className="add-movie-fields"
          >
            <FieldError error={error} prop="someField" />
            <input
              {...fields.movie}
              className="add-movie-fields--movie-name"
              placeholder="movie name"
              maxLength={30}
              type="text"
            />
            <input
              {...fields.year}
              className="add-movie-fields--movie-year"
              placeholder="year"
              maxLength={4}
              type="text"
            />
            <button type="submit">
              search movie
            </button>
            {fields.$error.value &&
             <b className="error-message">{fields.$error.value.message}</b>
            }
          </fieldset>
        </form>
        <div className="search-results">
          {results ?
           results.map((value) =>
             <div
               key={value.imdbID}
               className="search-results--item"
             >
               {value.Title} / {value.Year}
               {viewer ?
                <span
                  className="search-results--add-button"
                  onClick={() => addMovie(
                      value.imdbID, viewer.id, omdbSecret)}
                  >
                  add
                </span>
                : null
               }
             </div>)
           : null
          }
        </div>
      </div>
    );
  }
}

AddMovie = fields(AddMovie, {
  path: 'addMovie',
  fields: [
    '$disabled',
    '$error',
    'movie',
    'year'
  ],
  getInitialState: () => ({
    // someField: '123',
    // hasCar: true,
    // movie: 'interstellar',
  })
});

export default connect(state => ({
  addMovieModel: state.fields.get('addMovie'),
  results: state.movies.results,
  viewer: state.users.viewer,
  omdbSecret: state.config.omdbSecret,
}), movieActions)(AddMovie);

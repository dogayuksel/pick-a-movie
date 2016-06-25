import * as movieActions from '../../common/movies/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { focusInvalidField, ValidationError } from '../../common/lib/validation';

const messages = defineMessages({
  userHere: {
    defaultMessage: 'There is a user already.',
    id: 'firebase.page.userHere'
  }
});

class AddMovie extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    searchMovie: PropTypes.func,
    cleanSearch: PropTypes.func,
    addMovie: PropTypes.func,
    viewer: PropTypes.object,
    results: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { searchMovie } = this.props;
    const queryTerm = nextProps.fields.movie.value.trim();
    if (this.state && queryTerm.length > 2 &&
        queryTerm !== this.state.fieldValue) {
      searchMovie({ title: queryTerm });
    }
    this.setState({ fieldValue: queryTerm });
  }

  componentWillUnmount() {
    const { cleanSearch } = this.props;
    cleanSearch();
  }

  async onFormSubmit(e) {
    e.preventDefault();
    const { fields, searchMovie } = this.props;
    // Disable form.
    fields.$disabled.setValue(true);
    const exampleAction = async (values) => new Promise((resolve, reject) => {
      if (values.movie.trim()) {
        searchMovie({ title: values.movie.trim(),
                      year: values.year.trim()
        });
        setTimeout(resolve, 1000);
        return;
      }
      setTimeout(() => {
        reject({
          reason: new ValidationError('required', { prop: 'movie' })
        });
      }, 1000);
    });
    try {
      // For simple flat forms we can use handy fields.$values() helper.
      const values = fields.$values();
      // console.log(values); // eslint-disable-line no-console
      // For complex nested forms we can get whole model via redux connect.
      // const allValues = this.propsfieldsPageModel && this.propsfieldsPageModel.toJS();
      // console.log(allValues); // eslint-disable-line no-console
      await exampleAction(values);
    } catch (error) {
      fields.$disabled.setValue(false);
      fields.$error.setValue(error.reason);
      focusInvalidField(this, error.reason);
      throw error;
    }

    // Reset all (even nested) fieldsPage fields.
    fields.$reset();
  }

  render() {
    const { fields, results, addMovie, viewer} = this.props;

    return (
      <div className="add-movie">
        <form onSubmit={this.onFormSubmit}>
          <fieldset disabled={fields.$disabled.value}>
            <input
              {...fields.movie}
              maxLength={30}
              type="text"
            />
            <input
              {...fields.year}
              maxLength={4}
              type="text"
            />
            <button type="submit">
              Want to add a movie
            </button>
            {fields.$error.value &&
              <b className="error-message">{fields.$error.value.message}</b>
            }
          </fieldset>
        </form>
        {results ?
         results.map((value) =>
           <div>{value.Title} / {value.Year}
             {viewer ?
               <button
                 onClick={addMovie.bind(this, value.imdbID, viewer.id)}
               >
                 Add to my movies
               </button>
              : null
             }
           </div>)
         : null
        }
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
  viewer: state.users.viewer
}), movieActions)(AddMovie);

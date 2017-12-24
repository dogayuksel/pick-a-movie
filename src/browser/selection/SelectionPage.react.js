import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React from 'react';
import Movies from './Movies.react';
import PickOne from './PickOne.react';
import linksMessages from '../../common/app/linksMessages';
import { Link } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import './SelectionPage.scss';

const messages = defineMessages({
  loginFirst: {
    defaultMessage: 'Login to see the movies on your list',
    id: 'selection.page.userHere'
  }
});

class SelectionPage extends Component {

  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl, viewer } = this.props;
    const title = intl.formatMessage(linksMessages.selection);

    return (
      <div className="selection-page">
        <Helmet title={title} />
        { viewer ?
          <div>
            <PickOne />
            <Movies />
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

SelectionPage = injectIntl(SelectionPage);

export default connect(state => ({
  viewer: state.users.viewer
}))(SelectionPage);

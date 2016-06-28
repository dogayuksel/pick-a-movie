import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React from 'react';
import Movies from './Movies.react';
import PickOne from './PickOne.react';
import linksMessages from '../../common/app/linksMessages';
import { injectIntl, intlShape } from 'react-intl';

class SelectionPage extends Component {

  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.props;
    const title = intl.formatMessage(linksMessages.todos);

    return (
      <div className="todos-page">
        <Helmet title={title} />
        <Movies />
        <PickOne />
      </div>
    );
  }

}

export default injectIntl(SelectionPage);

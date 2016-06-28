import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedHTMLMessage, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router';

const messages = defineMessages({
  intro: {
    defaultMessage: `
      <p>
        Welcome to the movie picker! <br />
        Are you having a hard time choosing what to watch? <br />
        Just start adding movies at your disposal and let me decide for you!
      </p>
    `,
    id: 'home.intro'
  }
});

export default class HomePage extends Component {

  render() {
    return (
      <div className="home-page">
        {/* Note child is a function, so we can localize anything. */}
        <FormattedMessage {...linksMessages.home}>
          {message => <Helmet title={message} />}
        </FormattedMessage>
        <FormattedHTMLMessage {...messages.intro} />
        <Link to="/movies">Start adding movies</Link>
      </div>
    );
  }

}

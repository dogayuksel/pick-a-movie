import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Header extends Component {

  static propTypes = {
    viewer: PropTypes.object
  };

  render() {
    const { viewer } = this.props;

    return (
      <header>
        <div className="logo">
          <Link to="/">
            <FormattedMessage {...linksMessages.home} />
          </Link>
        </div>
        <div className="link-item">
          <Link activeClassName="active" to="/movies">
            <FormattedMessage {...linksMessages.movies} />
          </Link>
        </div>
        <div className="link-item">
          <Link activeClassName="active" to="/select">
            <FormattedMessage {...linksMessages.selection} />
          </Link>
        </div>        
        {viewer &&
          <div className="link-item">
            <Link activeClassName="active" to="/me">
              <FormattedMessage {...linksMessages.me} />
            </Link>
          </div>
        }
        {!viewer &&
          <div className="link-item">
            <Link activeClassName="active" to="/firebase">
              <FormattedMessage {...linksMessages.login} />
            </Link>
          </div>
        }
      </header>
    );
  }

}

export default connect(state => ({
  viewer: state.users.viewer
}))(Header);

import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Header extends Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { isAuthenticated, viewer } = this.props;
    const viewerIsAuthenticated = viewer && isAuthenticated;

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
        {viewerIsAuthenticated &&
          <div className="link-item">
            <Link activeClassName="active" to="/me">
              <FormattedMessage {...linksMessages.me} />
            </Link>
          </div>
        }
        {!viewerIsAuthenticated &&
          <div>
            <Link activeClassName="active" to="/login">
              <FormattedMessage {...linksMessages.login} />
            </Link>
          </div>
        }
      </header>
    );
  }

}

export default connect(state => ({
  isAuthenticated: state.auth.isAuthenticated,
  viewer: state.users.viewer
}))(Header);

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from './Header.module.sass';
import CONSTANTS from '../../constants';
import { clearUserStore } from '../../store/slices/userSlice';
import { getUser } from '../../store/slices/userSlice';
import withRouter from '../../hocs/withRouter';
import BadgeNotification from '../BadgeNotification/BadgeNotification';
import {
  selectActiveNotifications,
  markNotificationsAsViewed,
} from '../../store/slices/eventsSlice';

class Header extends React.Component {
  state = {
    isOpen: false,
  };

  toggleMenu = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  componentDidMount () {
    if (!this.props.data) {
      this.props.getUser();
    }
    this.notificationInterval = setInterval(() => {
      this.props.updateEvents();
    }, 5000);
  }

  componentWillUnmount () {
    clearInterval(this.notificationInterval);
  }

  handleViewEvents = () => {
    this.props.markNotificationsAsViewed();
  };

  logOut = () => {
    localStorage.clear();
    this.props.clearUserStore();
    this.props.navigate('/login', { replace: true });
  };

  startContests = () => {
    this.props.navigate('/startContest');
  };

  renderLoginButtons = () => {
    if (this.props.data) {
      const { notifications } = this.props;
      return (
        <>
          <div className={styles.userInfo}>
            <img
              src={
                this.props.data.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${this.props.data.avatar}`
              }
              alt='user'
            />
            <span className={styles.displayName}>
              {`Hi, ${this.props.data.displayName}`}
              <BadgeNotification count={notifications} />
            </span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt='menu'
            />
            <ul>
              <li>
                <Link to='/dashboard' style={{ textDecoration: 'none' }}>
                  <span>View Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to='/account' style={{ textDecoration: 'none' }}>
                  <span>My Account</span>
                </Link>
              </li>
              {this.props.data?.role === CONSTANTS.CUSTOMER && (
                <li>
                  <Link to='/events' onClick={this.handleViewEvents}>
                    <span className={styles.events}>
                      My Events <BadgeNotification count={notifications} />
                    </span>
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to='http:/www.google.com'
                  style={{ textDecoration: 'none' }}
                >
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  to='http:/www.google.com'
                  style={{ textDecoration: 'none' }}
                >
                  <span>Affiliate Dashboard</span>
                </Link>
              </li>
              <li>
                <span onClick={this.logOut}>Logout</span>
              </li>
            </ul>
          </div>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`}
            className={styles.emailIcon}
            alt='email'
          />
        </>
      );
    }
    return (
      <>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to='/registration' style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  render () {
    if (this.props.isFetching) {
      return null;
    }
    const { isOpen } = this.state;
    return (
      <div className={styles.headerContainer}>
        <div className={styles.fixedHeader}>
          <span className={styles.info}>
            Squadhelp recognized as one of the Most Innovative Companies by Inc
            Magazine.
          </span>
          <a href='http://www.google.com'>Read Announcement</a>
        </div>
        <div className={styles.loginSignnUpHeaders}>
          <div className={styles.numberContainer}>
            <img src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`} alt='phone' />
            <span>(877)&nbsp;355-3585</span>
          </div>
          <div className={styles.userButtonsContainer}>
            {this.renderLoginButtons()}
          </div>
        </div>
        <button className={styles.burgerBtnWrapper} onClick={this.toggleMenu}>
          <RxHamburgerMenu className={styles.burgerBtn} />
        </button>
        <div className={styles.navContainer}>
          <Link to='/'>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
              className={styles.logo}
              alt='blue_logo'
            />
          </Link>

          <div
            className={classNames(styles.leftNav, { [styles.open]: isOpen })}
          >
            <div className={styles.nav}>
              <ul>
                {CONSTANTS.MENU_ITEMS.map((menu, index) => (
                  <li key={index}>
                    <p>{menu.title}</p>
                    <img
                      src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                      alt='menu'
                    />
                    <ul>
                      {menu.subItems.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <Link to={sub.path}>{sub.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                {this.props.data &&
                  this.props.data.role === CONSTANTS.MODERATOR && (
                    <div className={styles.offersWrapper}>
                      <Link className={styles.offers} to='/offers'>
                        OFFERS
                      </Link>
                    </div>
                  )}
              </ul>
            </div>

            {this.props.data &&
              this.props.data.role !== CONSTANTS.CREATOR &&
              this.props.data.role !== CONSTANTS.MODERATOR && (
                <div
                  className={styles.startContestBtn}
                  onClick={this.startContests}
                >
                  START CONTEST
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.userStore,
  notifications: selectActiveNotifications(state),
});
const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUser()),
  clearUserStore: () => dispatch(clearUserStore()),
  markNotificationsAsViewed: () => dispatch(markNotificationsAsViewed()),
  updateEvents: () => dispatch({ type: 'events/updateEvents' }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

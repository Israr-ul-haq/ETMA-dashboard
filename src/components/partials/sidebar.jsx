import { Link, withRouter } from 'react-router-dom';

function Sidebar(props) {
  let userImg;
  let bookletImg;
  let assignBookletImg;

  if (window.location.href.indexOf('/users') > -1) {
    userImg = '/assets/images/User-1.svg';
  } else {
    userImg = '/assets/images/User.svg';
  }
  if (window.location.href.indexOf('/booklets') > -1) {
    bookletImg = '/assets/images/Booket-1.svg';
  } else {
    bookletImg = '/assets/images/Booket.svg';
  }
  if (window.location.href.indexOf('/booklet-assignment') > -1) {
    assignBookletImg = '/assets/images/flyer.png';
  } else {
    assignBookletImg = '/assets/images/flyer.svg';
  }
  return (
    <div className='menu'>
      <div className='main-menu dashboar-right'>
        <div className='scroll'>
          <ul className='list-unstyled'>
            <li
              className={`nav-item  ${
                window.location.href.indexOf('/users') > -1 ? 'active' : ''
              }`}
            >
              <Link to='/users'>
                <img alt='Profile Picture' src={userImg} />
                <span>Users</span>
              </Link>
            </li>
            <li
              className={`nav-item  ${
                window.location.href.indexOf('/booklets') > -1 ? 'active' : ''
              }`}
            >
              <Link to='/booklets'>
                <img alt='Profile Picture' src={bookletImg} />
                <span>Booklet</span>
              </Link>
            </li>
            <li
              className={`nav-item  ${
                window.location.href.indexOf('/booklet-assignment') > -1
                  ? 'active'
                  : ''
              }`}
            >
              <Link to='/booklet-assignment'>
                <img alt='Profile Picture' src={assignBookletImg} />
                <span>Assign Booklet</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Sidebar);

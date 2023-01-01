import {
  BrowserRouter as Router,
  Route,
  Switch,
  HashRouter,
} from 'react-router-dom';
import React, { useContext } from 'react';

import Login from './components/login';
import Header from './components/partials/header';
import Sidebar from './components/partials/sidebar';
import Users from './components/Dashboard/Users/all';
import AddUsers from './components/Dashboard/Users/add';
import EditUsers from './components/Dashboard/Users/edit';
import FilterUser from './components/Dashboard/Users/filter';
import Booklet from './components/Dashboard/Booklet/all';
import FilterBooklet from './components/Dashboard/Booklet/filter';
import AddBooklet from './components/Dashboard/Booklet/add';
import EditBooklet from './components/Dashboard/Booklet/edit';
import ViewBooklet from './components/Dashboard/Booklet/view';
import BookletAssignmentsListing from './components/Dashboard/AssignBooklet/Assignments';
import BookletAssignmentsFilter from './components/Dashboard/Booklet/assignmentfilter';
import BookletAssignments from './components/Dashboard/Booklet/assignbooklet';
import AssignmentEdit from './components/Dashboard/AssignBooklet/AssignmentEdit';
import AssignUser from './components/Dashboard/AssignBooklet/AssignUser';
import UploadUsers from './components/Dashboard/Users/uploadusers';
import ImportBooklets from './components/Dashboard/Booklet/importbooklets';
import BookletAssignement from './components/Dashboard/AssignBooklet/BookletAssignement';
import BookletAssignmentBooklet from './components/Dashboard/AssignBooklet/BookletAssignmentBooklet';
import AccountContext from './components/context/account/AccountContext';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import 'datatables.net/js/jquery.dataTables.min.js';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.print';
import ChooseUsers from './components/Dashboard/AssignBooklet/ChooseUsers';
import { createBrowserHistory } from 'history';
import { useIsAuthenticated } from '@azure/msal-react';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

function App() {
  return (
    <div className='App'>
      <HashRouter>
        <Switch>
          <Route exact path='/' exact component={() => <Login />} />

          <div>
            <Header />
            <Sidebar />
            <Route exact path='/users' component={Users} />
            <Route exact path='/users/add' component={AddUsers} />
            <Route exact path='/users/upload' component={UploadUsers} />
            <Route exact path='/booklets/upload' component={ImportBooklets} />
            <Route exact path='/users/edit/:id' component={EditUsers} />
            <Route exact path='/filter-user' component={FilterUser} />
            <Route exact path='/booklets' component={Booklet} />
            <Route exact path='/assign-booklet/:id' component={AssignmentEdit} />
            <Route exact path='/assign-booklet/tasks/:id' component={AssignUser} />
            <Route exact path='/filter-booklet' component={FilterBooklet} />
            <Route exact path='/booklet-assignment' component={BookletAssignement} />
            <Route exact
              path='/booklet-assignment/booklet'
              component={BookletAssignmentBooklet}
            />
            <Route exact path='/booklet-assignment/assign' component={ChooseUsers} />
            <Route exact path='/booklets/view/:id' component={ViewBooklet} />
            <Route exact path='/booklets/add' component={AddBooklet} />
            <Route exact path='/booklets/edit/:id' component={EditBooklet} />
            <Route exact
              path='/assign-booklet'
              component={BookletAssignmentsListing}
            />
            <Route exact
              path='/assign-booklet-filter'
              component={BookletAssignmentsFilter}
            />
            {/* <Route exact
              path='/assign-booklet'
              exact
              component={() => <BookletAssignments />}
            /> */}
          </div>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;

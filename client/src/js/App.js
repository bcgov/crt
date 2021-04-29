import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import 'react-toastify/dist/ReactToastify.css';

import AuthorizedRoute from './components/fragments/AuthorizedRoute';
import Main from './components/Main';
import Footer from './components/fragments/Footer';
import Header from './components/fragments/Header';
import UserAdmin from './components/admin/UserAdmin';
import RoleAdmin from './components/admin/RoleAdmin';
import CodeTableAdmin from './components/admin/CodeTableAdmin';
import ElementAdmin from './components/admin/ElementAdmin';
import Projects from './components/Projects';
import ProjectDetails from './components/project/ProjectDetails';
import ProjectPlan from './components/project/ProjectPlan';
import ProjectTender from './components/project/ProjectTender';
import ProjectSegment from './components/project/ProjectSegment';
import Version from './components/Version';
import ApiAccess from './components/ApiAccess';
import ErrorBoundary from './components/ErrorBoundary';

import addIconsToLibrary from './fontAwesome';
import * as Constants from './Constants';

import '../scss/app.scss';

toast.configure({
  position: 'bottom-center',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const App = ({ currentUser }) => {
  addIconsToLibrary();

  return (
    <Main>
      <BrowserRouter>
        <React.Fragment>
          <Header />
          <Container>
            <ErrorBoundary>
              <Switch>{Routes(currentUser)}</Switch>
            </ErrorBoundary>
          </Container>
          <Footer />
        </React.Fragment>
      </BrowserRouter>
    </Main>
  );
};

const NoMatch = () => {
  return <p>404</p>;
};

const Unauthorized = () => {
  return <p>Unauthorized</p>;
};

const Routes = (currentUser) => {
  return AdminRoutes(currentUser);
};

const defaultPath = (currentUser) => {
  if (currentUser.permissions?.includes(Constants.PERMISSIONS.PROJECT_R)) return Constants.PATHS.PROJECTS;

  if (currentUser.permissions?.includes(Constants.PERMISSIONS.USER_R)) return Constants.PATHS.ADMIN_USERS;

  if (currentUser.permissions?.includes(Constants.PERMISSIONS.ROLE_R)) return Constants.PATHS.ADMIN_ROLES;

  return Constants.PATHS.UNAUTHORIZED;
};

const getLastVistedPath = (currentUser) => {
  const lastVisitedPath = localStorage.getItem('lastVisitedPath');

  if (lastVisitedPath) return lastVisitedPath;

  return defaultPath(currentUser);
};

const CommonRoutes = () => {
  return (
    <Switch>
      <AuthorizedRoute path={Constants.PATHS.API_ACCESS} requires={Constants.PERMISSIONS.API_W}>
        <Route path={Constants.PATHS.API_ACCESS} exact component={ApiAccess} />
      </AuthorizedRoute>
      <Route path={Constants.PATHS.VERSION} exact component={Version} />
      <Route path={Constants.PATHS.UNAUTHORIZED} exact component={Unauthorized} />
      <Route path="*" component={NoMatch} />
    </Switch>
  );
};

const AdminRoutes = (currentUser) => {
  return (
    <Switch>
      <Route path={Constants.PATHS.HOME} exact>
        <Redirect to={getLastVistedPath(currentUser)} />
      </Route>
      <AuthorizedRoute path={Constants.PATHS.ADMIN_USERS} requires={Constants.PERMISSIONS.USER_R}>
        <Route path={Constants.PATHS.ADMIN_USERS} exact component={UserAdmin} />
      </AuthorizedRoute>
      <AuthorizedRoute path={Constants.PATHS.ADMIN_ROLES} requires={Constants.PERMISSIONS.ROLE_R}>
        <Route path={Constants.PATHS.ADMIN_ROLES} exact component={RoleAdmin} />
      </AuthorizedRoute>
      <AuthorizedRoute path={Constants.PATHS.ADMIN_CODE_TABLES} requires={Constants.PERMISSIONS.CODE_R}>
        <Route path={Constants.PATHS.ADMIN_CODE_TABLES} exact component={CodeTableAdmin} />
      </AuthorizedRoute>
      <AuthorizedRoute path={Constants.PATHS.ADMIN_ELEMENTS} requires={Constants.PERMISSIONS.CODE_R}>
        <Route path={Constants.PATHS.ADMIN_ELEMENTS} exact component={ElementAdmin} />
      </AuthorizedRoute>
      {ProjectRoutes()}
      {CommonRoutes()}
    </Switch>
  );
};

const ProjectRoutes = (currentUser) => {
  return (
    <AuthorizedRoute path={Constants.PATHS.PROJECTS} requires={Constants.PERMISSIONS.PROJECT_R}>
      <Route path={Constants.PATHS.PROJECTS} exact component={Projects} />
      <Route path={`${Constants.PATHS.PROJECTS}/:id`} exact component={ProjectDetails} />
      <Route path={`${Constants.PATHS.PROJECTS}/:id${Constants.PATHS.PROJECT_PLAN}`} component={ProjectPlan} />
      <Route path={`${Constants.PATHS.PROJECTS}/:id${Constants.PATHS.PROJECT_TENDER}`} component={ProjectTender} />
      <Route path={`${Constants.PATHS.PROJECTS}/:id${Constants.PATHS.PROJECT_SEGMENT}`} component={ProjectSegment} />
    </AuthorizedRoute>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.current,
  };
};

export default connect(mapStateToProps, null)(App);

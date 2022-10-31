import Keycloak from 'keycloak-js';

import * as api from './Api';

const keycloakConfig = {
  url: window.RUNTIME_REACT_APP_SSO_HOST ? window.RUNTIME_REACT_APP_SSO_HOST : process.env.REACT_APP_SSO_HOST,
  realm: window.RUNTIME_REACT_APP_SSO_REALM ? window.RUNTIME_REACT_APP_SSO_REALM : process.env.REACT_APP_SSO_REALM,
  clientId: window.RUNTIME_REACT_APP_SSO_CLIENT
    ? window.RUNTIME_REACT_APP_SSO_CLIENT
    : process.env.REACT_APP_SSO_CLIENT,
};

export const keycloak = Keycloak(keycloakConfig);

const login = keycloak.login;
keycloak.login = (options) => {
  options.idpHint = 'idir';
  login(options);
};

export const init = (onSuccess) => {
  //disable checkLoginIframe
  //https://medium.com/@szoradi.balazs/keycloak-login-infinite-loop-9005bcd9a915
  keycloak.init({ onLoad: 'login-required', promiseType: 'native', checkLoginIframe: false}).then((authenticated) => {
    if (authenticated && onSuccess) {
      onSuccess();
    }
  });

  keycloak.onAuthLogout = () => {
    window.location.reload();
  };

  api.instance.interceptors.request.use(
    (config) =>
      new Promise((resolve) =>
        keycloak
          .updateToken(5)
          .then(() => {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            resolve(config);
          })
          .catch(() => {
            keycloak.login();
          })
      )
  );
};

export const logout = () => {
  keycloak.logout();
};

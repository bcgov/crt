import React from 'react';

import * as Constants from '../../Constants';

const Footer = () => {
  const displayVersion =
    Constants.RUNTIME_APP_VERSION || Constants.RUNTIME_OPENSHIFT_BUILD_COMMIT || 'Version unavailable';

  return (
    <footer className="footer text-center small text-muted py-1">
      <div>Version: {displayVersion}</div>
    </footer>
  );
};

export default Footer;

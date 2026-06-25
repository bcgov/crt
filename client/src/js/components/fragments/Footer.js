import React from 'react';

import * as Constants from '../../Constants';

const Footer = () => {
  return (
    <footer className="footer">
      {Constants.RUNTIME_APP_VERSION && (
        <div className="text-center small text-muted py-1">
          Version: {Constants.RUNTIME_APP_VERSION}
        </div>
      )}
    </footer>
  );
};

export default Footer;

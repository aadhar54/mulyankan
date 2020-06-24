import React from 'react';
import WelcomeNav from './../components/WelcomeNav';

const Help = ({ mode }) => {
  return (
    <div className="help">
      <div className="help-container">
        <WelcomeNav active="help" mode={mode} />
        <div className="help-contents">
          <div className="help-sidebar">
            {/* <ul className="help-sidebar-list">
              <li className="help-sidebar-item">Basics</li>
              <li className="help-sidebar-item">Correcting</li>
              <li className="help-sidebar-item">Save and Download</li>
              <li className="help-sidebar-item">Advanced</li>
            </ul> */}
            <span className="coming-soon">
              Documentation and FAQs will come soon!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

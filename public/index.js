import { render } from 'react-dom';
import React from 'react';
import Relay from 'react-relay';

import TodoApp from './containers/TodoApp';
import AppHomeRoute from './routes/AppHomeRoute';

const appRoot = document.getElementById('root');

const currentName = 'user1';

render(
  <Relay.RootContainer
    Component={TodoApp}
    route={new AppHomeRoute({ login: currentName })}
  />,
  appRoot
);

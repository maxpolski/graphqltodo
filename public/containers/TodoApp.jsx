import React from 'react';
import Relay from 'react-relay';

import ChangeIsCompletedStatusMutation from '../mutations/changeIsCompletedStatus';
import TodoList from './TodoList';

class TodoApp extends React.Component {
  render() {
    const {
      user,
    } = this.props;

    return (
      <div>
        Todos by {user.login}:
        <TodoList todos={user.todos} />
      </div>
    );
  }
}

export default Relay.createContainer(TodoApp, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        login,
        id
        todos(first: 10) {
          ${TodoList.getFragment('todos')}
        }
      }
    `,
  },
});

import React from 'react';
import Relay from 'react-relay';

import TodoList from './TodoList';
import AddTodoInput from './AddTodoInput';

class TodoApp extends React.Component {
  render() {
    const {
      user,
    } = this.props;

    return (
      <div>
        Todos by {user.login}:
        <TodoList todos={user.todos} />
        <AddTodoInput userInfo={user} />
      </div>
    );
  }
}

export default Relay.createContainer(TodoApp, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${AddTodoInput.getFragment('userInfo')}
        login
        id
        todos(last: 10) {
          ${TodoList.getFragment('todos')}
        }
      }
    `,
  },
});

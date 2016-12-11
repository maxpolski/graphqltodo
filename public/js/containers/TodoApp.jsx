import React from 'react';
import Relay from 'react-relay';

import TodoList from './TodoList';
import AddTodoFooter from './AddTodoFooter';
import '../../styles/common.css';

class TodoApp extends React.Component {
  loadPrevious = (cursor) =>
    this.props.relay.setVariables({ beforeNode: cursor });

  render() {
    const {
      user,
    } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="card todo-holder col-md-4 offset-md-4">
            <div className="card-block">
              <h4 className="card-title">Todos</h4>
              <p className="card-text">
                Put your todos here
              </p>
            </div>
            <TodoList
              loadPrevious={this.loadPrevious}
              loadNext={this.loadNext}
              todos={user.todos}
            />
            <AddTodoFooter userInfo={user} />
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(TodoApp, {
  initialVariables: {
    afterNode: null,
    beforeNode: null,
  },
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        login
        todos(last: 10, before: $beforeNode) {
          ${TodoList.getFragment('todos')}
        }
        ${AddTodoFooter.getFragment('userInfo')}
      }
    `,
  },
});

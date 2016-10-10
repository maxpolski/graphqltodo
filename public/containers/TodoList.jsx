import React from 'react';
import Relay from 'react-relay';

import Todo from './Todo';

class TodoList extends React.Component {
  render() {
    const {
      todos,
    } = this.props;

    return (
      <ul>
        {
          todos.edges.map(({ node: todo }) => (
            <Todo
              caption={todo.caption}
              key={todo.id}
              isCompleted={todo.isCompleted}
            />
          ))
        }
      </ul>
    );
  }
}

export default Relay.createContainer(TodoList, {
  fragments: {
    todos: () => Relay.QL`
      fragment on TodoConnection {
        edges {
          node {
            id
            caption
            isCompleted
          }
        }
      }
    `,
  },
});

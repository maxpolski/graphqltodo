import React from 'react';
import Relay from 'react-relay';

import Todo from './Todo';

class TodoList extends React.Component {
  loadPrevious = (event) => {
    event.preventDefault();
    const { loadPrevious, todos } = this.props;

    if (todos.pageInfo.hasPreviousPage) {
      loadPrevious(todos.edges[0].cursor);
    }
  }

  render() {
    const {
      todos,
    } = this.props;

    const {
      hasPreviousPage
    } = todos.pageInfo;

    const loadMorePreviousClassName = `list-group-item active ${hasPreviousPage ? '' : 'disabled'}`

    return (
      <ul className="list-group">
        <a
          href=""
          className={loadMorePreviousClassName}
          onClick={this.loadPrevious}
        >
          Load More Previous Todos
        </a>
        {
          todos.edges.map(({ node: todo }) => (
            <Todo
              todoInfo={todo}
              key={todo.id}
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
          cursor
          node {
            id
            ${Todo.getFragment('todoInfo')}
          }
        }
        pageInfo {
          hasPreviousPage
        }
      }
    `,
  },
});

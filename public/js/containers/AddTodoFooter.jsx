import React from 'react';
import Relay from 'react-relay';

import AddTodoMutation from '../mutations/addTodo';

class AddTodoFooter extends React.Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  _addTodo(caption) {
    if (caption !== '') {
      this.props.relay.commitUpdate(
        new AddTodoMutation({
          user: this.props.userInfo,
          newTodo: { caption },
        })
      );
      this.clearInput();
    }
  }

  handleKeyDown(event) {
    const {
      which,
      target: { value },
    } = event;
    if (which === 13) {
      this._addTodo(value);
    }
  }

  clearInput() {
    this.todoTextInput.value = '';
  }

  render() {
    return (
      <div className="card-block">
        <input ref={node => this.todoTextInput = node} onKeyDown={this.handleKeyDown} />
        <button
          onClick={() => this._addTodo(this.todoTextInput.value)}
          type="button"
          className="btn btn-link"
        >
          Add
        </button>
      </div>
    );
  }
}

export default Relay.createContainer(AddTodoFooter, {
  fragments: {
    userInfo: () => Relay.QL`
      fragment on User {
        ${AddTodoMutation.getFragment('user')}
      }
    `,
  },
});

import React from 'react';
import Relay from 'react-relay';

import AddTodoMutation from '../mutations/addTodo';

class AddTodoInput extends React.Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  _addTodo(caption) {
    this.props.relay.commitUpdate(
      new AddTodoMutation({
        user: this.props.userInfo,
        newTodo: { caption },
      })
    );
  }

  handleKeyDown(event) {
    const {
      which,
      target: { value },
    } = event;
    if (which === 13) {
      this._addTodo(value);
      event.target.value = '';
    }
  }

  render() {
    return (
      <input onKeyDown={this.handleKeyDown} />
    );
  }
}

export default Relay.createContainer(AddTodoInput, {
  fragments: {
    userInfo: () => Relay.QL`
      fragment on User {
        id
        ${AddTodoMutation.getFragment('user')}
      }
    `,
  },
});

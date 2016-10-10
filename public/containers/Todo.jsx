import React from 'react';
import Relay from 'react-relay';

import ChangeIsCompletedStatusMutation from '../mutations/changeIsCompletedStatus';

class Todo extends React.Component {

  constructor() {
    super();
    this._handleChangingIsCompletedStatus = this._handleChangingIsCompletedStatus.bind(this);
  }

  _handleChangingIsCompletedStatus() {
    console.log('todoInfo', this.props.todoInfo);
    this.props.relay.commitUpdate(
      new ChangeIsCompletedStatusMutation({
        todo: this.props.todoInfo,
      })
    );
  }

  render() {
    const {
      caption,
      isCompleted,
    } = this.props.todoInfo;

    return (
      <li
        type="none"
        onClick={this._handleChangingIsCompletedStatus}
      >
        {caption} - {isCompleted ? 'checked' : 'nope'}
      </li>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    todoInfo: () => Relay.QL`
      fragment on Todo {
        caption
        isCompleted
        ${ChangeIsCompletedStatusMutation.getFragment('todo')}
      }
    `,
  },
});

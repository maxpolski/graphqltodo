import Relay from 'react-relay';

export default class ChangeIsCompletedStatusMutation extends Relay.Mutation {
  static fragments = {
    todo: () => Relay.QL`
      fragment on Todo {
        id,
        caption,
        isCompleted
      }
    `,
    user: () => Relay.QL`
      fragment on User {
        id,
        login
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{changeIsCompletedStatus}`;
  }
  getCollisionKey() {
    return `check_${this.props.todo.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ChangeIsCompletedStatusPayload @relay(pattern: true) {
        todo {
          isCompleted
        }
      }`
    ;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        todo: this.props.todo.id,
        user: this.props.user.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.todo.id,
    };
  }
  getOptimisticResponse() {
    return {
      todo: {
        isCompleted: !this.props.todo.isCpmpleted,
      },
    };
  }
}

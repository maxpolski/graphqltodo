import Relay from 'react-relay';

export default class ChangeIsCompletedStatusMutation extends Relay.Mutation {
  static fragments = {
    todo: () => Relay.QL`
      fragment on Todo {
        id
        isCompleted
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{changeIsCompletedStatus}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ChangeIsCompletedStatusPayload {
        todo {
          id
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
      todoInfo: {
        id: this.props.todo.id,
        isCompleted: !this.props.todo.isCompleted,
      },
    };
  }
}

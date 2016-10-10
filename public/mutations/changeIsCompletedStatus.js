import Relay from 'react-relay';

export default class ChangeIsCompletedStatusMutation extends Relay.Mutation {
  static fragments = {
    todo: () => Relay.QL`
      fragment on Todo {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{changeIsCompletedStatus}`;
  }
  getFatQuery() {
    console.log('get fat query', this.props);
    return Relay.QL`
      fragment on ChangeIsCompletedStatusPayload {
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
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.todo.id,
    };
  }
  getOptimisticResponse() {
    console.log('called', this.props.todo);
    return {
      todo: {
        isCompleted: !this.props.todo.isCompleted,
      },
    };
  }
}

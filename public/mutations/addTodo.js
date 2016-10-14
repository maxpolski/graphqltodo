import Relay from 'react-relay';

export default class AddTodoMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{addTodo}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddTodoPayload {
        user {
          id
          todos
        }
      }`
    ;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.user.id,
      caption: this.props.newTodo.caption,
    };
  }
  // getOptimisticResponse() {
  //   return {
  //     userInfo: {
  //       id: this.props.user.id,
  //       todos: [...this.props.user.todos, {
  //         caption: this.props.newTodo.caption,
  //         isCompleted: false,
  //       }],
  //     },
  //   };
  // }
}

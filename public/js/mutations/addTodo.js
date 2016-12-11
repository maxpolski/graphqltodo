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
      fragment on AddTodoPayload @relay(pattern: true){
        user {
          id
          todos {
            edges {
              node {
                caption
              }
            }
          }
        }
        newTodoEdge
      }`
    ;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'todos',
      edgeName: 'newTodoEdge',
      rangeBehaviors: {
        '': 'append',
        'orderby(oldest)': 'prepend',
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.user.id,
      caption: this.props.newTodo.caption,
    };
  }
  getOptimisticResponse() {
    return {
      newTodoEdge: {
        node: {
          caption: this.props.newTodo.caption,
          isCompleted: false,
        },
      },
      user: {
        id: this.props.user.id,
      }
    };
  }
}

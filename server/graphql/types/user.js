import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import TodoType from './todo';
import todoResolver from '../resolvers/todoResolver';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString,
    },
    login: {
      type: GraphQLString,
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve: usr => usr.todos.map(id => todoResolver({}, { id })),
    },
  },
});

export default UserType;

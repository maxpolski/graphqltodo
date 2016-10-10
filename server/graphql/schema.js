import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  connectionDefinitions,
  connectionFromArray,
  connectionArgs,
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
  mutationWithClientMutationId,
} from 'graphql-relay';


import User from '../models/user';
import Todo from '../models/todo';

import userResolver from './resolvers/userResolver';
import todoResolver from './resolvers/todoResolver';

import { changeIsCompletedStatus } from './mutators/todoMutations';

const {
  nodeInterface,
  nodeField,
} = nodeDefinitions(
  (globalId) => {
    const { type, id, login = null } = fromGlobalId(globalId);
    if (type === 'User') {
      return userResolver(login);
    } else if (type === 'Todo') {
      return todoResolver(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return UserType;
    } else if (obj instanceof Todo) {
      return TodoType;
    }
    return null;
  }
);

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: globalIdField('Todo'),
    caption: {
      type: GraphQLString,
    },
    isCompleted: {
      type: GraphQLBoolean,
    },
  }),
  interfaces: [nodeInterface],
});

const { connectionType: todoConnection } =
  connectionDefinitions({ name: 'Todo', nodeType: TodoType });

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    login: {
      type: GraphQLString,
    },
    todos: {
      type: todoConnection,
      args: connectionArgs,
      resolve: (usr, args) =>
        connectionFromArray(usr.todos.map(id =>
          todoResolver({}, { id })), args),
    },
  }),
  interfaces: [nodeInterface],
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: UserType,
      args: {
        login: {
          name: 'login',
          type: GraphQLString,
        },
      },
      resolve: userResolver,
    },
    todo: {
      type: TodoType,
      args: {
        todo: {
          type: GraphQLString,
        },
      },
      resolve: todoResolver,
    },
  }),
});

const ChangeIsCompletedStatusMutation = mutationWithClientMutationId({
  name: 'ChangeIsCompletedStatus',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todo: {
      type: TodoType,
      resolve: ({ id }) => todoResolver({}, { id }),
    },
  },
  mutateAndGetPayload: ({ id }) => {
    const localTodoId = fromGlobalId(id).id;
    changeIsCompletedStatus(localTodoId);
    return { localTodoId };
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    changeIsCompletedStatus: ChangeIsCompletedStatusMutation,
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export default schema;

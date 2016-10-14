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
import { addTodo } from './mutators/userMutations';

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
      resolve: async ({ id }) => {
        const todoResult = await todoResolver({}, { id });
        return todoResult;
      },
    },
  },
  mutateAndGetPayload: async ({ id }) => {
    const localTodoId = fromGlobalId(id).id;
    await changeIsCompletedStatus(localTodoId);
    return { id: localTodoId };
  },
});

const AddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    caption: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ login }) => userResolver({}, { login }),
    },
  },
  mutateAndGetPayload: async ({ id, caption }) => {
    const localUserId = fromGlobalId(id).id;
    const login = await addTodo(localUserId, caption);
    return { login };
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    changeIsCompletedStatus: ChangeIsCompletedStatusMutation,
    addTodo: AddTodoMutation,
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export default schema;

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
  cursorForObjectInConnection,
} from 'graphql-relay';

import userResolver from './resolvers/userResolver';
import todoResolver from './resolvers/todoResolver';

import { changeIsCompletedStatus } from './mutators/todoMutations';
import { addTodo } from './mutators/userMutations';

const {
  nodeInterface,
  nodeField,
} = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return userResolver({}, { id });
    } else if (type === 'Todo') {
      return todoResolver({}, { id });
    }
    return null;
  },
  (obj) => {
    if (obj.login !== '') {
      return 'User';
    } else if (obj.isCompleted !== undefined) {
      return 'Todo';
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

const { connectionType: todoConnection, edgeType: todoEdge } =
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
        connectionFromArray(usr.todos.map(id => todoResolver({}, { id })
      ), args),
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
        id: {
          name: 'id',
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
      resolve: ({ userId }) => userResolver({}, { userId }),
    },
    newTodoEdge: {
      type: todoEdge,
      resolve: async (payload) => {
        const user = await userResolver({}, { id: payload.userId });
        const newTodo = await todoResolver({}, { id: payload.newTodoId });
        const dataToSend = {
          cursor: cursorForObjectInConnection(
            user.todos,
            newTodo.id
          ),
          node: newTodo,
        };
        return dataToSend;
      },
    },
  },
  mutateAndGetPayload: async ({ id, caption }) => {
    const localUserId = fromGlobalId(id).id;
    const todo = await addTodo(localUserId, caption);
    return { userId: localUserId, newTodoId: todo.id };
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

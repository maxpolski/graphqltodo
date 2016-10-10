import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    caption: {
      type: GraphQLString,
    },
    isCompleted: {
      type: GraphQLBoolean,
    },
  }),
});

export default TodoType;

import Todo from '../../models/todo';

export default async (_, { id }) =>
  Todo.findById(id);

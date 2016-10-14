import Todo from '../../models/todo';
import User from '../../models/user';

export const addTodo = async (userId, caption) => {
  const newTodo = await Todo.create({ caption, isCompleted: false });
  await User.update({ _id: userId }, { $push: { todos: newTodo._id } });
  return (await User.findById(userId)).login;
};

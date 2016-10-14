import Todo from '../../models/todo';

export const changeIsCompletedStatus = async (id) => {
  const todoItem = await Todo.findById(id);
  const { isCompleted } = todoItem;
  return Todo.update({ _id: id }, { $set: { isCompleted: !isCompleted } });
};

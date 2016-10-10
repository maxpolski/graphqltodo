import Todo from '../../models/todo';

export const changeIsCompletedStatus = async (id) => {
  const todoItem = await Todo.findById(id);
  const { isCompleted } = todoItem;
  console.log('isCompleted', isCompleted);
  await Todo.update({ _id: id }, { $set: { isCompleted: !isCompleted } });
};

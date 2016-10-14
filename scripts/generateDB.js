import connectMongoose from '../server/services/mongoose';

import User from '../server/models/user';
import Todo from '../server/models/todo';

connectMongoose();

(async function () {
  const firstTodo = await Todo.create({ caption: 'testCaption1', isChecked: true });
  const secondTodo = await Todo.create({ caption: 'testCaption1', isChecked: false });
  const user = await User.create({ login: 'user1', todos: [firstTodo._id, secondTodo._id] });
  console.log(`Test user
    ${user}
    added successfully`);
  return;
}());

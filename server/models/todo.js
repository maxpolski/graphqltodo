import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const TodoSchema = {
  caption: String,
  isCompleted: Boolean,
};

export default mongoose.model('Todo', TodoSchema);

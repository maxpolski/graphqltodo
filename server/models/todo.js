import mongoose from 'mongoose';

const TodoSchema = {
  caption: String,
  isCompleted: Boolean,
};

export default mongoose.model('Todo', TodoSchema);

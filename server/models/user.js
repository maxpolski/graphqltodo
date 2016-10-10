import mongoose from 'mongoose';

const UserSchema = {
  login: String,
  todos: [String],
};

export default mongoose.model('User', UserSchema);

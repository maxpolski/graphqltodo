import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const UserSchema = {
  login: String,
  todos: [String],
};

export default mongoose.model('User', UserSchema);

import User from '../../models/user';

export default (_, { login }) =>
  User.findOne({ login });

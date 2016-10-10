import mongoose from 'mongoose';

export default () => mongoose.connect('mongodb://localhost/todoDB');

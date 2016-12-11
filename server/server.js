import express from 'express';
import graphqlHTTP from 'express-graphql';

import RootGraphQLSchema from './graphql/schema';
import connectMongo from './services/mongoose';
import indexHandler from './routes/indexRoute';

const PORT = 8080;
const app = express();

app.use(express.static('dist'));
app.use('/graphql', graphqlHTTP({
  schema: RootGraphQLSchema,
  graphiql: true,
}));

app.get('/', indexHandler);

export const launch = () => {
  connectMongo();
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });
};

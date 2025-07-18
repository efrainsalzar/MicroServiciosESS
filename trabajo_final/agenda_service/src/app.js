const express = require('express');
const connectDB = require('./config/db');
const auth = require('./middlewares/auth');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');

const especialidad_typeDefs = require('./graphql/especialidad_schema');
const especialidad_resolvers = require('./graphql/especialidad_resolvers');
const agendaTypeDefs = require('./graphql/agenda_schema');
const agendaResolvers = require('./graphql/agenda_resolvers');

dotenv.config();

const app = express();

app.use(express.json());

const combinedTypeDefs = mergeTypeDefs([especialidad_typeDefs, agendaTypeDefs]);
const combinedResolvers = mergeResolvers([especialidad_resolvers, agendaResolvers]);

async function startServer() {
  try {
    await connectDB();

    const server = new ApolloServer({
      typeDefs: combinedTypeDefs,
      resolvers: combinedResolvers,
      context: ({ req }) => {
        // Aquí podrías pasar el JWT del header para autorización
        const user = auth(req);
        return { user };
      },
    });

    await server.start();

    // Integrar Apollo Server con Express en la ruta /graphql
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT;
    const HOST_PORT = process.env.HOST_PORT; 

    app.listen(PORT, () => {
      console.log(`Servidor de agendas corriendo internamente en puerto ${PORT}`);
      console.log(`Si es en Local:  http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`Si se en Docker:  http://localhost:${HOST_PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error arrancando el servidor:', error);
  }
}

startServer();
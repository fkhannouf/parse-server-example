const 
express = require('express'),
path = require('path'),
{ default: ParseServer, ParseGraphQLServer } = require('parse-server')
parseMountPath = process.env.PARSE_MOUNT || '/parse',
databaseUri = process.env.MONGODB_ADDON_URI || process.env.MONGODB_URI,
app = express()
;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const parseServer = new ParseServer({
  databaseURI: process.env.MONGODB_ADDON_URI || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.PARSE_APPID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});

const parseGraphQLServer = new ParseGraphQLServer(
  parseServer,
  {
    graphQLPath: '/graphql',
    playgroundPath: '/playground'
  }
);

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Mounts the REST API
app.use(parseMountPath, parseServer.app);

// Mounts the GraphQL API
parseGraphQLServer.applyGraphQL(app);

// Mounts the GraphQL Playground - do NOT use in Production
parseGraphQLServer.applyPlayground(app);

app.listen(1337, function() {
  console.log('REST API running on http://localhost:1337/parse');
  console.log('GraphQL API running on http://localhost:1337/graphql');
  console.log('GraphQL Playground running on http://localhost:1337/playground');
});

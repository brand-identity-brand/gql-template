/** express server */
const express = require('express');
/** graphql server(middleware) for express */
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
/** graphql stuff */
const resolvers = require('./graphql/resolvers').default;
const schema = require('./graphql/schema.js').default;
const notreallyDB = require('./database/notreally.js').default;
const { getId } = require('./database/notreally.js');
/**********************************/

//initialises express server. express is a server framework based on NodeJS API
//it abstracts away tedious ground work for us 
const app = express(); //line 2
app.use(express.json()); //express.json() middleware 
//
const randomObject = {"hello": 0};
app.use('/graphql', graphqlHTTP((req, res) => {
    return {
        schema: makeExecutableSchema( {typeDefs: schema, resolvers} ),
        graphiql: true, //enables "domain.com/graphiql"\
        context: randomObject
    }
}));
app.get('/fakepi/:key/:id', (req, res) => {
    // collect params from GET request (sent through url) 
    //
    //const key = req.params.key;
    //const id = req.params.id;
    //
    const result = getId(notreallyDB[req.params.key], req.params.id);
    return res.send( result );
})

app.get('/fakepi/:key', (req, res) => {
    // collect params from GET request (sent through url) 
    const key = req.params.key || undefined;
    //
    const result = notreallyDB[key];
    return res.send( result );
})

app.use('/', (req, res) => {
    res.send(`<p>if you see this the endpoint is working</p>`);
})

app.listen(4000);
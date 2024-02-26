require('dotenv').config();
const expressSession = require('express-session');
const mongodbStore = require('connect-mongodb-session');

function createSessionStore(){
    const MongodbStore = mongodbStore(expressSession);
    const store = new MongodbStore({
        uri : process.env.DATABASE_URI,
        databaseName : 'online-shop',
        collection : 'sessions'
    });
    return store;
}

function createSessionConfig(){
    return {
        secret : process.env.SESSION_SECRET,
        resave : false,
        saveUninitialized : false,
        store : createSessionStore(),
        cookie : {
            maxAge : 24 * 60 * 60 * 1000 // time in milliseconds
        }
    };
}

module.exports = createSessionConfig;

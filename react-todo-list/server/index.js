import {MongoClient} from 'mongodb';
import http from 'http';


const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'mongo';
const todosCollectionName = 'todos';

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/todos') {
        holdEndpoint(req, res, getTodo);
    } else if (req.method === 'POST' && req.url === '/todo') {
        holdEndpoint(req, res, postTodo);
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Not Found'}));
    }
});

async function holdEndpoint(req, res, callback) {
    try {
        await client.connect();
        const dataBase = client.db(dbName);
        const collection = dataBase.collection(todosCollectionName);
        res.writeHead(200, {'Content-Type': 'application/json'});
        await callback(req, res, collection);
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Failed to fetch users', details: err.message}));
    } finally {
        await client.close();
    }
}

async function getTodo(req, res, collection) {
    const todosCursor = collection.find();
    const todos = await todosCursor.toArray();
    res.end(JSON.stringify(todos));
}

async function postTodo(req, res, collection) {
//todo
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

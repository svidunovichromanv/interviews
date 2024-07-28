import { MongoClient } from 'mongodb';
import http from 'http';


const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'mongo';
const usersCollectionName = 'users';

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/users') {
        try {
            await client.connect();
            console.log("Connected successfully to server");
            const dataBase = client.db(dbName);
            const collection  = dataBase.collection(usersCollectionName);
            const usersCursor  = collection.find();
            const users = await usersCursor.toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch users', details: err.message }));
        } finally {
            await client.close();
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

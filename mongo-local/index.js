import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });

const start =  async () => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
    } catch(err) {
        console.log(err);
    }
}
 start();
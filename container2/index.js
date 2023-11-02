import express from 'express';
import routes from './routes/count.js';

const app = express();

app.use(express.json());

app.use('/', routes);

const port = 7001;

app.listen(port, () => {
  console.log(`Container-2 listening at ${port}`);
});

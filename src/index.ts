import env from './env/env.schema';
import express, { json } from 'express';
import apiRoutes from './api';

const app = express();
app
	.use(json())
	.use('/api', apiRoutes)
	.get('/health', (_, res) => res.send('ok'))
	.listen(env.PORT, () => console.log(`listening on ${env.PORT}`));

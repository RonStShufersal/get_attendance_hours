import { Router } from 'express';
import { startScraping } from '../main';
import { envSchema } from '../env/env.schema';

const router = Router();

router.post('/scrape', async (req, res) => {
	const payload = envSchema.safeParse(req.body);
	if (!payload.success) {
		return res.status(400).json({ msg: 'illegal body provided' });
	}

	try {
		await startScraping(payload.data);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ msg: 'scraping failed' });
	}

	return res.send({});
});

export default router;

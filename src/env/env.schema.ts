import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.configDotenv();

const minOneChar = () => z.string().min(1);

const envSchema = z.object({
	//prettier-ignore
	SCRAPING_TARGET: z.union([
		z.literal('synerion'),
		z.literal('hilan'),
	]).default('hilan'),
	//prettier-ignore
	AUTOMATION_TARGET: z.union([
		z.literal('webtime'),
	]).default('webtime'),
	AUTOMATOR_USERNAME: minOneChar(),
	AUTOMATOR_PASSWORD: minOneChar(),
	SCRAPER_USERNAME: minOneChar(),
	SCRAPER_PASSWORD: minOneChar(),
});

const env = envSchema.parse(process.env);

export default env;

export type Environment = z.infer<typeof envSchema>;

export type EnvTargets = Environment['AUTOMATION_TARGET'] | Environment['SCRAPING_TARGET'];

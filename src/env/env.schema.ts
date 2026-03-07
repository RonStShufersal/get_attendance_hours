import dotenv from 'dotenv';
import { boolean, number, z } from 'zod';

dotenv.configDotenv();

const minOneChar = () => z.string().min(1);

export const envSchema = z.object({
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
	THROW_ON_MALFORMED_DAYS: boolean().optional(),
	PORT: number().default(3000),
});

const env = envSchema.parse(process.env);

export default env;

export type Environment = z.infer<typeof envSchema>;

export type EnvTargets = Environment['AUTOMATION_TARGET'] | Environment['SCRAPING_TARGET'];

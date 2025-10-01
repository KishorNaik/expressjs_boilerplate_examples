import { logger } from '@/shared/utils/helpers/loggers';
import { Container, CronJob, delay, WorkerCronJob } from '@kishornaik/utils';
import { RunBatchService } from '../service/batch';

export const runJob: WorkerCronJob = async () => {
	let isRunning = false;
	const job = new CronJob(
		`*/20 * * * * *`,
		async () => {
			if (isRunning) return;
			isRunning = true;

			logger.info(`Cron Job Started....`);

			const result = await Container.get(RunBatchService).handleAsync();

			if (result.isErr()) {
				logger.error(`CRON Error: ${result.error.message}`);
			}

			await delay(40000);
			logger.info(`Cron Job Completed....`);
			isRunning = false;
		},
		null,
		true
	);
};

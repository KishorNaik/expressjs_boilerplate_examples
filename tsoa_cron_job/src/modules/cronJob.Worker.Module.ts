import { WorkerCronJob } from '@kishornaik/utils';
import { demoCronJobModules } from './demo/demo.Module';

// Workers
const cronJobWorkerModules: WorkerCronJob[] = [...demoCronJobModules];

export { cronJobWorkerModules };

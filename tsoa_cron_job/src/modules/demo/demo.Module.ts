import { WorkerCronJob } from '@kishornaik/utils';
import { runJob } from './apps/features/v1/runJob';

export const demoCronJobModules: WorkerCronJob[] = [runJob];

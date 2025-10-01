import { WorkerCronJob } from "@kishornaik/utils";
import { publishWelcomeUserEmailIntegrationEventJob } from "./apps/features/v1/runJob";

export const demoCronJobModules: WorkerCronJob[] = [publishWelcomeUserEmailIntegrationEventJob];

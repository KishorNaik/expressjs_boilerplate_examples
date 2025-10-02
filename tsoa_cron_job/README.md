This guide introduces the **Cron Job Worker** — a dedicated process for running scheduled tasks independently of the main API service. It enables time-based automation for workflows, such as notifications, data synchronization, outbox patterns, and more.

* We use the `cron` npm package to define and manage scheduled jobs with flexible time expressions.
* The Cron Job Worker runs as a separate process, completely decoupled from the API lifecycle. This ensures that background tasks do not interfere with request/response performance.
* To run locally, use the following script:
```bash
npm run dev:cron
```
* For deployment, we maintain dedicated Dockerfiles:
  * `Dockerfile.cronJob.dev`  — for local development
  * `Dockerfile.cronJob.prod` — for production environments

## 📝 Production Note
* For production builds, we use the same build script for both the API and Cron Job Workers:
* In the Cron Job Dockerfile, this build script is invoked via `npm run build` to prepare the worker for deployment.
* ✅ You can run cron jobs alongside your API process if the tasks are tightly coupled to API operations — such as:
  * Outbox pattern
  * Scheduled cleanup or sync tasks tied to API data
* ⚠️ If your cron jobs are independent of the API, we recommend creating a dedicated cron job project for better isolation, scalability, and deployment flexibility.
* While cron jobs can operate alongside the API in the same codebase, they do not share runtime or memory with the API service. That means:
  * ❌ You cannot directly trigger cron jobs from API events — they run in a separate process.
  * ✅ Instead, cron jobs should operate on shared infrastructure (e.g., database tables, message queues, outbox patterns) that the API writes to and the worker reads from.
* 🔄 Recommended Use Case
  * Use cron jobs for background tasks that are indirectly triggered by API operations — such as:
  * Polling an outbox table for new events
  * Scheduled cleanup of stale data
  * Periodic sync with external services

***

## 🧪 Sample Example
In this example, a cron job is configured to run periodically using the `cron` npm package. When triggered, it initiates a batch service that processes a predefined list of `DemoRecord` items.

### 🔄 Execution Flow
* The cron job runs on a fixed schedule (e.g., every minute, hourly, daily).
* It invokes a batch service responsible for handling multiple records.
* The batch service processes all records in parallel for performance and scalability.
* For each record:
  * A processing service is called to handle the individual item.
  * The current implementation logs the record’s content for demonstration.

### Code Structure
```markdown
src/modules/
  ├── cronJon.Worker.Module.ts
  └── demo/
      ├── demo.Module.ts
      └── apps/
          └── features/
              └── v1/
                  └── runJob/
                      ├── index.ts
                      ├── job/
                      │   └── index.ts
                      └── service/
                          ├── batch/
                          │   └── index.ts
                          └── process/
                              └── index.ts
```

📦 Module Breakdown
* `demo.Module.ts`
Registers the cron job feature for orchestration and modular bootstrapping.
* `runJob/index.ts`
Entry point for the cron job feature — exports job logic for registration.
* `job/index.ts`
Defines the actual cron schedule and triggers the batch service.
* `service/batch/index.ts`
Orchestrates parallel processing of multiple `DemoRecord` items.
* `service/process/index.ts`
Handles individual record processing — currently logs each record’s content.

### 🧵 Cron Job Worker Bootstrap : (cronJob.Worker.Module.ts)
This file serves as the entry point for spinning up all registered cron jobs in a dedicated process, separate from the API runtime.
#### 📦 Purpose
* Centralizes the registration of all domain-specific cron job modules.
* Ensures each job is initialized and scheduled when the cron worker starts.
* Keeps the cron job lifecycle isolated from API services for better scalability and fault tolerance.
#### 🧠 Why It Matters
* ✅ Enables modular registration of jobs from different domains (e.g., demo, billing, analytics).
* ✅ Ensures that scheduled tasks run independently — without impacting API performance or request handling.
* ✅ Supports clean deployment via Docker, using `npm run build` and dedicated cron job Dockerfiles.

📌 This file is the backbone of your scheduled task infrastructure — ensuring all jobs are orchestrated reliably in a separate runtime.

### ⚙️Service

#### Process

📁 Location:
```bash
src/modules/demo/apps/features/v1/runJob/service/process/index.ts
```
👉 https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/blob/main/tsoa_cron_job/src/modules/demo/apps/features/v1/runJob/service/process/index.ts

🎯 Purpose:
This service handles the processing of individual `DemoRecord` items within the cron job workflow. It is designed to be:
* Modular: Isolated from orchestration logic
* Safe: Wrapped with validation and exception handling
* Extensible: Ready for future enhancements like database writes, notifications, or external API calls

Currently, it logs the record’s content for demonstration purposes.

🧩 Code:
```typescript
import { logger } from '@/shared/utils/helpers/loggers';
import {
	ExceptionsWrapper,
	GuardWrapper,
	IServiceHandlerVoidAsync,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	VOID_RESULT,
	VoidResult,
} from '@kishornaik/utils';

// #region Dummy Data
export interface DemoRecord {
	id: number;
	name: string;
	email: string;
	isActive: boolean;
	createdAt: Date;
	tags: string[];
}

export const demoBatch: DemoRecord[] = [
	{
		id: 1,
		name: 'Aarav Mehta',
		email: 'aarav.mehta@example.com',
		isActive: true,
		createdAt: new Date('2025-09-15T10:30:00Z'),
		tags: ['new', 'priority'],
	},
	{
		id: 2,
		name: 'Sneha Rao',
		email: 'sneha.rao@example.com',
		isActive: false,
		createdAt: new Date('2025-09-20T14:45:00Z'),
		tags: ['archived'],
	},
	{
		id: 3,
		name: 'Kabir Shah',
		email: 'kabir.shah@example.com',
		isActive: true,
		createdAt: new Date('2025-09-25T08:15:00Z'),
		tags: ['review', 'important'],
	},
	{
		id: 4,
		name: 'Meera Iyer',
		email: 'meera.iyer@example.com',
		isActive: true,
		createdAt: new Date('2025-09-28T17:00:00Z'),
		tags: [],
	},
	{
		id: 5,
		name: 'Rohan Desai',
		email: 'rohan.desai@example.com',
		isActive: false,
		createdAt: new Date('2025-09-30T12:00:00Z'),
		tags: ['follow-up'],
	},
];
// #endregion

// #region Process

export interface IDemoRecordProcessService extends IServiceHandlerVoidAsync<DemoRecord> {}

@sealed
@Service()
export class DemoProcessService implements IDemoRecordProcessService {
	public async handleAsync(params: DemoRecord): Promise<Result<VoidResult, ResultError>> {
		return await ExceptionsWrapper.tryCatchResultAsync(async () => {
			// Guard
			const guard = new GuardWrapper().check(params, `params`).validate();
			if (guard.isErr()) return ResultFactory.errorInstance(guard.error);

			// Some Process
			logger.info(`Processing ${JSON.stringify(params)}`);

			return ResultFactory.success(VOID_RESULT);
		});
	}
}
// #endregion
```

🧠 Highlights:
* DemoRecord Interface: Defines the structure of each item to be processed — including metadata like id, name, email, tags, and timestamps.
* demoBatch Array: A static list of sample records used for demonstration and testing.
* handleAsync() Method:
* Validates input using GuardWrapper
* Wraps execution in ExceptionsWrapper for safe error handling
* Logs the record content using logger.info
* Returns a VOID_RESULT on success

📌 This service is invoked by the batch orchestrator to process each record in parallel — keeping the logic clean, testable, and scalable.

#### Batch
📁 Location:
```bash
src/modules/demo/apps/features/v1/runJob/service/batch/index.ts
```
👉 https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/blob/main/tsoa_cron_job/src/modules/demo/apps/features/v1/runJob/service/batch/index.ts

🎯 Purpose:
This service orchestrates the batch execution of multiple `DemoRecord` items, leveraging the `executeBatchArrayAsync` helper to run tasks in either `parallel` or `sequential` mode.
It delegates individual record processing to the `DemoProcessService`, ensuring modularity and separation of concerns.

🧩 Code:
```typescript
import {
	Container,
	ExceptionsWrapper,
	executeBatchArrayAsync,
	IServiceHandlerNoParamsVoidAsync,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	VOID_RESULT,
	VoidResult,
} from '@kishornaik/utils';
import { demoBatch, DemoProcessService, DemoRecord } from '../process';
import { logger } from '@/shared/utils/helpers/loggers';

export interface IRunBatchService extends IServiceHandlerNoParamsVoidAsync {}

@sealed
@Service()
export class RunBatchService implements IRunBatchService {
	private readonly _demoProcessService: DemoProcessService;

	public constructor() {
		this._demoProcessService = Container.get(DemoProcessService);
	}

	public async handleAsync(): Promise<Result<VoidResult, ResultError>> {
		return await ExceptionsWrapper.tryCatchResultAsync(async () => {
			// execute batch
			const batchArrayResults = await executeBatchArrayAsync({
				items: demoBatch, // Array
				runMode: 'parallel',
				batchSize: 2,
				concurrency: 2,
				handler: async (x: DemoRecord) => {
					const processResult = await this._demoProcessService.handleAsync(x);
					return processResult;
				},
			});

			// Get Error list from Batch
			if (batchArrayResults.error.length >= 1) {
				for (const error of batchArrayResults.error) {
					if (error.isErr()) {
						logger.error(`batch error: ${error.error.message}`);
					}
				}
			}

			// Get Success list from Batch
			if (batchArrayResults.success.length >= 1) {
				for (const success of batchArrayResults.success) {
					if (success.isOk()) {
						logger.info(`batch success: ${JSON.stringify(success.value)}`);
					}
				}
			}

			return ResultFactory.success(VOID_RESULT);
		});
	}
}

```
* `demoBatch`: Static array of records to be processed.
* `runMode`: 'parallel': Executes multiple records concurrently.
* `batchSize` & `concurrency`: Controls how many records are processed at once.
* `handler`: Invokes DemoProcessService.handleAsync() for each record.

🧠 Highlights:
* Uses `Container.get()` to inject `DemoProcessService` — ensuring loose coupling and testability.
* Wraps execution in `ExceptionsWrapper.tryCatchResultAsync()` for safe error handling.
* Logs both success and error outcomes for each record using the `logger`.

🔧 Modes Supported by `executeBatchArrayAsync`
* `parallel`: Runs multiple items concurrently — ideal for performance.
* `sequential`: Processes items one-by-one — useful for ordered or rate-limited tasks.

📌 This service is triggered by the cron job and acts as the orchestrator for record-level processing — making it easy to scale, monitor, and extend.

### ⏱️ Run Job Scheduler

📁 Location:
```bash
src/modules/demo/apps/features/v1/runJob/job/index.ts
```
👉 https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/blob/main/tsoa_cron_job/src/modules/demo/apps/features/v1/runJob/job/index.ts

🎯 Purpose:
This function defines and schedules the cron job using the `CronJob` class from` @kishornaik/utils`, which wraps the `cron` npm package. It orchestrates the periodic execution of the `RunBatchService`.

🧩 Code:
```typescript
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

```

🧠 Highlights:
* `*/20 * * * * *`: Cron expression that triggers the job every 20 seconds.
* `isRunning flag`: Prevents overlapping executions — ensures only one instance runs at a time.
* `RunBatchService`: Invoked to process the batch of DemoRecord items.
- `delay(40000)`: Adds a cooldown period before the next run — useful for throttling and avoiding race conditions.
- `logger`: Logs start, completion, and error messages for observability.


### 🚀 Cron Job Registration & Bootstrap

### 📦 demo.Module.ts

📁 Location:
👉
https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/blob/main/tsoa_cron_job/src/modules/demo/apps/features/v1/runJob/index.ts#L1
https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/blob/main/tsoa_cron_job/src/modules/demo/demo.Module.ts

```typescript
import { WorkerCronJob } from '@kishornaik/utils';
import { runJob } from './apps/features/v1/runJob';

export const demoCronJobModules: WorkerCronJob[] = [runJob];
```

* Registers the `runJob` scheduler as part of the demo domain.
* Exports it as a `WorkerCronJob[]` array for modular inclusion.

### 🧵 cronJob.Worker.Module.ts

📁 Location:
👉
https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/blob/main/tsoa_cron_job/src/modules/cronJon.Worker.Module.ts

```typescript
import { WorkerCronJob } from '@kishornaik/utils';
import { demoCronJobModules } from './demo/demo.Module';

const cronJobWorkerModules: WorkerCronJob[] = [...demoCronJobModules];

export { cronJobWorkerModules };
```

* Central bootstrap file for all cron jobs across domains.
* Aggregates and exports all registered jobs for execution in a dedicated process.

### 🧪 Run Locally
To start the cron job worker:
```bash
npm run dev:cron
```

This command spins up the cron job runtime independently of the API service.

### 🧠 Key Notes
* All domain-specific cron jobs are registered in their respective modules and aggregated here.
* This worker runs in a separate process — ensuring isolation from API traffic and lifecycle.
* Ideal for scheduled tasks like:
  * Outbox pattern
  * Background syncs
  * Periodic cleanup

📌 This completes the full lifecycle of your cron job architecture — from modular registration to isolated execution.

***

## 📁 Full Example Reference
For anyone referencing this guide, the complete working implementation of the Cron Job Worker architecture — including modular job registration, batch orchestration, and process isolation — is available here:

🔗 [tsoa_cron_job – Full Example Repository](https://github.com/KishorNaik/expressjs_tsoa_boilerplate_examples/tree/main/tsoa_cron_job)

This repo demonstrates:
* ✅ Decoupled cron job execution using the `cron` npm package
* ✅ Modular service design with `@kishornaik/utils` wrappers
* ✅ Parallel batch processing with error/success aggregation
* ✅ Dedicated Dockerfiles for dev and prod cron job deployment
* ✅ Clean separation between API services and background workers

📌 Ideal for implementing outbox patterns, scheduled syncs, and scalable background jobs in a production-grade Express.js + TSOA setup.

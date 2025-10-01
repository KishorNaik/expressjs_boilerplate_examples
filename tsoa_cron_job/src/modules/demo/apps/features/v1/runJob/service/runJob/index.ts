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

export interface IRunJobService extends IServiceHandlerNoParamsVoidAsync {}

@sealed
@Service()
export class RunJobService implements IRunJobService {
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

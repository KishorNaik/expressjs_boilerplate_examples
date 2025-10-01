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

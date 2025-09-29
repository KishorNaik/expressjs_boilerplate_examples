import {
	Container,
	DataResponse,
	DataResponseFactory,
	ExceptionsWrapper,
	GuardWrapper,
	PipelineWorkflow,
	RequestData,
	RequestHandler,
	requestHandler,
	sealed,
	StatusCodes,
} from '@kishornaik/utils';
import { UpdateUserQueryParamsDto, UpdateUserRequestDto, UpdateUserResponseDto } from '../contract';
import { getTraceId, logger } from '@/shared/utils/helpers/loggers';
import { UpdateUserDbService } from '../services/db';

// #region Command
@sealed
export class UpdateUserCommand extends RequestData<DataResponse<UpdateUserResponseDto>> {
	private readonly _request: UpdateUserRequestDto;
  private readonly _requestParam:UpdateUserQueryParamsDto;

	constructor(request: UpdateUserRequestDto,requestParam:UpdateUserQueryParamsDto) {
		super();
		this._request = request;
    this._requestParam=requestParam
	}

	public get request(): UpdateUserRequestDto {
		return this._request;
	}

  public get requestParam():UpdateUserQueryParamsDto{
    return this._requestParam
  }
}
// #endregion

// #region Pipeline Steps
enum PipelineSteps {
	DB_SERVICE = 'DbService',
}
// #endregion

// #region Command Handler
@sealed
@requestHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
	implements RequestHandler<UpdateUserCommand, DataResponse<UpdateUserResponseDto>>
{
	private _pipeline = new PipelineWorkflow(logger);
	private readonly _updateUserDbService: UpdateUserDbService;

	public constructor() {
		this._updateUserDbService = Container.get(UpdateUserDbService);
	}

	public async handle(value: UpdateUserCommand): Promise<DataResponse<UpdateUserResponseDto>> {
		// Get traceId
		const traceId = getTraceId();

		return await ExceptionsWrapper.tryCatchPipelineAsync(async () => {
			// Guard
			const guard = new GuardWrapper()
				.check(value, `value`)
				.check(value.request, `request`)
        .check(value.requestParam, `requestParam`)
				.validate();
			if (guard.isErr())
				return DataResponseFactory.error(
					StatusCodes.BAD_REQUEST,
					guard.error.message,
					undefined,
					traceId,
					undefined
				);

			const { request,requestParam } = value;

			// Db Service Pipeline Step
			await this._pipeline.step(PipelineSteps.DB_SERVICE, async () => {
				return await this._updateUserDbService.handleAsync({
          request:request,
          requestParam:requestParam
        });
			});

			// Get Response
			const dbServiceResponse = this._pipeline.getResult<UpdateUserResponseDto>(
				PipelineSteps.DB_SERVICE
			);

			return DataResponseFactory.success(
				StatusCodes.OK,
				dbServiceResponse,
				'Success',
				undefined,
				traceId,
				undefined
			);
		}, traceId);
	}
}

// #endregion

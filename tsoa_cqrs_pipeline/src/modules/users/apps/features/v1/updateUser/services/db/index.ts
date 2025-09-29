import {
	ExceptionsWrapper,
	GuardWrapper,
	IServiceHandlerAsync,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
} from '@kishornaik/utils';
import { UpdateUserQueryParamsDto, UpdateUserRequestDto, UpdateUserResponseDto } from '../../contract';

export interface IUpdateUserDbServiceParameters {
  request: UpdateUserRequestDto;
  requestParam: UpdateUserQueryParamsDto;
}

export interface IUpdateUserDbService
	extends IServiceHandlerAsync<IUpdateUserDbServiceParameters, UpdateUserResponseDto> {}

@sealed
@Service()
export class UpdateUserDbService implements IUpdateUserDbService {
	public async handleAsync(
		params: IUpdateUserDbServiceParameters
	): Promise<Result<UpdateUserResponseDto, ResultError>> {
		return await ExceptionsWrapper.tryCatchResultAsync(async () => {
			// Guard
			const guard = new GuardWrapper().check(params, `params`).check(params.request, `request`).check(params.requestParam, `requestParam`).validate();

			if (guard.isErr()) return ResultFactory.errorInstance(guard.error);

			// Db Code
			// ......

			const response = new UpdateUserResponseDto();
			response.identifier = params.requestParam.id;

			return ResultFactory.success(response);
		});
	}
}

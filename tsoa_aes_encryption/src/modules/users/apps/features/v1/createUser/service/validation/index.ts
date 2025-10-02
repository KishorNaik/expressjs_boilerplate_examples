import { DtoValidation, sealed, Service } from '@kishornaik/utils';
import { CreateUserRequestDto } from '../../contract';

// #Region Service
@sealed
@Service()
export class CreateUserValidationService extends DtoValidation<CreateUserRequestDto> {
	public constructor() {
		super();
	}
}
//#endregion

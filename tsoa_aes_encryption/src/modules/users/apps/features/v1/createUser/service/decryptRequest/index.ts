import { AesDecryptWrapper, sealed, Service } from '@kishornaik/utils';
import { CreateUserRequestDto } from '../../contract';

// #region Service
@sealed
@Service()
export class CreateUserDecryptRequestService extends AesDecryptWrapper<CreateUserRequestDto> {
	public constructor() {
		super();
	}
}
// #endregion

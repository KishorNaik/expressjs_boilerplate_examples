import { AesEncryptWrapper, sealed, Service } from '@kishornaik/utils';
import { CreateUserResponseDto } from '../../contract';

// #region Service
@sealed
@Service()
export class CreateUserEncryptResponseService extends AesEncryptWrapper<CreateUserResponseDto> {
	public constructor() {
		super();
	}
}
// #endRegion

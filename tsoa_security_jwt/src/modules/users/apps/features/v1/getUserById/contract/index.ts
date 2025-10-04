import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

// #region Request Dto
export class GetUserByIdRequestDto {
	@IsUUID()
	@IsNotEmpty()
	@IsSafeString()
	@Type(() => String)
	public id?: string;
}
// #endregion

// #region Response Dto
export class GetUserByIdResponseDto {
	public id: string;
	public userName: string;
	public firstName: string;
	public lastName: string;
}
// #endregion

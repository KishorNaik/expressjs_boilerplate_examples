import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// #region Request Dto
export class CreateUserRequestDto {
	@IsNotEmpty()
	@IsString()
	@IsSafeString()
	@Length(3, 50)
	@Type(() => String)
	public fullName?: string;

	@IsNotEmpty()
	@IsEmail()
	@IsSafeString()
	@Type(() => String)
	public email?: string;
}
// #endregion

// #region Response Dto
export class CreateUserResponseDto {
	public identifier?: string;
}
// #endregion

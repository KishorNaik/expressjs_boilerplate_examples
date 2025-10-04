import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

// #region Request Dto
export class SignInRequestDto {
	@IsNotEmpty()
	@IsEmail()
	@IsSafeString()
	@Type(() => String)
	public username: string;

	@IsNotEmpty()
	@IsString()
	@IsSafeString()
	@Length(8, 20)
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
		message: 'Password must contain at least one letter and one number',
	})
	@Type(() => String)
	public password: string;
}
// #endregion

// #region Response Dto
export class SignInResponseDto {
	userName: string;
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}
// #endregion

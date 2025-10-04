import {
	Body,
	Get,
	Path,
	Post,
	Produces,
	Query,
	Route,
	SuccessResponse,
	Tags,
	Request,
	Middlewares,
	Response,
} from 'tsoa';
import express from 'express';
import {
	Container,
	DataResponse,
	DataResponseFactory,
	RoleEnum,
	StatusCodes,
} from '@kishornaik/utils';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import { Endpoint } from '@/shared/utils/helpers/tsoa';
import { getTraceId, logConstruct, logger } from '@/shared/utils/helpers/loggers';
import { SignInRequestDto, SignInResponseDto } from '../contract';
import { JwtExtendedService } from '@/modules/shared/users/services/jwt';
import { IClaims } from '@/modules/shared/users/types';

// #region Endpoint
@Route('api/v1/auth')
@Tags('auth')
export class SignInEndpoint extends Endpoint {
	private readonly _jwtService: JwtExtendedService;
	public constructor() {
		super();
		this._jwtService = Container.get(JwtExtendedService);
	}

	@Post('sign-in')
	@Produces('application/json')
	@SuccessResponse('200', 'Success')
	@Response(StatusCodes.BAD_REQUEST, 'Bad Request')
	@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
	@Middlewares(
		ValidationMiddleware({
			body: SignInRequestDto,
		})
	)
	public async postAsync(
		@Request() req: express.Request,
		@Body() body: SignInRequestDto
	): Promise<DataResponse<SignInResponseDto>> {
		const traceId = getTraceId();

		try {
			const { username, password } = body;
			if (username != `kishor@example.com` || password != `@kishornaik123`) {
				this.setStatus(StatusCodes.UNAUTHORIZED);
				return DataResponseFactory.error(
					StatusCodes.UNAUTHORIZED,
					`Unauthorized`,
					null,
					traceId,
					null
				);
			}

			// Prepare Claims
			const claims: IClaims = {
				id: `4c59331e-a909-41b3-abd2-69bb16a00fe3`,
				email: username,
				firstName: `john`,
				lastName: `doe`,
				role: RoleEnum.USER,
			};

			// Generate Jwt
			const jwtServiceResult = await this._jwtService.handleAsync(claims);
			if (jwtServiceResult.isErr()) {
				this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
				return DataResponseFactory.error(
					StatusCodes.INTERNAL_SERVER_ERROR,
					jwtServiceResult.error.message,
					null,
					traceId,
					null
				);
			}

			const [accessToken, refreshToken] = jwtServiceResult.value;

			const response: SignInResponseDto = new SignInResponseDto();
			response.userName = username;
			response.tokens = {
				accessToken: accessToken,
				refreshToken: refreshToken,
			};
			this.setStatus(StatusCodes.OK);
			return DataResponseFactory.success(
				StatusCodes.OK,
				response,
				`Success`,
				null,
				traceId,
				null
			);
		} catch (ex) {
			const error = ex as Error;
			logger.error(
				logConstruct(`SignInEndpoint`, `postAsync`, error.message, traceId, error.stack)
			);
			this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
			return DataResponseFactory.error(
				StatusCodes.INTERNAL_SERVER_ERROR,
				error.message,
				null,
				traceId,
				null
			);
		}
	}
}
// #endregion

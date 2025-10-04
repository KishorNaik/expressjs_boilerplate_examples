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
import { Container, DataResponse, DataResponseFactory, RoleEnum, StatusCodes } from '@kishornaik/utils';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import { Endpoint } from '@/shared/utils/helpers/tsoa';
import { GetUserByIdRequestDto, GetUserByIdResponseDto } from '../contract';
import { getTraceId, logConstruct, logger } from '@/shared/utils/helpers/loggers';
import { authenticateJwt, authorizeRole } from '@/middlewares/security/auth/jwt';
import { UserTokenProviderService } from '@/modules/shared/users/services/jwtTokenProvider';
import { IClaims } from '@/modules/shared/users/types';

// #region Endpoint
@Route('api/v1/users')
@Tags('Users')
export class GetUserByIdEndpoint extends Endpoint {
	private readonly _jwtTokenProviderService: UserTokenProviderService;

	public constructor() {
		super();
		this._jwtTokenProviderService = Container.get(UserTokenProviderService);
	}

	/**
	 * Get User By Id
	 */
	@Get('{id}')
	@Produces('application/json')
	@SuccessResponse(StatusCodes.OK, 'Ok') // Custom success response
	@Response(StatusCodes.BAD_REQUEST, 'Bad Request')
	@Response(StatusCodes.NOT_FOUND, 'Not Found')
	@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
	@Middlewares([
		authenticateJwt,
    authorizeRole([RoleEnum.USER, RoleEnum.ADMIN]),
		ValidationMiddleware({
			params: GetUserByIdRequestDto,
		}),
	])
	public async getAsync(
		@Request() req: express.Request,
		@Path() id: string
	): Promise<DataResponse<GetUserByIdResponseDto>> {
		const traceId = getTraceId();

		try {
			// Create Query
			const request = new GetUserByIdRequestDto();
			request.id = id;

			// Get JWT Token Directly from the Request Object.
			console.log(`JwtToken:${req.jwtTokens}`);

			// Get Claims Directly from the Request Object.
			console.log(`Claims:${JSON.stringify(req.claims)}`);

			// OR Get Claims by passing Request Object to the Token Provider service
			// Check given Query Param id and Jwt claim user id is match or not
			const getUserIdByJwtToken: IClaims =
				this._jwtTokenProviderService.getClaimsByRequest(req);
			if (getUserIdByJwtToken.id !== request.id) {
				this.setStatus(StatusCodes.UNAUTHORIZED);
				return DataResponseFactory.error(
					StatusCodes.UNAUTHORIZED,
					'Unauthorized',
					null,
					traceId,
					null
				);
			}

			// response
			const response: GetUserByIdResponseDto = new GetUserByIdResponseDto();
			response.id = id;
			response.userName = 'jhon@example.com';
			response.firstName = 'jhon';
			response.lastName = 'doe';

			this.setStatus(StatusCodes.OK);
			return DataResponseFactory.success(
				StatusCodes.OK,
				response,
				'Success',
				null,
				traceId,
				null
			);
		} catch (ex) {
			const error = ex as Error;
			logger.error(
				logConstruct(`GetUserByIdEndpoint`, `getAsync`, error.message, traceId, error.stack)
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

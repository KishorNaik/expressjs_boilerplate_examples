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
	AesRequestDto,
	AesResponseDto,
	Container,
	DataResponse,
	DataResponseFactory,
	StatusCodes,
} from '@kishornaik/utils';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import { Endpoint } from '@/shared/utils/helpers/tsoa';
import { CreateUserRequestDto, CreateUserResponseDto } from '../contract';
import { getTraceId, logConstruct, logger } from '@/shared/utils/helpers/loggers';
import { CreateUserDecryptRequestService } from '../service/decryptRequest';
import { CreateUserValidationService } from '../service/validation';
import { CreateUserEncryptResponseService } from '../service/encryptResponse';
import { ENCRYPTION_KEY } from '@/config/env';

@Route('api/v1/users')
@Tags('Users')
export class CreateUserEndpoint extends Endpoint {
	private readonly _createUserDecryptRequestService: CreateUserDecryptRequestService;
	private readonly _createUserValidationService: CreateUserValidationService;
	private readonly _createUserEncryptRequestService: CreateUserEncryptResponseService;

	public constructor() {
		super();
		this._createUserDecryptRequestService = Container.get(CreateUserDecryptRequestService);
		this._createUserValidationService = Container.get(CreateUserValidationService);
		this._createUserEncryptRequestService = Container.get(CreateUserEncryptResponseService);
	}

	@Post()
	@Produces('application/json')
	@SuccessResponse(StatusCodes.CREATED, 'Success')
	@Response(StatusCodes.BAD_REQUEST, 'Bad Request')
	@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
	@Middlewares(
		ValidationMiddleware({
			body: AesRequestDto,
		})
	)
	public async createUser(
		@Body() body: AesRequestDto,
		@Request() req: express.Request
	): Promise<DataResponse<AesResponseDto>> {
		// Get Trace Id
		const traceId = getTraceId();

		try {
			// Decrypt Request Service
			const decryptRequestServiceResult =
				await this._createUserDecryptRequestService.handleAsync({
					data: body.body,
					key: ENCRYPTION_KEY,
				});
			if (decryptRequestServiceResult.isErr()) {
				this.setStatus(decryptRequestServiceResult.error.statusCode);
				logger.error(
					logConstruct(
						`CreateUserEndpoint`,
						`postAsync`,
						`decrypted request failed`,
						traceId
					)
				);
				return DataResponseFactory.error(
					decryptRequestServiceResult.error.statusCode,
					decryptRequestServiceResult.error.message,
					null,
					traceId,
					null
				);
			}
			const createUserRequestDto: CreateUserRequestDto = decryptRequestServiceResult.value;
			logger.info(
				logConstruct(
					`CreateUserEndpoint`,
					`postAsync`,
					`decrypted request success`,
					traceId
				)
			);

			// Validation Service
			const validationServiceResult = await this._createUserValidationService.handleAsync({
				dto: createUserRequestDto,
				dtoClass: CreateUserRequestDto,
			});
			if (validationServiceResult.isErr()) {
				this.setStatus(validationServiceResult.error.statusCode);
				logger.error(
					logConstruct(
						`CreateUserEndpoint`,
						`postAsync`,
						`validation request failed`,
						traceId
					)
				);
				return DataResponseFactory.error(
					validationServiceResult.error.statusCode,
					validationServiceResult.error.message,
					null,
					traceId,
					null
				);
			}
			logger.info(
				logConstruct(
					`CreateUserEndpoint`,
					`postAsync`,
					`validation request success`,
					traceId
				)
			);

			// Some Process
			// ....
			// ....

			const response: CreateUserResponseDto = new CreateUserResponseDto();
			response.identifier = crypto.randomUUID().toString();

			// Encrypt Response Service
			const encryptResponseServiceResult =
				await this._createUserEncryptRequestService.handleAsync({
					data: response,
					key: ENCRYPTION_KEY,
				});
			if (encryptResponseServiceResult.isErr()) {
				logger.error(
					logConstruct(
						`CreateUserEndpoint`,
						`postAsync`,
						`encrypted response failed`,
						traceId
					)
				);
				this.setStatus(encryptResponseServiceResult.error.statusCode);
				return DataResponseFactory.error(
					encryptResponseServiceResult.error.statusCode,
					encryptResponseServiceResult.error.message,
					null,
					traceId,
					null
				);
			}

			const aesResponseDto: AesResponseDto =
				encryptResponseServiceResult.value.aesResponseDto;
			this.setStatus(StatusCodes.CREATED);

			logger.info(
				logConstruct(
					`CreateUserEndpoint`,
					`postAsync`,
					`encrypted response success`,
					traceId
				)
			);

			return DataResponseFactory.success(
				StatusCodes.CREATED,
				aesResponseDto,
				`Success`,
				null,
				traceId,
				null
			);
		} catch (ex) {
			const error = ex as Error;
			logger.error(
				logConstruct(`CreateUserEndpoint`, `postAsync`, error.message, traceId, error.stack)
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

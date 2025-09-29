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
	Put,
} from 'tsoa';
import express from 'express';
import { DataResponse, StatusCodes } from '@kishornaik/utils';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import { Endpoint } from '@/shared/utils/helpers/tsoa';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { UpdateUserQueryParamsDto, UpdateUserRequestDto, UpdateUserResponseDto } from '../contract';
import { UpdateUserCommand } from '../command';

@Route('api/v1/users')
@Tags('Users')
export class UpdateUserEndpoint extends Endpoint {
	/**
	 * Update User
	 */
	@Put('{id}')
	@Produces('application/json')
	@SuccessResponse(StatusCodes.CREATED, 'Ok') // Custom success response
	@Response(StatusCodes.BAD_REQUEST, 'Bad Request')
	@Middlewares([ValidationMiddleware({
    body: UpdateUserRequestDto,
    params:UpdateUserQueryParamsDto
  })])
	public async putAsync(
		@Request() req: express.Request,
		@Path() id: string,
		@Body() body: UpdateUserRequestDto
	): Promise<DataResponse<UpdateUserResponseDto>> {
		// Consume Command
    const requestParams=new UpdateUserQueryParamsDto();
    requestParams.id=id;

		const response = await mediator.send(new UpdateUserCommand(body,requestParams));

		// Set Status Code based on the response
		this.setStatus(response.statusCode);

		return response;
	}
}

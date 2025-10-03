/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UpdateUserEndpoint } from './../../modules/users/apps/features/v1/updateUser/endpoint/index';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetUsersEndpoint } from './../../modules/users/apps/features/v1/getUsers/endpoint/index';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetUserByIdEndpoint } from './../../modules/users/apps/features/v1/getUserById/endpoint/index';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "StatusCodes": {
        "dataType": "refEnum",
        "enums": [100,101,102,103,200,201,202,203,204,205,206,207,300,301,302,303,304,305,307,308,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,426,428,429,431,451,500,501,502,503,504,505,507,511],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserResponseDto": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationDataResponseModel": {
        "dataType": "refObject",
        "properties": {
            "currentPage": {"dataType":"double"},
            "totalPages": {"dataType":"double"},
            "pageSize": {"dataType":"double"},
            "totalCount": {"dataType":"double"},
            "hasPrevious": {"dataType":"boolean"},
            "hasNext": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponse_UpdateUserResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean"},
            "statusCode": {"ref":"StatusCodes"},
            "data": {"ref":"UpdateUserResponseDto"},
            "message": {"dataType":"string"},
            "pagination": {"ref":"PaginationDataResponseModel"},
            "timestamp": {"dataType":"string"},
            "traceId": {"dataType":"string"},
            "metaData": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserRequestDto": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phoneNumber": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUsersResponseDto": {
        "dataType": "refObject",
        "properties": {
            "identifier": {"dataType":"string"},
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phoneNumber": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponse_GetUsersResponseDto-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean"},
            "statusCode": {"ref":"StatusCodes"},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"GetUsersResponseDto"}},
            "message": {"dataType":"string"},
            "pagination": {"ref":"PaginationDataResponseModel"},
            "timestamp": {"dataType":"string"},
            "traceId": {"dataType":"string"},
            "metaData": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUsersRequestDto": {
        "dataType": "refObject",
        "properties": {
            "pageNumber": {"dataType":"double","required":true},
            "pageSize": {"dataType":"double","required":true},
            "byEmailId": {"dataType":"string"},
            "byPhoneNumber": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserByIdResponseDto": {
        "dataType": "refObject",
        "properties": {
            "identifier": {"dataType":"string"},
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phoneNumber": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponse_GetUserByIdResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean"},
            "statusCode": {"ref":"StatusCodes"},
            "data": {"ref":"GetUserByIdResponseDto"},
            "message": {"dataType":"string"},
            "pagination": {"ref":"PaginationDataResponseModel"},
            "timestamp": {"dataType":"string"},
            "traceId": {"dataType":"string"},
            "metaData": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUpdateUserEndpoint_putAsync: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateUserRequestDto"},
        };
        app.put('/api/v1/users/:id',
            ...(fetchMiddlewares<RequestHandler>(UpdateUserEndpoint)),
            ...(fetchMiddlewares<RequestHandler>(UpdateUserEndpoint.prototype.putAsync)),

            async function UpdateUserEndpoint_putAsync(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUpdateUserEndpoint_putAsync, request, response });

                const controller = new UpdateUserEndpoint();

              await templateService.apiHandler({
                methodName: 'putAsync',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGetUsersEndpoint_getsAsync: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                request: {"in":"queries","name":"request","required":true,"ref":"GetUsersRequestDto"},
        };
        app.get('/api/v1/users',
            ...(fetchMiddlewares<RequestHandler>(GetUsersEndpoint)),
            ...(fetchMiddlewares<RequestHandler>(GetUsersEndpoint.prototype.getsAsync)),

            async function GetUsersEndpoint_getsAsync(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGetUsersEndpoint_getsAsync, request, response });

                const controller = new GetUsersEndpoint();

              await templateService.apiHandler({
                methodName: 'getsAsync',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGetUserByIdEndpoint_getAsync: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/v1/users/:id',
            ...(fetchMiddlewares<RequestHandler>(GetUserByIdEndpoint)),
            ...(fetchMiddlewares<RequestHandler>(GetUserByIdEndpoint.prototype.getAsync)),

            async function GetUserByIdEndpoint_getAsync(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGetUserByIdEndpoint_getAsync, request, response });

                const controller = new GetUserByIdEndpoint();

              await templateService.apiHandler({
                methodName: 'getAsync',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

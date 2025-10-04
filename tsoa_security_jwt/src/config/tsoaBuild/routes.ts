/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetUserByIdEndpoint } from './../../modules/users/apps/features/v1/getUserById/endpoint/index';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SignInEndpoint } from './../../modules/auth/apps/features/v1/sign-in/endpoint/index';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "StatusCodes": {
        "dataType": "refEnum",
        "enums": [100,101,102,103,200,201,202,203,204,205,206,207,300,301,302,303,304,305,307,308,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,426,428,429,431,451,500,501,502,503,504,505,507,511],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserByIdResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
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
    "SignInResponseDto": {
        "dataType": "refObject",
        "properties": {
            "userName": {"dataType":"string","required":true},
            "tokens": {"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true},"accessToken":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponse_SignInResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean"},
            "statusCode": {"ref":"StatusCodes"},
            "data": {"ref":"SignInResponseDto"},
            "message": {"dataType":"string"},
            "pagination": {"ref":"PaginationDataResponseModel"},
            "timestamp": {"dataType":"string"},
            "traceId": {"dataType":"string"},
            "metaData": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignInRequestDto": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
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
        const argsSignInEndpoint_postAsync: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"SignInRequestDto"},
        };
        app.post('/api/v1/auth/sign-in',
            ...(fetchMiddlewares<RequestHandler>(SignInEndpoint)),
            ...(fetchMiddlewares<RequestHandler>(SignInEndpoint.prototype.postAsync)),

            async function SignInEndpoint_postAsync(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSignInEndpoint_postAsync, request, response });

                const controller = new SignInEndpoint();

              await templateService.apiHandler({
                methodName: 'postAsync',
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

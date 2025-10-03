import request from 'supertest';
import expect from 'expect';
import { beforeEach, describe, it } from 'node:test';
import { App } from '@/app';
import { HmacWrapper, ValidateEnv } from '@kishornaik/utils';
import { GetUsersRequestDto } from '@/modules/users/apps/features/v1/getUsers/contracts';
import { HMAC_SECRET_KEY } from '@/config/env';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App();
appInstance.initializeProcessExceptionHandling();
appInstance.initializeMiddlewares((app) => {});
appInstance.initializeRestApiRoutes();
appInstance.initializeErrorHandling();
const app = appInstance.getServer();

describe(`get_users_endpoint_integration_test`, () => {
	beforeEach(async () => {});

	/*
  Command:
  npm run build
  node --trace-deprecation --test --test-name-pattern='should_return_200_when_users_found' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integrations/features/v1/getUsers/index.test.ts
  */
	it(`should_return_200_when_users_found`, async () => {
		// Request Dto
		const requestDto = new GetUsersRequestDto();
		requestDto.byEmailId = 'john@example.com';
		requestDto.byPhoneNumber = '9161234567';
		requestDto.pageNumber = 1;
		requestDto.pageSize = 10;

		// Endpoint
		const endpoint = `/api/v1/users?byEmailId=${requestDto.byEmailId}&byPhoneNumber=${requestDto.byPhoneNumber}&pageNumber=${requestDto.pageNumber}&pageSize=${requestDto.pageSize}`;
    const timestamp=Date.now().toString();
    const clientId=crypto.randomUUID().toString()

    const canonicalPayload= `${timestamp}:${endpoint}`;

    // Generate Signature
    const signatureResult=HmacWrapper.generate(canonicalPayload,HMAC_SECRET_KEY);
    if(signatureResult.isErr())
    {
      setTimeout(() => {
				process.exit(0);
			}, 5000);
			expect(true).toBe(false);
      return;
    }

    const signature=signatureResult.value;

		const response = await request(app)
      .get(endpoint)
      .set('Accept', 'application/json')
      .set('x-hmac-signature', signature)
      .set('x-hmac-client-id', clientId)
      .set('x-hmac-timestamp', timestamp);
		if (response.status !== 200) {
			console.error('Response:', JSON.stringify(response.body, null, 2));
			setTimeout(() => {
				process.exit(0);
			}, 5000);
			expect(true).toBe(false);
		}

		setTimeout(() => {
			process.exit(0);
		}, 5000);
		expect(response.status).toBe(200);
	});
});

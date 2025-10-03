import request from 'supertest';
import expect from 'expect';
import { beforeEach, describe, it } from 'node:test';
import { App } from '@/app';
import { HmacWrapper, ValidateEnv } from '@kishornaik/utils';
import { UpdateUserRequestDto } from '@/modules/users/apps/features/v1/updateUser/contract';
import { HMAC_SECRET_KEY } from '@/config/env';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App();
appInstance.initializeProcessExceptionHandling();
appInstance.initializeMiddlewares((app) => {});
appInstance.initializeRestApiRoutes();
appInstance.initializeErrorHandling();
const app = appInstance.getServer();

describe(`update_user_endpoint_integration_test`, () => {
	beforeEach(async () => {});

	/*
  Command:
  npm run build
  node --trace-deprecation --test --test-name-pattern='should_return_200_when_user_updated' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integrations/features/v1/updateUser/index.test.ts
  */
	it(`should_return_200_when_user_updated`, async () => {
		// Request Dto
		const requestDto = new UpdateUserRequestDto();
		requestDto.firstName = 'john';
		requestDto.lastName = 'doe';
		requestDto.email = 'john@example.com';
		requestDto.phoneNumber = '9161234567';
		const id = crypto.randomUUID().toString();

		const endpoint = `/api/v1/users/${id}`;
    const timestamp=Date.now().toString();
    const clientId=crypto.randomUUID().toString()

    const canonicalPayload= `${timestamp}:${endpoint}:${JSON.stringify(requestDto)}`;

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
			.put(endpoint)
			.send(requestDto)
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

import request from 'supertest';
import expect from 'expect';
import { beforeEach, describe, it } from 'node:test';
import { App } from '@/app';
import { ValidateEnv } from '@kishornaik/utils';
import { SignInRequestDto } from '@/modules/auth/apps/features/v1/sign-in/contract';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App();
appInstance.initializeProcessExceptionHandling();
appInstance.initializeMiddlewares((app) => {});
appInstance.initializeRestApiRoutes();
appInstance.initializeErrorHandling();
const app = appInstance.getServer();

describe(`create_user_endpoint_integration_test`, () => {
	beforeEach(async () => {});

	/*
  Command:
  npm run build
  node --trace-deprecation --test --test-name-pattern='should_return_200_when_user_login_success' --require ts-node/register -r tsconfig-paths/register ./src/modules/auth/tests/integrations/features/v1/sign-in/index.test.ts
  */
	it(`should_return_200_when_user_login_success`, async () => {
		// Request Dto
		const requestDto = new SignInRequestDto();
		requestDto.username = 'kishor@example.com';
		requestDto.password = '@kishornaik123';

		const response = await request(app)
			.post('/api/v1/auth/sign-in')
			.send(requestDto)
			.set('Accept', 'application/json');
		if (response.status !== 200) {
			console.error('Response Error:', JSON.stringify(response.body, null, 2));
			setTimeout(() => {
				process.exit(0);
			}, 5000);
			expect(true).toBe(false);
			return;
		}

		console.info(`Response Success:`, JSON.stringify(response.body, null, 2));

		setTimeout(() => {
			process.exit(0);
		}, 5000);
		expect(response.status).toBe(200);
	});
});

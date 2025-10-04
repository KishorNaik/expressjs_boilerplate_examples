import request from 'supertest';
import expect from 'expect';
import { beforeEach, describe, it } from 'node:test';
import { App } from '@/app';
import { Container, RoleEnum, ValidateEnv } from '@kishornaik/utils';
import { GetUserByIdRequestDto } from '@/modules/users/apps/features/v1/getUserById/contract';
import { JwtService } from '@/modules/shared/users/services/jwt';
import { IClaims } from '@/modules/shared/users/types';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App();
appInstance.initializeProcessExceptionHandling();
appInstance.initializeMiddlewares((app) => {});
appInstance.initializeRestApiRoutes();
appInstance.initializeErrorHandling();
const app = appInstance.getServer();

describe(`get_user_by_id_endpoint_integration_test`, () => {
	beforeEach(async () => {});

	/*
  Command:
  npm run build
  node --trace-deprecation --test --test-name-pattern='should_return_200_when_user_found' --require ts-node/register -r tsconfig-paths/register ./src/modules/users/tests/integrations/features/v1/getUserById/index.test.ts
  */
	it(`should_return_200_when_user_found`, async () => {
		// Request Dto
		const requestDto = new GetUserByIdRequestDto();
		requestDto.id = `4c59331e-a909-41b3-abd2-69bb16a00fe3`;

		// Endpoint
		const endpoint = `/api/v1/users/${requestDto.id}`;

		// Generate Jwt Token for Testing
		// Prepare Claims
		const claims: IClaims = {
			id: `4c59331e-a909-41b3-abd2-69bb16a00fe3`,
			email: `jhon@example.com`,
			firstName: `john`,
			lastName: `doe`,
			role: RoleEnum.USER,
		};
		const jwtService = new JwtService();
		const jwtToken = await jwtService.generateTokenAsync(claims);
		//const jwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRjNTkzMzFlLWE5MDktNDFiMy1hYmQyLTY5YmIxNmEwMGZlMyIsImVtYWlsIjoiamhvbkBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6ImpvaG4iLCJsYXN0TmFtZSI6ImRvZSIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiaHR0cHM6Ly95b3VyLWF1dGgtcHJvdmlkZXIvIiwiYXVkIjoieW91ci1hcGktaWRlbnRpZmllciIsInN1YiI6IjRjNTkzMzFlLWE5MDktNDFiMy1hYmQyLTY5YmIxNmEwMGZlMyIsImlhdCI6MTc1OTU3MzY4MywiZXhwIjoxNzU5NTc3MjgzLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.G-t9XGuNjO_Rcn1w_uOKXdtcxEx6fVuWjVebEjqqH4c`;

		const response = await request(app)
			.get(endpoint)
			.set('Accept', 'application/json')
			.set('authorization', `Bearer ${jwtToken}`);
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

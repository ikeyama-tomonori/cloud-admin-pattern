import { App } from "aws-cdk-lib";
import { getStatefulStack } from ".";

describe("getStatefulStack", async () => {
	it("実行できる", async () => {
		const app = new App();

		const vpc = {};
		const db = {};
		const hostedZone = {};
		const userPool = {};
		const userPoolClient = {};
		const userPoolDomain = {};

		const createVpc = vi.fn().mockReturnValueOnce(Promise.resolve({ vpc }));
		const createRds = vi.fn().mockReturnValueOnce({ db });
		const createRoute53 = vi.fn().mockReturnValueOnce({ hostedZone });
		const createCognito = vi.fn().mockReturnValueOnce({
			userPool,
			userPoolClient,
			userPoolDomain,
		});

		const statefulStack = getStatefulStack({
			name: "testStack",
			env: {},
			createVpc,
			createRds,
			createRoute53,
			createCognito,
		});

		const result = await statefulStack({ scope: app });

		expect(createVpc).toHaveBeenCalled();
		expect(createRds).toHaveBeenCalled();
		expect(createRoute53).toHaveBeenCalled();
		expect(createCognito).toHaveBeenCalled();

		expect(result.vpc).toBe(vpc);
		expect(result.db).toBe(db);
		expect(result.hostedZone).toBe(hostedZone);
		expect(result.cognito.userPool).toBe(userPool);
		expect(result.cognito.userPoolClient).toBe(userPoolClient);
		expect(result.cognito.userPoolDomain).toBe(userPoolDomain);
	});
});

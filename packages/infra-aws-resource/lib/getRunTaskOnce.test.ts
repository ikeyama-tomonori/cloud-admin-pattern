import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Cluster, FargateTaskDefinition } from "aws-cdk-lib/aws-ecs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance, DatabaseInstanceEngine } from "aws-cdk-lib/aws-rds";
import { getRunTaskOnce } from ".";

describe("getRunTaskOnce", () => {
	it("RunTaskOnce(カスタムリソース)が作成できる", async () => {
		const app = new App();
		const stack = new Stack(app, "test", {
			env: { account: "000000000000", region: "ap-northeast-1" },
		});

		const cluster = new Cluster(stack, "TestCluster");
		const taskDefinition = new FargateTaskDefinition(stack, "TestTask");
		const vpc = new Vpc(stack, "TestVpc");
		const db = new DatabaseInstance(stack, "TestDb", {
			vpc,
			engine: DatabaseInstanceEngine.MYSQL,
		});

		const createAlb = getRunTaskOnce({
			name: "TestAlbService",
		});
		await createAlb({ scope: stack, cluster, taskDefinition, db });

		const template = Template.fromStack(stack);

		template.resourceCountIs("Custom::RunTask", 1);
	});
});

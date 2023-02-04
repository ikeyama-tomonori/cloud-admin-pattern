import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { getRoute53 } from ".";

describe("getRoute53", () => {
	it("HostedZoneが作成できる", async () => {
		const app = new App();
		const stack = new Stack(app, "test", {
			env: { account: "000000000000", region: "ap-northeast-1" },
		});
		const createRoute53 = getRoute53({
			name: "TestHostedZone",
			zoneName: "test.example.com",
		});
		await createRoute53({ scope: stack });

		const template = Template.fromStack(stack);
		template.hasResourceProperties("AWS::Route53::HostedZone", {
			Name: "test.example.com.",
		});
	});
});

import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { getCertificate } from ".";

describe("getCertificate", () => {
	it("Certificateが作成できる", async () => {
		const app = new App();
		const stack = new Stack(app, "test", {
			env: { account: "000000000000", region: "ap-northeast-1" },
		});
		const hostedZone = new HostedZone(stack, "TestHostedZone", {
			zoneName: "test.example.com",
		});

		const createCertificate = getCertificate({
			name: "TestCertificate",
			domainName: "test.example.com",
		});
		await createCertificate({ scope: stack, hostedZone });

		const template = Template.fromStack(stack);

		template.hasResourceProperties("AWS::CloudFormation::CustomResource", {
			DomainName: "test.example.com",
			SubjectAlternativeNames: ["*.test.example.com"],
			CleanupRecords: "true",
		});
	});
});

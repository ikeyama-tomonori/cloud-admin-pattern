import { Template } from "aws-cdk-lib/assertions";
import getMain from "./getMain";

describe("getMain", async () => {
  it("Snapshotが一致する", async () => {
    const config = {
      env: {
        account: "000000000000",
        region: "ap-northeast-1",
      },
      distDir: "infra/main/test/dist",
      domianName: "test.example.com",
      version: "99999",
      userPoolDomainPrefix: "test-prefix",
    };

    const main = getMain(config);
    const { statefulStack, statelessStack, hostNameStack } = await main();

    expect(Template.fromStack(statefulStack)).toMatchSnapshot();
    expect(Template.fromStack(statelessStack)).toMatchSnapshot();
    expect(Template.fromStack(hostNameStack)).toMatchSnapshot();
  });
});

import { getApp } from ".";

describe("getApp", async () => {
  it("実行できる", async () => {
    const vpc = {};
    const db = {};
    const hostedZone = {};
    const userPool = {};
    const userPoolClient = {};
    const userPoolDomain = {};

    const loadBalancer = {};

    const aRecord = {};

    const createStatefulStack = vi.fn().mockReturnValueOnce(
      Promise.resolve({
        vpc,
        db,
        hostedZone,
        cognito: {
          userPool,
          userPoolClient,
          userPoolDomain,
        },
      }),
    );

    const createStatelessStack = vi.fn().mockReturnValueOnce(
      Promise.resolve({
        loadBalancer,
      }),
    );

    const createHostNameStack = vi.fn().mockReturnValueOnce(
      Promise.resolve({
        aRecord,
      }),
    );

    const app = getApp({
      createStatefulStack,
      createStatelessStack,
      createHostNameStack,
    });

    await app();

    expect(createStatefulStack).toHaveBeenCalled();
    expect(createStatelessStack).toHaveBeenCalled();
    expect(createHostNameStack).toHaveBeenCalled();
  });
});

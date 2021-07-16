import { AggregatedResult, Context } from "@jest/reporters";
import type { Config } from "@jest/types";

import { createElement, getOptions, Options, send } from "./utils";

class LarkReporter {
  private options: Options;

  constructor(_: Config.GlobalConfig, options: Options) {
    this.options = getOptions(options);
  }

  async onRunComplete(_: Set<Context>, aggregatedResults: AggregatedResult) {
    if (!this.options.token) {
      console.error("请设置 token");
      return;
    }

    const { numTotalTests, numFailedTests } = aggregatedResults;

    if (numTotalTests === 0) return;
    if (numFailedTests === 0) return;

    const content = aggregatedResults.testResults
      .filter((x) => x.numFailingTests !== 0)
      .map(createElement);

    await send(this.options.token, this.options.secret, [
      {
        tag: "div",
        text: {
          content: `共执行了 ${numTotalTests} 个测试，其中 **${numFailedTests}** 个失败`,
          tag: "lark_md",
        },
      },
      { tag: "hr" },
      ...content,
    ]);
  }
}

export default LarkReporter;

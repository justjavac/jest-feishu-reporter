import { relative } from "path";
import { TestResult } from "@jest/test-result";
import fetch from "node-fetch";
import stripAnsi from "strip-ansi";
import crypto from "crypto";

export interface Options {
  token?: string;
  secret?: string;
}

export interface ElementTag {
  tag: string;
  text?: ElementTag;
  content?: string;
}

export function getOptions(options: Options): Options {
  const token = process.env["JEST_FEISHU_TOKEN"] ||
    process.env["npm_package_jest_feishu_token"];
  const secret = process.env["JEST_FEISHU_SECRET"] ||
    process.env["npm_package_jest_feishu_secret"];

  return { token, secret, ...options };
}

export function createContent(testResult: TestResult) {
  const num = testResult.numFailingTests;
  const filePath = relative(process.cwd(), testResult.testFilePath);
  const message = stripAnsi(testResult.failureMessage!);
  const code = urlEncode(message);

  return `● ${filePath}: [${num} 个失败](https://carbon.now.sh?code=${code})`;
}

export function createElement(testResult: TestResult): ElementTag {
  const content = createContent(testResult);
  return {
    tag: "div",
    text: {
      content,
      tag: "lark_md",
    },
  };
}

export function urlEncode(str: string) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
}

export interface Sign {
  timestamp?: string;
  sign?: string;
}

export function sign(secret: string) {
  const timestamp = String(Date.now()).slice(0, 10);
  const stringToSign = `${timestamp}\n${secret}`;
  const hash = crypto.createHmac("sha256", stringToSign);
  hash.update("");
  const sign = hash.digest("base64");
  return { timestamp, sign };
}

export async function send(
  token: string,
  secret: string | undefined,
  elements: ElementTag[],
) {
  const singPayload = secret ? sign(secret) : {};

  const data = {
    ...singPayload,
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: "Jest 测试报告",
        },
        template: "red",
      },
      elements,
    },
  };

  const response = await fetch(
    `https://open.feishu.cn/open-apis/bot/v2/hook/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    console.error(response.statusText);
    return;
  }

  const body = await response.json();

  if (body.code !== 0) {
    console.error(body.msg);
    return;
  }

  console.log("send success 🎉");
}

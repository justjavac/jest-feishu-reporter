# jest-feishu-reporter

[![ci](https://github.com/justjavac/jest-feishu-reporter/actions/workflows/ci.yml/badge.svg)](https://github.com/justjavac/jest-feishu-reporter/actions/workflows/ci.yml)
[![npm][npm-badge]][npm-url] [![Size][size-badge]][size]

将 Jest 的测试错误发送到飞书。

飞书自定义机器人使用说明:
[如何在群组中使用机器人？](https://www.feishu.cn/hc/zh-CN/articles/360024984973)

## 加群

- 通过二维码: [./qrcode.png](./qrcode.png)
- 通过链接: [Jest 机器人测试群](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=63budeba-35e8-4668-a4cb-1a8bb1266316)

## 安装

```sh
npm install -D jest-feishu-reporter
# 或者
yarn add -D jest-feishu-reporter
```

## 使用

在 `jest.config.js` 中配置:

```js
module.exports = {
  reporters: [
    "default",
    // ... other reporters
    [
      "jest-feishu-reporter",
      {
        "token": "xxxxxx-xxxxxxx-xxxx-xxxx",
        "secret": "xxxxxxx",
      },
    ],
  ],
};
```

或者在 `package.json` 配置:

```json
"jest": {
  "reporters": [
    "default",
    [
      "jest-feishu-reporter",
      {
        "token": "xxxxxx-xxxxxxx-xxxx-xxxx",
        "secret": "xxxxxxx"
      }
    ] 
  ]
}
```

在 `package.json` 中还可以单独配置：

```json
"jest-feishu": {
  "token": "xxxxxx-xxxxxxx-xxxx-xxxx",
  "secret": "xxxxxxx"
}
```

## 配置说明

### token

在[如何在群组中使用机器人？](https://www.feishu.cn/hc/zh-CN/articles/360024984973)第二步可以获取机器人的
webhook 地址，格式如下：

```
​https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxxx​
                                             ^^^^^^^^^^^^^^^^^
                                                   token
```

`token` 就是 url 最后面的部分。

### secret

飞书有 3 种安全模式，如果使用**签名校验**，则需要设置 `secret`。

## 注意事项

对于公有仓库，还可以通过设置系统环境变量来进行配置。

- `JEST_FEISHU_TOKEN` - 设置 token
- `JEST_FEISHU_SECRET` - 设置 secret

使用：

```shell
JEST_FEISHU_TOKEN=xxxx-xxxx-xxx npm run test
```

Github Actions 配置：

```yml
- name: Test
  env:
    JEST_FEISHU_TOKEN: ${{ secrets.FEISHU_TOKEN }}
  run: yarn test
```

## License

[jest-feishu-reporter](https://github.com/justjavac/jest-feishu-reporter) is
released under the MIT License. See the bundled [LICENSE](./LICENSE) file for
details.

[size-badge]: https://img.shields.io/bundlephobia/minzip/jest-feishu-reporter.svg
[size]: https://bundlephobia.com/result?p=jest-feishu-reporter
[npm-badge]: https://img.shields.io/npm/v/jest-feishu-reporter.svg
[npm-url]: https://npmjs.com/package/jest-feishu-reporter

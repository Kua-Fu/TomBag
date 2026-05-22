# TomBag

TomBag 是一个轻量的日常开发小工具集，当前提供 JSON 展示、时间戳转换和单位换算三个工具。
支持中英文界面、默认背景图、关闭背景和自定义本地背景图。

## 功能

| 工具 | 入口 | 说明 |
| --- | --- | --- |
| JSON 展示 | `http://localhost:3000/index.html` | 校验、格式化、压缩、复制、文件导入和树形浏览 |
| 时间戳转换 | `http://localhost:3000/timestamp.html` | 秒、毫秒、微秒、纳秒与多时区日期时间互转 |
| 单位换算 | `http://localhost:3000/unit-converter.html` | 数据大小、时间间隔、吞吐、带宽、百分比和人民币单位换算 |

## 快速开始

```bash
npm install
npm start
```

默认访问地址：

```text
http://localhost:3000
```

## 开发

```bash
npm run dev
npm test
```

## Chrome 扩展

生成扩展目录：

```bash
npm run build:extension
```

然后在 Chrome 打开：

```text
chrome://extensions
```

开启开发者模式，选择 `chrome-extension/` 作为未打包扩展加载。

## 隐私

隐私政策见 [PRIVACY.md](PRIVACY.md)。

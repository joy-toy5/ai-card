# AI Card

一个基于 Vite + React 的卡牌展示示例项目。界面提供卡牌选择、归档预览、全量归档和 `PROMPT_ID` 搜索，适合作为交互原型、动画实验或提示词数据展示骨架。

-在线体验：https://daw.qzz.io/

## 开源整理说明

- 仓库内默认只保留可公开分发的示例数据。
- `src/data/cards.js` 使用内联 SVG 占位图和原创示例 prompt，不依赖第三方图片站点。
- 当前仓库面向源码使用与二次开发，不以直接发布 npm 包为目标，因此 `package.json` 仍保留 `private: true` 防止误发布。

## 功能特性

- 赛博风格的卡牌对战与收纳交互
- 已收录卡片预览与全量归档浏览
- 按 `PROMPT_ID` 关键词搜索全量卡牌
- 图片放大查看与分批懒加载
- 自包含示例数据，克隆后即可运行

## 界面展示

选择卡牌界面
<p><img width="2560" height="1320" alt="image" src="https://github.com/user-attachments/assets/666fe4e9-3a5b-455f-8f06-6c216367cac4" /></p>

卡牌对比界面

<p><img width="2560" height="1320" alt="image" src="https://github.com/user-attachments/assets/edce7003-29f7-4c66-9ca2-6d33b260170a" /></p>

预览归档界面

<p><img width="2545" height="1319" alt="image" src="https://github.com/user-attachments/assets/44343c8c-e96d-4fd7-8b22-e90f0146efa9" /></p>

总收录卡牌查看界面

<p><img width="2545" height="1319" alt="image" src="https://github.com/user-attachments/assets/3079acf0-a718-4d92-b9fb-d88eb14d9a8b" /></p>

归档界面

<p><img width="2545" height="1319" alt="image" src="https://github.com/user-attachments/assets/b7ec40b2-bafc-4a75-9728-fbb451db665e" /></p>


## 快速开始

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 数据约定

卡片数据位于 `src/data/cards.js`，每张卡至少包含以下字段：

```js
{
  id: 'card_001',
  imageUrl: 'data:image/svg+xml,...',
  prompt: `// PROMPT_ID: 示例标题
{
  "category": "UI SYSTEM",
  "summary": "..."
}`
}
```

注意点：

- `prompt` 第一行必须保留 `// PROMPT_ID: ...` 格式，界面顶部搜索依赖这一行。
- 如果你替换成真实素材，请确保你拥有图片、文字和品牌元素的再分发权。
- 如果你要导入外部数据，建议先做一层清洗，把第三方 IP、品牌名和来源不明的图片全部剥离。

## 目录结构

```text
.
├── AGENTS.md
├── LICENSE
├── README.md
├── aicard.js
├── index.html
├── package.json
├── package-lock.json
├── src
│   ├── App.jsx
│   ├── CyberDeck.jsx
│   ├── data
│   │   └── cards.js
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

## 开发建议

- 公开仓库默认不要提交 `dist/` 和 `node_modules/`
- 如果后续引入真实卡库，建议改成外部注入或私有数据包，不要直接混进公开仓库
- 如果你要把这个项目作为模板复用，优先复用交互和数据结构，不要直接回填来源不明的素材

## 许可证

代码采用 [MIT License](./LICENSE)。

仓库内示例卡片数据仅作为演示内容随代码一起分发；你后续替换进来的真实数据或图片，需要自行确认许可边界。 

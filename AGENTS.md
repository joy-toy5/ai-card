# AI Card

## 目录结构

```text
.
├── AGENTS.md
├── LICENSE
├── README.md
├── aicard.js
├── assets
│   └── tasks
│       └── todo.md
├── package-lock.json
├── index.html
├── package.json
├── src
│   ├── App.jsx
│   ├── CyberDeck.jsx
│   ├── data
│   │   └── cards.js
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

## 文件职责

- `README.md`: 面向公开仓库的使用说明、数据约束和开源边界。
- `LICENSE`: 代码许可证文本。
- `aicard.js`: 对外保留的组件入口，重导出 `src/CyberDeck.jsx`。
- `src/CyberDeck.jsx`: 卡牌交互主界面，负责游戏状态、动画、归档展示和搜索入口。
- `src/data/cards.js`: 自包含示例卡片数据源，生成内联 SVG 卡面并提供 `PROMPT_ID` 文本。
- `src/App.jsx`: 页面级装配层，只挂载核心卡牌组件。
- `src/main.jsx`: React 启动入口，把应用挂到 `#root`。
- `src/index.css`: Tailwind v4 入口和全局背景、排版基础样式。
- `index.html`: Vite HTML 入口。
- `vite.config.js`: Vite 与 React、Tailwind 插件配置。
- `package.json`: 依赖、脚本与开源元数据定义。
- `package-lock.json`: 当前依赖解析结果，保证安装结果可复现。
- `assets/tasks/todo.md`: 当前任务执行与验证记录。

## 依赖边界

- 运行时依赖集中在 `react`、`react-dom`、`framer-motion`、`lucide-react`。
- 构建层依赖集中在 `vite`、`@vitejs/plugin-react`、`tailwindcss`、`@tailwindcss/vite`。
- `src/CyberDeck.jsx` 依赖 `src/data/cards.js` 提供卡片内容；数据文件不应反向依赖组件实现。
- 公开仓库默认只应携带可再分发的示例数据；真实业务素材应通过外部注入或私有数据包接入。

## 变更记录

- 新增最小 Vite + React + Tailwind v4 工程骨架。
- 将核心界面整理到 `src/CyberDeck.jsx`，并保留根入口兼容导出。
- 将模拟卡片数据拆到 `src/data/cards.js`，避免界面组件混杂大段内容数据。
- 为公开仓库新增 `README.md` 与 `LICENSE`，并将卡片数据替换为自包含的开源安全示例集。

const colorThemes = [
  { accent: '#22d3ee', glow: '#0f172a', ink: '#cffafe' },
  { accent: '#f97316', glow: '#431407', ink: '#ffedd5' },
  { accent: '#84cc16', glow: '#1a2e05', ink: '#ecfccb' },
  { accent: '#f472b6', glow: '#4a044e', ink: '#fce7f3' },
  { accent: '#60a5fa', glow: '#172554', ink: '#dbeafe' },
  { accent: '#facc15', glow: '#422006', ink: '#fef9c3' },
];

const cardBlueprints = [
  {
    promptId: '霓虹终端仪表盘',
    category: 'UI SYSTEM',
    summary: '构建一个夜间运行的终端控制台界面样张。',
    scene: '多窗口数据监控台，强调状态条、图表和告警区。',
    composition: '横向主图加右侧详情栏，信息层级清晰。',
    focus: '适合公开演示的控制台设计示例。',
  },
  {
    promptId: '城市夜航信息海报',
    category: 'POSTER',
    summary: '设计一张虚构城市夜航活动宣传海报。',
    scene: '河岸灯光、船只剪影、时间与地点信息模块。',
    composition: '大标题居中，下方留出活动说明与票务区。',
    focus: '突出排版、留白与夜景氛围。',
  },
  {
    promptId: '山谷观测站横截面',
    category: 'TECHNICAL',
    summary: '绘制一座山谷观测站的结构横截面示意图。',
    scene: '观测塔、储能舱、数据链路和维护通道。',
    composition: '左侧主体剖面，右侧标注图例。',
    focus: '强调工程说明图的可读性。',
  },
  {
    promptId: '雨夜街角摄影练习',
    category: 'PHOTOGRAPHY',
    summary: '展示一张雨夜街角主题的摄影练习卡。',
    scene: '路灯倒影、公交站、潮湿人行道与暖色窗光。',
    composition: '低机位透视，主体落在黄金分割位置。',
    focus: '训练城市夜景的构图判断。',
  },
  {
    promptId: '森林旅店品牌板',
    category: 'BRAND',
    summary: '输出一套虚构森林旅店的品牌情绪板。',
    scene: '木纹材质、导视箭头、名片和欢迎卡样机。',
    composition: '卡片式拼贴布局，突出配色和字体关系。',
    focus: '适合开源仓库的品牌系统演示数据。',
  },
  {
    promptId: '海港物流流程图',
    category: 'INFOGRAPHIC',
    summary: '整理一张海港物流处理流程图。',
    scene: '入港、分拣、仓储、复核、离港五个阶段。',
    composition: '自左向右的流向图，搭配编号节点。',
    focus: '验证流程图类卡片在归档中的展示效果。',
  },
  {
    promptId: '远山露营插画卡',
    category: 'ILLUSTRATION',
    summary: '创作一张远山露营主题插画设定卡。',
    scene: '帐篷、篝火、松树、湖面和稀薄晨雾。',
    composition: '前景物件明确，中景营地，远景山体。',
    focus: '用于自然题材的原创插画示例。',
  },
  {
    promptId: '低多边形沙丘地形',
    category: 'LOW POLY',
    summary: '制作一张低多边形沙丘地形演示图。',
    scene: '起伏沙丘、观测旗标、路径线与高度差色带。',
    composition: '斜俯视角度，便于理解体块关系。',
    focus: '展示几何风格和清晰明暗面。',
  },
  {
    promptId: '复古收音机产品页',
    category: 'PRODUCT',
    summary: '模拟一个复古收音机的产品介绍页。',
    scene: '主产品图、旋钮细节、规格参数和卖点标签。',
    composition: '左图右文，底部加入参数表。',
    focus: '用于产品型卡片的公开演示。',
  },
  {
    promptId: '夜班电台节目单',
    category: 'EDITORIAL',
    summary: '排一张虚构夜班电台的节目时间表。',
    scene: '主持人栏目、主题色块、整点时段与曲目提示。',
    composition: '竖向时间轴加横向栏目标签。',
    focus: '测试长文本与时间表结构。',
  },
  {
    promptId: '城市轻轨导览图',
    category: 'MAP',
    summary: '设计一张虚构城市轻轨线路导览图。',
    scene: '主线、换乘节点、终点站与服务图例。',
    composition: '线路图居中，外围留出站点说明。',
    focus: '用于地图型卡片的结构验证。',
  },
  {
    promptId: '冷杉茶饮包装稿',
    category: 'PACKAGING',
    summary: '制作一款虚构茶饮品牌的包装展开稿。',
    scene: '主标签、侧标、成分区和运输标识。',
    composition: '平铺刀版展示，配一角实物小样。',
    focus: '适合展示包装系统与版式比例。',
  },
  {
    promptId: '山间研究所建筑渲染',
    category: 'ARCHITECTURE',
    summary: '表现一座山间研究所的外观渲染图。',
    scene: '坡地建筑、玻璃走廊、台阶和雾气环境。',
    composition: '三分之二视角，建筑占画面主体。',
    focus: '展示建筑场景的干净体块关系。',
  },
  {
    promptId: '数据协作网络图',
    category: 'DATA VIZ',
    summary: '构建一张团队协作关系网络图。',
    scene: '节点、连接权重、分组颜色和摘要注释。',
    composition: '中心主节点向外扩散，多环层次分明。',
    focus: '适合搜索和归档演示的数据可视化示例。',
  },
  {
    promptId: '博物馆导视系统',
    category: 'WAYFINDING',
    summary: '输出一套虚构博物馆的导视系统卡。',
    scene: '楼层索引、箭头牌、票务入口和展厅编号。',
    composition: '模块化组件排布，突出图文比例。',
    focus: '用于导视与信息设计场景。',
  },
  {
    promptId: '清晨厨房静物摄影',
    category: 'STILL LIFE',
    summary: '拍摄感的清晨厨房静物组合演示。',
    scene: '陶杯、木砧板、柠檬、亚麻布和晨光。',
    composition: '桌面斜构图，保留适度负空间。',
    focus: '展示静物摄影的柔和光线效果。',
  },
  {
    promptId: '浮空花园环境设定',
    category: 'ENVIRONMENT',
    summary: '设定一个架空世界中的浮空花园场景。',
    scene: '石桥、水渠、温室穹顶和悬浮平台。',
    composition: '多层景深，自上而下连接路径。',
    focus: '用于原创环境概念图示例。',
  },
  {
    promptId: '海边图书馆长页海报',
    category: 'LAYOUT',
    summary: '制作一张海边图书馆主题的长页海报。',
    scene: '建筑剪影、开放时间、活动栏和藏书标签。',
    composition: '纵向版式，头图与信息模块交替。',
    focus: '验证长幅排版在卡片中的阅读体验。',
  },
  {
    promptId: '机器人维修手册封面',
    category: 'MANUAL',
    summary: '设计一张虚构机器人维修手册封面。',
    scene: '型号编号、拆解线框和安全提醒区。',
    composition: '大号编号压题，细节线稿辅助。',
    focus: '用于技术手册风格演示。',
  },
  {
    promptId: '科普折页月相说明',
    category: 'EDUCATION',
    summary: '做一页月相变化主题的科普折页内容。',
    scene: '月相序列、简短说明、观测建议和图标。',
    composition: '上方图序，下方文字与提示框。',
    focus: '强调教育类图文平衡。',
  },
  {
    promptId: '远洋气象信息卡',
    category: 'WEATHER',
    summary: '整理一张远洋航线的气象信息卡。',
    scene: '风向、浪高、温度和压强提示。',
    composition: '主图显示海域概况，右侧为指标卡。',
    focus: '测试指标型内容的归档呈现。',
  },
  {
    promptId: '植物温室信息图',
    category: 'SCIENCE',
    summary: '构建一张植物温室运作说明信息图。',
    scene: '灌溉、通风、光照和湿度监控四个模块。',
    composition: '中央俯视总图，四角分解说明。',
    focus: '适合公开展示的原创教育信息图。',
  },
  {
    promptId: '像素早餐场景',
    category: 'PIXEL ART',
    summary: '绘制一个像素风早餐桌面场景。',
    scene: '煎蛋、吐司、咖啡杯和晨报小物。',
    composition: '等距小场景，物件层次清楚。',
    focus: '展示像素细节和色块控制。',
  },
  {
    promptId: '极地考察地图',
    category: 'FIELD GUIDE',
    summary: '设计一张极地考察路线地图卡。',
    scene: '营地、补给点、冰裂区和观测站位置。',
    composition: '主地图配方位箭头与图例。',
    focus: '适合地图与野外任务示例。',
  },
  {
    promptId: '屋顶农场年度报告',
    category: 'REPORT',
    summary: '整理一页屋顶农场年度摘要报告。',
    scene: '产量趋势、作物占比、志愿者时数和备注。',
    composition: '上图下文，左右分栏补充数据。',
    focus: '用于报告型卡片的公开演示。',
  },
  {
    promptId: '晚风唱片封套',
    category: 'MUSIC',
    summary: '设计一张虚构唱片的封套概念图。',
    scene: '海边晚风、波纹纹理、曲目清单与编号。',
    composition: '正封套主视觉加背面曲目栏。',
    focus: '验证音乐类视觉和文字混排。',
  },
  {
    promptId: '旧城钟楼横版插画',
    category: 'SCENE',
    summary: '绘制一张旧城钟楼横版插画卡。',
    scene: '砖石钟楼、广场路灯、鸽群和晚霞天空。',
    composition: '横向展开，中央建筑承担主体。',
    focus: '适合环境插画的公开样本。',
  },
  {
    promptId: '光学实验台说明图',
    category: 'LAB',
    summary: '绘制一套光学实验台操作说明图。',
    scene: '光源、透镜、遮光罩与记录屏幕。',
    composition: '主结构图配三段操作步骤。',
    focus: '展示实验流程类说明结构。',
  },
  {
    promptId: '科研摘要流程图',
    category: 'RESEARCH',
    summary: '制作一张科研摘要用的方法流程图。',
    scene: '数据采集、清洗、建模、评估和复核。',
    composition: '自上而下的流程盒与箭头连接。',
    focus: '适合论文图示风格的中性示例。',
  },
  {
    promptId: '跨端设计系统卡',
    category: 'DESIGN SYSTEM',
    summary: '整理一个跨端设计系统组件总览卡。',
    scene: '按钮、输入框、标签、卡片和状态色。',
    composition: '网格化组件样板加规范注释。',
    focus: '用于界面系统类公开仓库演示。',
  },
  {
    promptId: '雾港夜车电影感场景',
    category: 'CINEMATIC',
    summary: '表现一辆夜车穿过雾港的电影感场景。',
    scene: '路面反光、码头吊臂、车灯雾束和远处信号灯。',
    composition: '低饱和环境配一处高亮主光源。',
    focus: '强调氛围与光影，而非现成 IP 复刻。',
  },
  {
    promptId: '岩层剖面教育海报',
    category: 'GEOLOGY',
    summary: '做一张岩层剖面主题教育海报。',
    scene: '分层结构、化石位置、年代标签与比例尺。',
    composition: '中央剖面柱状图，周边附注释。',
    focus: '适合公开教学示意卡。',
  },
  {
    promptId: '书店橱窗陈列方案',
    category: 'RETAIL',
    summary: '输出书店橱窗陈列方案概念卡。',
    scene: '书堆、灯箱、吊旗、价签和入口动线。',
    composition: '正立面展示，附关键尺寸说明。',
    focus: '验证零售展示类内容表现。',
  },
  {
    promptId: '野外观鸟记录卡',
    category: 'NATURE',
    summary: '设计一张野外观鸟记录卡。',
    scene: '日期、地点、天气、目击数量和备注栏。',
    composition: '左图右表，底部留出手写区。',
    focus: '适合轻量数据卡和记录表样式。',
  },
  {
    promptId: '极简办公空间渲染',
    category: 'INTERIOR',
    summary: '表现一个极简办公空间的室内渲染。',
    scene: '长桌、台灯、样书架、浅色墙面和自然光。',
    composition: '两点透视，空间纵深简洁明确。',
    focus: '展示内装场景的干净秩序。',
  },
  {
    promptId: '群岛渡轮时刻板',
    category: 'TRANSPORT',
    summary: '制作一张群岛渡轮服务时刻板。',
    scene: '班次、登船口、天气提示和乘客须知。',
    composition: '顶部标题，中部时刻表，底部提醒。',
    focus: '用于交通信息类公开样例。',
  },
];

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const chunkText = (value, size = 12, maxLines = 3) => {
  const chars = Array.from(value);
  const lines = [];

  for (let index = 0; index < chars.length && lines.length < maxLines; index += size) {
    lines.push(chars.slice(index, index + size).join(''));
  }

  return lines;
};

const svgToDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const buildCardImage = ({ id, promptId, category, accent, glow, ink }) => {
  const titleLines = chunkText(promptId, 10, 3)
    .map(
      (line, index) =>
        `<text x="56" y="${744 + index * 46}" fill="${ink}" font-family="monospace" font-size="28" letter-spacing="2">${escapeXml(line)}</text>`
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1024" role="img" aria-label="${escapeXml(promptId)}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#030508" />
          <stop offset="100%" stop-color="${glow}" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.92" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="720" height="1024" fill="url(#bg)" />
      <rect x="28" y="28" width="664" height="968" rx="18" fill="none" stroke="${accent}" stroke-opacity="0.45" stroke-width="2" />
      <circle cx="564" cy="196" r="164" fill="${accent}" fill-opacity="0.14" />
      <circle cx="156" cy="280" r="108" fill="${accent}" fill-opacity="0.09" />
      <path d="M72 508 L648 154" stroke="url(#beam)" stroke-width="16" stroke-linecap="round" />
      <path d="M108 596 L610 596" stroke="${accent}" stroke-opacity="0.24" stroke-width="2" />
      <path d="M108 638 L610 638" stroke="${accent}" stroke-opacity="0.14" stroke-width="2" />
      <path d="M108 680 L610 680" stroke="${accent}" stroke-opacity="0.1" stroke-width="2" />
      <rect x="56" y="88" width="164" height="34" rx="17" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.45" />
      <text x="80" y="111" fill="${ink}" font-family="monospace" font-size="16" letter-spacing="3">${escapeXml(category)}</text>
      <text x="56" y="170" fill="${accent}" font-family="monospace" font-size="18" letter-spacing="4">OPEN SOURCE SAMPLE</text>
      ${titleLines}
      <text x="56" y="908" fill="${accent}" font-family="monospace" font-size="18" letter-spacing="3">${escapeXml(id.toUpperCase())}</text>
      <text x="56" y="948" fill="${ink}" fill-opacity="0.72" font-family="monospace" font-size="16" letter-spacing="2">INLINE SVG DEMO ASSET</text>
    </svg>
  `;

  return svgToDataUri(svg);
};

const buildPrompt = ({ promptId, category, summary, scene, composition, focus }, palette) => `// PROMPT_ID: ${promptId}
{
  "category": "${category}",
  "summary": "${summary}",
  "scene": "${scene}",
  "composition": "${composition}",
  "palette": "${palette}",
  "focus": "${focus}",
  "constraints": "仅使用原创元素，不引用第三方角色、品牌或受限素材。"
}`;

export const cards = cardBlueprints.map((card, index) => {
  const theme = colorThemes[index % colorThemes.length];
  const id = `card_${String(index + 1).padStart(3, '0')}`;
  const palette = `${theme.accent} / ${theme.glow} / ${theme.ink}`;

  return {
    id,
    imageUrl: buildCardImage({
      id,
      promptId: card.promptId,
      category: card.category,
      accent: theme.accent,
      glow: theme.glow,
      ink: theme.ink,
    }),
    prompt: buildPrompt(card, palette),
  };
});

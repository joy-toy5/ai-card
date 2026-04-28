import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Database, X, Cpu, Crosshair, Terminal, Search } from 'lucide-react';

const ARCHIVE_BATCH_SIZE = 24;

const extractPromptId = (prompt = '') => {
  const matchedPromptId = prompt.match(/PROMPT_ID:\s*([^\n]+)/);
  return matchedPromptId?.[1]?.trim() ?? '';
};

// --- 隐式预加载钩子 ---
const useImagePreloader = (urls) => {
  useEffect(() => {
    urls.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
};

// --- 全局赛博朋克样式 ---
const customStyles = `
  .bg-cyber-abyss { background-color: #030508; }
  .cyber-backdrop {
    position: absolute; inset: 0; pointer-events: none;
    background-image: 
      linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
  }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 255, 255, 0.05); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.3); border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.6); }
  
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`;

export default function CyberDeck() {
  const [cardsCatalog, setCardsCatalog] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogLoadError, setCatalogLoadError] = useState(null);
  const [pool, setPool] = useState([]);
  const [hand, setHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [battle, setBattle] = useState(null); // { player: card, opponent: card, revealed: boolean }
  const [isArchivePreviewOpen, setIsArchivePreviewOpen] = useState(false);
  const [isFullArchiveOpen, setIsFullArchiveOpen] = useState(false);
  const [archiveVisibleCount, setArchiveVisibleCount] = useState(0);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');
  const [imageViewer, setImageViewer] = useState(null);
  const [sessionToken, setSessionToken] = useState(0);
  const [viewingCard, setViewingCard] = useState(null);
  const [hoveredDeckCardId, setHoveredDeckCardId] = useState(null);
  const archiveLoadMoreRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadCardsCatalog = async () => {
      setIsCatalogLoading(true);
      setCatalogLoadError(null);

      try {
        const module = await import('./data/cards');
        if (cancelled) return;
        setCardsCatalog(module.cards ?? []);
      } catch (error) {
        if (cancelled) return;
        setCatalogLoadError(error);
      } finally {
        if (!cancelled) {
          setIsCatalogLoading(false);
        }
      }
    };

    loadCardsCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  // 初始化 / 重新开始
  const startSession = useCallback(() => {
    if (!cardsCatalog.length) {
      setHand([]);
      setPool([]);
      setDeck([]);
      setBattle(null);
      setIsArchivePreviewOpen(false);
      setIsFullArchiveOpen(false);
      setArchiveVisibleCount(0);
      setArchiveSearchQuery('');
      setImageViewer(null);
      setViewingCard(null);
      setHoveredDeckCardId(null);
      return;
    }

    const shuffled = [...cardsCatalog].sort(() => Math.random() - 0.5);
    setSessionToken((current) => current + 1);
    setHand(shuffled.slice(0, 3));
    setPool(shuffled.slice(3));
    setDeck([]);
    setBattle(null);
    setIsArchivePreviewOpen(false);
    setIsFullArchiveOpen(false);
    setArchiveVisibleCount(0);
    setArchiveSearchQuery('');
    setImageViewer(null);
    setViewingCard(null);
    setHoveredDeckCardId(null);
  }, [cardsCatalog]);

  useEffect(() => {
    if (cardsCatalog.length > 0) {
      startSession();
    }
  }, [cardsCatalog, startSession]);

  // 预加载：手牌 + 牌堆顶部的牌
  const preloadUrls = [...hand.map(c => c.imageUrl), pool[0]?.imageUrl, pool[1]?.imageUrl].filter(Boolean);
  useImagePreloader(preloadUrls);

  // 出牌逻辑
  const playCard = useCallback((playerCard) => {
    if (pool.length < 1 || battle) return; // 没牌或正在对决时防抖

    const opponentCard = pool[0];
    const replacementCard = pool[1];
    const newPool = pool.slice(2); // 一次消耗两张

    // 1. 刷新手牌：移除打出的，立刻补入新的
    setHand(prev => {
      const remaining = prev.filter(c => c.id !== playerCard.id);
      return replacementCard ? [...remaining, replacementCard] : remaining;
    });
    setPool(newPool);

    // 2. 进入对决
    setBattle({ player: playerCard, opponent: opponentCard, revealed: false });
    
    // 延迟展开 Prompt，增加神秘感
    setTimeout(() => {
      setBattle(prev => prev ? { ...prev, revealed: true } : null);
    }, 500); 
  }, [pool, battle]);

  // 结算二选一
  const resolveBattle = useCallback((winnerType) => {
    if (!battle) return;

    const selectedCard = winnerType === 'player' ? battle.player : battle.opponent;
    
    // 放入右侧卡盒
    setDeck(prev => [...prev, selectedCard]);
    setBattle(null);
  }, [battle]);

  const openImageViewer = useCallback((card, title) => {
    if (!card?.imageUrl) return;

    setImageViewer({
      src: card.imageUrl,
      alt: card.id,
      title: title || card.id,
      cardId: card.id,
    });
  }, []);

  const isArchiveComplete = deck.length >= 10;
  const isArchiveView = isArchiveComplete || isArchivePreviewOpen || isFullArchiveOpen;
  const archiveSearchKeyword = archiveSearchQuery.trim().toLowerCase();
  const fullArchiveCards = archiveSearchKeyword
    ? cardsCatalog.filter((card) => extractPromptId(card.prompt).toLowerCase().includes(archiveSearchKeyword))
    : cardsCatalog;
  const archiveCards = isFullArchiveOpen ? fullArchiveCards : deck;
  const archiveTitle = isArchiveComplete
    ? 'NEURAL_ARCHIVE_COMPLETE'
    : isFullArchiveOpen
      ? 'GLOBAL_CARD_ARCHIVE'
      : 'NEURAL_ARCHIVE_PREVIEW';
  const archiveSummary = isFullArchiveOpen
    ? archiveSearchKeyword
      ? `[ PROMPT_ID 搜索命中 ${archiveCards.length} 张 / 总卡池 ${cardsCatalog.length} 张 ]`
      : `[ 全量卡牌索引已加载 ${cardsCatalog.length} 张 / 支持按 PROMPT_ID 搜索 ]`
    : `[ 已收录 ${deck.length} 张核心视觉资产${isArchiveComplete ? '' : ' / 可返回继续选择'} ]`;
  const getLayoutId = (cardId) => `${sessionToken}-${cardId}`;
  const visibleArchiveCards = isFullArchiveOpen ? archiveCards.slice(0, archiveVisibleCount) : archiveCards;
  const hasMoreArchiveCards = isFullArchiveOpen && archiveVisibleCount < archiveCards.length;
  const archiveBatches = isFullArchiveOpen
    ? Array.from({ length: Math.ceil(visibleArchiveCards.length / ARCHIVE_BATCH_SIZE) }, (_, batchIndex) =>
        visibleArchiveCards.slice(batchIndex * ARCHIVE_BATCH_SIZE, (batchIndex + 1) * ARCHIVE_BATCH_SIZE)
      )
    : [visibleArchiveCards];

  useEffect(() => {
    if (isFullArchiveOpen) {
      setArchiveVisibleCount(Math.min(ARCHIVE_BATCH_SIZE, archiveCards.length));
      return;
    }

    setArchiveVisibleCount(0);
  }, [archiveCards.length, isFullArchiveOpen]);

  useEffect(() => {
    if (!isFullArchiveOpen || archiveVisibleCount >= archiveCards.length) return;

    const target = archiveLoadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setArchiveVisibleCount((current) => Math.min(current + ARCHIVE_BATCH_SIZE, archiveCards.length));
      },
      { rootMargin: '480px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [archiveCards.length, archiveVisibleCount, isFullArchiveOpen]);

  const imageViewerOverlay = (
    <AnimatePresence>
      {imageViewer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6"
          onClick={() => setImageViewer(null)}
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            className="relative max-w-[92vw] max-h-[92vh] w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImageViewer(null)}
              className="absolute top-0 right-0 z-10 rounded-sm border border-cyan-500/30 bg-black/70 p-2 text-cyan-400 transition-colors hover:text-cyan-200"
            >
              <X size={20} />
            </button>
            <div className="w-full pt-12 text-center font-mono text-xs tracking-[0.25em] text-cyan-400/80">
              {imageViewer.title}
            </div>
            <img
              src={imageViewer.src}
              alt={imageViewer.alt}
              decoding="async"
              className="max-w-full max-h-[78vh] object-contain border border-cyan-500/30 bg-black shadow-[0_0_40px_rgba(34,211,238,0.12)]"
            />
            <div className="font-mono text-[11px] tracking-[0.18em] text-cyan-600/70">
              {imageViewer.cardId}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (catalogLoadError) {
    return (
      <div className="min-h-screen bg-cyber-abyss relative overflow-hidden">
        <style>{customStyles}</style>
        <div aria-hidden className="cyber-backdrop" />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
          <div className="max-w-xl border border-red-500/40 bg-black/80 p-8 text-center font-mono text-sm text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.18)]">
            资源目录加载失败，请刷新后重试。
          </div>
        </div>
      </div>
    );
  }

  if (isCatalogLoading && cardsCatalog.length === 0) {
    return (
      <div className="min-h-screen bg-cyber-abyss relative overflow-hidden">
        <style>{customStyles}</style>
        <div aria-hidden className="cyber-backdrop" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 p-8">
          <Cpu size={40} className="animate-pulse text-cyan-400" />
          <div className="font-mono text-sm tracking-[0.3em] text-cyan-300">LOADING_CARD_ARCHIVE</div>
          <div className="font-mono text-xs tracking-[0.18em] text-cyan-600">正在载入卡片索引与远端图像目录…</div>
        </div>
      </div>
    );
  }

  // --- 终局界面：归档展示 ---
  if (isArchiveView) {
    return (
      <>
        <div className="min-h-screen bg-cyber-abyss overflow-y-auto relative selection:bg-cyan-500/30">
          <style>{customStyles}</style>
          <div aria-hidden className="cyber-backdrop" />

          {!isArchiveComplete && (
            <div className="fixed right-6 top-6 z-20">
              <button
                onClick={() => {
                  if (isFullArchiveOpen) {
                    setArchiveSearchQuery('');
                    setIsFullArchiveOpen(false);
                    return;
                  }

                  setIsArchivePreviewOpen(false);
                }}
                className="inline-flex items-center justify-center gap-3 rounded-sm border border-cyan-500/40 bg-black/75 px-5 py-3 font-mono text-xs font-medium tracking-[0.18em] text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.12)] backdrop-blur-md transition-all duration-300 hover:bg-cyan-500/10"
              >
                返回继续选择
              </button>
            </div>
          )}
          
          <div className="relative z-10 p-12 flex flex-col items-center min-h-screen">
            <div className="mt-12 flex flex-col items-center">
              <Cpu size={48} className="text-cyan-400 mb-6 animate-pulse" />
              <h1 className="font-mono text-cyan-300 text-3xl tracking-[0.6em] mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                {archiveTitle}
              </h1>
              <p className="font-mono text-cyan-500/50 text-sm mb-16 tracking-widest">
                {archiveSummary}
              </p>
            </div>

            {isFullArchiveOpen && (
              <div className="mb-10 flex w-full max-w-3xl flex-col gap-3">
                <div className="font-mono text-[10px] tracking-[0.25em] text-cyan-500/70">
                  PROMPT_ID_SEARCH
                </div>
                <div className="flex items-center gap-3 rounded-sm border border-cyan-500/30 bg-black/70 px-4 py-3 shadow-[0_0_24px_rgba(34,211,238,0.08)] backdrop-blur-sm">
                  <Search size={16} className="shrink-0 text-cyan-400" />
                  <input
                    type="text"
                    value={archiveSearchQuery}
                    onChange={(event) => setArchiveSearchQuery(event.target.value)}
                    placeholder="输入 PROMPT_ID 关键词，例如：终端 / 海港 / 研究所"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent font-mono text-sm text-cyan-100 outline-none placeholder:text-cyan-700/80"
                  />
                  {archiveSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setArchiveSearchQuery('')}
                      className="shrink-0 border border-cyan-500/30 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-cyan-300 transition-colors hover:border-cyan-400 hover:text-cyan-100"
                    >
                      清空
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="w-full max-w-[90rem] mb-10 flex flex-col gap-6">
              {archiveCards.length === 0 ? (
                <div className="flex min-h-[18rem] items-center justify-center rounded-sm border border-cyan-900/50 bg-black/70 px-8 text-center shadow-[0_0_24px_rgba(34,211,238,0.06)]">
                  <div className="font-mono text-sm tracking-[0.18em] text-cyan-500/80">
                    未找到匹配的 PROMPT_ID 关键词，请更换搜索词后重试。
                  </div>
                </div>
              ) : (
                archiveBatches.map((batch, batchIndex) => (
                  <div
                    key={`archive-batch-${batchIndex}`}
                    className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full"
                  >
                    {batch.map((card, idx) => (
                      <motion.div 
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{
                          delay: isFullArchiveOpen ? idx * 0.03 : idx * 0.1,
                          type: "spring",
                          stiffness: 100
                        }}
                        className="break-inside-avoid bg-black border border-cyan-900/50 rounded-sm overflow-hidden group hover:border-cyan-400 transition-colors duration-300 relative"
                      >
                        {/* 扫描线扫过动画 */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                        
                        <button
                          type="button"
                          onClick={() => openImageViewer(card, 'ARCHIVE_IMAGE_VIEW')}
                          className="relative block w-full cursor-zoom-in appearance-none border-0 bg-transparent p-0 text-left"
                        >
                          <img
                            src={card.imageUrl}
                            alt="Archived"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto opacity-80 transition-opacity group-hover:opacity-100"
                          />
                          <div className="absolute left-2 bottom-2 bg-black/75 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-cyan-300/80">
                            点击放大
                          </div>
                          <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 border border-cyan-500/30 font-mono text-[10px] text-cyan-400">
                            {card.id}
                          </div>
                        </button>
                        <div className="border-t border-cyan-900/50 bg-black p-4">
                          {isFullArchiveOpen && (
                            <div className="mb-3 border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 font-mono text-[10px] tracking-[0.18em] text-cyan-300/90">
                              PROMPT_ID: {extractPromptId(card.prompt) || 'UNKNOWN'}
                            </div>
                          )}
                          <pre className="font-mono text-[10px] text-cyan-600/80 whitespace-pre-wrap group-hover:text-cyan-300 transition-colors">
                            {card.prompt}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {isFullArchiveOpen && archiveCards.length > 0 && (
              <div className="mb-16 flex w-full max-w-[90rem] flex-col items-center gap-3">
                {hasMoreArchiveCards ? (
                  <>
                    <div ref={archiveLoadMoreRef} className="h-4 w-full" />
                    <div className="font-mono text-[10px] tracking-[0.25em] text-cyan-500/70">
                      向下滚动继续加载 · {visibleArchiveCards.length} / {archiveCards.length}
                    </div>
                  </>
                ) : (
                  <div className="font-mono text-[10px] tracking-[0.25em] text-cyan-500/70">
                    全部卡牌已加载 · {archiveCards.length} / {archiveCards.length}
                  </div>
                )}
              </div>
            )}

            <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={startSession}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-mono text-sm font-medium text-black bg-cyan-500 rounded-sm hover:bg-cyan-400 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                <RefreshCw size={18} className="group-hover:rotate-180 transition-all duration-700 ease-in-out" /> 
                重新开始系统循环
              </button>
            </div>
          </div>
        </div>
        {imageViewerOverlay}
      </>
    );
  }

  // --- 主游戏界面 ---
  return (
    <div className="h-screen w-full bg-cyber-abyss text-cyan-50 overflow-hidden font-sans select-none relative">
      <style>{customStyles}</style>
      <div aria-hidden className="cyber-backdrop" />
      
      <div className="relative z-10 flex h-full w-full">
        {/* 左侧：操作与对决区 */}
        <div className="flex-1 flex flex-col relative">
          
          {/* 顶部 HUD 状态栏 */}
          <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-10 border-b border-cyan-900/50 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Terminal size={16} className="text-cyan-500" />
              <span className="font-mono text-xs tracking-[0.2em] text-cyan-400">UPLINK_ESTABLISHED</span>
            </div>
            <div className="relative font-mono text-xs tracking-widest text-white/40 flex items-center gap-3">
              <span>SYS_POOL:</span>
              <span className="text-cyan-400 font-bold">{pool.length}</span>
              <div className="flex gap-[2px] ml-2">
                {/* 动态卡池进度条 */}
                {Array.from({ length: Math.min(20, pool.length) }).map((_, i) => (
                  <div key={i} className="w-1.5 h-3 bg-cyan-500" />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsArchivePreviewOpen(false);
                  setIsFullArchiveOpen(true);
                  setArchiveSearchQuery('');
                  setImageViewer(null);
                  setViewingCard(null);
                  setHoveredDeckCardId(null);
                }}
                className="absolute inset-0 cursor-pointer appearance-none border-0 bg-transparent p-0"
                aria-label="查看全部卡牌归档"
                title="查看全部卡牌归档"
              />
            </div>
          </div>

          {/* 中心对战区 */}
          <div className="flex-1 w-full flex items-center justify-center relative mt-12">
            <AnimatePresence mode="wait">
              {battle && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  className="flex flex-col items-center gap-8 w-full max-w-6xl px-8"
                >
                  <div className="flex w-full justify-between items-center gap-8 relative">
                    
                    {/* 左侧：你的卡牌 */}
                    <motion.div layoutId={getLayoutId(battle.player.id)} className="flex-1 h-[28rem] bg-black border border-cyan-500/30 rounded-sm overflow-hidden flex shadow-[0_0_30px_rgba(0,255,255,0.1)] relative group">
                      <button
                        type="button"
                        disabled={!battle.revealed}
                        onClick={() => battle.revealed && openImageViewer(battle.player, 'PLAYER_CARD_IMAGE')}
                        className={`w-1/2 h-full relative appearance-none border-0 bg-transparent p-0 text-left ${battle.revealed ? 'cursor-zoom-in' : 'cursor-default'}`}
                      >
                        <img src={battle.player.imageUrl} decoding="async" className="w-full h-full object-cover" alt="Player" />
                        <div className="absolute inset-0 border-r border-cyan-500/30" />
                        {battle.revealed && (
                          <div className="absolute left-3 bottom-3 bg-black/70 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-cyan-300/80">
                            点击放大
                          </div>
                        )}
                      </button>
                      <div className="w-1/2 p-6 relative bg-black">
                        {!battle.revealed ? (
                          <div className="h-full flex flex-col items-center justify-center text-cyan-500/50 animate-pulse">
                            <Cpu size={32} className="mb-4" />
                            <span className="font-mono text-xs tracking-widest">ANALYZING_ASSET...</span>
                          </div>
                        ) : (
                          <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[11px] leading-relaxed text-cyan-300/80 whitespace-pre-wrap h-full overflow-y-auto custom-scrollbar">
                            <span className="text-cyan-500 block mb-4 border-b border-cyan-900 pb-2">[{battle.player.id}]</span>
                            {battle.player.prompt}
                          </motion.pre>
                        )}
                      </div>
                    </motion.div>

                    <div className="flex flex-col items-center gap-2 shrink-0 z-10">
                      <Crosshair size={32} className="text-red-500/50 animate-[spin_4s_linear_infinite]" />
                      <div className="font-mono text-red-500/80 text-xl tracking-[0.5em] drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">VS</div>
                    </div>

                    {/* 右侧：系统出牌 */}
                    <motion.div layoutId={getLayoutId(battle.opponent.id)} className="flex-1 h-[28rem] bg-black border border-red-500/30 rounded-sm overflow-hidden flex flex-row-reverse shadow-[0_0_30px_rgba(255,0,0,0.05)]">
                      <button
                        type="button"
                        disabled={!battle.revealed}
                        onClick={() => battle.revealed && openImageViewer(battle.opponent, 'OPPONENT_CARD_IMAGE')}
                        className={`w-1/2 h-full relative appearance-none border-0 bg-transparent p-0 text-left ${battle.revealed ? 'cursor-zoom-in' : 'cursor-default'}`}
                      >
                        <img src={battle.opponent.imageUrl} decoding="async" className={`w-full h-full object-cover transition-all duration-700 ${!battle.revealed ? 'grayscale blur-md' : 'grayscale-0 blur-0'}`} alt="Opponent" />
                        <div className="absolute inset-0 border-l border-red-500/30" />
                        {battle.revealed && (
                          <div className="absolute left-3 bottom-3 bg-black/70 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-red-300/80">
                            点击放大
                          </div>
                        )}
                      </button>
                      <div className="w-1/2 p-6 relative bg-black">
                        {!battle.revealed ? (
                          <div className="h-full flex flex-col items-center justify-center text-red-500/50 animate-pulse">
                            <Database size={32} className="mb-4" />
                            <span className="font-mono text-xs tracking-widest">DECRYPTING_TARGET...</span>
                          </div>
                        ) : (
                          <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[11px] leading-relaxed text-red-300/80 whitespace-pre-wrap h-full overflow-y-auto custom-scrollbar">
                             <span className="text-red-500 block mb-4 border-b border-red-900 pb-2">[{battle.opponent.id}]</span>
                            {battle.opponent.prompt}
                          </motion.pre>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* 决策按钮 */}
                  <AnimatePresence>
                    {battle.revealed && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-16 z-20 mt-4">
                        <button onClick={() => resolveBattle('player')} className="px-10 py-3 border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 font-mono text-xs tracking-widest transition-all rounded-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                          ◀ 选左侧 (SECURE_OWN)
                        </button>
                        <button onClick={() => resolveBattle('opponent')} className="px-10 py-3 border border-red-500/50 hover:bg-red-500/10 text-red-400 font-mono text-xs tracking-widest transition-all rounded-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                          选右侧 (ASSIMILATE) ▶
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 底部手牌区 */}
          <div className={`h-72 w-full flex flex-col items-center justify-end pb-8 transition-all duration-700 z-10 ${battle ? 'opacity-10 pointer-events-none translate-y-20' : 'opacity-100 translate-y-0'}`}>
            <div className="font-mono text-[10px] text-cyan-600 tracking-[0.3em] mb-4 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-cyan-900" />
              AVAILABLE_INPUTS
              <span className="h-[1px] w-12 bg-cyan-900" />
            </div>
            <div className="flex gap-8 px-8">
              <AnimatePresence>
                {hand.map((card) => (
                  <motion.div
                    key={card.id}
                    layoutId={getLayoutId(card.id)}
                    onClick={() => playCard(card)}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -20, scale: 1.05 }}
                    className="w-44 h-64 cursor-pointer rounded-sm overflow-hidden border border-cyan-900 bg-black relative group shadow-2xl"
                  >
                    <img src={card.imageUrl} decoding="async" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale-[0.3] group-hover:grayscale-0" alt="Hand Card" />
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 transition-colors duration-300 z-10" />
                    {/* 卡牌伪UI标识 */}
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 to-transparent">
                       <span className="font-mono text-[8px] text-cyan-400/70">{card.id}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 右侧：卡盒收纳区 (Deck Box) */}
        <div className="w-56 border-l border-cyan-900/50 bg-black/80 backdrop-blur-md relative flex flex-col items-center px-3 pt-6 pb-6 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-20">
          <div className="font-mono text-xs tracking-[0.2em] text-cyan-500 flex flex-col items-center gap-2 mb-8 w-full border-b border-cyan-900/50 pb-4">
            <Database size={18} />
            <span>DECK</span>
            <span className="text-white/80">{deck.length} <span className="text-cyan-800">/ 10</span></span>
            <button
              type="button"
              onClick={() => {
                setIsArchivePreviewOpen(true);
                setViewingCard(null);
                setHoveredDeckCardId(null);
              }}
              disabled={deck.length === 0}
              className={`mt-2 w-full px-3 py-2 border rounded-sm text-[10px] tracking-[0.2em] transition-all duration-300 ${
                deck.length === 0
                  ? 'cursor-not-allowed border-cyan-950 text-cyan-900 bg-black/40'
                  : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:text-cyan-100 hover:shadow-[0_0_18px_rgba(34,211,238,0.18)]'
              }`}
            >
              预览归档
            </button>
          </div>
          
          {/* 卡片物理堆叠区 */}
          <div className="absolute bottom-8 w-44 h-[450px]">
            {deck.map((card, idx) => {
              const isHovered = hoveredDeckCardId === card.id;

              return (
                <motion.div
                  key={card.id}
                  layoutId={getLayoutId(card.id)}
                  onClick={() => setViewingCard(card)}
                  onHoverStart={() => setHoveredDeckCardId(card.id)}
                  onHoverEnd={() => setHoveredDeckCardId((current) => (current === card.id ? null : current))}
                  className={`absolute right-0 w-44 h-16 border-t border-l bg-black rounded-tl-md overflow-hidden cursor-pointer transition-all duration-300 ${
                    isHovered
                      ? 'border-cyan-400 shadow-[0_-5px_20px_rgba(34,211,238,0.4)]'
                      : 'border-cyan-900/50 shadow-lg'
                  }`}
                  style={{ bottom: idx * 40, zIndex: isHovered ? deck.length + 10 : idx }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0, y: isHovered ? -8 : 0, scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={card.imageUrl}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isHovered ? 'opacity-100 saturate-150 brightness-110' : 'opacity-40 grayscale-[0.5]'
                    }`}
                    alt="Stacked"
                  />
                  {isHovered && <div className="absolute inset-y-0 left-0 w-1.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />}
                  
                  {/* 卡片侧边栏标签 */}
                  <div className={`absolute inset-0 px-3 py-1 transition-all duration-300 flex items-start justify-end ${
                      isHovered ? 'bg-gradient-to-r from-transparent via-black/40 to-black/90' : 'bg-black/60'
                    }`}
                  >
                     <span className={`font-mono text-[9px] font-bold tracking-wider transition-colors duration-200 ${isHovered ? 'text-cyan-300' : 'text-cyan-800'}`}>
                       {String(idx + 1).padStart(2, '0')}
                     </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 查看详情模态框 */}
      <AnimatePresence>
        {viewingCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-lg"
            onClick={() => setViewingCard(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-5xl w-full bg-[#030508] border border-cyan-500/40 rounded-sm overflow-hidden flex shadow-[0_0_50px_rgba(0,255,255,0.15)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 边框角部修饰 */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-10" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-10" />

              <button 
                onClick={() => setViewingCard(null)}
                className="absolute top-4 right-4 text-cyan-500/50 hover:text-cyan-300 hover:rotate-90 transition-all z-20 p-2 bg-black/50 rounded-sm"
              >
                <X size={20} />
              </button>

              <button
                type="button"
                onClick={() => openImageViewer(viewingCard, 'DECK_CARD_IMAGE')}
                className="w-[55%] h-[75vh] relative cursor-zoom-in appearance-none border-0 bg-transparent p-0 text-left"
              >
                <img src={viewingCard.imageUrl} decoding="async" className="w-full h-full object-cover" alt="Detail" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#030508]" />
                <div className="absolute left-4 bottom-4 z-10 bg-black/70 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-cyan-300 transition-colors hover:text-cyan-100">
                  点击放大
                </div>
              </button>
              <div className="w-[45%] p-10 flex flex-col relative z-10">
                <div className="flex items-center gap-3 mb-8 border-b border-cyan-900/50 pb-4">
                  <Database size={20} className="text-cyan-500" />
                  <h3 className="font-mono text-sm tracking-[0.3em] text-cyan-400 uppercase">ASSET_DATA_STREAM</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                  <div className="mb-6 font-mono text-xs text-white/40 flex justify-between">
                    <span>ID: {viewingCard.id}</span>
                    <span className="text-cyan-600">STATUS: VERIFIED</span>
                  </div>
                  <pre className="font-mono text-sm text-cyan-100/80 leading-loose whitespace-pre-wrap break-words">
                    {viewingCard.prompt}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {imageViewerOverlay}

    </div>
  );
}

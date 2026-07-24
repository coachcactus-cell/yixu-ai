"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_STEP,
  COLOR_PRIMARY,
  INCENSE_NAMES,
  CHARACTER_POOL,
  IncenseItem,
  Grid,
  Piece,
} from "@/data/incenseGame";

const LOCAL_STORAGE_KEY = "pinxiang_high_score";

export default function PinXiangGame() {
  const [grid, setGrid] = useState<Grid>(() =>
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null))
  );

  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // 彈窗與提示 State
  const [activeCard, setActiveCard] = useState<IncenseItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 引用用作遊戲循環無閉包舊值問題
  const gridRef = useRef<Grid>(grid);
  gridRef.current = grid;

  const currentPieceRef = useRef<Piece | null>(currentPiece);
  currentPieceRef.current = currentPiece;

  const gameOverRef = useRef<boolean>(gameOver);
  gameOverRef.current = gameOver;

  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const gameStartedRef = useRef<boolean>(gameStarted);
  gameStartedRef.current = gameStarted;

  const scoreRef = useRef<number>(score);
  scoreRef.current = score;

  const lastDropTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // 讀取最高分
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch {
      // safe fallback for SSR / disabled storage
    }
  }, []);

  // 隨機獲取一個字
  const getRandomChar = useCallback((): string => {
    const index = Math.floor(Math.random() * CHARACTER_POOL.length);
    return CHARACTER_POOL[index];
  }, []);

  // 生成新方塊
  const createNewPiece = useCallback((): Piece => {
    return {
      x: Math.floor(GRID_WIDTH / 2) - 1,
      y: 0,
      char: getRandomChar(),
      color: COLOR_PRIMARY,
    };
  }, [getRandomChar]);

  // 碰撞檢測
  const checkCollision = useCallback((p: Piece, g: Grid, offsetX = 0, offsetY = 0): boolean => {
    const newX = p.x + offsetX;
    const newY = p.y + offsetY;

    if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
      return true;
    }

    if (newY >= 0 && g[newY][newX] !== null) {
      return true;
    }

    return false;
  }, []);

  // 顯示提示訊息 (半拼成功等)
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  }, []);

  // 顯示香品知識卡 (3秒後自動關閉)
  const triggerKnowledgeCard = useCallback((item: IncenseItem) => {
    setActiveCard(item);
    const timer = setTimeout(() => {
      setActiveCard(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 檢測消除與香名拼合
  const checkAndClearLines = useCallback(
    (currentGrid: Grid) => {
      const newGrid = currentGrid.map((row) => [...row]);
      let linesCleared = 0;
      let addedScore = 0;
      let matchedCard: IncenseItem | null = null;
      let halfMatchName: string | null = null;

      for (let r = GRID_HEIGHT - 1; r >= 0; r--) {
        const isFull = newGrid[r].every((cell) => cell !== null);
        if (isFull) {
          linesCleared++;
          const rowText = newGrid[r].map((cell) => cell?.char || "").join("");

          let lineMatched = false;

          // 1. 檢查是否有完全匹配或完全包含的香名
          for (const incense of INCENSE_NAMES) {
            if (rowText === incense.name) {
              // 完全匹配
              addedScore += 20;
              matchedCard = incense;
              lineMatched = true;
              break;
            } else if (rowText.includes(incense.name)) {
              // 半拼成功 (包含子串)
              addedScore += 10;
              halfMatchName = incense.name;
              lineMatched = true;
              break;
            }
          }

          // 2. 若無匹配香名，則為普通消除
          if (!lineMatched) {
            addedScore += 1;
          }

          // 移除該行
          newGrid.splice(r, 1);
          // 頂部補一行空行
          newGrid.unshift(Array(GRID_WIDTH).fill(null));
          r++; // 重新檢測當前索引
        }
      }

      if (linesCleared > 0) {
        setGrid(newGrid);
        gridRef.current = newGrid;

        const newScore = scoreRef.current + addedScore;
        setScore(newScore);
        scoreRef.current = newScore;

        // 更新最高分
        setHighScore((prev) => {
          if (newScore > prev) {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, newScore.toString());
            } catch {
              // ignore
            }
            return newScore;
          }
          return prev;
        });

        // 升級機制
        setLevel(Math.floor(newScore / 50) + 1);

        // 觸發對應提示/卡片
        if (matchedCard) {
          triggerKnowledgeCard(matchedCard);
        } else if (halfMatchName) {
          showToast(`半拼成功！拼出「${halfMatchName}」+10分`);
        } else {
          showToast(`普通消除 +${linesCleared}分`);
        }
      }
    },
    [showToast, triggerKnowledgeCard]
  );

  // 方塊固定至網格
  const lockPiece = useCallback(
    (p: Piece) => {
      const newGrid = gridRef.current.map((row) => [...row]);

      if (p.y < 0) {
        // 觸頂 Game Over
        setGameOver(true);
        return;
      }

      newGrid[p.y][p.x] = { char: p.char, color: p.color };
      setGrid(newGrid);
      gridRef.current = newGrid;

      // 檢查消除
      checkAndClearLines(newGrid);

      // 生成下一個方塊
      const next = createNewPiece();
      if (checkCollision(next, newGrid)) {
        setGameOver(true);
      } else {
        setCurrentPiece(next);
      }
    },
    [checkAndClearLines, createNewPiece, checkCollision]
  );

  // 下落一步
  const dropPiece = useCallback(() => {
    const p = currentPieceRef.current;
    const g = gridRef.current;

    if (!p || gameOverRef.current || isPausedRef.current) return;

    if (!checkCollision(p, g, 0, 1)) {
      setCurrentPiece({ ...p, y: p.y + 1 });
    } else {
      lockPiece(p);
    }
  }, [checkCollision, lockPiece]);

  // 控制操作
  const moveLeft = useCallback(() => {
    const p = currentPieceRef.current;
    const g = gridRef.current;
    if (!p || gameOverRef.current || isPausedRef.current) return;
    if (!checkCollision(p, g, -1, 0)) {
      setCurrentPiece({ ...p, x: p.x - 1 });
    }
  }, [checkCollision]);

  const moveRight = useCallback(() => {
    const p = currentPieceRef.current;
    const g = gridRef.current;
    if (!p || gameOverRef.current || isPausedRef.current) return;
    if (!checkCollision(p, g, 1, 0)) {
      setCurrentPiece({ ...p, x: p.x + 1 });
    }
  }, [checkCollision]);

  // 輪換下落方塊的中文字
  const rotateChar = useCallback(() => {
    const p = currentPieceRef.current;
    if (!p || gameOverRef.current || isPausedRef.current) return;
    let nextChar = getRandomChar();
    while (nextChar === p.char && CHARACTER_POOL.length > 1) {
      nextChar = getRandomChar();
    }
    setCurrentPiece({ ...p, char: nextChar });
  }, [getRandomChar]);

  const moveDown = useCallback(() => {
    dropPiece();
  }, [dropPiece]);

  // 遊戲核心 Loop
  const gameLoop = useCallback(
    (time: number) => {
      if (gameStartedRef.current && !gameOverRef.current && !isPausedRef.current) {
        const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (level - 1) * SPEED_STEP);
        if (time - lastDropTimeRef.current > currentSpeed) {
          dropPiece();
          lastDropTimeRef.current = time;
        }
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [dropPiece, level]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  // 開始 / 重新開始遊戲
  const startGame = () => {
    const emptyGrid: Grid = Array.from({ length: GRID_HEIGHT }, () =>
      Array(GRID_WIDTH).fill(null)
    );
    setGrid(emptyGrid);
    gridRef.current = emptyGrid;

    setScore(0);
    scoreRef.current = 0;
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setActiveCard(null);
    setToastMessage(null);

    const firstPiece = createNewPiece();
    setCurrentPiece(firstPiece);
  };

  // 鍵盤監聽
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || isPaused) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotateChar();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case " ":
          e.preventDefault();
          // 硬下落 (Fast drop to bottom)
          let p = currentPieceRef.current;
          const g = gridRef.current;
          if (p) {
            let dropDist = 0;
            while (!checkCollision(p, g, 0, dropDist + 1)) {
              dropDist++;
            }
            if (dropDist > 0) {
              lockPiece({ ...p, y: p.y + dropDist });
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, isPaused, moveLeft, moveRight, rotateChar, moveDown, checkCollision, lockPiece]);

  // 手勢觸控滑動處理
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || isPaused) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    // 滑動判定閾值
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        if (dy > 0) moveDown();
      }
    } else {
      // 點擊 -> 變換字
      rotateChar();
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto min-h-screen bg-[#fafafa] flex flex-col justify-between text-slate-800 selection:bg-[#c9a84c]/20">
      {/* 頂部 Banner */}
      <header className="bg-gradient-to-r from-neutral-900 via-stone-800 to-neutral-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-[#c9a84c] text-neutral-900 font-bold px-2 py-0.5 rounded text-xs">
            香舖
          </span>
          <h1 className="text-lg font-bold font-song tracking-widest text-[#c9a84c]">
            拼香
          </h1>
        </div>
        {gameStarted && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-2 py-1 rounded transition"
          >
            {isPaused ? "继续" : "暂停"}
          </button>
        )}
      </header>

      {/* 遊戲數據儀表板 */}
      <div className="px-4 py-2 bg-white border-b border-stone-200 flex items-center justify-between text-sm">
        <div>
          <span className="text-stone-500 text-xs block">当前得分</span>
          <span className="text-lg font-bold text-[#c9a84c]">{score}</span>
        </div>
        <div className="text-center">
          <span className="text-stone-500 text-xs block">关卡</span>
          <span className="text-base font-semibold text-stone-700">{level}</span>
        </div>
        <div className="text-right">
          <span className="text-stone-500 text-xs block">历史最高</span>
          <span className="text-base font-semibold text-slate-500">{highScore}</span>
        </div>
      </div>

      {/* 遊戲主要網格區域 */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-2">
        {/* 中央提示 Toast */}
        {toastMessage && (
          <div className="absolute top-4 z-20 bg-stone-900/90 text-[#c9a84c] border border-[#c9a84c]/40 text-xs px-3 py-1.5 rounded-full shadow-lg transition-all animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* 網格容器 */}
        <div
          className="relative bg-[#1a1a1a] rounded-lg p-1 border-2 border-[#c9a84c]/30 shadow-inner touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`,
            gap: "2px",
            width: "100%",
            maxWidth: "320px",
            aspectRatio: "1 / 2",
          }}
        >
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              // 檢查是否為當前下落方塊
              const isCurrent =
                currentPiece &&
                currentPiece.x === cIdx &&
                currentPiece.y === rIdx;

              const displayChar = isCurrent
                ? currentPiece.char
                : cell
                ? cell.char
                : "";

              const isFilled = isCurrent || cell !== null;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`flex items-center justify-center rounded-sm text-sm font-bold select-none transition-colors duration-75 ${
                    isFilled
                      ? "bg-[#c9a84c] text-white shadow-sm border border-amber-200/30"
                      : "bg-neutral-800/60"
                  }`}
                >
                  {displayChar}
                </div>
              );
            })
          )}

          {/* 未開始遊戲遮罩 */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6 text-center z-10">
              <h2 className="text-2xl font-bold font-song text-[#c9a84c] mb-2">
                拼香小游戏
              </h2>
              <p className="text-stone-300 text-xs leading-relaxed mb-6">
                下落带字方块，当整行填满且能拼成完整香名时即可消除并获高分！
              </p>
              <button
                onClick={startGame}
                className="bg-[#c9a84c] hover:bg-amber-600 active:scale-95 text-neutral-950 font-bold px-6 py-2.5 rounded-full shadow-md transition"
              >
                开始游戏
              </button>
            </div>
          )}

          {/* 暫停遮罩 */}
          {isPaused && (
            <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10">
              <span className="text-white text-lg font-bold mb-4">游戏暂停中</span>
              <button
                onClick={() => setIsPaused(false)}
                className="bg-[#c9a84c] text-neutral-950 px-5 py-2 rounded-full font-bold text-sm"
              >
                继续游戏
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 底部控制按鈕 (手機端友好) */}
      <footer className="p-3 bg-stone-100 border-t border-stone-200">
        <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto">
          <button
            onClick={moveLeft}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-white hover:bg-stone-50 active:bg-stone-200 disabled:opacity-40 text-stone-700 font-bold py-3 rounded-lg border border-stone-300 shadow-sm text-lg flex items-center justify-center"
            aria-label="向左移动"
          >
            ←
          </button>
          <button
            onClick={rotateChar}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 active:bg-[#c9a84c]/30 disabled:opacity-40 text-[#c9a84c] font-bold py-3 rounded-lg border border-[#c9a84c]/40 shadow-sm text-xs flex flex-col items-center justify-center"
            aria-label="旋转换字"
          >
            <span className="text-base leading-none mb-0.5">↺</span>
            <span>换字</span>
          </button>
          <button
            onClick={moveRight}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-white hover:bg-stone-50 active:bg-stone-200 disabled:opacity-40 text-stone-700 font-bold py-3 rounded-lg border border-stone-300 shadow-sm text-lg flex items-center justify-center"
            aria-label="向右移动"
          >
            →
          </button>
          <button
            onClick={moveDown}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-white hover:bg-stone-50 active:bg-stone-200 disabled:opacity-40 text-stone-700 font-bold py-3 rounded-lg border border-stone-300 shadow-sm text-lg flex items-center justify-center"
            aria-label="加速下落"
          >
            ↓
          </button>
        </div>
      </footer>

      {/* Game Over 彈窗 */}
      {gameOver && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-xl max-w-xs w-full p-6 text-center shadow-2xl border border-stone-200 transition-all">
            <h3 className="text-xl font-bold font-song text-stone-800 mb-1">
              游戏结束
            </h3>
            <p className="text-stone-500 text-xs mb-4">方块已堆叠至顶部</p>

            <div className="bg-stone-50 rounded-lg p-3 mb-5 border border-stone-100">
              <div className="text-xs text-stone-400 mb-1">本次得分</div>
              <div className="text-3xl font-bold text-[#c9a84c]">{score}</div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-[#c9a84c] hover:bg-amber-600 text-neutral-950 font-bold py-2.5 rounded-lg shadow transition"
            >
              重新开始
            </button>
          </div>
        </div>
      )}

      {/* 香品知識卡彈窗 (3秒自動關閉) */}
      {activeCard && (
        <div className="fixed inset-0 bg-neutral-950/60 flex items-center justify-center p-4 z-50 pointer-events-auto transition-opacity">
          <div className="bg-stone-900 text-white rounded-xl max-w-xs w-full p-5 shadow-2xl border-2 border-[#c9a84c] relative transition-all">
            <div className="absolute top-2 right-2 text-[10px] text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-1.5 py-0.5 rounded">
              拼香成功 +20
            </div>
            <div className="text-xs text-slate-400 font-semibold mb-1">
              ✦ 香品知识卡 ✦
            </div>
            <h3 className="text-xl font-bold font-song text-[#c9a84c] mb-2">
              {activeCard.name}
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed mb-4">
              {activeCard.desc}
            </p>
            <div className="text-[10px] text-stone-500 text-center border-t border-stone-800 pt-2">
              (3秒后自动关闭)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

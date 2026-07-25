"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HelpCircle } from "lucide-react";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_STEP,
  COLOR_PRIMARY,
  INCENSE_NAMES,
  getUnlockedIncense,
  getCharacterPool,
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
  const [totalLinesCleared, setTotalLinesCleared] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // 彈窗與提示 State
  const [activeCard, setActiveCard] = useState<IncenseItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // 特效 State
  const [bingoEffect, setBingoEffect] = useState<{ active: boolean; scoreText: string }>({
    active: false,
    scoreText: "+20",
  });
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Refs 防止閉包陷阱
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

  const levelRef = useRef<number>(level);
  levelRef.current = level;

  const totalLinesClearedRef = useRef<number>(totalLinesCleared);
  totalLinesClearedRef.current = totalLinesCleared;

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
      // safe fallback
    }
  }, []);

  // 隨機獲取當前關卡字池中的字
  const getRandomChar = useCallback((curLevel: number): string => {
    const pool = getCharacterPool(curLevel);
    const index = Math.floor(Math.random() * pool.length);
    return pool[index] || "香";
  }, []);

  // 生成新方塊
  const createNewPiece = useCallback(
    (curLevel: number): Piece => {
      return {
        x: Math.floor(GRID_WIDTH / 2),
        y: 0,
        char: getRandomChar(curLevel),
        color: COLOR_PRIMARY,
      };
    },
    [getRandomChar]
  );

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

  // 顯示提示訊息
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // 顯示香品知識卡
  const triggerKnowledgeCard = useCallback((item: IncenseItem) => {
    setActiveCard(item);
    const timer = setTimeout(() => {
      setActiveCard(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // 觸發 Bingo 喜慶特效
  const triggerBingoAnimation = useCallback((scorePlus: number) => {
    setBingoEffect({ active: true, scoreText: `+${scorePlus}` });
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
    }, 300);

    setTimeout(() => {
      setBingoEffect({ active: false, scoreText: "" });
    }, 800);
  }, []);

  // 檢測消除與香名拼合
  // (逻辑不变)
  const checkAndClearLines = useCallback(
    (currentGrid: Grid) => {
      const newGrid = currentGrid.map((row) => [...row]);
      let linesCleared = 0;
      let addedScore = 0;
      let matchedCard: IncenseItem | null = null;
      let halfMatchName: string | null = null;

      const currentUnlocked = getUnlockedIncense(levelRef.current);

      for (let r = GRID_HEIGHT - 1; r >= 0; r--) {
        const isFull = newGrid[r].every((cell) => cell !== null);
        if (isFull) {
          linesCleared++;
          const rowText = newGrid[r].map((cell) => cell?.char || "").join("");

          let lineMatched = false;

          // 1. 檢測完整香名匹配 (Bingo)
          for (const incense of currentUnlocked) {
            if (rowText.includes(incense.name)) {
              addedScore += 20;
              matchedCard = incense;
              lineMatched = true;
              break;
            }
          }

          // 2. 若無完整匹配，檢測連續 2 字半拼
          if (!lineMatched) {
            for (const incense of currentUnlocked) {
              if (incense.name.length >= 2) {
                for (let i = 0; i <= incense.name.length - 2; i++) {
                  const subStr = incense.name.substring(i, i + 2);
                  if (rowText.includes(subStr)) {
                    addedScore += 10;
                    halfMatchName = incense.name;
                    lineMatched = true;
                    break;
                  }
                }
              }
              if (lineMatched) break;
            }
          }

          // 3. 普通消除
          if (!lineMatched) {
            addedScore += 1;
          }

          // 移除行並補頂部空行
          newGrid.splice(r, 1);
          newGrid.unshift(Array(GRID_WIDTH).fill(null));
          r++; // 重新檢測該列
        }
      }

      if (linesCleared > 0) {
        setGrid(newGrid);
        gridRef.current = newGrid;

        const newTotalLines = totalLinesClearedRef.current + linesCleared;
        setTotalLinesCleared(newTotalLines);
        totalLinesClearedRef.current = newTotalLines;

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

        // 升級機制：每 5 行升 1 級
        const newLevel = Math.floor(newTotalLines / 5) + 1;
        if (newLevel > levelRef.current) {
          setLevel(newLevel);
          levelRef.current = newLevel;

          // 檢測是否有新解鎖香名
          const newlyUnlocked = INCENSE_NAMES.filter((item) => item.unlockLevel === newLevel);
          if (newlyUnlocked.length > 0) {
            const namesStr = newlyUnlocked.map((i) => i.name).join("、");
            showToast(`🎉 升至 Level ${newLevel}！解锁新香名：${namesStr}`);
          }
        }

        // 觸發反饋與動畫
        if (matchedCard) {
          triggerBingoAnimation(20);
          triggerKnowledgeCard(matchedCard);
        } else if (halfMatchName) {
          showToast(`半拼成功！含有「${halfMatchName}」香意 +10分`);
        } else {
          showToast(`普通消除 +${linesCleared}分`);
        }
      }
    },
    [showToast, triggerKnowledgeCard, triggerBingoAnimation]
  );

  // 固定方塊
  const lockPiece = useCallback(
    (p: Piece) => {
      const newGrid = gridRef.current.map((row) => [...row]);

      if (p.y < 0) {
        setGameOver(true);
        return;
      }

      newGrid[p.y][p.x] = { char: p.char, color: p.color };
      setGrid(newGrid);
      gridRef.current = newGrid;

      checkAndClearLines(newGrid);

      const next = createNewPiece(levelRef.current);
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

  // 方向控制
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

  // 輪換字體
  const rotateChar = useCallback(() => {
    const p = currentPieceRef.current;
    if (!p || gameOverRef.current || isPausedRef.current) return;
    const pool = getCharacterPool(levelRef.current);
    let nextChar = getRandomChar(levelRef.current);
    while (nextChar === p.char && pool.length > 1) {
      nextChar = getRandomChar(levelRef.current);
    }
    setCurrentPiece({ ...p, char: nextChar });
  }, [getRandomChar]);

  const moveDown = useCallback(() => {
    dropPiece();
  }, [dropPiece]);

  // 遊戲主循環
  const gameLoop = useCallback(
    (time: number) => {
      if (gameStartedRef.current && !gameOverRef.current && !isPausedRef.current) {
        let currentSpeed = Math.max(
          MIN_SPEED,
          INITIAL_SPEED - (levelRef.current - 1) * SPEED_STEP
        );

        // 新手保護：前 3 行消除前維持初始速度
        if (totalLinesClearedRef.current < 3) {
          currentSpeed = INITIAL_SPEED;
        }

        if (time - lastDropTimeRef.current > currentSpeed) {
          dropPiece();
          lastDropTimeRef.current = time;
        }
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [dropPiece]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  // 開始遊戲
  const startGame = () => {
    const emptyGrid: Grid = Array.from({ length: GRID_HEIGHT }, () =>
      Array(GRID_WIDTH).fill(null)
    );
    setGrid(emptyGrid);
    gridRef.current = emptyGrid;

    setScore(0);
    scoreRef.current = 0;
    setLevel(1);
    levelRef.current = 1;
    setTotalLinesCleared(0);
    totalLinesClearedRef.current = 0;

    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setActiveCard(null);
    setToastMessage(null);

    const firstPiece = createNewPiece(1);
    setCurrentPiece(firstPiece);
  };

  // 鍵盤操作監聽
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

  // 手勢操作
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

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        if (dy > 0) moveDown();
      }
    } else {
      rotateChar();
    }
  };

  return (
    <div className="relative w-full max-w-[400px] mx-auto min-h-screen bg-gradient-to-b from-neutral-950 via-stone-900 to-neutral-950 flex flex-col justify-between text-stone-100 overflow-hidden font-sans">
      {/* 1.2 背景第一層：本地視訊煙氣 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        >
          <source src="/videos/shop/banner-smoke.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-stone-900/50 to-neutral-950/70" />
      </div>

      {/* 1.2 背景第二層：CSS 煙氣飄動粒子 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              bottom: `-80px`,
              background: `radial-gradient(circle, rgba(201,168,76,${
                0.08 - i * 0.008
              }) 0%, transparent 70%)`,
              animation: `smokeRise ${10 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 動畫 keyframes 樣式 */}
      <style>{`
        @keyframes smokeRise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-220px) translateX(25px) scale(1.3); opacity: 0.4; }
          100% { transform: translateY(-450px) translateX(-15px) scale(1.6); opacity: 0; }
        }
        @keyframes particleBurst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>

      {/* 頂部 Header */}
      <header className="relative z-10 bg-neutral-950/80 backdrop-blur-sm px-4 py-3 border-b border-stone-800/60 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <span className="bg-[#c9a84c] text-neutral-950 font-bold px-2 py-0.5 rounded text-xs">
            香舖
          </span>
          <h1 className="text-lg font-bold font-song tracking-widest text-[#c9a84c]">
            拼香
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="p-1 text-stone-400 hover:text-[#c9a84c] transition"
            aria-label="查看规则"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {gameStarted && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs bg-stone-800 hover:bg-stone-700 border border-stone-600/50 px-2.5 py-1 rounded text-stone-200 transition"
            >
              {isPaused ? "继续" : "暂停"}
            </button>
          )}
        </div>
      </header>

      {/* 遊戲數據儀表板 */}
      <div className="relative z-10 px-4 py-2 bg-stone-900/60 backdrop-blur-sm border-b border-stone-800/40 flex items-center justify-between text-sm">
        <div>
          <span className="text-stone-400 text-xs block">当前得分</span>
          <span className="text-xl font-bold text-[#f0d060]">{score}</span>
        </div>
        <div className="text-center">
          <span className="text-stone-400 text-xs block">关卡 (已消除 {totalLinesCleared} 行)</span>
          <span className="text-base font-semibold text-stone-200">Lv. {level}</span>
        </div>
        <div className="text-right">
          <span className="text-stone-400 text-xs block">历史最高</span>
          <span className="text-base font-semibold text-stone-400">{highScore}</span>
        </div>
      </div>

      {/* 主遊戲區域 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-2">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="absolute top-2 z-30 bg-stone-900/90 text-[#f0d060] border border-[#c9a84c]/60 text-xs px-3 py-1.5 rounded-full shadow-lg transition-all animate-bounce text-center max-w-[280px]">
            {toastMessage}
          </div>
        )}

        {/* 5.2 Bingo 喜慶特效 (粒子 + 飄字) */}
        {bingoEffect.active && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
            <div className="relative w-full h-full">
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 70 + Math.random() * 40;
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      background: i % 3 === 0 ? "#f0d060" : i % 3 === 1 ? "#c9a84c" : "#ffffff",
                      animation: `particleBurst 0.8s ease-out forwards`,
                      "--tx": `${Math.cos(angle) * distance}px`,
                      "--ty": `${Math.sin(angle) * distance}px`,
                    } as React.CSSProperties}
                  />
                );
              })}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold text-[#f0d060] drop-shadow-[0_0_10px_rgba(240,208,96,0.8)] animate-bounce">
                {bingoEffect.scoreText} Bingo!
              </div>
            </div>
          </div>
        )}

        {/* 網格容器 */}
        <div
          className={`relative bg-neutral-950/80 rounded-lg p-1 border-2 border-[#c9a84c]/40 shadow-[0_0_20px_rgba(201,168,76,0.15)] touch-none transition-transform ${
            isShaking ? "animate-[shake_0.3s_ease-in-out]" : ""
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`,
            gap: "1px",
            width: "100%",
            aspectRatio: "5 / 8",
            maxWidth: "min(360px, calc((100dvh - 180px) * 5 / 8))",
          }}
        >
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isCurrent =
                currentPiece &&
                currentPiece.x === cIdx &&
                currentPiece.y === rIdx;

              const displayChar = isCurrent
                ? currentPiece.char
                : cell
                ? cell.char
                : "";

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`flex items-center justify-center rounded-sm text-2xl font-bold select-none aspect-square transition-all duration-75 ${
                    isCurrent
                      ? "bg-gradient-to-br from-[#f0d060] to-[#c9a84c] text-white shadow-[0_0_12px_rgba(201,168,76,0.5)] border border-amber-100"
                      : cell
                      ? "bg-gradient-to-br from-[#d4af37] to-[#a88a3e] text-white border border-amber-200/40 drop-shadow-sm"
                      : "bg-neutral-800/40"
                  }`}
                >
                  <span className="drop-shadow-sm">{displayChar}</span>
                </div>
              );
            })
          )}

          {/* 1.3 開始遮罩畫面 */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm rounded-lg flex flex-col items-center justify-between p-5 text-center z-20 overflow-y-auto">
              <div className="mt-2">
                <h2 className="text-2xl font-bold font-song text-[#f0d060] tracking-wider mb-1">
                  拼香小游戏
                </h2>
                <p className="text-[#c9a84c] text-xs font-song italic tracking-widest">
                  「一炉初爇，静心拼香」
                </p>
              </div>

              {/* 2.1 開始畫面遊戲規則 */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-lg p-3 text-left w-full my-2">
                <div className="text-[#c9a84c] font-semibold text-xs mb-1.5 flex items-center">
                  <span>✦ 游戏规则</span>
                </div>
                <ul className="text-stone-300 text-[11px] leading-relaxed space-y-1">
                  <li>• 方块带字落下，点击「换字」可切换字</li>
                  <li>• 填满一整行即可消除得分</li>
                  <li>• 包含完整香名 → <b>拼香成功！+20分</b> + 香卡</li>
                  <li>• 包含香名部分字 → <b>半拼奖励 +10分</b></li>
                  <li>• 普通消除 → <b>+1分</b>，堆到顶则结束</li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-[#c9a84c] to-[#f0d060] hover:brightness-110 active:scale-95 text-neutral-950 font-bold py-2.5 rounded-full shadow-lg transition text-sm mb-1"
              >
                开始游戏
              </button>
            </div>
          )}

          {/* 暫停遮罩 */}
          {isPaused && (
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-20">
              <span className="text-stone-200 text-lg font-bold mb-4">游戏暂停中</span>
              <button
                onClick={() => setIsPaused(false)}
                className="bg-[#c9a84c] text-neutral-950 px-6 py-2 rounded-full font-bold text-sm"
              >
                继续游戏
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 底部控制區域 (深色系) */}
      <footer className="relative z-10 p-3 bg-stone-900/80 backdrop-blur-sm border-t border-stone-800/80">
        <div className="grid grid-cols-4 gap-2 max-w-[340px] mx-auto">
          <button
            onClick={moveLeft}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-stone-800 hover:bg-stone-700 active:bg-stone-600 disabled:opacity-30 text-stone-100 font-bold py-3 rounded-lg border border-stone-700 shadow-sm text-xl flex items-center justify-center transition"
            aria-label="向左移动"
          >
            ←
          </button>
          <button
            onClick={rotateChar}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 active:bg-[#c9a84c]/40 disabled:opacity-30 text-[#f0d060] font-bold py-3 rounded-lg border border-[#c9a84c]/40 shadow-sm text-xs flex flex-col items-center justify-center transition"
            aria-label="旋转换字"
          >
            <span className="text-base leading-none mb-0.5">↺</span>
            <span>换字</span>
          </button>
          <button
            onClick={moveRight}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-stone-800 hover:bg-stone-700 active:bg-stone-600 disabled:opacity-30 text-stone-100 font-bold py-3 rounded-lg border border-stone-700 shadow-sm text-xl flex items-center justify-center transition"
            aria-label="向右移动"
          >
            →
          </button>
          <button
            onClick={moveDown}
            disabled={!gameStarted || gameOver || isPaused}
            className="bg-stone-800 hover:bg-stone-700 active:bg-stone-600 disabled:opacity-30 text-stone-100 font-bold py-3 rounded-lg border border-stone-700 shadow-sm text-xl flex items-center justify-center transition"
            aria-label="加速下落"
          >
            ↓
          </button>
        </div>
      </footer>

      {/* 2.2 獨立規則說明彈窗 */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-[#c9a84c]/50 rounded-xl max-w-xs w-full p-5 text-stone-200 shadow-2xl relative">
            <h3 className="text-lg font-bold font-song text-[#f0d060] mb-3 text-center">
              玩法说明
            </h3>
            <ul className="text-xs text-stone-300 leading-relaxed space-y-2 mb-5">
              <li>• 方块从顶部落下，按底部按键或滑动操作。</li>
              <li>• 点击<b>「换字」</b>可在当前解锁的字池中随机切换。</li>
              <li>• 填满一整行（5格）即可消除。</li>
              <li>• 一行中包含完整香名：<b>+20分</b> 并在卡片中展示香品知识。</li>
              <li>• 一行中包含香名连续2字：<b>+10分</b> 半拼奖励。</li>
              <li>• 普通消除：<b>+1分</b>。每消除 5 行提升 1 级并解锁新香名！</li>
            </ul>
            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full bg-[#c9a84c] hover:bg-amber-600 text-neutral-950 font-bold py-2 rounded-lg text-xs transition"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* Game Over 彈窗 */}
      {gameOver && (
        <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-xs w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold font-song text-[#f0d060] mb-1">
              游戏结束
            </h3>
            <p className="text-stone-400 text-xs mb-4">方块已堆叠至顶部</p>

            <div className="bg-neutral-950/60 rounded-lg p-3 mb-5 border border-stone-800">
              <div className="text-xs text-stone-400 mb-1">本次得分</div>
              <div className="text-3xl font-bold text-[#f0d060]">{score}</div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-[#c9a84c] to-[#f0d060] text-neutral-950 font-bold py-2.5 rounded-lg shadow transition text-sm"
            >
              重新开始
            </button>
          </div>
        </div>
      )}

      {/* 香品知識卡彈窗 */}
      {activeCard && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 text-white rounded-xl max-w-xs w-full p-5 shadow-2xl border-2 border-[#c9a84c] relative">
            <div className="absolute top-2 right-2 text-[10px] text-[#f0d060] bg-[#c9a84c]/20 border border-[#c9a84c]/40 px-1.5 py-0.5 rounded">
              拼香成功 +20
            </div>
            <div className="text-xs text-stone-400 font-semibold mb-1">
              ✦ 香品知识卡 ✦
            </div>
            <h3 className="text-xl font-bold font-song text-[#f0d060] mb-2">
              {activeCard.name}
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed mb-4">
              {activeCard.desc}
            </p>
            <div className="text-[10px] text-stone-500 text-center border-t border-stone-800/80 pt-2">
              (3秒后自动关闭)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

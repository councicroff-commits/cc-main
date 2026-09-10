import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };

const GRID_SIZE = 20;
const BASE_SPEED = 140; 
const REWARD_TIERS = [
  { score: 25, discount: 25, label: 'Initiate', type: 'fixed' },
  { score: 50, discount: 50, label: 'Serpent', type: 'fixed' },
  { score: 100, discount: 100, label: 'Monolith', type: 'fixed' },
];

const MiniGame: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const cartContext = useCart() as any;
  const refreshCoupons = cartContext.refreshCoupons || cartContext.fetchCoupons || (() => {});

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('cc_serpent_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isSwipeMode, setIsSwipeMode] = useState(false);

  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const directionRef = useRef<Direction>('UP');

  const [earnedCode, setEarnedCode] = useState<{
    code: string;
    discount: number;
    label: string;
    type: string;
    expiresAt: string;
  } | null>(null);
  
  const [claimedTiers, setClaimedTiers] = useState<number[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // === ONLY UPDATED PART: full page scroll lock while swipe mode is ON ===
  useEffect(() => {
    if (!isSwipeMode || !isPlaying || isPaused) return;

    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Capture every touchmove at document level (non-passive)
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Extra modern CSS lock
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isSwipeMode, isPlaying, isPaused]);
  // === END OF UPDATED PART ===

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        setIsPaused((p) => !p);
        return;
      }

      const dir = directionRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dir !== 'DOWN') setDirection('UP');
      if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dir !== 'UP') setDirection('DOWN');
      if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dir !== 'RIGHT') setDirection('LEFT');
      if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dir !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isPlaying, isPaused]);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setIsPlaying(false);
    setGameOver(true);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('cc_serpent_highscore', String(finalScore));
    }
  }, [highScore]);

  const handleUnlockReward = useCallback(async (tier: { score: number; discount: number; label: string; type: string }) => {
    setClaimedTiers((prev) => {
      if (prev.includes(tier.score)) return prev;
      return [...prev, tier.score];
    });

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const generatedCode = `CC-${randomNum}`;
    
    // Calculate expiration date exactly 1 week (7 days) from now
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const rewardData = {
      code: generatedCode,
      discount: tier.discount,
      label: tier.label,
      type: tier.type,
      expiresAt: expirationDate.toLocaleDateString(),
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://cc-backend-yc-team.onrender.com/api/v1';
      const userId = isAuthenticated && user ? (user.id || (user as any)._id || 'guest') : 'guest';
      
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

            const response = await fetch(`${apiUrl}/coupons/claim-game-reward`, {
        method: 'POST',
        headers, 
        body: JSON.stringify({
          code: generatedCode,
          discount: tier.discount,
          type: tier.type,
          description: `Mini-Game Reward: ${tier.label}`
        }),
      });

      
      if (!response.ok) {
        throw new Error(`Failed to save coupon to backend: ${response.statusText}`);
      }

      refreshCoupons();
    } catch (err) {
      console.warn('Backend offline or unauthorized – localized coupon generated.', err);
    } finally {
      // Seamlessly updates the code on screen to the higher tier without disrupting gameplay
      setEarnedCode(rewardData);
    }
  }, [isAuthenticated, user, refreshCoupons]);

  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const speed = Math.max(55, BASE_SPEED - Math.floor(score / 4) * 5);

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        if (dir === 'UP') head.y -= 1;
        if (dir === 'DOWN') head.y += 1;
        if (dir === 'LEFT') head.x -= 1;
        if (dir === 'RIGHT') head.x += 1;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          endGame(prevSnake.length - 3);
          return prevSnake;
        }

        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          endGame(prevSnake.length - 3);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          const newScore = prevSnake.length - 2;
          setScore(newScore);

          REWARD_TIERS.forEach((tier) => {
            if (newScore >= tier.score && !claimedTiers.includes(tier.score)) {
              handleUnlockReward(tier);
            }
          });

          // Game no longer ends automatically at 100, allowing players to keep playing indefinitely

          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, food, score, claimedTiers, spawnFood, endGame, handleUnlockReward]);

  const startGame = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDirection('UP');
    directionRef.current = 'UP';
    setScore(0);
    setEarnedCode(null);
    setClaimedTiers([]);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isSwipeMode || !isPlaying || isPaused) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwipeMode || !touchStart.current || !isPlaying || isPaused) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 25) return; 

    const dir = directionRef.current;
    if (absDx > absDy) {
      if (dx > 0 && dir !== 'LEFT') setDirection('RIGHT');
      else if (dx < 0 && dir !== 'RIGHT') setDirection('LEFT');
    } else {
      if (dy > 0 && dir !== 'UP') setDirection('DOWN');
      else if (dy < 0 && dir !== 'DOWN') setDirection('UP');
    }
    touchStart.current = null;
  };

  const copyToClipboard = (codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white text-zinc-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-zinc-900 selection:text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-6 sm:mb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] font-semibold text-zinc-400 mb-1.5">
            Counci Croff Archive Experience
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
            The Monolith Serpent
          </h1>
          <p className="text-zinc-500 text-xs mt-2 max-w-md mx-auto leading-relaxed">
            Reach <strong className="text-black">25 / 50 / 100</strong> points to unlock <strong className="text-black">₱25 / ₱50 / ₱100</strong> fixed discount vouchers.
          </p>
        </div>

        {/* Fixed Height Container to prevent UI jumping / shaking when a reward is earned */}
        <div className="min-h-[170px] mb-6 flex flex-col justify-end w-full">
          {earnedCode ? (
            <div className="bg-zinc-50 border border-emerald-200 p-5 sm:p-6 rounded-2xl shadow-sm text-center transition-all animate-in fade-in duration-500">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-600">
                {earnedCode.label} Achievement Unlocked
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-black mt-2 font-mono tracking-widest">
                {earnedCode.code}
              </h3>
              <p className="text-xs text-zinc-600 mt-1 font-medium">
                ₱{earnedCode.discount} Fixed Amount Discount
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">
                Valid for 1 week (Expires: {earnedCode.expiresAt})
              </p>
              <button
                onClick={() => copyToClipboard(earnedCode.code)}
                className="mt-3 px-5 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-[0.12em] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
              >
                {copyFeedback ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  'Copy Voucher Code'
                )}
              </button>
            </div>
          ) : (
            <div className="h-[140px] flex items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-white">
              <p className="text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-semibold">
                Rewards will appear here
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-zinc-100 font-mono text-[11px] text-zinc-500">
            <span>
              SCORE <strong className="text-black ml-1">{score}</strong>
            </span>
            <span className="hidden xs:inline">
              NEXT TIER <strong className="text-black ml-1">
                {REWARD_TIERS.find((t) => t.score > score)?.score ?? 'MAXED'}
              </strong>
            </span>
            <span>
              HIGH <strong className="text-black ml-1">{highScore}</strong>
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {!isPlaying && !gameOver ? (
              <div className="py-12 sm:py-16 text-center">
                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-5 border border-zinc-200">
                  <svg className="w-7 h-7 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold uppercase tracking-wide text-zinc-900 mb-2">
                  Ready to Enter the Grid?
                </h2>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-8 leading-relaxed">
                  Toggle Use Swipe mode / Circle joystick / Arrow keys · Space or P to pause
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all active:scale-[0.98]"
                >
                  Initiate Sequence
                </button>
              </div>
            ) : gameOver ? (
              <div className="py-12 sm:py-16 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
                  Session Terminated
                </h2>
                <p className="text-zinc-500 text-xs mb-1 font-mono">
                  Final Score: <span className="text-black font-bold">{score}</span>
                </p>
                {score >= 25 && (
                  <p className="text-emerald-600 text-xs mb-6">
                    Reward voucher successfully unlocked! Check above.
                  </p>
                )}
                {score < 25 && (
                  <p className="text-zinc-400 text-xs mb-6">
                    Reach 25 points for your first fixed voucher
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all active:scale-[0.98]"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <>
                <div className="relative w-full max-w-[min(100%,380px)] mx-auto aspect-square bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                    <span className="text-zinc-200/50 font-black text-xl sm:text-2xl tracking-[0.25em] uppercase">
                      Counci Croff
                    </span>
                  </div>

                  <div
                    className="absolute bg-black rounded-full shadow-sm animate-pulse z-10 transition-all duration-75"
                    style={{
                      width: `${100 / GRID_SIZE}%`,
                      height: `${100 / GRID_SIZE}%`,
                      left: `${(food.x / GRID_SIZE) * 100}%`,
                      top: `${(food.y / GRID_SIZE) * 100}%`,
                      transform: 'scale(0.7)',
                    }}
                  />

                  {snake.map((segment, idx) => (
                    <div
                      key={`\( {segment.x}- \){segment.y}-${idx}`}
                      className={`absolute z-10 rounded-[2px] transition-all duration-75 ${
                        idx === 0 ? 'bg-black' : 'bg-zinc-500'
                      }`}
                      style={{
                        width: `${100 / GRID_SIZE}%`,
                        height: `${100 / GRID_SIZE}%`,
                        left: `${(segment.x / GRID_SIZE) * 100}%`,
                        top: `${(segment.y / GRID_SIZE) * 100}%`,
                        transform: 'scale(0.88)',
                      }}
                    />
                  ))}

                  {isPaused && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-800 mb-3">Paused</p>
                        <button
                          onClick={() => setIsPaused(false)}
                          className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setIsPaused((p) => !p)}
                      className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-zinc-700 transition-colors"
                    >
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>

                    <button
                      onClick={() => setIsSwipeMode(!isSwipeMode)}
                      className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all flex items-center gap-2 ${
                        isSwipeMode
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSwipeMode ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'}`} />
                      Use Swipe: {isSwipeMode ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center shadow-inner mx-auto">
                    <div className="w-10 h-10 bg-zinc-200 rounded-full border border-zinc-300 absolute z-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                    </div>

                    <button
                      onClick={() => direction !== 'DOWN' && setDirection('UP')}
                      className="absolute top-1.5 left-1/2 -translate-x-1/2 w-11 h-11 bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-sm transition-transform active:scale-95"
                      aria-label="Up"
                    >
                      ▲
                    </button>

                    <button
                      onClick={() => direction !== 'UP' && setDirection('DOWN')}
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-11 h-11 bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-sm transition-transform active:scale-95"
                      aria-label="Down"
                    >
                      ▼
                    </button>

                    <button
                      onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-sm transition-transform active:scale-95"
                      aria-label="Left"
                    >
                      ◀
                    </button>

                    <button
                      onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-sm transition-transform active:scale-95"
                      aria-label="Right"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-400 mt-6 tracking-wide">
          Counci Croff · Archive Experience · 2026
        </p>
      </div>
    </div>
  );
};

export default MiniGame;
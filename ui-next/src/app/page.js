"use client";

import React, { useState, useEffect, useCallback } from "react";

// Fallback logic to detect port/environment automatically while preserving the original default
const SERVER_URL = typeof window !== "undefined"
  ? (window.location.origin.includes("localhost") ? "http://localhost:8000/api" : "/api")
  : "http://localhost:8000/api";

const BADGE_MAP = {
  FIRST_WON: { name: "🏆 Chiến Thắng Đầu Tiên", className: "bg-yellow-300 text-black border-black" },
  FIRST_ATTEMPT: { name: "🎯 Lần Đầu Chinh Phục", className: "bg-blue-300 text-black border-black" },
  BRONZE_MULTIPLICATOR: { name: "🥉 Cao Thủ Đồng", className: "bg-amber-600 text-white border-black" },
  SILVER_MULTIPLICATOR: { name: "🥈 Cao Thủ Bạc", className: "bg-slate-300 text-black border-black" },
  GOLD_MULTIPLICATOR: { name: "🥇 Cao Thủ Vàng", className: "bg-yellow-400 text-black border-black font-black" },
  LUCKY_NUMBER: { name: "🍀 Con Số May Mắn", className: "bg-green-300 text-black border-black" }
};

export default function Home() {
  // Game States
  const [factorA, setFactorA] = useState(0);
  const [factorB, setFactorB] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [alias, setAlias] = useState("");
  
  // Dynamic Message States
  const [message, setMessage] = useState(null); // { text: "", type: "success" | "danger" | "warning" }
  const [animateMessage, setAnimateMessage] = useState(false);

  // Performance/Section Displays
  const [showStats, setShowStats] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState({ alias: "", score: 0, badges: [] });
  const [history, setHistory] = useState([]);
  
  // Leaderboard States
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Random Challenge
  const fetchChallenge = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/multiplications/random`);
      if (res.ok) {
        const data = await res.json();
        setFactorA(data.factorA);
        setFactorB(data.factorB);
        setAttempt(""); // reset input field
      }
    } catch (err) {
      console.error("Error fetching challenge:", err);
    }
  }, []);

  // 2. Fetch Leaderboard with user alias resolution
  const fetchLeaderboard = useCallback(async () => {
    setIsLeaderboardLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/leaders`);
      if (res.ok) {
        const data = await res.json(); // Array of { userId, totalScore }
        
        // Resolve User ID to Alias for each row
        const resolved = await Promise.all(
          data.map(async (row) => {
            try {
              const uRes = await fetch(`${SERVER_URL}/users/${row.userId}`);
              if (uRes.ok) {
                const user = await uRes.json();
                return { ...row, alias: user.alias };
              }
            } catch (e) {
              console.error(`Error resolving user ${row.userId}:`, e);
            }
            return { ...row, alias: `Player #${row.userId}` };
          })
        );
        setLeaderboard(resolved);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  // 3. Fetch Recent Results for an alias
  const fetchResults = useCallback(async (userAlias) => {
    try {
      const res = await fetch(`${SERVER_URL}/results?alias=${userAlias}`);
      if (res.ok) {
        const data = await res.json(); // Array of attempts
        if (data && data.length > 0) {
          setHistory(data);
          setShowResults(true);
          return data[0].user.id; // Return the user ID for stats loading
        }
      }
    } catch (err) {
      console.error("Error fetching results:", err);
    }
    return null;
  }, []);

  // 4. Fetch Stats for a user ID
  const fetchStats = useCallback(async (userId, userAlias) => {
    try {
      const res = await fetch(`${SERVER_URL}/stats?userId=${userId}`);
      if (res.ok) {
        const data = await res.json(); // { score, badges: [...] }
        setStats({
          alias: userAlias,
          score: data.score || 0,
          badges: data.badges || []
        });
        setShowStats(true);
      } else {
        // Error fallback matching original gamification-client.js
        setStats({ alias: userAlias, score: 0, badges: [] });
        setShowStats(true);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Fallback
      setStats({ alias: userAlias, score: 0, badges: [] });
      setShowStats(true);
    }
  }, []);

  // Submit Attempt
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedAlias = alias.trim();
    if (!attempt || !trimmedAlias) {
      setMessage({
        text: "⚠️ Vui lòng điền đầy đủ kết quả và biệt danh của bạn!",
        type: "warning"
      });
      setAnimateMessage(true);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setAnimateMessage(false);

    const payload = {
      user: { alias: trimmedAlias },
      multiplication: { factorA, factorB },
      resultAttempt: parseInt(attempt, 10)
    };

    try {
      const res = await fetch(`${SERVER_URL}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setAnimateMessage(true);
        if (result.correct) {
          setMessage({
            text: "🎉 Kết quả chính xác! Chúc mừng bạn đã ghi điểm!",
            type: "success"
          });
        } else {
          setMessage({
            text: "❌ Rất tiếc, kết quả chưa đúng! Hãy tiếp tục cố gắng nhé! 💪",
            type: "danger"
          });
        }
      } else {
        setMessage({
          text: "❌ Có lỗi kết nối máy chủ! Hãy thử lại sau.",
          type: "danger"
        });
        setAnimateMessage(true);
      }
    } catch (err) {
      console.error("Error submitting attempt:", err);
      setMessage({
        text: "❌ Gửi thất bại! Hãy chắc chắn server backend đã được khởi động ở cổng 8000.",
        type: "danger"
      });
      setAnimateMessage(true);
    } finally {
      setIsSubmitting(false);
      // Immediately load a new challenge
      fetchChallenge();
      
      // Delay 300ms as per original logic to allow database index updates
      setTimeout(async () => {
        const uid = await fetchResults(trimmedAlias);
        if (uid) {
          await fetchStats(uid, trimmedAlias);
        }
        await fetchLeaderboard();
      }, 300);
    }
  };

  // Initial Data Load
  useEffect(() => {
    fetchChallenge();
    fetchLeaderboard();
  }, [fetchChallenge, fetchLeaderboard]);

  // Clean animation class after execution
  useEffect(() => {
    if (animateMessage) {
      const timer = setTimeout(() => setAnimateMessage(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateMessage]);

  return (
    <div className="flex flex-col min-h-screen pb-16">
      
      {/* 1. BRUTALIST SCROLLING HEADER MARQUEE */}
      <header className="w-full bg-brutalist-black border-b-4 border-brutalist-black py-4 overflow-hidden relative shadow-[0_4px_0_0_#0f0f11]">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="font-syncopate font-black text-2xl md:text-3xl text-brutalist-yellow uppercase tracking-widest mx-8 inline-block select-none">
              ⚡ CUỘC ĐUA PHÉP NHÂN ⚡ BATTLE MATH ARENA ⚡ TÍNH NHẨM SIÊU TỐC ⚡
            </span>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 mt-12 flex-1">
        
        {/* Decorative Grid Banner */}
        <div className="brutalist-border bg-brutalist-black text-white p-6 brutalist-shadow-yellow mb-10 -rotate-[0.5deg] relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] bg-brutalist-orange text-black font-orbitron font-black text-6xl opacity-15 rotate-12 select-none select-none pointer-events-none">
            × ÷ + -
          </div>
          <h1 className="font-orbitron font-black text-3xl md:text-5xl tracking-tighter text-brutalist-yellow mb-2 select-all">
            ĐẤU TRƯỜNG PHÉP NHÂN
          </h1>
        </div>

        {/* Asymmetric 2-Column Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
          
          {/* LEFT COLUMN: Challenge & Stats */}
          <div className="flex flex-col gap-10">
            
            {/* CARD 1: CHALLENGE */}
            <section className="brutalist-border bg-brutalist-yellow brutalist-shadow-yellow p-6 md:p-8 -rotate-[0.3deg] brutalist-pop">
              <div className="flex justify-between items-center border-b-4 border-brutalist-black pb-4 mb-6">
                <h2 className="font-orbitron font-black text-xl md:text-2xl text-brutalist-black tracking-tight uppercase flex items-center gap-2">
                  <span>🎯</span> Thử Thách Phép Nhân
                </h2>
                <span className="bg-black text-brutalist-yellow px-2 py-1 text-xs font-black uppercase tracking-widest font-mono brutalist-border-sm">
                  ACT.01
                </span>
              </div>

              {/* Math Board Display */}
              <div className="bg-white brutalist-border p-8 text-center my-6 shadow-[6px_6px_0px_0px_rgba(15,15,17,1)] relative overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(15,15,17,1)] transition-all duration-200">
                <div className="absolute top-0 right-0 bg-brutalist-orange text-white px-3 py-1 text-xs font-black uppercase tracking-widest font-orbitron brutalist-border-sm border-t-0 border-r-0">
                  MATH CORE v10
                </div>
                <p className="text-gray-500 uppercase tracking-wider text-xs font-black mb-3">
                  Phép toán ngẫu nhiên được chỉ định
                </p>
                <div className="font-mono font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-brutalist-black select-all py-4 flex justify-center items-center gap-4">
                  <span className="multiplication-a select-all">{factorA}</span>
                  <span className="text-brutalist-orange animate-pulse">×</span>
                  <span className="multiplication-b select-all">{factorB}</span>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} id="attempt-form" className="mt-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Result input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="result-attempt" className="font-black text-sm uppercase tracking-wider text-brutalist-black flex items-center gap-1">
                      Kết quả của bạn? <span className="text-brutalist-red">*</span>
                    </label>
                    <input
                      type="number"
                      name="result-attempt"
                      id="result-attempt"
                      value={attempt}
                      onChange={(e) => setAttempt(e.target.value)}
                      placeholder="Nhập đáp án..."
                      autoComplete="off"
                      className="brutalist-border bg-white text-brutalist-black font-mono font-bold text-xl p-4 w-full focus:bg-brutalist-cyan focus:outline-none transition-colors shadow-[4px_4px_0_0_rgba(15,15,17,1)] focus:shadow-[2px_2px_0_0_rgba(15,15,17,1)] focus:translate-x-[2px] focus:translate-y-[2px]"
                    />
                  </div>

                  {/* Nickname input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-alias" className="font-black text-sm uppercase tracking-wider text-brutalist-black flex items-center gap-1">
                      Biệt danh chơi <span className="text-brutalist-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="user-alias"
                      id="user-alias"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Ví dụ: hoang, tran_tu..."
                      autoComplete="off"
                      className="brutalist-border bg-white text-brutalist-black font-bold text-lg p-4 w-full focus:bg-brutalist-cyan focus:outline-none transition-colors shadow-[4px_4px_0_0_rgba(15,15,17,1)] focus:shadow-[2px_2px_0_0_rgba(15,15,17,1)] focus:translate-x-[2px] focus:translate-y-[2px]"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full brutalist-btn bg-brutalist-orange text-white font-orbitron font-black text-lg py-5 px-6 uppercase tracking-wider select-none disabled:opacity-75 cursor-pointer relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full" />
                      Đang Kiểm Tra...
                    </span>
                  ) : (
                    "Kiểm Tra Kết Quả 🚀"
                  )}
                </button>
              </form>

              {/* Dynamic Alert Messages */}
              {message && (
                <div className={`mt-6 brutalist-border p-4 brutalist-shadow-small text-center font-bold text-lg flex items-center justify-center gap-2 select-all ${
                  message.type === "success" 
                    ? "bg-brutalist-green text-black" 
                    : message.type === "danger" 
                    ? "bg-brutalist-red text-white" 
                    : "bg-brutalist-orange text-white"
                } ${animateMessage ? "brutalist-shake" : ""}`}>
                  {message.text}
                </div>
              )}
            </section>

            {/* CARD 2: PERSONAL STATS */}
            {showStats && (
              <section id="stats-div" className="brutalist-border bg-brutalist-green brutalist-shadow-yellow p-6 md:p-8 rotate-[0.3deg] brutalist-pop">
                <div className="flex justify-between items-center border-b-4 border-brutalist-black pb-4 mb-6">
                  <h2 className="font-orbitron font-black text-xl md:text-2xl text-brutalist-black tracking-tight uppercase flex items-center gap-2">
                    <span>📊</span> Thành Tích Cá Nhân
                  </h2>
                  <span className="bg-black text-brutalist-green px-2 py-1 text-xs font-black uppercase tracking-widest font-mono brutalist-border-sm">
                    ACT.02
                  </span>
                </div>

                <div className="bg-white brutalist-border p-5 shadow-[4px_4px_0_0_rgba(15,15,17,1)] flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                    
                    {/* User display */}
                    <div className="p-2 flex flex-col gap-1">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Chiến binh đang chọn:</span>
                      <div className="bg-black text-brutalist-yellow font-orbitron font-black text-xl py-2 px-4 inline-block uppercase brutalist-border-sm tracking-wider self-start select-all">
                        {stats.alias}
                      </div>
                    </div>

                    {/* Score display */}
                    <div className="p-2 md:pl-6 flex flex-col gap-1 justify-center">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Tổng điểm hiện tại:</span>
                      <div className="text-4xl font-mono font-black text-brutalist-orange tracking-tight select-all">
                        {stats.score} <span className="font-sans font-bold text-lg text-black">ĐIỂM</span>
                      </div>
                    </div>

                  </div>

                  {/* Badges Container */}
                  <div className="border-t-2 border-black pt-4">
                    <span className="text-gray-500 font-bold uppercase tracking-wider text-xs block mb-3">
                      Huy Chương Sở Hữu:
                    </span>
                    {stats.badges && stats.badges.length > 0 ? (
                      <div id="stats-badges" className="flex flex-wrap gap-3">
                        {stats.badges.map((badgeCode, index) => {
                          const badgeObj = BADGE_MAP[badgeCode] || { 
                            name: `🎖️ ${badgeCode}`, 
                            className: "bg-stone-300 text-black border-black" 
                          };
                          return (
                            <span
                              key={index}
                              className={`brutalist-border-sm px-3 py-2 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0_0_rgba(15,15,17,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(15,15,17,1)] transition-all select-all ${badgeObj.className}`}
                            >
                              {badgeObj.name}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-stone-500 font-bold italic py-2">
                        Chưa có huy chương nào. Hãy cố gắng trả lời đúng nhiều hơn! 💪
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN: Leaderboard & Latest Attempts */}
          <div className="flex flex-col gap-10">
            
            {/* CARD 3: LEADERBOARD */}
            <section className="brutalist-border bg-white brutalist-shadow-yellow p-6 md:p-8 rotate-[0.2deg]">
              <div className="flex justify-between items-center border-b-4 border-brutalist-black pb-4 mb-6">
                <h2 className="font-orbitron font-black text-xl md:text-2xl text-brutalist-black tracking-tight uppercase flex items-center gap-2">
                  <span>👑</span> Bảng Xếp Hạng
                </h2>
                <button
                  id="refresh-leaderboard"
                  onClick={fetchLeaderboard}
                  disabled={isLeaderboardLoading}
                  className="brutalist-btn bg-brutalist-orange text-white font-orbitron font-black text-xs px-3 py-2 uppercase tracking-widest cursor-pointer disabled:opacity-50 select-none"
                >
                  {isLeaderboardLoading ? "ĐANG TẢI..." : "TẢI LẠI 🔄"}
                </button>
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-x-auto brutalist-border shadow-[4px_4px_0_0_rgba(15,15,17,1)]">
                <table id="leaderboard" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brutalist-black text-white border-b-4 border-brutalist-black font-orbitron text-xs md:text-sm tracking-wider uppercase font-black">
                      <th className="p-4 w-16 text-center border-r-2 border-black">Hạng</th>
                      <th className="p-4 border-r-2 border-black">Người chơi</th>
                      <th className="p-4 text-right">Tổng Điểm</th>
                    </tr>
                  </thead>
                  <tbody id="leaderboard-body" className="divide-y-2 divide-black bg-white font-bold text-sm md:text-base">
                    {leaderboard.length > 0 ? (
                      leaderboard.map((row, index) => {
                        const rankColors = [
                          "bg-yellow-300 text-black", // Rank 1
                          "bg-slate-300 text-black", // Rank 2
                          "bg-amber-600 text-white", // Rank 3
                        ];
                        const rankStyle = rankColors[index] || "bg-brutalist-black text-white";
                        const isTopThree = index < 3;

                        return (
                          <tr key={index} className="hover:bg-brutalist-paper transition-colors">
                            <td className="p-4 text-center border-r-2 border-black font-mono">
                              <span className={`inline-block font-black text-xs px-2 py-1 brutalist-border-sm shadow-[1px_1px_0_0_rgba(0,0,0,1)] ${rankStyle}`}>
                                {isTopThree ? `0${index + 1}` : index + 1}
                              </span>
                            </td>
                            <td className="p-4 border-r-2 border-black font-orbitron tracking-tight text-brutalist-black select-all">
                              {row.alias}
                            </td>
                            <td className="p-4 text-right font-mono font-black text-brutalist-orange select-all">
                              {row.totalScore} điểm
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-stone-500 italic bg-stone-50">
                          Bảng xếp hạng trống. Hãy là người chơi đầu tiên! 👑
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CARD 4: LATEST ATTEMPTS */}
            {showResults && (
              <section id="results-div" className="brutalist-border bg-white brutalist-shadow-yellow p-6 md:p-8 -rotate-[0.2deg] brutalist-pop">
                <div className="flex justify-between items-center border-b-4 border-brutalist-black pb-4 mb-6">
                  <h2 className="font-orbitron font-black text-xl md:text-2xl text-brutalist-black tracking-tight uppercase flex items-center gap-2">
                    <span>📝</span> Các Lượt Chơi Gần Đây
                  </h2>
                  <span className="bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-widest font-mono brutalist-border-sm">
                    LOGS
                  </span>
                </div>

                {/* History Table */}
                <div className="overflow-x-auto brutalist-border shadow-[4px_4px_0_0_rgba(15,15,17,1)]">
                  <table id="results" className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brutalist-black text-white border-b-4 border-brutalist-black font-orbitron text-xs md:text-sm tracking-wider uppercase font-black">
                        <th className="p-4 border-r-2 border-black">Mã lượt</th>
                        <th className="p-4 border-r-2 border-black">Phép tính</th>
                        <th className="p-4 border-r-2 border-black">Kết quả nhập</th>
                        <th className="p-4 text-center">Chính xác?</th>
                      </tr>
                    </thead>
                    <tbody id="results-body" className="divide-y-2 divide-black bg-white font-mono font-bold text-sm md:text-base">
                      {history.map((row) => (
                        <tr key={row.id} className="hover:bg-brutalist-paper transition-colors">
                          <td className="p-4 border-r-2 border-black text-stone-500 text-xs">
                            #{row.id}
                          </td>
                          <td className="p-4 border-r-2 border-black font-black text-brutalist-black text-base select-all">
                            {row.multiplication.factorA} x {row.multiplication.factorB}
                          </td>
                          <td className="p-4 border-r-2 border-black text-base select-all">
                            {row.resultAttempt}
                          </td>
                          <td className="p-4 text-center">
                            {row.correct ? (
                              <span className="inline-block brutalist-border-sm bg-brutalist-green text-black font-black text-xs px-2.5 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] select-all">
                                ĐÚNG
                              </span>
                            ) : (
                              <span className="inline-block brutalist-border-sm bg-brutalist-red text-white font-black text-xs px-2.5 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] select-all">
                                SAI
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>

        </div>

      </main>

      {/* Decorative Grid Footer */}
      <footer className="w-full text-center mt-20 pt-8 border-t-4 border-black border-dashed font-bold text-sm text-stone-600 px-4">
        <p className="uppercase tracking-widest font-black font-orbitron mb-1">
          ⚙️ DESIGNED IN BOLD & GAMIFIED BRUTALISM ⚙️
        </p>
        <p>
          Cuộc Đua Phép Nhân v10 © {new Date().getFullYear()} — Premium Maths Arena.
        </p>
      </footer>
    </div>
  );
}

(function () {
    console.log("⚡ Loading Brutalist Quest Integration v10...");

    let currentAlias = null;
    let lastStatsHtml = "";
    let lastResultsHtml = "";
    let checkInterval = null;

    // Main polling loop
    function startQuestChecker() {
        console.log("🔍 Quest Service Checker is scanning the page...");
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            const statsDiv = document.getElementById('stats-div');
            const resultsDiv = document.getElementById('results-div');

            if (statsDiv) {
                // Highly robust selector: get the first .select-all element (the alias) inside statsDiv
                const aliasEl = statsDiv.querySelector('.select-all');

                if (aliasEl) {
                    const alias = aliasEl.textContent.trim();
                    // Prevent catching the score or header text
                    if (alias && !alias.includes("Thành Tích") && !alias.includes("ĐIỂM")) {
                        const statsHtml = statsDiv.innerHTML;
                        const resultsHtml = resultsDiv ? resultsDiv.innerHTML : "";

                        if (alias !== currentAlias || statsHtml !== lastStatsHtml || resultsHtml !== lastResultsHtml) {
                            currentAlias = alias;
                            lastStatsHtml = statsHtml;
                            lastResultsHtml = resultsHtml;
                            console.log(`👤 Active user state changed: "${alias}". Fetching quest progress...`);
                            loadQuests(alias);
                        }
                    }
                } else {
                    console.warn("⚠️ Found #stats-div but could not extract user alias text elements.");
                }
            } else {
                // If stats div is gone, remove our quest section
                const questSec = document.getElementById('quests-section');
                if (questSec) {
                    console.log("🗑️ Stats section hidden. Removing quests panel.");
                    questSec.remove();
                }
                currentAlias = null;
                lastStatsHtml = "";
                lastResultsHtml = "";
            }
        }, 1500);
    }

    // Fetch and render quests
    async function loadQuests(alias) {
        // Bypass Gateway and call quest-service (port 8084) directly to avoid Zuul CORS/routing delays
        const url = `http://localhost:8084/quests?alias=${alias}`;
        console.log(`🌐 Fetching quests directly from quest-service: GET ${url}`);
        try {
            const res = await fetch(url);
            if (res.ok) {
                const quests = await res.json();
                console.log(`✅ Quests fetched successfully:`, quests);
                renderQuests(quests, alias);
            } else {
                console.error(`❌ quest-service returned error code ${res.status}`);
                renderErrorPanel(alias, `Dịch vụ nhiệm vụ phản hồi lỗi ${res.status}.`);
            }
        } catch (e) {
            console.warn(`⚠️ Direct fetch failed. Trying Gateway fallback...`, e);
            // Fallback to Gateway
            const gatewayUrl = `http://localhost:8000/api/quests?alias=${alias}`;
            try {
                const res = await fetch(gatewayUrl);
                if (res.ok) {
                    const quests = await res.json();
                    renderQuests(quests, alias);
                } else {
                    renderErrorPanel(alias, `Gateway trả về lỗi ${res.status}.`);
                }
            } catch (gwError) {
                console.error(`❌ Both direct and gateway connections failed.`, gwError);
                renderErrorPanel(alias, `Không thể kết nối tới cổng 8084 hoặc cổng 8000. Hãy kiểm tra xem 'quest-service' đã chạy chưa.`);
            }
        }
    }

    // Render diagnostic error panel directly in the UI
    function renderErrorPanel(alias, reason) {
        const statsDiv = document.getElementById('stats-div');
        if (!statsDiv) return;

        let questSec = document.getElementById('quests-section');
        if (!questSec) {
            questSec = document.createElement('section');
            questSec.id = 'quests-section';
            questSec.className = 'brutalist-border bg-brutalist-red text-white p-6 md:p-8 rotate-[-0.3deg] brutalist-pop mb-10';
            statsDiv.parentNode.insertBefore(questSec, statsDiv.nextSibling);
        }

        questSec.innerHTML = `
            <div class="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                <h2 class="font-orbitron font-black text-xl md:text-2xl text-white tracking-tight uppercase flex items-center gap-2">
                    <span>⚠️</span> LỖI KẾT NỐI NHIỆM VỤ
                </h2>
                <span class="bg-black text-brutalist-red px-2 py-1 text-xs font-black uppercase tracking-widest font-mono brutalist-border-sm">ERR.03</span>
            </div>
            <div class="bg-white brutalist-border p-5 shadow-[4px_4px_0_0_rgba(15,15,17,1)] text-black">
                <p class="font-black text-lg text-brutalist-red uppercase mb-2">Không thể tải danh sách thử thách của "${alias}"</p>
                <p class="font-bold text-sm text-gray-700 mb-4">Lý do: ${reason}</p>
                <div class="bg-stone-100 p-3 brutalist-border-sm text-xs font-mono font-bold text-stone-600">
                    Mẹo: Nhấn Ctrl+F5 để xóa bộ nhớ đệm trình duyệt, hoặc kiểm tra xem tab PowerShell chạy quest-service cổng 8084 đã khởi động chưa.
                </div>
            </div>
        `;
    }

    // Render Quests card in Brutalist design
    function renderQuests(quests, alias) {
        const statsDiv = document.getElementById('stats-div');
        if (!statsDiv) return;

        let questSec = document.getElementById('quests-section');
        if (!questSec) {
            questSec = document.createElement('section');
            questSec.id = 'quests-section';
            questSec.className = 'brutalist-border bg-brutalist-cyan brutalist-shadow-yellow p-6 md:p-8 rotate-[-0.3deg] brutalist-pop mb-10';
            // Insert right after stats-div
            statsDiv.parentNode.insertBefore(questSec, statsDiv.nextSibling);
        }

        let questsHtml = `
            <div class="flex justify-between items-center border-b-4 border-brutalist-black pb-4 mb-6">
                <h2 class="font-orbitron font-black text-xl md:text-2xl text-brutalist-black tracking-tight uppercase flex items-center gap-2">
                    <span>🌟</span> Thử Thách Nhận Thưởng
                </h2>
                <span class="bg-black text-brutalist-cyan px-2 py-1 text-xs font-black uppercase tracking-widest font-mono brutalist-border-sm">ACT.03</span>
            </div>
            <div class="bg-white brutalist-border p-5 shadow-[4px_4px_0_0_rgba(15,15,17,1)] flex flex-col gap-6">
        `;

        quests.forEach(q => {
            const percent = Math.min(100, Math.round((q.currentCount / q.targetCount) * 100));

            // Build action element (button or badge)
            let actionHtml = '';
            if (q.claimed) {
                actionHtml = `<span class="bg-stone-300 text-stone-600 brutalist-border-sm px-3 py-2 text-xs font-black uppercase tracking-widest select-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]">✅ Đã Nhận</span>`;
            } else if (q.completed) {
                actionHtml = `<button onclick="window.claimQuest(${q.questId})" class="brutalist-btn bg-brutalist-orange text-white font-orbitron font-black text-xs px-4 py-2.5 uppercase tracking-widest cursor-pointer shadow-[3px_3px_0_0_rgba(15,15,17,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(15,15,17,1)] transition-all animate-bounce">🎁 Nhận +${q.rewardPoints}đ</button>`;
            } else {
                actionHtml = `<span class="bg-brutalist-yellow text-black brutalist-border-sm px-3 py-1.5 text-xs font-black uppercase tracking-widest select-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] font-mono">${q.currentCount}/${q.targetCount}</span>`;
            }

            questsHtml += `
                <div class="border-b-2 border-black last:border-b-0 pb-4 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <h3 class="font-black text-base md:text-lg text-brutalist-black uppercase tracking-tight">${q.title}</h3>
                            <span class="bg-brutalist-black text-brutalist-yellow px-2 py-0.5 text-[10px] font-black uppercase tracking-wider brutalist-border-sm">+${q.rewardPoints} ĐIỂM</span>
                        </div>
                        <p class="text-xs md:text-sm font-bold text-gray-700 mt-1 mb-3">${q.description}</p>
                        
                        <!-- Progress bar -->
                        <div class="w-full bg-stone-200 brutalist-border-sm h-5 overflow-hidden relative shadow-[2px_2px_0_0_rgba(15,15,17,1)]">
                            <div class="bg-brutalist-green h-full brutalist-border-sm transition-all duration-500" style="width: ${percent}%"></div>
                            <span class="absolute inset-0 flex items-center justify-center font-mono font-black text-[10px] text-black drop-shadow-sm select-none">${percent}% hoàn thành</span>
                        </div>
                    </div>
                    <div class="flex items-center self-start md:self-center mt-2 md:mt-0">
                        ${actionHtml}
                    </div>
                </div>
            `;
        });

        questsHtml += `</div>`;
        questSec.innerHTML = questsHtml;
    }

    // Global function to claim rewards
    window.claimQuest = async function (questId) {
        if (!currentAlias) return;
        console.log(`🎁 Requesting reward claim for quest ${questId} and user ${currentAlias}...`);

        try {
            // Try direct call first
            let res;
            try {
                res = await fetch(`http://localhost:8084/quests/claim?alias=${currentAlias}&questId=${questId}`, {
                    method: 'POST'
                });
            } catch (err) {
                console.warn("⚠️ Direct claim failed. Trying Gateway fallback...", err);
                res = await fetch(`http://localhost:8000/api/quests/claim?alias=${currentAlias}&questId=${questId}`, {
                    method: 'POST'
                });
            }

            if (res && res.ok) {
                const data = await res.json();
                if (data.success) {
                    alert(`🎉 CHÚC MỪNG!\nBạn đã nhận thưởng thành công! Điểm số của bạn được cộng trực tiếp lên Bảng xếp hạng.`);

                    // Trigger refresh of stats and leaderboard programmatically
                    const refreshBtn = document.getElementById('refresh-leaderboard');
                    if (refreshBtn) refreshBtn.click();

                    // Refresh quest cards
                    loadQuests(currentAlias);
                } else {
                    alert("❌ Lỗi: Không thể nhận thưởng hoặc phần thưởng đã được quy đổi!");
                }
            } else {
                alert("❌ Lỗi kết nối với máy chủ khi đổi quà!");
            }
        } catch (e) {
            console.error("Error claiming quest:", e);
            alert("❌ Gửi yêu cầu đổi quà thất bại! Chắc chắn quest-service đang hoạt động.");
        }
    };

    window.loadQuests = loadQuests;

    // Start checking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startQuestChecker);
    } else {
        startQuestChecker();
    }
})();

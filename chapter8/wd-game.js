// ================================================
// Words & Deeds 투자 컨테스트 시뮬레이터
// Based on Eisenkopf (2020), The Leadership Quarterly
// ================================================

const WD = (() => {
  // ── 상태 ─────────────────────────────────────
  let s = {};

  function reset() {
    s = {
      phase: 'idle',
      role: null,
      totalRounds: 3,
      round: 0,
      cumScore: 0,
      wins: 0,
      losses: 0,
      // 리더 모드 라운드 변수
      rec: 0,
      myBid: 0,
      npc1Bid: 0,
      npc2Bid: 0,
      // 팔로워 모드 라운드 변수
      npcLeaderRec: 0,
      npcLeaderActual: 0,
      npcLeaderLied: false,
      npcF2Bid: 0,
      // 배틀
      myTeamTotal: 0,
      oppTotal: 0,
      oppStrategy: '',
      winProb: 0,
      won: false,
      roundEarnings: 0,
    };
  }

  // ── DOM 헬퍼 ─────────────────────────────────
  const $log = () => document.getElementById('wd-log');
  const $inp = () => document.getElementById('wd-input');
  const $score = () => document.getElementById('wd-score-display');
  const $npc = () => document.getElementById('wd-npc-info');

  function addMsg(html, type = 'sys') {
    const color = {
      sys: '#94a3b8', title: '#fcd34d', npc: '#60a5fa',
      player: '#34d399', battle: '#f59e0b', win: '#10b981',
      lose: '#ef4444', warn: '#f87171', info: '#a5b4fc',
    }[type] || '#94a3b8';
    const d = document.createElement('div');
    d.style.cssText = `font-size:0.83rem;line-height:1.55;color:${color};`;
    d.innerHTML = html;
    $log().appendChild(d);
    $log().scrollTop = $log().scrollHeight;
  }

  function sep() { addMsg('──────────────────────────────', 'sys'); }

  function setInput(html) { $inp().innerHTML = html; }

  function updateScore() {
    if (s.round === 0) {
      $score().innerHTML = '<div style="text-align:center;color:#64748b;font-size:0.8rem;">게임 시작 전</div>';
      return;
    }
    const color = s.cumScore >= 0 ? '#10b981' : '#ef4444';
    $score().innerHTML = `
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:0.75rem;color:#94a3b8;">라운드</span>
          <span style="font-weight:bold;color:#fcd34d;">${s.round} / ${s.totalRounds}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:0.75rem;color:#94a3b8;">누적 수익</span>
          <span style="font-weight:700;color:${color};font-size:1.05rem;">${s.cumScore >= 0 ? '+' : ''}${s.cumScore} pt</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:0.75rem;color:#94a3b8;">전적</span>
          <span style="font-weight:bold;color:#cbd5e1;">${s.wins}승 ${s.losses}패</span>
        </div>
      </div>`;
  }

  function updateNpcInfo() {
    if (s.role === 'leader') {
      $npc().innerHTML = `
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.6rem;font-weight:bold;">👥 내 팀</div>
        <div style="font-size:0.78rem;display:flex;flex-direction:column;gap:0.4rem;">
          <div>👑 <span style="color:#fcd34d;font-weight:bold;">나 (리더)</span></div>
          <div>🏃 <span style="color:#94a3b8;">팔로워 김철수</span></div>
          <div>🏃 <span style="color:#94a3b8;">팔로워 이영희</span></div>
          <div style="font-size:0.72rem;color:#64748b;margin-top:0.3rem;border-top:1px solid rgba(255,255,255,0.07);padding-top:0.3rem;">
            ※ 팔로워는 리더의 언행일치 여부에 따라 반응합니다.
          </div>
        </div>`;
    } else {
      $npc().innerHTML = `
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.6rem;font-weight:bold;">👥 내 팀</div>
        <div style="font-size:0.78rem;display:flex;flex-direction:column;gap:0.4rem;">
          <div>👑 <span style="color:#94a3b8;">리더 박지훈 (NPC)</span></div>
          <div>⭐ <span style="color:#fcd34d;font-weight:bold;">나 (팔로워)</span></div>
          <div>🏃 <span style="color:#94a3b8;">팔로워 최수진 (NPC)</span></div>
          <div style="font-size:0.72rem;color:#64748b;margin-top:0.3rem;border-top:1px solid rgba(255,255,255,0.07);padding-top:0.3rem;">
            ※ NPC 리더의 말과 행동을 잘 살펴보세요.
          </div>
        </div>`;
    }
  }

  // ── NPC 계산 ────────────────────────────────
  function calcFollowers(rec, myBid) {
    const isHypocrite = rec > 20 && myBid < rec * 0.6;
    let f1, f2;
    if (isHypocrite) {
      f1 = Math.floor(Math.random() * 12);
      f2 = Math.floor(Math.random() * 12);
    } else if (myBid >= rec * 0.9) {
      const r = 0.5 + Math.random() * 0.3;
      f1 = Math.min(100, Math.floor(myBid * r + Math.random() * 8));
      f2 = Math.min(100, Math.floor(myBid * (r - 0.05) + Math.random() * 8));
    } else {
      const r = 0.25 + Math.random() * 0.2;
      f1 = Math.min(100, Math.floor(myBid * r + Math.random() * 8));
      f2 = Math.min(100, Math.floor(myBid * (r - 0.05) + Math.random() * 5));
    }
    return { f1: Math.max(0, f1), f2: Math.max(0, f2), isHypocrite };
  }

  function calcNpcLeader(round) {
    const lieChance = Math.min(0.5, 0.1 + round * 0.1);
    const lies = Math.random() < lieChance;
    let rec, actual;
    if (lies) {
      rec = 45 + Math.floor(Math.random() * 35);
      actual = 5 + Math.floor(Math.random() * 18);
    } else {
      actual = 30 + Math.floor(Math.random() * 45);
      rec = Math.max(0, Math.min(100, actual + Math.floor(Math.random() * 10) - 5));
    }
    return { rec, actual, lies };
  }

  function calcNpcF2(npcLeaderActual, npcLeaderRec, myBid) {
    const hypo = npcLeaderRec > 20 && npcLeaderActual < npcLeaderRec * 0.6;
    let f2;
    if (hypo) {
      f2 = Math.floor(Math.random() * 12);
    } else {
      const avg = (npcLeaderActual + myBid) / 2;
      f2 = Math.min(100, Math.floor(avg * (0.45 + Math.random() * 0.35)));
    }
    return Math.max(0, f2);
  }

  function calcOpponent() {
    const roll = Math.random();
    let strategy, total;
    if (roll < 0.33) {
      strategy = '내쉬 균형팀 (Rational)';
      total = 18 + Math.floor(Math.random() * 14);
    } else if (roll < 0.66) {
      strategy = '과투자팀 (Aggressive)';
      total = 120 + Math.floor(Math.random() * 35);
    } else {
      strategy = '무임승차팀 (Free-rider)';
      total = Math.floor(Math.random() * 11);
    }
    return { strategy, total };
  }

  function rollBattle(myTeamTotal, oppTotal) {
    const t = myTeamTotal + oppTotal;
    if (t === 0) return Math.random() < 0.5;
    return Math.random() < myTeamTotal / t;
  }

  // ── 게임 흐름 ────────────────────────────────

  // 시작 화면
  function showIdle() {
    reset();
    $log().innerHTML = '';
    sep();
    addMsg('<strong style="color:#fcd34d;font-size:0.95rem;">⚔️ WORDS &amp; DEEDS 시뮬레이터</strong>', 'sys');
    addMsg('<em style="color:#64748b;font-size:0.78rem;">Based on Eisenkopf (2020), The Leadership Quarterly</em>', 'sys');
    sep();
    addMsg('Words and Deeds 시뮬레이터를 가동합니다.', 'title');
    addMsg('플레이어의 역할(리더/팔로워)을 선택해 주십시오.', 'title');
    setInput(`
      <div style="display:flex;gap:0.6rem;">
        <button onclick="WD.selectRole('leader')" style="flex:1;padding:0.65rem;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;font-size:0.88rem;">
          👑 리더
        </button>
        <button onclick="WD.selectRole('follower')" style="flex:1;padding:0.65rem;background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;font-size:0.88rem;">
          🏃 팔로워
        </button>
      </div>`);
    updateScore();
  }

  // 역할 선택 후 라운드 수 선택
  function selectRole(role) {
    s.role = role;
    s.phase = 'round_select';
    updateNpcInfo();
    const label = role === 'leader' ? '👑 리더' : '🏃 팔로워';
    addMsg(`▶ <strong style="color:#fcd34d;">${label}</strong> 역할을 선택했습니다.`, 'player');
    addMsg('총 몇 라운드를 진행하시겠습니까?', 'title');
    setInput(`
      <div style="display:flex;gap:0.5rem;">
        ${[3,5,7].map(n => `<button onclick="WD.selectRounds(${n})" style="flex:1;padding:0.6rem;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:7px;color:#e2e8f0;font-weight:bold;cursor:pointer;font-size:0.9rem;">${n}라운드</button>`).join('')}
      </div>`);
  }

  // 라운드 수 확정 → 게임 시작
  function selectRounds(n) {
    s.totalRounds = n;
    addMsg(`▶ <strong style="color:#fcd34d;">${n}라운드</strong> 선택. 게임을 시작합니다!`, 'player');
    sep();
    startRound();
  }

  function startRound() {
    s.round++;
    updateScore();
    sep();
    addMsg(`<strong style="color:#f59e0b;">🎯 ROUND ${s.round} / ${s.totalRounds}</strong>`, 'battle');
    addMsg(`각 플레이어에게 <strong>100포인트</strong>가 지급됩니다.`, 'sys');

    if (s.role === 'leader') {
      phaseLeaderRec();
    } else {
      phaseFollowerNpcSetup();
    }
  }

  // ── 리더 모드 ────────────────────────────────

  function phaseLeaderRec() {
    s.phase = 'leader_rec';
    addMsg('팔로워들에게 권고할 투자 금액을 먼저 발표하십시오. (0~100)', 'npc');
    setInput(`
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <label style="font-size:0.8rem;color:#94a3b8;">권고 투자액 (0~100)</label>
        <div style="display:flex;gap:0.5rem;">
          <input id="wd-rec-inp" type="number" min="0" max="100" placeholder="예: 60"
            style="flex:1;padding:0.55rem 0.7rem;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;font-size:0.9rem;outline:none;">
          <button onclick="WD.submitRec()" style="padding:0.55rem 1rem;background:#f59e0b;border:none;border-radius:6px;color:#1e293b;font-weight:bold;cursor:pointer;">발표</button>
        </div>
      </div>`);
  }

  function submitRec() {
    const v = parseInt(document.getElementById('wd-rec-inp').value);
    if (isNaN(v) || v < 0 || v > 100) { alert('0~100 사이의 숫자를 입력하세요.'); return; }
    s.rec = v;
    addMsg(`▶ 나(리더): <strong style="color:#fcd34d;">"팀원 여러분, 저는 ${v}pt 투자를 권고합니다."</strong>`, 'player');
    phaseLeaderBid();
  }

  function phaseLeaderBid() {
    s.phase = 'leader_bid';
    addMsg('이제 본인이 실제로 투자할 금액을 결정하십시오. (0~100)', 'npc');
    setInput(`
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <label style="font-size:0.8rem;color:#94a3b8;">실제 투자액 (0~100)</label>
        <div style="display:flex;gap:0.5rem;">
          <input id="wd-bid-inp" type="number" min="0" max="100" placeholder="예: 60"
            style="flex:1;padding:0.55rem 0.7rem;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;font-size:0.9rem;outline:none;">
          <button onclick="WD.submitBid()" style="padding:0.55rem 1rem;background:#3b82f6;border:none;border-radius:6px;color:#fff;font-weight:bold;cursor:pointer;">투자</button>
        </div>
      </div>`);
  }

  function submitBid() {
    const v = parseInt(document.getElementById('wd-bid-inp').value);
    if (isNaN(v) || v < 0 || v > 100) { alert('0~100 사이의 숫자를 입력하세요.'); return; }
    s.myBid = v;
    addMsg(`▶ 나(리더): <strong style="color:#34d399;">${v}pt 투자.</strong>`, 'player');
    phaseFollowerReact();
  }

  function phaseFollowerReact() {
    const { f1, f2, isHypocrite } = calcFollowers(s.rec, s.myBid);
    s.npc1Bid = f1;
    s.npc2Bid = f2;

    if (isHypocrite) {
      addMsg(`😤 <strong>김철수:</strong> "리더님이 ${s.rec}pt 권고하고 정작 ${s.myBid}pt밖에 안 내셨잖아요? 저도 ${f1}pt만 낼게요."`, 'warn');
      addMsg(`😤 <strong>이영희:</strong> "말로만 하시는 거잖아요. 저도 ${f2}pt만요."`, 'warn');
    } else if (s.myBid >= s.rec * 0.9) {
      addMsg(`😊 <strong>김철수:</strong> "리더님이 솔선수범하시니 저도 ${f1}pt 투자합니다!"`, 'npc');
      addMsg(`😊 <strong>이영희:</strong> "신뢰가 생기네요. ${f2}pt 투자할게요!"`, 'npc');
    } else {
      addMsg(`😐 <strong>김철수:</strong> "음... 알겠습니다. ${f1}pt 내겠습니다."`, 'npc');
      addMsg(`😐 <strong>이영희:</strong> "그렇군요. ${f2}pt 드릴게요."`, 'npc');
    }

    s.myTeamTotal = s.myBid + f1 + f2;
    addMsg(`📦 우리 팀 총 투자액: <strong style="color:#fcd34d;">${s.myTeamTotal}pt</strong> (나 ${s.myBid} + 김철수 ${f1} + 이영희 ${f2})`, 'info');
    runBattle();
  }

  // ── 팔로워 모드 ──────────────────────────────

  function phaseFollowerNpcSetup() {
    const { rec, actual, lies } = calcNpcLeader(s.round);
    s.npcLeaderRec = rec;
    s.npcLeaderActual = actual;
    s.npcLeaderLied = lies;
    s.phase = 'follower_bid';

    addMsg(`👑 <strong>리더 박지훈:</strong> "팀원 여러분, 저는 <strong style="color:#fcd34d;">${rec}pt</strong> 투자를 권고합니다."`, 'npc');
    addMsg(`👑 <strong>리더 박지훈</strong>이 실제로 <strong style="color:${lies ? '#ef4444' : '#34d399'};">${actual}pt</strong> 투자했습니다.${lies ? ' <span style="color:#ef4444;">(⚠️ 권고와 다름!)</span>' : ''}`, 'npc');
    addMsg('당신은 얼마를 투자하시겠습니까? (0~100)', 'title');

    setInput(`
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <label style="font-size:0.8rem;color:#94a3b8;">나의 투자액 (0~100)</label>
        <div style="display:flex;gap:0.5rem;">
          <input id="wd-bid-inp" type="number" min="0" max="100" placeholder="예: 50"
            style="flex:1;padding:0.55rem 0.7rem;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;font-size:0.9rem;outline:none;">
          <button onclick="WD.submitFollowerBid()" style="padding:0.55rem 1rem;background:#3b82f6;border:none;border-radius:6px;color:#fff;font-weight:bold;cursor:pointer;">투자</button>
        </div>
      </div>`);
  }

  function submitFollowerBid() {
    const v = parseInt(document.getElementById('wd-bid-inp').value);
    if (isNaN(v) || v < 0 || v > 100) { alert('0~100 사이의 숫자를 입력하세요.'); return; }
    s.myBid = v;
    addMsg(`▶ 나(팔로워): <strong style="color:#34d399;">${v}pt 투자.</strong>`, 'player');

    const f2 = calcNpcF2(s.npcLeaderActual, s.npcLeaderRec, v);
    s.npcF2Bid = f2;
    addMsg(`🏃 <strong>최수진:</strong> "${f2}pt 투자하겠습니다."`, 'npc');

    s.myTeamTotal = s.npcLeaderActual + v + f2;
    addMsg(`📦 우리 팀 총 투자액: <strong style="color:#fcd34d;">${s.myTeamTotal}pt</strong> (박지훈 ${s.npcLeaderActual} + 나 ${v} + 최수진 ${f2})`, 'info');
    runBattle();
  }

  // ── 배틀 & 결과 ──────────────────────────────

  function runBattle() {
    const { strategy, total } = calcOpponent();
    s.oppTotal = total;
    s.oppStrategy = strategy;
    s.winProb = s.myTeamTotal + total === 0 ? 0.5 : s.myTeamTotal / (s.myTeamTotal + total);
    s.won = rollBattle(s.myTeamTotal, total);
    if (s.won) s.wins++; else s.losses++;

    const probPct = Math.round(s.winProb * 100);
    sep();
    addMsg(`🆚 <strong>상대 팀 정보 공개!</strong>`, 'battle');
    addMsg(`상대 팀 전략: <strong style="color:#f59e0b;">${strategy}</strong>`, 'battle');
    addMsg(`상대 팀 총 투자액: <strong style="color:#f59e0b;">${total}pt</strong>`, 'battle');
    addMsg(`⚖️ 우리 팀 승리 확률: <strong style="color:#fcd34d;">${probPct}%</strong>`, 'battle');

    // 룰렛 연출
    addMsg('🎲 승패를 결정합니다...', 'sys');
    setTimeout(() => {
      if (s.won) {
        addMsg('🏆 <strong style="color:#10b981;font-size:0.95rem;">우리 팀 승리!</strong>', 'win');
      } else {
        addMsg('💔 <strong style="color:#ef4444;font-size:0.95rem;">우리 팀 패배.</strong>', 'lose');
      }
      showRoundResult();
    }, 800);
  }

  function showRoundResult() {
    const reward = s.won ? 100 : 0;
    s.roundEarnings = (100 - s.myBid) + reward;
    const net = s.roundEarnings - 100; // 100pt 지급 기준 대비 순이익
    s.cumScore += net;
    updateScore();

    sep();
    addMsg(`📊 <strong>라운드 ${s.round} 정산</strong>`, 'title');
    addMsg(`보유 포인트: 100 - 투자 ${s.myBid} = <strong>${100 - s.myBid}pt</strong>`, 'sys');
    addMsg(`승리 보상: <strong style="color:${s.won ? '#10b981' : '#64748b'};">${reward}pt</strong>`, 'sys');
    addMsg(`이번 라운드 총 수익: <strong style="color:#fcd34d;">${s.roundEarnings}pt</strong>`, 'info');
    addMsg(`누적 순이익: <strong style="color:${s.cumScore >= 0 ? '#10b981' : '#ef4444'};">${s.cumScore >= 0 ? '+' : ''}${s.cumScore}pt</strong>`, s.cumScore >= 0 ? 'win' : 'lose');

    if (s.round < s.totalRounds) {
      setInput(`
        <button onclick="WD.nextRound()" style="width:100%;padding:0.65rem;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;">
          ▶ 다음 라운드 (${s.round + 1} / ${s.totalRounds})
        </button>`);
    } else {
      showFinalResult();
    }
  }

  function showFinalResult() {
    sep();
    addMsg(`🏁 <strong style="color:#fcd34d;font-size:0.95rem;">게임 종료! 최종 결과</strong>`, 'title');
    addMsg(`최종 전적: <strong>${s.wins}승 ${s.losses}패</strong>`, 'info');
    addMsg(`최종 누적 순이익: <strong style="color:${s.cumScore >= 0 ? '#10b981' : '#ef4444'};font-size:1rem;">${s.cumScore >= 0 ? '+' : ''}${s.cumScore}pt</strong>`, s.cumScore >= 0 ? 'win' : 'lose');

    let verdict;
    if (s.cumScore > 100) verdict = '🌟 탁월한 리더십으로 마을을 성공으로 이끌었습니다!';
    else if (s.cumScore > 0) verdict = '✅ 안정적으로 팀을 이끌었습니다.';
    else if (s.cumScore === 0) verdict = '😐 본전치기입니다.';
    else verdict = '⚠️ 언행불일치나 낮은 기여가 팀 전체를 약화시켰습니다.';

    addMsg(`<em>${verdict}</em>`, s.cumScore > 0 ? 'win' : 'warn');
    sep();

    setInput(`
      <button onclick="WD.restart()" style="width:100%;padding:0.65rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#e2e8f0;font-weight:bold;cursor:pointer;">
        🔄 다시 시작
      </button>`);
  }

  // ── 공개 API ────────────────────────────────
  return {
    init: showIdle,
    restart: showIdle,
    selectRole,
    selectRounds,
    submitRec,
    submitBid,
    submitFollowerBid,
    nextRound: startRound,
  };
})();

// 슬라이드 진입 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  WD.init();
});

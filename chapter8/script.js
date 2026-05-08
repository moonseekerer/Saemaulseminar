// Chapter 8 Specific JS - Simulation Logic
function calculatePayoff() {
  const leaderInput = document.getElementById('leaderContribution').value;
  const compLevel = document.getElementById('competitionLevel').value;
  const leaderCont = parseInt(leaderInput) || 0;
  
  if (leaderCont < 0) {
    alert("올바른 금액을 입력하세요.");
    return;
  }
  if (leaderCont > 1000000) {
    alert("보유 자산(1,000,000원)을 초과할 수 없습니다.");
    return;
  }
  
  const E = 1000000;
  // Prize based on competition level (1=200k, 2=400k, 3=600k, 4=800k, 5=1000k)
  const P = compLevel * 200000;
  
  const U_win = E - leaderCont + P;
  const U_lose = E - leaderCont;
  
  const winResult = document.getElementById('winResult');
  const winFormula = document.getElementById('winFormula');
  const loseResult = document.getElementById('loseResult');
  const loseFormula = document.getElementById('loseFormula');
  const commentDiv = document.getElementById('simComment');
  const simBox = document.getElementById('simResult');
  
  winResult.innerText = U_win.toLocaleString() + " 원";
  winFormula.innerText = `100만 - ${leaderCont/10000}만 + ${P/10000}만`;
  
  loseResult.innerText = U_lose.toLocaleString() + " 원";
  loseFormula.innerText = `100만 - ${leaderCont/10000}만`;
  
  let comment = "";
  if(leaderCont === 0) {
    comment = "<span style='color: #ef4444; font-weight: bold;'>⚠️ 무임승차(0원 기여):</span> 패배 시 손실은 없으나, 경쟁에서 이길 확률이 0%에 가까워 보상(P)을 얻을 수 없습니다.";
  } else if (leaderCont === 1000000) {
    comment = "<span style='color: #f59e0b; font-weight: bold;'>🔥 전액 기여(솔선수범):</span> 패배 시 모든 것을 잃는 위험이 따르지만, 승리 확률이 극대화되어 보상(P)을 획득할 가능성이 가장 높습니다.";
  } else {
    comment = "<span style='color: #34d399; font-weight: bold;'>✅ 적절한 기여:</span> 기여금이 커질수록 승리 확률이 올라가며, 승리 시의 추가 편익과 패배 시의 리스크를 동시에 감수합니다.";
  }
  commentDiv.innerHTML = comment;
  
  simBox.style.display = 'block';
}

function setContribution(amount, btnElement) {
  document.getElementById('leaderContribution').value = amount;
  
  const buttons = document.querySelectorAll('.contribution-btn');
  buttons.forEach(btn => {
    btn.style.background = 'rgba(0,0,0,0.2)';
    btn.style.border = '1px solid rgba(255,255,255,0.2)';
    btn.style.color = '#fff';
  });
  
  btnElement.style.background = '#3b82f6';
  btnElement.style.border = '1px solid #3b82f6';
  btnElement.style.color = 'white';
}

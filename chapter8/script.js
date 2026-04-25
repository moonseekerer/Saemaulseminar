// Chapter 8 Specific JS - Simulation Logic
function calculateFollower() {
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
  
  // 알파: 지도자 기여의 60%를 기본적으로 따라함
  // 베타: 경쟁 강도(1~5)에 따라 10%~50% 추가 기여 유발
  const alpha = 0.6;
  const beta_multiplier = 1 + (compLevel * 0.1); 
  
  let followerExpected = (leaderCont * alpha) * beta_multiplier;
  
  const resultDiv = document.getElementById('followerResult');
  const formulaDiv = document.getElementById('followerFormula');
  const commentDiv = document.getElementById('simComment');
  const simBox = document.getElementById('simResult');
  
  resultDiv.innerText = Math.round(followerExpected).toLocaleString() + " 원";
  formulaDiv.innerText = `식: (${leaderCont.toLocaleString()} × 0.6) × (1 + ${compLevel} × 0.1) = ${Math.round(followerExpected).toLocaleString()}`;
  
  let comment = "";
  if(leaderCont === 0) {
    comment = "지도자의 솔선수범이 없어 주민들의 참여 동력이 발생하지 않습니다.";
    resultDiv.style.color = "#94a3b8";
    simBox.style.borderLeftColor = "#94a3b8";
  } else if (compLevel >= 4 && leaderCont > 500000) {
    comment = "높은 헌신(솔선수범)과 강한 마을경쟁이 결합되어 주민들의 폭발적인 협력을 이끌어냈습니다!";
    resultDiv.style.color = "#10b981";
    simBox.style.borderLeftColor = "#10b981";
  } else {
    comment = "지도자의 기여와 경쟁 강도에 비례하여 주민들이 일정 수준 협력합니다.";
    resultDiv.style.color = "#34d399";
    simBox.style.borderLeftColor = "#34d399";
  }
  commentDiv.innerText = comment;
  
  simBox.style.display = 'block';
}

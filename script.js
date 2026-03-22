// ===============================
// 증상 안내 박스
// ===============================
function showInfo(title, text) {
  const t = document.getElementById("infoTitle");
  const p = document.getElementById("infoText");
  const box = document.getElementById("infoBox");
  if (!t || !p || !box) return;

  t.textContent = title;
  p.textContent = text;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ===============================
// 구글 폼 링크 (예약/문의 공통)
// ===============================
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSchUfryFIiGHlgDmStM2zRa5iY5WE_IBXKVDv8H_O5cRZrs2w/viewform?usp=publish-editor";

// (선택) 구글폼 entry 키가 있으면 자동 입력 가능
const FORM_ENTRY_KEY = ""; // 예: "entry.1234567890"

function openInquiryForm(itemName) {
  let url = FORM_URL;
  if (FORM_ENTRY_KEY) url += `?${FORM_ENTRY_KEY}=` + encodeURIComponent(itemName);
  window.open(url, "_blank");
}

// 예약 버튼 링크 동기화
document.addEventListener("DOMContentLoaded", () => {
  const reserveBtn = document.getElementById("reserveFormBtn");
  if (reserveBtn) reserveBtn.href = FORM_URL;
});

// ===============================
// 3D 모델 전환
// ===============================
function set3D(key) {
  const mv = document.getElementById("mv");
  if (!mv) return;

  const map = {
    starter_fail: "./assets/models/StarterMotor_FailureSimulation.glb",
    starter_click_no_start: "./assets/models/starter_click_no_start.glb",
    starter_sluggish: "./assets/models/starter_sluggish.glb", // 나중에 업로드
    starter_normal: "./assets/models/starter_normal.glb",     // 나중에 업로드
  };

  const src = map[key];
  if (!src) return;

  // 강제 갱신 (캐시/동일파일 갱신 문제 방지)
  mv.src = "";
  requestAnimationFrame(() => {
    mv.src = src;
    mv.cameraOrbit = "auto auto auto";
    mv.fieldOfView = "45deg";
  });
}



 // ===============================
// 3D 모델 전환
// ===============================
function set3D(key) {
  const mv = document.getElementById("mv");
  if (!mv) return;

  const map = {
    starter_fail: "./assets/models/StarterMotor_FailureSimulation.glb",
    starter_click_no_start: "./assets/models/starter_click_no_start.glb",
    starter_sluggish: "./assets/models/starter_sluggish.glb",
    starter_normal: "./assets/models/starter_normal.glb",
  };

  const src = map[key];
  if (!src) return;

  mv.src = "";
  requestAnimationFrame(() => {
    mv.src = src;
    mv.cameraOrbit = "auto auto auto";
    mv.fieldOfView = "45deg";
  });
}

// ===============================
// Price cards (가로 스와이프 + 검색)
// ===============================
const PRICE_ITEMS = [
  { cat: "엔진/점화", name: "점화플러그 교체", range: "₩xx,xxx ~", note: "차종/개수(4기통·6기통)에 따라", link: "#parts" },
  { cat: "엔진/점화", name: "점화코일 교체", range: "₩xx,xxx ~", note: "실화/떨림 동반 시 점검", link: "#symptom" },
  { cat: "소모품", name: "엔진오일 교환", range: "₩xx,xxx ~", note: "오일 등급/용량/필터 포함 여부", link: "#reserve" },
  { cat: "소모품", name: "오일필터 교체", range: "₩x,xxx ~", note: "엔진오일 교환 시 함께 추천", link: "#reserve" },
  { cat: "에어컨", name: "에어컨 필터 교체", range: "₩xx,xxx ~", note: "필터 등급 선택(활성탄 등)", link: "#parts" },
  { cat: "에어컨", name: "에바 클리닝(탈취)", range: "₩xx,xxx ~", note: "냄새/곰팡이/배수 라인 점검 포함 가능", link: "#reserve" },

  { cat: "제동", name: "브레이크 패드(앞)", range: "₩xx,xxx ~", note: "브랜드/차종/마모도", link: "#symptom" },
  { cat: "제동", name: "브레이크 패드(뒤)", range: "₩xx,xxx ~", note: "전자파킹 차량은 추가 점검", link: "#symptom" },
  { cat: "제동", name: "브레이크 디스크(로터)", range: "₩xx,xxx ~", note: "편마모/진동 시 점검", link: "#symptom" },
  { cat: "제동", name: "브레이크액 교환", range: "₩xx,xxx ~", note: "수분/에어 혼입 예방(권장 주기)", link: "#reserve" },

  { cat: "타이어/하체", name: "타이어 교체(1본)", range: "₩xx,xxx ~", note: "규격/브랜드/공임 포함 여부", link: "#reserve" },
  { cat: "타이어/하체", name: "휠 얼라인먼트", range: "₩xx,xxx ~", note: "쏠림/편마모/핸들 틀어짐", link: "#symptom" },
  { cat: "타이어/하체", name: "휠 밸런스", range: "₩xx,xxx ~", note: "고속 떨림/진동 개선", link: "#symptom" },

  { cat: "배터리", name: "배터리 교체", range: "₩xx,xxx ~", note: "CCA/용량/차종에 따라", link: "#symptom" },
  { cat: "배터리", name: "발전기(충전) 점검", range: "₩x,xxx ~", note: "배터리 경고등/방전 반복 시", link: "#symptom" },

  { cat: "진단", name: "스캐너 진단", range: "₩x,xxx ~", note: "경고등/실화/센서 오류 코드 확인", link: "#symptom" },
  { cat: "진단", name: "정밀 점검(시운전 포함)", range: "₩xx,xxx ~", note: "소음/떨림/쏠림 원인 파악", link: "#reserve" },
];

function renderPriceCards(items) {
  const row = document.getElementById("priceRow");
  if (!row) return;
  row.innerHTML = "";

  items.forEach((it) => {
    const card = document.createElement("div");
    card.className = "price-card";
    card.innerHTML = `
      <div class="price-badge">🔧 ${it.cat}</div>
      <div class="price-title">${it.name}</div>
      <div class="price-range">${it.range}</div>
      <div class="price-note">${it.note}</div>
      <div class="price-actions">
        <a class="mini" href="${it.link}">상세</a>
        <button class="mini primary inquiry-btn" type="button" data-item="${it.name}">문의</button>
      </div>
    `;
    row.appendChild(card);
  });

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "price-card";
    empty.innerHTML = `
      <div class="price-title">검색 결과가 없어요</div>
      <div class="price-note">다른 키워드로 검색해보세요. (예: 엔진오일, 브레이크, 배터리)</div>
      <div class="price-actions">
        <button class="mini primary inquiry-btn" type="button" data-item="가격 문의(기타)">문의하기</button>
      </div>
    `;
    row.appendChild(empty);
  }
}

function setupPriceSearch() {
  const input = document.getElementById("priceSearch");
  if (!input) return;

  renderPriceCards(PRICE_ITEMS);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    const filtered = PRICE_ITEMS.filter((it) =>
      (it.cat + " " + it.name + " " + it.note).toLowerCase().includes(q)
    );
    renderPriceCards(filtered);
  });
}

// ✅ 가격 “문의” 버튼 이벤트 (렌더링 재생성 대비 이벤트 위임)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".inquiry-btn");
  if (!btn) return;
  openInquiryForm(btn.dataset.item || "문의");
});

document.addEventListener("DOMContentLoaded", setupPriceSearch);

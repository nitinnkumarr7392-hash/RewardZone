// ========== STATE & VARIABLES ==========
let isLoggedIn = false;
let totalCoins = 0;
let rupeeBalance = 0;
let streakDays = 0;

let firstLoginBonusGiven = false;        // 200 coins first login bonus
let lastCheckInDate = null;              // daily check‑in control
let isSpinning = false;                  // lucky spin control

// ========== INIT & VISUALS ==========
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
  updateBalanceDisplay();
  updateDailyCheckInBtn();
});

function updateBalanceDisplay() {
  const coinsEl = document.getElementById("coinBalance");
  const rupeesEl = document.getElementById("rupeeBalance");
  const modalBalanceEl = document.getElementById("modalBalance");
  const progressFillEl = document.getElementById("progressFill");

  coinsEl.innerText = new Intl.NumberFormat("en-IN").format(totalCoins);
  rupeesEl.innerText = rupeeBalance.toFixed(2);
  if (modalBalanceEl) modalBalanceEl.innerText = rupeeBalance.toFixed(2);

  const progress = Math.min(100, (totalCoins / 500) * 100);
  progressFillEl.style.width = `${progress}%`;
}

// ========= LOGIN / SIGNUP FLOW =========
function showLoginScreen() {
  document.getElementById("loginScreen").classList.add("active");
  document.getElementById("mainApp").classList.remove("active");
  document.getElementById("signupContainer").style.display = "none";
}

function showSignupScreen() {
  document.getElementById("loginScreen").classList.add("active");
  document.getElementById("mainApp").classList.remove("active");
  document.getElementById("signupContainer").style.display = "block";
}

function resetAuthView() {
  const login = document.getElementById("loginContainer");
  const signup = document.getElementById("signupContainer");
  login.style.display = "block";
  signup.style.display = "none";
}

// Simulate persistent user (localStorage — later you can replace with Firebase / API)
function loadUserData() {
  const user = localStorage.getItem("dailycoin_user");
  if (user) {
    const data = JSON.parse(user);
    totalCoins = data.coins;
    rupeeBalance = data.rupees;
    streakDays = data.streak || 0;
    firstLoginBonusGiven = data.firstLoginBonusGiven || false;
    lastCheckInDate = data.lastCheckInDate || null;

    if (!data.loggedIn) return;

    isLoggedIn = true;
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("mainApp").classList.add("active");
    document.getElementById("streakDays").innerText = streakDays;

    // Give first login bonus only once
    if (!firstLoginBonusGiven) {
      totalCoins += 200;
      rupeeBalance = totalCoins / 100;
      firstLoginBonusGiven = true;
      saveUserData();
      showWelcomeModal();
    }
  }
}

function saveUserData() {
  const user = {
    loggedIn: true,
    coins: totalCoins,
    rupees: rupeeBalance,
    streak: streakDays,
    firstLoginBonusGiven,
    lastCheckInDate,
  };
  localStorage.setItem("dailycoin_user", JSON.stringify(user));
}

function showWelcomeModal() {
  const modal = document.getElementById("successModal");
  document.getElementById("successMessage").innerText =
    "Welcome! You’ve earned 200 coins as your first login bonus.";
  modal.style.display = "flex";
  const content = modal.querySelector(".success-content");
  content.style.transform = "translateY(20px)";
  content.style.opacity = 0;

  setTimeout(() => {
    content.style.transition = "all 0.5s ease";
    content.style.transform = "translateY(0)";
    content.style.opacity = 1;
  }, 100);
}

function closeSuccess() {
  const modal = document.getElementById("successModal");
  const content = modal.querySelector(".success-content");
  content.style.transition = "all 0.3s ease";
  content.style.transform = "translateY(-20px)";
  content.style.opacity = 0;

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// ============= LOGIN / SIGNUP (SIMULATED) ==============
function loginWithEmailPassword() {
  const emailInput = document.getElementById("emailInput");
  const passInput = document.getElementById("passwordInput");
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass) {
    alert("Please enter email and password");
    return;
  }

  // Simulate login (in real app, use Firebase / backend)
  isLoggedIn = true;
  saveUserData();
  loadUserData();

  document.getElementById("loginScreen").classList.remove("active");
  document.getElementById("mainApp").classList.add("active");
}

function forgotPassword() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter your email");
    return;
  }

  alert("A password reset link has been sent to " + email);
}

function signupWithPhoneOrEmail() {
  const phoneInput = document.getElementById("signupPhone");
  const emailInput = document.getElementById("signupEmail");
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";

  if (!phone && !email) {
    alert("Please enter phone or email");
    return;
  }

  // Simulate signup
  isLoggedIn = true;
  totalCoins = 0;
  rupeeBalance = 0;
  streakDays = 0;
  firstLoginBonusGiven = false;
  lastCheckInDate = null;

  saveUserData();

  document.getElementById("loginScreen").classList.remove("active");
  document.getElementById("mainApp").classList.add("active");
}

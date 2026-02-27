// ========== GLOBAL STATE ==========

let isLoggedIn = false;
let totalCoins = 0;
let rupeeBalance = 0;
let streakDays = 0;

let firstLoginBonusGiven = false;   // 200 coins only once
let lastCheckInDate = null;         // daily check‑in once a day
let isSpinning = false;             // lucky spin control
let selectedWithdrawMethod = null;

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
  updateBalanceDisplay();
  updateDailyCheckInBtn();
});

function showSuccessModal(message) {
  const modal = document.getElementById("successModal");
  document.getElementById("successMessage").innerText = message;
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

// ========== LOGIN / SIGNUP FLOW ==========

function showLoginScreen() {
  document.getElementById("loginScreen").classList.add("active");
  document.getElementById("mainApp").classList.remove("active");
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("signupContainer").style.display = "none";
}

function showSignupScreen() {
  document.getElementById("loginScreen").classList.add("active");
  document.getElementById("mainApp").classList.remove("active");
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("signupContainer").style.display = "block";
}

// Simulate persistent user using localStorage
function loadUserData() {
  const user = localStorage.getItem("dailycoin_user");
  if (user) {
    const data = JSON.parse(user);
    totalCoins = data.coins || 0;
    rupeeBalance = data.rupees || 0;
    streakDays = data.streak || 0;
    firstLoginBonusGiven = data.firstLoginBonusGiven || false;
    lastCheckInDate = data.lastCheckInDate || null;

    if (data.loggedIn) {
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
}

function saveUserData() {
  const user = {
    loggedIn: isLoggedIn,
    coins: totalCoins,
    rupees: rupeeBalance,
    streak: streakDays,
    firstLoginBonusGiven,
    lastCheckInDate,
  };
  localStorage.setItem("dailycoin_user", JSON.stringify(user));
}

function showWelcomeModal() {
  showSuccessModal("Welcome! You’ve earned 200 coins as your first login bonus.");
}

// ========== LOGIN + SIGNUP LOGIC ==========

function loginWithEmailPassword() {
  const emailInput = document.getElementById("emailInput");
  const passInput = document.getElementById("passwordInput");
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass) {
    showSuccessModal("Please enter email and password.");
    return;
  }

  isLoggedIn = true;
  saveUserData();
  loadUserData();

  document.getElementById("loginScreen").classList.remove("active");
  document.getElementById("mainApp").classList.add("active");

  // If this is the first time login (no bonus given), show welcome
  if (!firstLoginBonusGiven) {
    showWelcomeModal();
  }
}

function signupWithPhoneOrEmail() {
  const phoneInput = document.getElementById("signupPhone");
  const emailInput = document.getElementById("signupEmail");
  const passInput = document.getElementById("signupPassword");
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const pass = passInput ? passInput.value.trim() : "";

  if (!email) {
    showSuccessModal("Please enter email and password.");
    return;
  }

  isLoggedIn = true;
  totalCoins = 0;
  rupeeBalance = 0;
  streakDays = 0;
  firstLoginBonusGiven = false;
  lastCheckInDate = null;

  saveUserData();

  document.getElementById("loginScreen").classList.remove("active");
  document.getElementById("mainApp").classList.add("active");

  showSuccessModal("Account created! Start earning coins.");
}

function forgotPassword() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email) {
    showSuccessModal("Please enter your email.");
    return;
  }

  showSuccessModal("A password reset link has been sent to " + email);
}

// ========== BALANCE DISPLAY ==========
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

// ========== DAILY CHECK‑IN (ONCE PER DAY) ==========

function updateDailyCheckInBtn() {
  const now = new Date();
  const today = now.toDateString();
  const btn = document.querySelector(".task-card[onclick='completeCheckIn()'] .task-btn");
  const circle = document.getElementById("checkInCircle");

  if (btn && circle) {
    if (lastCheckInDate === today) {
      btn.innerText = "Claimed";
      btn.disabled = true;
      btn.style.opacity = 0.6;
      circle.innerText = "1/1";
    } else {
      btn.innerText = "Claim Now";
      btn.disabled = false;
      btn.style.opacity = 1;
      circle.innerText = "0/1";
    }
  }
}

function completeCheckIn() {
  const now = new Date();
  const today = now.toDateString();

  if (lastCheckInDate === today) {
    showSuccessModal("You already claimed today's check‑in.");
    return;
  }

  totalCoins += 75;
  rupeeBalance = totalCoins / 100;
  streakDays++;
  lastCheckInDate = today;

  saveUserData();
  updateBalanceDisplay();
  updateDailyCheckInBtn();

  showSuccessModal(`Daily check‑in done! You earned 75 coins (₹0.75). Streak: ${streakDays} days.`);
}

// ========== TASKS (GENERAL) ==========
function completeTask(type, coins) {
  if (!isLoggedIn) return;

  totalCoins += coins;
  rupeeBalance = totalCoins / 100;

  // Visual coin animation (fly up)
  const btn = event.target;
  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const coin = document.createElement("div");
    coin.innerHTML = '<i class="fas fa-coins"></i>';
    coin.style.position = "fixed";
    coin.style.left = x + "px";
    coin.style.top = y + "px";
    coin.style.color = "#ffd700";
    coin.style.fontSize = "1.2rem";
    coin.style.zIndex = "9999";
    coin.style.pointerEvents = "none";
    coin.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(coin);

    setTimeout(() => {
      coin.style.transition = "all 0.8s ease-out";
      coin.style.transform =
        "translate(-50%, -50%) translate(" +
        (Math.random() * 100 - 50) +
        "px," +
        -(80 + Math.random() * 40) +
        "px) scale(" +
        (0.8 + Math.random() * 0.6) +
        ")";
      coin.style.opacity = 0;
    }, 10);

    setTimeout(() => {
      document.body.removeChild(coin);
    }, 900);
  }

  if (coins > 50) {
    showConfetti();
  }

  saveUserData();
  updateBalanceDisplay();

  showSuccessModal(`Task completed! You earned ${coins} coins (₹${(coins / 100).toFixed(2)}).`);
}

// Confetti (optional fun animation on big rewards)
function showConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = Math.round(randomInRange(5, 8));
    for (let i = 0; i < particleCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.left = randomInRange(0, window.innerWidth) + "px";
      confetti.style.top = "10px";
      confetti.style.width = "8px";
      confetti.style.height = "8px";
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0%";
      confetti.style.background = [
        "#ffd700",
        "#ff4500",
        "#4CAF50",
        "#2196F3",
        "#9C27B0",
      ][Math.floor(Math.random() * 5)];
      confetti.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "999";

      document.body.appendChild(confetti);

      const vx = randomInRange(-2, 2);
      const vy = randomInRange(1, 2);

      let y = 10;
      let x = parseFloat(confetti.style.left);

      const tick = () => {
        y += vy;
        x += vx;
        confetti.style.top = y + "px";
        confetti.style.left = x + "px";

        if (y < window.innerHeight && x > -20 && x < window.innerWidth) {
          requestAnimationFrame(tick);
        } else {
          document.body.removeChild(confetti);
        }
      };

      tick();
    }
  }, 130);
}

// ========== LUCKY SPIN ==========
function spinWheel() {
  if (isSpinning) return;

  const wheel = document.querySelector(".task-icon.spin");
  isSpinning = true;

  // Reset animation
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";

  // Trigger spin
  setTimeout(() => {
    wheel.style.transition = "transform 2s ease-out";
    wheel.style.transform = `rotate(${3600 + Math.floor(Math.random() * 360)}deg)`;
  }, 10);

  // After animation, give coins
  setTimeout(() => {
    const coins = Math.floor(Math.random() * 46) + 5; // 5–50 coins
    totalCoins += coins;
    rupeeBalance = totalCoins / 100;

    saveUserData();
    updateBalanceDisplay();

    showSuccessModal(`Lucky Spin: You won ${coins} coins! (₹${(coins / 100).toFixed(2)})`);
    isSpinning = false;
  }, 2200);
}

// ========== NAVIGATION & WITHDRAW ==========
function switchTab(tab) {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  navItems.forEach((item) => item.classList.remove("active"));

  if (tab === "home") {
    navItems[0].classList.add("active");
  } else if (tab === "history") {
    navItems[1].classList.add("active");
    showSuccessModal("History view coming soon.");
  }
}

// Withdraw system
function showWithdraw() {
  const modal = document.getElementById("withdrawModal");
  const methodCards = document.querySelectorAll(".method-card");

  methodCards.forEach((card) => card.classList.remove("selected"));
  selectedWithdrawMethod = null;

  modal.style.display = "flex";
}

function selectMethod(method) {
  const methodCards = document.querySelectorAll(".method-card");
  methodCards.forEach((card) => card.classList.remove("selected"));
  event.currentTarget.classList.add("selected");
  selectedWithdrawMethod = method;
}

function processWithdraw() {
  const amountInput = document.getElementById("withdrawAmount");
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount < 5) {
    showSuccessModal("Minimum withdrawal is ₹5");
    return;
  }

  if (amount > rupeeBalance) {
    showSuccessModal("Insufficient balance");
    return;
  }

  // Disable button
  const btn = document.querySelector(".withdraw-confirm");
  const originalText = btn.innerText;
  btn.innerText = "Processing...";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerText = originalText;
    btn.disabled = false;

    // Deduct from balance
    const coinsToDeduct = amount * 100;
    totalCoins -= coinsToDeduct;
    rupeeBalance -= amount;

    saveUserData();
    updateBalanceDisplay();

    closeWithdraw();
    showSuccessModal(
      `₹${amount.toFixed(2)} withdrawal request submitted! Amount will be credited shortly.`
    );
  }, 1500);
}

function closeWithdraw() {
  const modal = document.getElementById("withdrawModal");
  modal.style.display = "none";
}

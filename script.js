// Global state
let isLoggedIn = false;
let totalCoins = 1250;
let rupeeBalance = 12.50;
let minWithdrawCoins = 500; // 500 coins = ₹5
let streakDays = 7;

// Auto‑update rupee balance
function updateBalanceDisplay() {
  const coinsEl = document.getElementById("coinBalance");
  const rupeesEl = document.getElementById("rupeeBalance");
  const modalBalanceEl = document.getElementById("modalBalance");
  const progressFillEl = document.getElementById("progressFill");

  coinsEl.innerText = new Intl.NumberFormat("en-IN").format(totalCoins);
  rupeesEl.innerText = rupeeBalance.toFixed(2);
  if (modalBalanceEl) modalBalanceEl.innerText = rupeeBalance.toFixed(2);

  const progress = Math.min(100, (totalCoins / minWithdrawCoins) * 100);
  progressFillEl.style.width = `${progress}%`;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateBalanceDisplay();
});

// Login functions
function googleLogin() {
  // Show loader animation
  const btn = document.querySelector(".google-btn");
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  btn.disabled = true;

  // Simulate auth (you can replace with Firebase later)
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    loginUser();
  }, 1500);
}

function showOTP() {
  document.getElementById("otpContainer").style.display = "block";
}

function verifyOTP() {
  const phoneInput = document.getElementById("phoneInput");

  if (!phoneInput.value || phoneInput.value.length !== 10) {
    phoneInput.style.borderColor = "#f44336";
    return;
  }

  // Show OTP input fields
  const otpContainer = document.getElementById("otpInputs");
  otpContainer.style.display = "flex";

  // Simulate OTP sent
  const otpBtn = document.querySelector(".otp-btn");
  otpBtn.innerHTML = '<i class="fas fa-check"></i> OTP Sent!';
  otpBtn.disabled = true;

  setTimeout(() => {
    otpBtn.innerHTML = "Send OTP";
    otpBtn.disabled = false;
  }, 2000);
}

// Auto‑focus next OTP digit
document.querySelectorAll(".otp-digit").forEach((input, index) => {
  input.addEventListener("input", () => {
    if (input.value.length === 1) {
      const next = input.nextElementSibling;
      if (next && next.classList.contains("otp-digit")) {
        next.focus();
      }
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value === "") {
      const prev = input.previousElementSibling;
      if (prev && prev.classList.contains("otp-digit")) {
        prev.focus();
      }
    }
  });
});

function loginUser() {
  // Hide login, show main app
  document.getElementById("loginScreen").classList.remove("active");
  document.getElementById("mainApp").classList.add("active");
  isLoggedIn = true;

  // Animated success checkmark
  const successModal = document.getElementById("successModal");
  const successContent = successModal.querySelector(".success-content");
  successModal.style.display = "flex";
  successContent.style.transform = "translateY(20px)";
  successContent.style.opacity = 0;

  setTimeout(() => {
    successContent.style.transition = "all 0.5s ease";
    successContent.style.transform = "translateY(0)";
    successContent.style.opacity = 1;
  }, 100);

  document.getElementById("successMessage").innerText =
    "Logged in successfully! Ready to earn coins.";
}

function closeSuccess() {
  const successModal = document.getElementById("successModal");
  const successContent = successModal.querySelector(".success-content");
  successContent.style.transition = "all 0.3s ease";
  successContent.style.transform = "translateY(-20px)";
  successContent.style.opacity = 0;

  setTimeout(() => {
    successModal.style.display = "none";
  }, 300);
}

// Task completion logic
function completeTask(type, coins) {
  if (!isLoggedIn) return;

  // Increment coins
  totalCoins += coins;
  rupeeBalance = totalCoins / 100;

  // Floating coins animation (simulated)
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

  // Update streak (just visual demo)
  streakDays++;
  document.getElementById("streakDays").innerText = streakDays;

  // Confetti on big tasks
  if (coins > 50) {
    showConfetti();
  }

  // Success modal
  const successModal = document.getElementById("successModal");
  document.getElementById("successMessage").innerText =
    `You earned ${coins} coins! Total: ${totalCoins} coins (₹${rupeeBalance.toFixed(2)})`;
  successModal.style.display = "flex";
  const successContent = successModal.querySelector(".success-content");
  successContent.style.transform = "translateY(20px)";
  successContent.style.opacity = 0;

  setTimeout(() => {
    successContent.style.transition = "all 0.5s ease";
    successContent.style.transform = "translateY(0)";
    successContent.style.opacity = 1;
  }, 100);

  updateBalanceDisplay();
}

function showConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const randomInRange = (min, max) =>
    Math.random() * (max - min) + min;

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
      confetti.style.left =
        randomInRange(0, window.innerWidth) + "px";
      confetti.style.top = "10px";
      confetti.style.width = "8px";
      confetti.style.height = "8px";
      confetti.style.borderRadius =
        Math.random() > 0.5 ? "50%" : "0%";
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

// Tab switching
function switchTab(tab) {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  if (tab === "home") {
    navItems[0].classList.add("active");
  } else if (tab === "history") {
    navItems[1].classList.add("active");
    // Show history screen logic (you can extend later)
  }
}

// Withdraw system
let selectedWithdrawMethod = null;

function showWithdraw() {
  const modal = document.getElementById("withdrawModal");
  modal.style.display = "flex";

  // Reset selection
  document.querySelectorAll(".method-card").forEach((card) => {
    card.classList.remove("selected");
  });
  selectedWithdrawMethod = null;
}

function selectMethod(method) {
  selectedWithdrawMethod = method;
  document.querySelectorAll(".method-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");
}

function processWithdraw() {
  const amountInput = document.getElementById("withdrawAmount");
  const amount = parseFloat(amountInput.value);

  if (amount < 5) {
    amountInput.style.borderColor = "#f44336";
    alert("Minimum withdrawal is ₹5");
    return;
  }

  if (amount > rupeeBalance) {
    amountInput.style.borderColor = "#f44336";
    alert("Insufficient balance");
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

    updateBalanceDisplay();

    // Success message
    closeWithdraw();
    const successModal = document.getElementById("successModal");
    document.getElementById("successMessage").innerText =
      `₹${amount.toFixed(2)} withdrawal request submitted! Amount will be credited shortly.`;
    successModal.style.display = "flex";
    const successContent = successModal.querySelector(".success-content");
    successContent.style.transform = "translateY(20px)";
    successContent.style.opacity = 0;

    setTimeout(() => {
      successContent.style.transition = "all 0.5s ease";
      successContent.style.transform = "translateY(0)";
      successContent.style.opacity = 1;
    }, 100);
  }, 1500);
}

function closeWithdraw() {
  const modal = document.getElementById("withdrawModal");
  modal.style.display = "none";
}

// Animation helpers

// Logo pulse
const pulseKeyframes = [
  { transform: "scale(1)", filter: "drop-shadow(0 0 0 rgba(255,215,0,0.8))" },
  { transform: "scale(1.05)", filter: "drop-shadow(0 0 12px rgba(255,215,0,0.8))" },
  { transform: "scale(1)", filter: "drop-shadow(0 0 0 rgba(255,215,0,0.8))" },
];
const pulseTiming = { duration: 2000, iterations: Infinity };

if (document.querySelector(".logo i")) {
  document.querySelector(".logo i").animate(pulseKeyframes, pulseTiming);
}

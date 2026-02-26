class RewardZone {
    constructor() {
        this.user = null;
        this.coins = 0; // Changed to coins (100 coins = ₹1)
        this.streak = 0;
        this.todayCoins = 0;
        this.history = [];
        this.referralCode = '';
        
        // Daily Limits & Tracking
        this.dailyData = {
            checkin: false,
            spins: 0,
            videos: 0,
            puzzles: 0,
            lastCheckin: null
        };
        
        this.tasks = this.generateTasks();
        this.completedTasks = new Set();
        this.gameTime = 0;
        this.gameInterval = null;
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.showSplash();
        this.updateDashboard();
        this.requestNotificationPermission();
    }

    generateTasks() {
        // 20 Video Tasks
        const videos = Array.from({length: 20}, (_, i) => ({
            id: `video${i+1}`,
            type: 'video',
            title: `Video ${i+1}`,
            points: 10 + (i % 5) * 2, // 10-20 coins
            icon: '🎥',
            duration: 8 + i
        }));

        // 20 App Tasks
        const apps = Array.from({length: 10}, (_, i) => ({
            id: `app${i+1}`,
            type: 'app',
            title: `Install App ${i+1}`,
            points: 50 + i * 10, // 50-140 coins
            icon: '📱',
            duration: 3
        }));

        // 20 Puzzle Tasks
        const puzzles = Array.from({length: 20}, (_, i) => ({
            id: `puzzle${i+1}`,
            type: 'puzzle',
            title: `Puzzle ${i+1}`,
            points: 8,
            icon: '🧩',
            duration: 5
        }));

        return [...videos, ...apps, ...puzzles, 
            // Other tasks
            { id: 'survey1', type: 'survey', title: '5 Min Survey', points: 35, icon: '📝', duration: 8 },
            { id: 'quiz1', type: 'quiz', title: 'Daily Quiz', points: 25, icon: '❓', duration: 5 }
        ];
    }

    createUser() {
        const email = document.getElementById('email').value || 'user@rewardzone.com';
        this.user = {
            id: Date.now().toString(),
            email,
            username: email.split('@')[0],
            coins: 200, // Welcome bonus 200 coins
            streak: 1,
            rank: Math.floor(Math.random() * 1000) + 1,
            totalWithdrawn: 0
        };
        this.referralCode = 'RZ' + Math.random().toString(36).substr(2, 6).toUpperCase();
        this.dailyData.lastCheckin = new Date().toDateString();
        this.saveData();
        this.showNotification('🎉 Welcome! 200 Coins Bonus Added!', 4000);
        this.playSound();
    }

    updateDashboard() {
        if (!this.user) return;
        
        document.getElementById('coins').textContent = this.user.coins;
        document.getElementById('rupees').textContent = (this.user.coins / 100).toFixed(2);
        document.getElementById('streak').textContent = this.user.streak;
        document.getElementById('todayPoints').textContent = this.todayCoins;
        document.getElementById('userRank').textContent = this.user.rank;
        document.getElementById('username').textContent = this.user.username;
        document.getElementById('refCode').textContent = this.referralCode;
    }

    // DAILY CHECKIN - 24hr Reset
    handleCheckin() {
        const today = new Date().toDateString();
        if (this.dailyData.checkin || this.dailyData.lastCheckin === today) {
            this.showNotification('✅ Already checked in today!', 2000);
            return;
        }

        const bonus = 15 + (this.user.streak * 3);
        this.addCoins(bonus, 'Daily Check-in');
        this.dailyData.checkin = true;
        this.dailyData.lastCheckin = today;
        this.user.streak++;
        this.saveData();
        this.playSound();
    }

    // LUCKY SPIN - 20 Daily
    handleSpin() {
        if (this.dailyData.spins >= 20) {
            this.showNotification('⏰ 20 spins completed today!', 2000);
            return;
        }

        const coins = Math.floor(Math.random() * 46) + 10; // 10-55 coins
        this.addCoins(coins, `Lucky Spin #${this.dailyData.spins + 1}`);
        this.dailyData.spins++;
        this.saveData();
        this.playSound();
        return coins;
    }

    // REAL TIME GAME - Coins per minute
    startGame(task) {
        document.getElementById('gameTitle').textContent = task.title;
        document.getElementById('gameModal').classList.remove('hidden');
        
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 250;
        
        let gameCoins = 0;
        this.gameTime = 0;
        
        // Simple clicking game
        canvas.onclick = () => {
            gameCoins += 2;
            this.updateGameDisplay(gameCoins);
        };

        this.gameInterval = setInterval(() => {
            this.gameTime++;
            gameCoins += Math.floor(this.gameTime / 60); // Bonus per minute
            this.updateGameDisplay(gameCoins);
        }, 1000);
    }

    updateGameDisplay(coins) {
        document.getElementById('gameTime').textContent = this.gameTime;
        document.getElementById('gameCoins').textContent = coins;
    }

    claimGameCoins() {
        if (this.gameTime === 0) return;
        const coinsPerMinute = Math.floor(this.gameTime / 60) * 50;
        const totalCoins = coinsPerMinute + (this.gameTime * 2);
        this.addCoins(totalCoins, `Game (${this.gameTime}s)`);
        this.stopGame();
    }

    stopGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        document.getElementById('gameModal').classList.add('hidden');
    }

    // PUZZLE GAME - 20 Daily
    startPuzzle(task) {
        document.getElementById('puzzleModal').classList.remove('hidden');
        let solved = 0;
        
        const canvas = document.getElementById('puzzleCanvas');
        const ctx = canvas.getContext('2d');
        
        function drawPuzzle() {
            ctx.clearRect(0, 0, 300, 300);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(20 + Math.random()*260, 20 + Math.random()*260, 30, 30);
            
            if (Math.random() > 0.7 && solved < 20) {
                solved++;
                document.getElementById('puzzlesSolved').textContent = solved;
                document.getElementById('puzzleCoins').textContent = solved * 8;
            }
        }
        
        canvas.onclick = drawPuzzle;
        drawPuzzle();
        
        document.getElementById('claimPuzzleCoins').onclick = () => {
            if (solved > 0) {
                this.addCoins(solved * 8, `Puzzles (${solved}/20)`);
                this.dailyData.puzzles = Math.max(this.dailyData.puzzles || 0, solved);
                document.getElementById('puzzleModal').classList.add('hidden');
            }
        };
    }

    // WITHDRAWAL SYSTEM
    updateWithdrawButton() {
        const coins = this.user.coins;
        const rupees = (coins / 100).toFixed(2);
        const minWithdraw = 500; // 500 coins = ₹5
        
        document.getElementById('withdrawAmount').textContent = rupees;
        const btn = document.getElementById('withdrawBtn');
        
        if (coins >= minWithdraw) {
            btn.disabled = false;
            btn.onclick = () => this.processWithdrawal();
        } else {
            btn.disabled = true;
        }
    }

    processWithdrawal() {
        const method = document.querySelector('input[name="method"]:checked').value;
        const number = document.getElementById('withdrawNumber').value;
        
        if (!number) {
            this.showNotification('⚠️ Enter payment details!', 2000);
            return;
        }

        const coins = this.user.coins;
        const rupees = (coins / 100).toFixed(2);
        
        this.showNotification(`✅ ₹${rupees} sent to ${number} via ${method.toUpperCase()}!`, 4000);
        this.user.coins = 0;
        this.user.totalWithdrawn += parseFloat(rupees);
        this.addCoins(0, `Withdrawn ₹${rupees}`);
        this.saveData();
        this.updateDashboard();
        this.updateWithdrawButton();
        this.playSound();
    }

    addCoins(coins, action) {
        this.user.coins += coins;
        this.todayCoins += coins;
        this.history.unshift({ action, coins, date: new Date().toLocaleString(), rupees: (coins / 100).toFixed(2) });
        this.user.rank = Math.max(1, this.user.rank - Math.floor(coins / 100));
        this.saveData();
        this.updateDashboard();
        this.updateWithdrawButton();
        this.renderProfile();
        this.showNotification(`+${coins} Coins (₹${(coins/100).toFixed(2)}) - ${action}`, 3000);
    }

    // Reset Daily Limits (Auto at midnight)
    resetDailyLimits() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeDiff = tomorrow - now;
        setTimeout(() => {
            this.dailyData = {
                checkin: false,
                spins: 0,
                videos: 0,
                puzzles: 0,
                lastCheckin: null
            };
            this.saveData();
            this.renderTasks();
            this.resetDailyLimits(); // Recurring
        }, timeDiff);
    }

    saveData() {
        localStorage.setItem('rewardzone_data', JSON.stringify({
            user: this.user,
            dailyData: this.dailyData,
            history: this.history.slice(0, 50), // Keep last 50
            referralCode: this.referralCode
        }));
    }

    loadData() {
        try {
            const data = JSON.parse(localStorage.getItem('rewardzone_data') || '{}');
            if (data.user) {
                this.user = data.user;
                this.dailyData = { ...this.dailyData, ...data.dailyData };
                this.history = data.history || [];
                this.referralCode = data.referralCode || '';
            }
        } catch(e) {}
        this.resetDailyLimits();
    }

    // [Other methods same as before - showModal, bindEvents, etc.]
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new RewardZone());

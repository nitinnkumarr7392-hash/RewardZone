class RewardZone {
    constructor() {
        this.user = null;
        this.points = 0;
        this.streak = 0;
        this.todayPoints = 0;
        this.history = [];
        this.referralCode = '';
        this.tasks = this.generateTasks();
        this.completedTasks = new Set();
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.showSplash();
        this.updateDashboard();
        this.requestNotificationPermission();
        this.startStreakCheck();
    }

    generateTasks() {
        return [
            { id: 'video1', type: 'video', title: 'Watch Ad Video', points: 15, icon: '🎥', duration: 10 },
            { id: 'app1', type: 'app', title: 'Install Game App', points: 75, icon: '📱', duration: 3 },
            { id: 'quiz1', type: 'quiz', title: 'Quick Quiz', points: 30, icon: '❓', duration: 5 },
            { id: 'survey1', type: 'survey', title: '5 Q Survey', points: 45, icon: '📝', duration: 8 },
            { id: 'social1', type: 'social', title: 'Share App', points: 20, icon: '📤', duration: 2 },
            { id: 'banner1', type: 'banner', title: 'Click Banner', points: 5, icon: '🖱️', duration: 1 },
            { id: 'game1', type: 'game', title: 'Play Mini Game', points: 25, icon: '🎮', duration: 15 },
            { id: 'puzzle1', type: 'puzzle', title: 'Solve Puzzle', points: 15, icon: '🧩', duration: 10 },
            { id: 'tutorial1', type: 'tutorial', title: 'Watch Tutorial', points: 10, icon: '📖', duration: 7 },
            { id: 'poll1', type: 'poll', title: 'Quick Poll', points: 8, icon: '📊', duration: 2 },
            { id: 'video2', type: 'video', title: 'Product Demo', points: 12, icon: '📺', duration: 8 },
            { id: 'app2', type: 'app', title: 'Shopping App', points: 60, icon: '🛒', duration: 3 },
            { id: 'feedback1', type: 'feedback', title: 'Give Feedback', points: 10, icon: '💬', duration: 4 },
            { id: 'challenge1', type: 'challenge', title: 'Daily Mission', points: 35, icon: '⚡', duration: 12 },
            { id: 'spin1', type: 'spin', title: 'Lucky Wheel', points: 25, icon: '🎰', duration: 3 },
            { id: 'easter1', type: 'easter', title: 'Find Easter Egg', points: 50, icon: '🥚', duration: 5 },
            { id: 'quiz2', type: 'quiz', title: 'Trivia Challenge', points: 40, icon: '🧠', duration: 6 },
            { id: 'social2', type: 'social', title: 'Post on Social', points: 18, icon: '📱', duration: 2 },
            { id: 'banner2', type: 'banner', title: 'Offer Banner', points: 4, icon: '🏷️', duration: 1 },
            { id: 'game2', type: 'game', title: 'Memory Game', points: 20, icon: '🧠', duration: 10 }
        ];
    }

    bindEvents() {
        // Splash to Login
        document.getElementById('getStarted').onclick = () => this.showLogin();

        // Login
        document.getElementById('loginForm').onsubmit = (e) => {
            e.preventDefault();
            this.createUser();
            this.showDashboard();
        };

        // Social Login
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.onclick = () => {
                this.createUser();
                this.showDashboard();
            };
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.onclick = () => this.switchTab(btn.dataset.tab);
        });

        // Quick Actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.onclick = () => this.handleQuickAction(btn.dataset.action);
        });

        // Tasks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.task-item')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.showTaskModal(taskId);
            }
        });

        // Videos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.video-item')) {
                const videoId = e.target.closest('.video-item').dataset.videoId;
                this.playVideo(videoId);
            }
        });

        // Modal
        document.querySelector('.close').onclick = () => this.hideModal();
        document.getElementById('completeTask').onclick = () => this.completeTask();
        document.getElementById('taskModal').onclick = (e) => {
            if (e.target === e.currentTarget) this.hideModal();
        };

        // Referral
        document.getElementById('copyRef').onclick = () => this.copyReferral();
        document.getElementById('redeemBtn').onclick = () => this.redeemPoints();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.getElementById('taskModal').classList.contains('hidden') === false) {
                this.completeTask();
            }
            if (e.key === 'Escape') this.hideModal();
        });
    }

    createUser() {
        const email = document.getElementById('email').value || 'user@rewardzone.com';
        this.user = {
            id: Date.now().toString(),
            email: email,
            username: email.split('@')[0],
            joined: new Date().toISOString(),
            points: 50, // Welcome bonus
            streak: 1,
            rank: Math.floor(Math.random() * 1000) + 1
        };
        this.referralCode = 'RZ' + Math.random().toString(36).substr(2, 6).toUpperCase();
        this.saveData();
        this.showNotification('Welcome Bonus! +₹50', 3000);
        this.playSound();
    }

    showSplash() {
        document.getElementById('splash').classList.remove('hidden');
        setTimeout(() => {
            if (!this.user) {
                document.getElementById('splash').classList.add('hidden');
                this.showLogin();
            }
        }, 2000);
    }

    showLogin() {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
    }

    showDashboard() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.updateDashboard();
        this.renderTasks();
        this.renderVideos();
        this.renderProfile();
    }

    switchTab(tab) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`${tab}Tab`).classList.remove('hidden');
    }

    updateDashboard() {
        if (!this.user) return;
        
        document.getElementById('points').textContent = this.user.points;
        document.getElementById('streak').textContent = this.user.streak;
        document.getElementById('todayPoints').textContent = this.todayPoints;
        document.getElementById('userRank').textContent = this.user.rank;
        document.getElementById('username').textContent = this.user.username;
        document.getElementById('refCode').textContent = this.referralCode;
        document.getElementById('todayEarnings').textContent = '₹' + this.todayPoints;
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-item ${this.completedTasks.has(task.id) ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-icon">${task.icon}</div>
                <div>${task.title}</div>
                <div class="task-points">₹${task.points}</div>
            </div>
        `).join('');
    }

    renderVideos() {
        const videosList = document.getElementById('videosList');
        videosList.innerHTML = this.tasks.filter(t => t.type === 'video').map(video => `
            <div class="video-item" data-video-id="${video.id}">
                <div class="task-icon">${video.icon}</div>
                <div>${video.title}</div>
                <div class="task-points">₹${video.points}</div>
            </div>
        `).join('');
    }

    renderProfile() {
        const badgesList = document.getElementById('badges');
        const badges = [];
        if (this.user.streak >= 7) badges.push('🔥 7-Day Streak');
        if (this.user.points >= 1000) badges.push('⭐ Gold Member');
        if (this.user.points >= 500) badges.push('🥉 Top Earner');
        
        badgesList.innerHTML = badges.map(badge => `<span class="badge">${badge}</span>`).join('');

        const historyList = document.getElementById('historyList');
        historyList.innerHTML = this.history.slice(-5).reverse().map(h => `
            <div class="history-item">
                <span>${h.action}</span>
                <span>+₹${h.points}</span>
            </div>
        `).join('');
    }

    showTaskModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || this.completedTasks.has(taskId)) return;

        document.getElementById('taskTitle').textContent = task.title;
        document.getElementById('taskPoints').textContent = task.points;
        
        const modalContent = document.getElementById('taskContent');
        let content = '';
        
        switch(task.type) {
            case 'video':
                content = `
                    <video width="100%" controls>
                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
                    </video>
                `;
                break;
            case 'quiz':
                content = `
                    <div class="quiz">
                        <p>What is 2+2?</p>
                        <button class="quiz-btn">4</button>
                        <button class="quiz-btn">5</button>
                    </div>
                `;
                break;
            case 'app':
                content = `<p>Redirecting to app store... (simulation)</p>`;
                break;
            default:
                content = `<div class="task-description">${task.title} - Complete in ${task.duration}s</div>`;
        }
        
        modalContent.innerHTML = content;
        document.getElementById('taskModal').classList.remove('hidden');
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                document.getElementById('completeTask').disabled = false;
                clearInterval(interval);
            }
            document.getElementById('progressFill').style.width = progress + '%';
        }, 200);
    }

    hideModal() {
        document.getElementById('taskModal').classList.add('hidden');
    }

    completeTask() {
        const taskId = document.querySelector('.task-item:not(.completed):not([data-task-id=""])')?.dataset.taskId;
        if (!taskId) return;

        const task = this.tasks.find(t => t.id === taskId);
        this.addPoints(task.points, `${task.title} Completed`);
        this.completedTasks.add(taskId);
        this.hideModal();
        this.renderTasks();
        this.playSound();
    }

    handleQuickAction(action) {
        const actions = {
            checkin: { points: 10 + (this.user.streak * 2), message: 'Daily Check-in!' },
            spin: { points: Math.floor(Math.random() * 46) + 5, message: 'Lucky Spin!' },
            challenge: { points: 25, message: 'Daily Challenge Complete!' }
        };

        const result = actions[action];
        if (result) {
            this.addPoints(result.points, result.message);
            this.playSound();
        }
    }

    playVideo(videoId) {
        const video = this.tasks.find(t => t.id === videoId);
        this.showTaskModal(videoId);
    }

    addPoints(points, action) {
        this.user.points += points;
        this.todayPoints += points;
        this.history.unshift({ action, points, date: new Date().toLocaleString() });
        this.user.rank = Math.max(1, this.user.rank - Math.floor(points / 50));
        this.saveData();
        this.updateDashboard();
        this.renderProfile();
        this.showNotification(`+₹${points} - ${action}`, 2500);
    }

    redeemPoints() {
        if (this.user.points >= 100) {
            this.showNotification('₹100 redeemed! Check your wallet.', 3000);
            this.user.points = Math.max(0, this.user.points - 100);
            this.saveData();
            this.updateDashboard();
        } else {
            this.showNotification('Need ₹100 minimum to redeem!', 2000);
        }
    }

    copyReferral() {
        const refLink = `https://rewardzone.com/ref/${this.referralCode}`;
        navigator.clipboard.writeText(refLink).then(() => {
            this.showNotification('Referral link copied!', 1500);
        });
    }

    showNotification(message, duration = 2000) {
        const notif = document.getElementById('notification');
        document.getElementById('notifText').textContent = message;
        notif.classList.remove('hidden');
        
        setTimeout(() => {
            notif.classList.add('hidden');
        }, duration);
    }

    playSound() {
        const audio = document.getElementById('notifSound');
        audio.currentTime = 0;
        audio.play().catch(() => {}); // Ignore audio policy errors
    }

    startStreakCheck() {
        setInterval(() => {
            const today = new Date().toDateString();
            const lastLogin = localStorage.getItem('lastLogin');
            if (lastLogin !== today) {
                this.user.streak++;
                localStorage.setItem('lastLogin', today);
                this.addPoints(5, 'Streak Bonus!');
                this.saveData();
            }
        }, 60000); // Check every minute
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    saveData() {
        localStorage.setItem('rewardzone_user', JSON.stringify(this.user));
        localStorage.setItem('rewardzone_history', JSON.stringify(this.history));
        localStorage.setItem('rewardzone_completed', JSON.stringify([...this.completedTasks]));
        localStorage.setItem('rewardzone_referral', this.referralCode);
    }

    loadData() {
        const userData = localStorage.getItem('rewardzone_user');
        if (userData) {
            this.user = JSON.parse(userData);
            this.history = JSON.parse(localStorage.getItem('rewardzone_history') || '[]');
            this.completedTasks = new Set(JSON.parse(localStorage.getItem('rewardzone_completed') || '[]'));
            this.referralCode = localStorage.getItem('rewardzone_referral') || '';
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RewardZone();
});

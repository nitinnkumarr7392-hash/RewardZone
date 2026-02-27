let coins = 0;
const coinBalance = document.getElementById('coin-balance');
const coinRupee = document.getElementById('coin-rupee');

function updateCoins(amount){
    coins += amount;
    coinBalance.innerText = coins;
    coinRupee.innerText = (coins/100).toFixed(2);
}

/* Login simulation */
document.getElementById('otp-login').addEventListener('click', ()=>{
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
});
document.getElementById('google-login').addEventListener('click', ()=>{
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
});
document.getElementById('signup').addEventListener('click', ()=>{
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
});

/* Task Buttons */
document.querySelector('#video-task button').addEventListener('click', ()=> updateCoins(15));
document.querySelector('#lucky-spin button').addEventListener('click', ()=> updateCoins(Math.floor(Math.random()*46)+5));
document.querySelector('#daily-checkin button').addEventListener('click', ()=> updateCoins(75));
document.querySelector('#game-task button').addEventListener('click', ()=> updateCoins(5)); // per minute simulation
document.querySelector('#puzzle-task button').addEventListener('click', ()=> updateCoins(15));
document.querySelector('#survey-task button').addEventListener('click', ()=> updateCoins(80));

/* Withdraw Modal */
const modal = document.getElementById('withdraw-modal');
document.getElementById('withdraw-btn').addEventListener('click', ()=> modal.style.display='flex');
document.getElementById('close-withdraw').addEventListener('click', ()=> modal.style.display='none');
document.getElementById('confirm-withdraw').addEventListener('click', ()=>{
    alert('Withdraw request submitted!');
    modal.style.display='none';
});

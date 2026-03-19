// 1. Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // یارییەکە بکە بە پڕاوپڕی شاشە

// 2. Initialize TON Connect
const tonConnectUI = new TONConnectUI.TonConnectUI({
    manifestUrl: 'https://your-domain.com/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

// 3. Game Engine (Matter.js)
const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;
const engine = Engine.create();
const world = engine.world;

const canvas = document.getElementById('plinkoCanvas');
const render = Render.create({
    canvas: canvas, engine: engine,
    options: { width: 350, height: 500, wireframes: false, background: 'transparent' }
});

// Create Pixel Pegs
for (let i = 4; i <= 12; i++) {
    for (let j = 0; j < i; j++) {
        const x = 175 + (j - (i - 1) / 2) * 25;
        const y = i * 35;
        const peg = Bodies.circle(x, y, 4, { isStatic: true, render: { fillStyle: '#ff00ff' } });
        Composite.add(world, peg);
    }
}

// Drop Ball Function
document.getElementById('drop-btn').onclick = () => {
    // لێرەدا دەتوانیت مەرجی هەبوونی باڵانسی TON دابنێیت
    if (!tonConnectUI.connected) {
        tg.showAlert("Please connect your Wallet first!");
        return;
    }

    const ball = Bodies.circle(175 + (Math.random() * 2 - 1), 20, 8, {
        restitution: 0.5,
        render: { fillStyle: '#00ff88' }
    });
    Composite.add(world, ball);
    
    // Telegram Haptic Feedback (لەرینەوە)
    tg.HapticFeedback.impactOccurred('medium');
};

// Collision - کاتێک تۆپەکە بەر بزمار دەکەوێت
Events.on(engine, 'collisionStart', (event) => {
    tg.HapticFeedback.selectionChanged(); // لەرینەوەی سوک
});

Render.run(render);
Runner.run(Runner.create(), engine);

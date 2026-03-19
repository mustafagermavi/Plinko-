const tg = window.Telegram.WebApp;
tg.expand();

const tonConnectUI = new TONConnectUI.TonConnectUI({
    manifestUrl: 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test-jest/public/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-btn'
});

const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;
const engine = Engine.create();
const world = engine.world;
engine.gravity.y = 1.3;

const canvas = document.getElementById('plinkoCanvas');
const width = 400; const height = 500;

const render = Render.create({
    canvas: canvas, engine: engine,
    options: { width, height, wireframes: false, background: 'transparent' }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// بزمارەکان (Pegs)
for (let i = 2; i <= 12; i++) {
    for (let j = 0; j <= i; j++) {
        const x = width / 2 + (j - i / 2) * 30;
        const y = 50 + (i * 30);
        Composite.add(world, Bodies.circle(x, y, 3.5, { isStatic: true, render: { fillStyle: '#ffffff88' } }));
    }
}

// مالتپڵایەرەکان
const colors = ["#ff003f", "#ff8000", "#ffff00", "#bfff00", "#00ff88", "#bfff00", "#ffff00", "#ff8000", "#ff003f"];
colors.forEach((col, i) => {
    const x = width / 2 + (i - (colors.length - 1) / 2) * 32;
    Composite.add(world, Bodies.rectangle(x, height - 30, 28, 20, { isStatic: true, label: 'multiplier', render: { fillStyle: col } }));
});

// جووڵەی تۆپ
document.getElementById('drop-btn').onclick = () => {
    if (!tonConnectUI.connected) return tg.showAlert("Connect Wallet!");
    
    const ball = Bodies.circle(width / 2 + (Math.random() * 2 - 1), 20, 7, { restitution: 0.5, render: { fillStyle: '#ff0055' } });
    Composite.add(world, ball);
    tg.HapticFeedback.impactOccurred('medium');
};

// بەرکەوتن
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(pair => {
        if (pair.bodyB.label === 'multiplier') {
            tg.HapticFeedback.notificationOccurred('success');
            setTimeout(() => Composite.remove(world, pair.bodyA), 500);
        }
    });
});

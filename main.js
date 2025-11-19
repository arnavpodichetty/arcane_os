// GLOBAL AUDIO SYSTEM
const AudioSys = {
    ctx: new (window.AudioContext || window.webkitAudioContext)(),
    play(type) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        if (type === 'key') {
            osc.frequency.value = 600 + Math.random() * 200;
            osc.type = 'triangle';
            gain.gain.value = 0.05;
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(now + 0.05);
        } else if (type === 'win') {
            [440, 554, 659].forEach((f, i) => {
                const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
                o.type = 'triangle'; o.frequency.value = f; g.gain.value = 0.1;
                g.gain.exponentialRampToValueAtTime(0.001, now + 3);
                o.connect(g); g.connect(this.ctx.destination);
                o.start(now + i * 0.1); o.stop(now + 3);
            });
        } else if (type === 'error') {
            osc.type = 'sawtooth'; osc.frequency.value = 150;
            gain.gain.value = 0.1; gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(now + 0.3);
        }
    }
};

// BOOT SEQUENCER (Phase 1 -> Phase 2 Transition)
const BootSequence = {
    start() {
        document.getElementById('ui-layer').style.display = 'none';
        const b = document.getElementById('boot-layer');
        b.style.display = 'block';
        
        const lines = ["Loading Kernel...", "Mounting /dev/sda1...", "Starting X11...", "Initializing Desktop Environment..."];
        let i = 0;
        
        const int = setInterval(() => {
            document.getElementById('boot-log').innerHTML += `<div>${lines[i]} [OK]</div>`;
            i++;
            if (i >= lines.length) {
                clearInterval(int);
                setTimeout(() => {
                    b.style.display = 'none';
                    GUI.init();
                }, 1500);
            }
        }, 800);
    }
};

// INITIALIZATION
window.onload = () => {
    Terminal.init();
};
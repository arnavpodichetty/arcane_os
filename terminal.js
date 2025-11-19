const TermFS = {
    tree: {
        "readme.txt": "MISSION: Unlock the Core.\n1. Find password in logs.\n2. Run /admin/unlock_core.exe",
        "system": { "config.txt": "System Owner: Dr. Vance\nRegion: Sector 4" },
        "logs": { "chat_history.txt": "USER: Pass is 2029." },
        "admin": {
            "unlock_core.exe": "BINARY",
            "notes.txt": "Don't run crack.exe on the core, it triggers the alarm."
        },
        "bin": {
            "system_liberate.exe": "BINARY",
            "crack.exe": "BINARY",   // RESTORED
            "matrix.exe": "BINARY"   // RESTORED
        }
    },
    path: [],
    
    // Vault (Appears after unlock)
    vault: { "project.txt": "ID: 9901" }
};

const Terminal = {
    input: document.getElementById('cmd'),
    output: document.getElementById('output'),
    accessLevel: 1,
    
    state: 'COMMAND', 
    passwordCallback: null,
    targetPassword: null,

    init() {
        this.input.addEventListener('keydown', e => {
            if (document.getElementById('ui-layer').style.display === 'none') return;
            if (e.key === 'Enter') this.handleEnter();
            AudioSys.play('key');
        });
        
        document.addEventListener('click', () => {
            if (document.getElementById('ui-layer').style.display !== 'none') this.input.focus();
        });
        
        this.updateTree();
    },

    handleEnter() {
        const val = this.input.value.trim();
        this.input.value = ''; 

        if (this.state === 'PASSWORD') {
            if (val === this.targetPassword) {
                this.state = 'COMMAND';
                this.input.placeholder = "";
                if (this.passwordCallback) this.passwordCallback();
            } else {
                this.print("ACCESS DENIED", 'error');
                AudioSys.play('error');
                document.getElementById('terminal-win').classList.add('shaking');
                setTimeout(() => document.getElementById('terminal-win').classList.remove('shaking'), 500);
                this.state = 'COMMAND';
                this.input.placeholder = "";
            }
        } else {
            if (!val) return;
            this.print(`> ${val}`, 'txt');
            this.exec(val);
        }
    },

    print(txt, cls = '') {
        this.output.innerHTML += `<div class="${cls}">${txt}</div>`;
        this.output.scrollTop = this.output.scrollHeight;
    },

    updateTree() {
        const t = document.getElementById('tree-view');
        t.innerText = "/root\n├── system/\n├── logs/\n├── admin/\n├── bin/";
        if (this.accessLevel > 1) t.innerText += "\n└── vault/ [NEW]";
    },

    promptPassword(msg, correctPass, callback) {
        this.print(msg, 'gold');
        this.state = 'PASSWORD';
        this.targetPassword = correctPass;
        this.passwordCallback = callback;
        this.input.placeholder = "ENTER PASSWORD...";
    },

    // --- VISUAL HACK EFFECT (RESTORED) ---
    async visualHack() {
        this.print("INITIATING BRUTE FORCE...", 'exe');
        const chars = "0123456789ABCDEF";
        for(let i=0; i<15; i++) {
            let str = "";
            for(let j=0; j<32; j++) str += chars[Math.floor(Math.random()*16)];
            this.print(str, 'dir'); // using 'dir' for blue color
            await new Promise(r => setTimeout(r, 50));
        }
        this.print("FAILURE. ENCRYPTION TOO STRONG.", 'error');
    },

    exec(val) {
        const [cmd, arg] = val.split(' ');
        
        if (cmd === 'ls') {
            let dir = TermFS.tree;
            for (let p of TermFS.path) dir = dir[p];
            for (let k in dir) {
                let type = (typeof dir[k] === 'object') ? 'dir' : (dir[k] === 'BINARY' ? 'exe' : 'txt');
                this.print(k, type);
            }
        }
        else if (cmd === 'cd') {
            if (!arg || arg === '..') TermFS.path.pop();
            else if (TermFS.tree[arg]) TermFS.path.push(arg);
            else this.print("Invalid dir", 'error');
        }
        else if (cmd === 'cat') {
            let dir = TermFS.tree;
            for (let p of TermFS.path) dir = dir[p];
            if (dir[arg] && dir[arg] !== 'BINARY') this.print(dir[arg], 'success');
            else this.print("Error reading file", 'error');
        }
        else if (cmd === 'run') {
            if (arg === 'unlock_core.exe') {
                this.promptPassword("ENTER CORE PASSCODE:", "2029", () => {
                    this.accessLevel = 2;
                    this.print("CORE UNLOCKED. /vault MOUNTED.", 'gold');
                    TermFS.tree.vault = TermFS.vault; 
                    this.updateTree();
                });
            }
            else if (arg === 'system_liberate.exe') {
                if (this.accessLevel < 2) return this.print("ACCESS DENIED", 'error');
                this.promptPassword("ENTER MASTER KEY (Name-ID):", "Vance-9901", () => {
                    this.print("SYSTEM REBOOTING...", 'gold');
                    AudioSys.play('win');
                    setTimeout(BootSequence.start, 2000);
                });
            }
            // RESTORED RED HERRINGS
            else if (arg === 'crack.exe') {
                this.visualHack();
            }
            else if (arg === 'matrix.exe') {
                this.print("The Matrix has you...", 'success');
                this.visualHack();
            }
            else this.print("File not found", 'error');
        }
        else if (cmd === 'help') this.print("ls, cd, cat, run", 'success');
        else this.print("Unknown command", 'error');
    }
};
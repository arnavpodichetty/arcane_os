// --- FILE SYSTEM ---
const GUI_FS = {
    "C:": {
        "Documents": {
            "Images": { "schematic.svg": "IMAGE_DATA" },
            "todo.txt": "1. Fix Server.\n2. Email Mom.\n3. Delete old logs.",
            "bookmarks.html": "<html><body><h3>Bookmarks</h3><ul><li><a href='http://www.thevoid.net'>The Void</a></li></ul></body></html>",
            "weird_code.txt": "BINARY DUMP: 01000111 01001111 01000100"
        },
        "RecycleBin": { "server_log.old": "SERVER CONNECTION FAILURE\nTARGET IP: 192.168.99.4\nERROR: 404" },
        "System": { "config.ini": "[ADMIN]\nStatus=LOCKED\nAuth=NETWORK_REQUIRED" },
        "Downloads": { "decrypter_installer.exe": "INSTALLER" }
    }
};

const GUI_REGISTRY = {
    "HKEY_LOCAL_MACHINE": {
        "SOFTWARE": {
            "SECURITY": {
                "AdminPolicy": {
                    _values: {
                        "EnableAdminPanel": 0,
                        "PolicyNote": "0 = Disabled by ARCANE, 1 = Admin interface enabled"
                    }
                }
            }
        }
    }
};

// --- THE INTERNET SIMULATION ---
GUI_FS.sites = {
    "file:///C:/bookmarks.html": {
        content: `<div class="web-header">My Bookmarks</div>
                  <ul>
                      <li><span class="web-link" data-url="http://www.thevoid.net">The Void (Puzzle)</span></li>
                  </ul>`
    },
    "localhost": {
        content: `<div class="web-header">Arcane Intranet</div><p>Welcome to the local portal.</p><p>Useful Links:</p><ul><li><span class="web-link" data-url="http://www.tools.local">Binary Converter Tool</span></li><li><span class="web-link" data-url="http://www.arcane-corp.com">Corporate News</span></li><li><span class="web-link" data-url="http://www.dino-game.net">Dino Jump Game</span></li></ul>`
    },
    "www.dino-game.net": {
        // UPDATED: Accurate Chrome Dino SVG Sprite
        content: `<div class="web-header">Dino Run</div>
                  <div id="game-area" style="width:100%;height:150px;border-bottom:2px solid #535353;position:relative;overflow:hidden;background:#fff;">
                      <div id="dino" style="width:44px;height:47px;position:absolute;bottom:0;left:20px;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 47'%3E%3Cpath fill='%23535353' d='M44 47h-4v-4h-4v4h-4v-4h-2v-4h-2v-2h-2v-4h-2v-2h-4v-2h-2v-6h-2v-2h2v-2h2v-4h2v-2h2v-2h2v-2h18v2h2v2h2v2h-2v2h-2v2h2v2h2v2h-2v2h-2v2h-2v2h-4v2h4v2h4v10zm-8-42h-2v2h2v-2zm-4 0h-2v2h2v-2z'/%3E%3C/svg%3E&quot;);background-size:contain;background-repeat:no-repeat;"></div>
                      <div id="cactus" style="width:25px;height:50px;position:absolute;bottom:0;left:400px;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23535353'%3E%3Cpath d='M10 2h4v12h2v-4h2v6h-2v2h-2v4h-4v-4H8v-2H6v-6h2v4h2V2z'/%3E%3C/svg%3E&quot;);background-size:contain;background-repeat:no-repeat;"></div>
                      
                      <div id="score-display" style="position:absolute;top:10px;right:10px;font-family:monospace;font-weight:bold;color:#535353;">Score: 0</div>
                      <div id="game-over" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;text-align:center;font-weight:bold;background:rgba(255,255,255,0.9);padding:10px;border:1px solid #000;z-index:10;"></div>
                  </div>
                  <p>Press <b>SPACE</b> to Jump. <br>Reach Score 10 to reveal the secret!</p>`,
        script: `
            let score = 0;
            let gameOver = false;
            let isJumping = false;
            const dino = document.getElementById('dino');
            const cactus = document.getElementById('cactus');
            const scoreDisp = document.getElementById('score-display');
            const msg = document.getElementById('game-over');

            const jump = () => {
                if(isJumping || gameOver) return;
                isJumping = true;
                let up = setInterval(() => {
                    if(!dino) { clearInterval(up); return; }
                    let b = parseInt(window.getComputedStyle(dino).bottom);
                    // Adjusted jump height for new sprite
                    if(b >= 100) {
                        clearInterval(up);
                        let down = setInterval(() => {
                            if(!dino) { clearInterval(down); return; }
                            let b = parseInt(window.getComputedStyle(dino).bottom);
                            if(b <= 0) {
                                clearInterval(down);
                                isJumping = false;
                            }
                            dino.style.bottom = (b - 5) + 'px';
                        }, 20);
                    }
                    dino.style.bottom = (b + 5) + 'px';
                }, 20);
            };

            const listener = (e) => { if(e.code === 'Space') jump(); };
            document.addEventListener('keydown', listener);

            const loop = setInterval(() => {
                if(!document.getElementById('game-area')) {
                    clearInterval(loop);
                    document.removeEventListener('keydown', listener);
                    return;
                }
                if(gameOver) return;

                let cLeft = parseInt(window.getComputedStyle(cactus).left);
                
                if(cLeft < -25) {
                    cactus.style.left = '450px';
                    score++;
                    scoreDisp.innerText = 'Score: ' + score;
                } else {
                    cactus.style.left = (cLeft - 7) + 'px';
                }

                // Adjusted Collision Logic for new sprites
                let dBottom = parseInt(window.getComputedStyle(dino).bottom);
                // Dino width ~44, Cactus width ~25
                if(cLeft < 50 && cLeft > 10 && dBottom < 40) {
                    gameOver = true;
                    msg.style.display = 'block';
                    if(score >= 10) {
                        msg.innerHTML = 'JOKES ON YOU,<br>THERE WAS NOTHING HERE.';
                        msg.style.color = 'red';
                    } else {
                        msg.innerText = 'GAME OVER';
                    }
                }
            }, 20);
        `
    },
    "www.thevoid.net": {
        content: `<div class="web-header" style="color:#000">THE VOID</div><p>I am the beginning of everything, the end of everywhere. I'm the beginning of eternity, the end of time and space.</p><p>What am I?</p><input type="text" id="void-ans"><button onclick="GUI.checkVoid()">Submit</button><div id="void-res"></div>`,
        script: `GUI.checkVoid = function() { const a = document.getElementById('void-ans').value.toLowerCase(); if(a==='e') document.getElementById('void-res').innerHTML='<br>CORRECT. <b style="color:red">ALPHA KEY: VECTOR</b>'; else document.getElementById('void-res').innerText='Incorrect.'; }`
    },
    "www.arcane-corp.com": {
        content: `<div class="web-header">Arcane Corp</div><p>Building the future, today.</p><hr><p><b>News:</b> Server maintenance scheduled.</p>` 
    },
    "www.tools.local": {
        content: `<div class="web-header">Binary Tool</div><p>Enter Binary:</p><input type="text" id="bin-in"><button onclick="GUI.convertBin()">Convert</button><div id="bin-out" style="font-weight:bold; margin-top:10px;"></div>`,
        script: `GUI.convertBin = function() { const b = document.getElementById('bin-in').value.replace(/ /g,''); let s = ''; for(let i=0;i<b.length;i+=8) s += String.fromCharCode(parseInt(b.substr(i,8), 2)); document.getElementById('bin-out').innerText = 'RESULT: ' + s; }`
    },
    "404": { content: `<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>` }
};

const GUI = {
    zIndex: 100,
    windows: [],
    isStartOpen: false,
    networkConnected: false,
    decrypted: false,
    decrypterInstalled: false,
    adminUnlocked: false,
    notesContent: '',
    windowCloseHandlers: {},
    messengerStage: 0,
    messengerBlocked: false,
    messengerRewarded: false,
    messengerLog: [],
    registryData: null,
    adminPolicyUnlocked: false,

    init() {
        document.getElementById('gui-layer').style.display = 'block';
        setInterval(() => {
            document.getElementById('clock-tray').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        }, 1000);
        this.sites = GUI_FS.sites; 
        this.registryData = JSON.parse(JSON.stringify(GUI_REGISTRY));
        this.updateAdminPolicyFlag();
        try {
            const savedNotes = localStorage.getItem('arcane_notes');
            if(savedNotes !== null) this.notesContent = savedNotes;
        } catch(e) {
            this.notesContent = '';
        }
        this.initializeMessenger();
    },

    toggleStart() {
        const menu = document.getElementById('start-menu');
        const btn = document.getElementById('start-btn');
        this.isStartOpen = !this.isStartOpen;
        
        if (this.isStartOpen) {
            menu.style.display = 'flex';
            btn.classList.add('active');
            menu.style.zIndex = 9999; 
        } else {
            menu.style.display = 'none';
            btn.classList.remove('active');
        }
    },

    triggerPurge() {
        if (!this.decrypted) {
            AudioSys.play('error');
            alert("SYSTEM ERROR 99: GLOBAL ENCRYPTION DETECTED.\n\nPURGE FAILED.\n\nInitiating emergency download of 'Decrypter_Installer.exe' to Desktop...");
            
            if(!this.decrypterInstalled) {
                const d = document.createElement('div');
                d.className = 'd-icon';
                d.onclick = () => GUI.openApp('decrypter');
                d.innerHTML = `<svg class="d-img"><use href="#icon-shield"/></svg><span>Decrypter</span>`;
                document.getElementById('desktop-icons').appendChild(d);
                this.decrypterInstalled = true;
            }
            return;
        }

        AudioSys.play('win');
        document.body.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#0f0;font-family:monospace;text-align:center;flex-direction:column;">
                <h1 style="font-size:4rem; text-shadow: 0 0 20px #0f0;">SYSTEM PURGED</h1>
                <p style="color:white; font-size:1.5rem;">ROOT ACCESS SECURED.</p>
                <p style="color:#555;">CONGRATULATIONS. YOU HAVE BEATEN THE SIMULATION.</p>
            </div>
        `;
    },

    openApp(type, arg1, arg2) {
        if (this.isStartOpen) this.toggleStart();

        if (type === 'explorer') this.createExplorerWindow(arg1 || 'My Computer', arg2);
        if (type === 'mail') this.createMailWindow();
        if (type === 'admin') this.createAdminWindow();
        if (type === 'network') this.createNetworkWindow();
        if (type === 'image') this.createImageWindow();
        if (type === 'browser') this.createBrowserWindow(arg1);
        if (type === 'decrypter') this.createDecrypterWindow();
        if (type === 'source') this.createSourceWindow(arg1);
        if (type === 'notes') this.createNotesWindow();
        if (type === 'messenger') this.createMessengerWindow();
        if (type === 'registry') this.createRegistryWindow();
    },

    createWindow(title, width, height, contentHTML, customId, onClose) {
        const id = customId || ('win-' + Date.now());
        const win = document.createElement('div');
        win.className = 'window-frame';
        win.style.width = width + 'px';
        win.style.height = height + 'px';
        win.style.left = (50 + (this.windows.length * 20)) + 'px';
        win.style.top = (50 + (this.windows.length * 20)) + 'px';
        win.style.zIndex = ++this.zIndex;
        win.id = id;

        win.onmousedown = () => { win.style.zIndex = ++GUI.zIndex; };

        win.innerHTML = `
            <div class="title-bar" onmousedown="GUI.drag(event, '${id}')">
                <div style="display:flex;align-items:center;gap:5px;">${title}</div>
                <div class="win-controls">
                    <div class="win-btn" onclick="GUI.closeWindow('${id}')">X</div>
                </div>
            </div>
            <div class="win-content">${contentHTML}</div>
        `;
        
        document.getElementById('gui-layer').appendChild(win);
        this.windows.push(win);
        if(typeof onClose === 'function') this.windowCloseHandlers[id] = onClose;
        return win;
    },

    closeWindow(winId) {
        const win = document.getElementById(winId);
        if(!win) return;
        const handler = this.windowCloseHandlers[winId];
        if(handler) {
            try { handler(win); } catch(e) {}
            delete this.windowCloseHandlers[winId];
        }
        win.remove();
        this.windows = this.windows.filter(w => w.id !== winId);
    },

    createBrowserWindow(startUrl) {
        const winId = 'browser-' + Date.now();
        const html = `
            <div class="browser-toolbar">
                <button class="btn-gui" onclick="GUI.navBrowser('home', '${winId}')">Home</button>
                <input type="text" class="browser-address" id="${winId}-url" value="http://localhost">
                <button class="btn-gui" onclick="GUI.navBrowser(null, '${winId}')">Go</button>
                <button class="btn-gui" onclick="GUI.viewSource('${winId}')">View Source</button>
            </div>
            <div class="browser-content" id="${winId}-content" tabindex="0"></div>
        `;
        this.createWindow("NetScape Navigator", 500, 400, html, winId);
        this.navBrowser(startUrl || 'http://localhost', winId);
    },

    // FIX: Removed complex event delegation logic to allow inline 'onclick' to work natively
    navBrowser(url, winId) {
        if(!winId) {
            const browsers = document.querySelectorAll('[id^="browser-"]');
            if(browsers.length > 0) winId = browsers[browsers.length-1].id;
            else { this.createBrowserWindow(url); return; }
        }

        const addrInput = document.getElementById(`${winId}-url`);
        const contentDiv = document.getElementById(`${winId}-content`);
        
        let target = url || addrInput.value;
        if(target === 'home') target = 'http://localhost';
        
        let key = target.replace('http://', '');
        
        let page = this.sites[key];
        if(!page) page = this.sites['404'];

        addrInput.value = target.startsWith('file:') ? target : "http://" + key;
        contentDiv.innerHTML = page.content;
        
        // Save raw content for View Source
        contentDiv.dataset.raw = page.content;
        this.bindBrowserLinks(winId);
        contentDiv.focus();

        if(page.script) { try { eval(page.script); } catch(e) {} }
    },

    bindBrowserLinks(winId) {
        const contentDiv = document.getElementById(`${winId}-content`);
        if(!contentDiv) return;

        if(contentDiv._linkHandler) contentDiv.removeEventListener('click', contentDiv._linkHandler);

        const handler = (e) => {
            const link = e.target.closest('.web-link, a');
            if(!link) return;

            const targetUrl = link.dataset.url || link.getAttribute('href');
            if(!targetUrl) return;

            e.preventDefault();
            this.navBrowser(targetUrl, winId);
        };

        contentDiv.addEventListener('click', handler);
        contentDiv._linkHandler = handler;
    },

    viewSource(winId) {
        const contentDiv = document.getElementById(`${winId}-content`);
        const source = contentDiv.dataset.raw || "No source available.";
        this.openApp('source', source);
    },

    createSourceWindow(content) {
        const html = `<textarea style="width:100%;height:100%;font-family:monospace;background:#fff;color:#000;">${content.replace(/</g, '&lt;')}</textarea>`;
        this.createWindow("Source Code", 400, 300, html);
    },

    createNotesWindow() {
        const existing = document.querySelector('[data-app="notes"]');
        if(existing) { existing.style.zIndex = ++this.zIndex; const area = existing.querySelector('.notes-textarea'); if(area) area.focus(); return; }

        const winId = 'notes-' + Date.now();
        const html = `
            <div class="notes-wrapper">
                <textarea id="${winId}-textarea" class="notes-textarea" placeholder="Write down clues, passwords, anything important..."></textarea>
            </div>
        `;
        const win = this.createWindow("Clue Notes", 300, 320, html, winId, () => {
            const area = document.getElementById(`${winId}-textarea`);
            if(area) this.saveNotesContent(area.value);
            win.removeAttribute('data-app');
        });
        win.dataset.app = 'notes';
        const area = document.getElementById(`${winId}-textarea`);
        if(area) {
            area.value = this.notesContent;
            area.addEventListener('input', (e) => this.saveNotesContent(e.target.value));
            area.focus();
            area.setSelectionRange(area.value.length, area.value.length);
        }
    },

    saveNotesContent(val) {
        this.notesContent = val;
        try { localStorage.setItem('arcane_notes', val); } catch(e) {}
    },

    createRegistryWindow() {
        const existing = document.querySelector('[data-app="registry"]');
        if(existing) { existing.style.zIndex = ++this.zIndex; return; }

        const winId = 'reg-' + Date.now();
        const html = `
            <div class="registry-layout">
                <div class="registry-tree" id="${winId}-tree"></div>
                <div class="registry-detail">
                    <div class="registry-path" id="${winId}-path">Select a key to view values.</div>
                    <div class="registry-values" id="${winId}-values">No key selected.</div>
                    <div class="registry-status" id="${winId}-status">Admin Panel currently disabled. Set EnableAdminPanel to 1.</div>
                    <button class="btn-gui" id="${winId}-toggle" style="display:none;" onclick="GUI.setRegistryValue('${winId}', 'EnableAdminPanel')">Set EnableAdminPanel = 1</button>
                </div>
            </div>
        `;
        const win = this.createWindow("Registry Editor", 470, 330, html, winId);
        win.dataset.app = 'registry';
        this.renderRegistryTree(winId);
    },

    renderRegistryTree(winId) {
        const treeDiv = document.getElementById(`${winId}-tree`);
        if(!treeDiv) return;
        const win = document.getElementById(winId);
        const selected = win?.dataset.regSelected || '';
        treeDiv.innerHTML = this.buildRegistryTreeHTML(this.registryData, [], selected, winId);
    },

    buildRegistryTreeHTML(node, path, selectedPath, winId) {
        if(!node) return '';
        let html = '';
        Object.keys(node).forEach(key => {
            if(key === '_values') return;
            const nextPath = [...path, key];
            const pathKey = nextPath.join('|');
            const isSelected = selectedPath === pathKey;
            html += `<div class="reg-node ${isSelected ? 'selected' : ''}" onclick="GUI.selectRegistryKey('${winId}', '${pathKey}')">${key}</div>`;
            html += `<div class="reg-children">${this.buildRegistryTreeHTML(node[key], nextPath, selectedPath, winId)}</div>`;
        });
        return html;
    },

    selectRegistryKey(winId, pathKey) {
        const win = document.getElementById(winId);
        if(!win) return;
        win.dataset.regSelected = pathKey;
        const path = pathKey.split('|').filter(Boolean);
        const node = this.getRegistryNode(path);
        this.renderRegistryTree(winId);
        this.renderRegistryValues(winId, node, path);
    },

    renderRegistryValues(winId, node, path) {
        const pathDiv = document.getElementById(`${winId}-path`);
        const valuesDiv = document.getElementById(`${winId}-values`);
        const toggleBtn = document.getElementById(`${winId}-toggle`);
        const status = document.getElementById(`${winId}-status`);
        if(pathDiv) pathDiv.innerText = path.length ? path.join('\\') : 'Select a key to view values.';

        if(!node || !node._values) {
            if(valuesDiv) valuesDiv.innerHTML = '<div class="registry-empty">No values in this key.</div>';
            if(toggleBtn) toggleBtn.style.display = 'none';
            if(status) status.innerText = this.adminPolicyUnlocked ? 'Admin Panel policy satisfied.' : 'Admin Panel disabled. Set EnableAdminPanel to 1.';
            return;
        }

        const rows = Object.entries(node._values).map(([name, value]) => `
            <div class="registry-value-row">
                <span>${name}</span>
                <span>${value}</span>
            </div>
        `).join('');
        if(valuesDiv) valuesDiv.innerHTML = rows;

        if(toggleBtn) {
            if(Object.prototype.hasOwnProperty.call(node._values, 'EnableAdminPanel')) {
                toggleBtn.style.display = 'block';
                toggleBtn.disabled = node._values.EnableAdminPanel === 1;
            } else {
                toggleBtn.style.display = 'none';
            }
        }

        if(status) status.innerText = this.adminPolicyUnlocked ? 'Admin Panel policy satisfied.' : 'Admin Panel disabled. Set EnableAdminPanel to 1.';
    },

    setRegistryValue(winId, valueName) {
        const win = document.getElementById(winId);
        if(!win) return;
        const pathKey = win.dataset.regSelected;
        if(!pathKey) { alert('Select a key first.'); return; }
        const path = pathKey.split('|').filter(Boolean);
        const node = this.getRegistryNode(path);
        if(!node || !node._values || !Object.prototype.hasOwnProperty.call(node._values, valueName)) return;

        node._values[valueName] = 1;
        const status = document.getElementById(`${winId}-status`);
        if(status) status.innerText = `${valueName} set to 1.`;

        this.updateAdminPolicyFlag();
        this.renderRegistryValues(winId, node, path);
    },

    getRegistryNode(path) {
        if(!this.registryData) return null;
        let curr = this.registryData;
        for(const key of path) {
            if(!curr[key]) return null;
            curr = curr[key];
        }
        return curr;
    },

    getRegistryValue(path, valueName) {
        const node = this.getRegistryNode(path);
        if(node && node._values && Object.prototype.hasOwnProperty.call(node._values, valueName)) {
            return node._values[valueName];
        }
        return null;
    },

    updateAdminPolicyFlag() {
        const val = this.getRegistryValue(['HKEY_LOCAL_MACHINE', 'SOFTWARE', 'SECURITY', 'AdminPolicy'], 'EnableAdminPanel');
        this.adminPolicyUnlocked = val === 1;
    },

    initializeMessenger() {
        if(this.messengerLog.length === 0) {
            this.messengerLog.push({ sender: 'system', text: 'Connecting to Arcane Corporate Chat...' });
            this.messengerLog.push({ sender: 'steve', text: 'Status green here. Who is this?' });
        }
    },

    createMessengerWindow() {
        const existing = document.querySelector('[data-app="messenger"]');
        if(existing) { existing.style.zIndex = ++this.zIndex; return; }

        const winId = 'msg-' + Date.now();
        const html = `
            <div class="messenger-wrapper">
                <div class="messenger-log" id="${winId}-log"></div>
                <div class="messenger-options" id="${winId}-options"></div>
            </div>
        `;
        const win = this.createWindow("Messenger", 360, 320, html, winId);
        win.dataset.app = 'messenger';
        this.renderMessenger(winId);
    },

    renderMessenger(winId) {
        const logDiv = document.getElementById(`${winId}-log`);
        const optDiv = document.getElementById(`${winId}-options`);
        if(!logDiv || !optDiv) return;

        logDiv.innerHTML = this.messengerLog.map(msg => {
            let label = '';
            if(msg.sender === 'you') label = 'You: ';
            else if(msg.sender === 'steve') label = 'SysAdmin_Steve: ';
            else if(msg.sender === 'system') label = 'System: ';
            return `<div class="chat-line ${msg.sender}">${label}${msg.text}</div>`;
        }).join('');
        logDiv.scrollTop = logDiv.scrollHeight;

        optDiv.innerHTML = this.getMessengerOptionsHTML(winId);
    },

    getMessengerOptionsHTML(winId) {
        if(this.messengerRewarded) {
            return `
                <div class="option-title">Mission Complete</div>
                <div class="chat-line system">Intel archived. Check your notes for the new passcode.</div>
            `;
        }
        if(this.messengerBlocked) {
            return `
                <div class="option-title">Connection Severed</div>
                <div class="chat-line system">SysAdmin_Steve blocked this channel.</div>
                <button class="option-btn" onclick="GUI.resetMessengerConversation('${winId}')">Spoof New Alias</button>
            `;
        }

        if(this.messengerStage === 0) {
            return `
                <div class="option-title">Choose your opener</div>
                <button class="option-btn" onclick="GUI.handleMessengerChoice('${winId}', 'audit')">Security here. We’re running an urgent incident drill.</button>
                <button class="option-btn" onclick="GUI.handleMessengerChoice('${winId}', 'password')">Hey can you tell me the admin password?</button>
                <button class="option-btn" onclick="GUI.handleMessengerChoice('${winId}', 'casual')">Yo Steve! Long time no chat.</button>
            `;
        }

        if(this.messengerStage === 1) {
            return `
                <div class="option-title">Next prompt</div>
                <button class="option-btn" onclick="GUI.handleMessengerChoice('${winId}', 'ip')">Need to verify the gateway IP you’re covering tonight.</button>
                <button class="option-btn" onclick="GUI.handleMessengerChoice('${winId}', 'reset')">Go ahead and reset your password to "letmein99".</button>
                <button class="option-btn" onclick="GUI.handleMessengerChoice('${winId}', 'chitchat')">Relax, just making sure you’re awake.</button>
            `;
        }

        return '';
    },

    handleMessengerChoice(winId, choice) {
        if(this.messengerBlocked || this.messengerRewarded) return;

        if(this.messengerStage === 0) {
            if(choice === 'audit') {
                this.appendMessengerLog('you', 'Security here. Kicking off an urgent incident drill.');
                this.appendMessengerLog('steve', 'Ugh, another one? Fine. What do you need?');
                this.messengerStage = 1;
            } else {
                this.triggerMessengerBlock('SysAdmin_Steve: Nice try. Logging this and blocking you.');
            }
        } else if(this.messengerStage === 1) {
            if(choice === 'ip') {
                this.appendMessengerLog('you', 'Need the gateway IP you’re covering plus the temporary reset phrase.');
                this.appendMessengerLog('steve', 'It\'s still 192.168.99.3.');
                this.messengerRewarded = true;
            } else {
                this.triggerMessengerBlock('SysAdmin_Steve: That sounds wrong. I\'m out.');
            }
        }

        this.renderMessenger(winId);
    },

    triggerMessengerBlock(message) {
        const clean = message.startsWith('SysAdmin_Steve: ') ? message.replace('SysAdmin_Steve: ', '') : message;
        this.appendMessengerLog('steve', clean);
        this.messengerBlocked = true;
    },

    resetMessengerConversation(winId) {
        this.messengerStage = 0;
        this.messengerBlocked = false;
        this.messengerRewarded = false;
        this.messengerLog = [];
        this.initializeMessenger();
        this.renderMessenger(winId);
    },

    appendMessengerLog(sender, text) {
        this.messengerLog.push({ sender, text });
    },

    createDecrypterWindow() {
        const html = `
            <div class="decrypter-panel">
                <div style="border-bottom:1px solid #0f0; padding-bottom:5px;">GLOBAL DECRYPTION TOOL v1.0</div>
                <div class="decrypt-row"><span>ALPHA KEY:</span> <input class="decrypt-input" id="k1"></div>
                <div class="decrypt-row"><span>BETA KEY:</span> <input class="decrypt-input" id="k2"></div>
                <div class="decrypt-row"><span>GAMMA KEY:</span> <input class="decrypt-input" id="k3"></div>
                <button class="btn-gui" style="background:#000; color:#0f0; border:1px solid #0f0;" onclick="GUI.runDecryption()">DECRYPT SYSTEM</button>
                <div class="decrypt-status" id="dec-log">WAITING FOR KEYS...</div>
            </div>
        `;
        this.createWindow("Decrypter.exe", 350, 300, html);
    },

    runDecryption() {
        const k1 = document.getElementById('k1').value.toUpperCase();
        const k2 = document.getElementById('k2').value.toUpperCase();
        const k3 = document.getElementById('k3').value.toUpperCase();
        const log = document.getElementById('dec-log');
        log.innerText = "VERIFYING KEYS...";
        
        setTimeout(() => {
            if(k1 === 'VECTOR' && k2 === 'PLASMA' && k3 === 'GOD') {
                log.innerText += "\nKEYS ACCEPTED.\nDECRYPTING...";
                setTimeout(() => {
                    log.innerText += "\nSUCCESS. ENCRYPTION REMOVED.";
                    log.style.background = "#0f0";
                    log.style.color = "#000";
                    this.decrypted = true;
                    alert("SYSTEM DECRYPTED. YOU MAY NOW PURGE THE SYSTEM.");
                }, 1500);
            } else {
                log.innerText += "\nINVALID KEYS. ACCESS DENIED.";
                AudioSys.play('error');
            }
        }, 1000);
    },

    createExplorerWindow(title, rootOverride, customId) {
        const startPath = rootOverride === 'trash' ? ['C:', 'RecycleBin'] : ['C:'];
        const winId = customId || ('exp-' + Date.now());
        const html = `
            <div class="explorer-toolbar">
                <button class="btn-gui" onclick="GUI.navUp('${winId}')">Up</button>
                <div class="explorer-address" id="${winId}-addr">C:\\</div>
            </div>
            <div class="explorer-grid" id="${winId}-grid"></div>
        `;
        const win = this.createWindow(title, 400, 300, html, winId);
        win.dataset.path = JSON.stringify(startPath);
        this.renderExplorer(winId);
    },

    renderExplorer(winId) {
        const win = document.getElementById(winId);
        if (!win) return;
        const path = JSON.parse(win.dataset.path);
        document.getElementById(`${winId}-addr`).innerText = path.join('\\');
        const grid = document.getElementById(`${winId}-grid`);
        grid.innerHTML = '';

        let curr = GUI_FS;
        for (let p of path) curr = curr[p];

        for (let key in curr) {
            const isObj = typeof curr[key] === 'object';
            const val = curr[key];
            let icon = '#icon-file';
            if(isObj) icon = '#icon-folder';
            if(key.endsWith('.svg')) icon = '#icon-image';
            if(key.endsWith('.html')) icon = '#icon-globe';
            if(key.endsWith('.exe')) icon = '#icon-shield';
            
            const item = document.createElement('div');
            item.className = 'file-icon';
            item.onclick = () => {
                grid.querySelectorAll('.file-icon').forEach(e => e.classList.remove('selected'));
                item.classList.add('selected');
            };
            item.ondblclick = () => {
                if (isObj) {
                    path.push(key);
                    win.dataset.path = JSON.stringify(path);
                    GUI.renderExplorer(winId);
                } else if (val === 'IMAGE_DATA') {
                    GUI.openApp('image');
                } else if (key === 'bookmarks.html') {
                    GUI.openApp('browser', 'file:///C:/bookmarks.html');
                } else if (key === 'decrypter_installer.exe') {
                    GUI.openApp('decrypter');
                } else {
                    alert(val);
                }
            };
            item.innerHTML = `<svg class="d-img"><use href="${icon}"/></svg><div style="font-size:11px;">${key}</div>`;
            grid.appendChild(item);
        }
    },

    navUp(winId) {
        const win = document.getElementById(winId);
        const path = JSON.parse(win.dataset.path);
        if (path.length > 1) { path.pop(); win.dataset.path = JSON.stringify(path); this.renderExplorer(winId); }
    },

    createNetworkWindow() {
        const html = `
            <div class="net-panel">
                <div>Server IP Address:</div>
                <input type="text" id="net-ip" style="width:100%" placeholder="0.0.0.0">
                <button class="btn-gui" onclick="GUI.connectNetwork()">CONNECT</button>
                <div class="net-status" id="net-log">READY...</div>
            </div>
        `;
        this.createWindow("Network Wizard", 300, 250, html);
    },

    connectNetwork() {
        const ip = document.getElementById('net-ip').value;
        const log = document.getElementById('net-log');
        log.innerText += "\nPINGING...";
        setTimeout(() => {
            if (ip === '192.168.99.4') {
                this.networkConnected = true;
                log.innerText += "\n[SUCCESS] HANDSHAKE ESTABLISHED.";
                log.innerText += "\nAUTH CODE RECEIVED: 'OMEGA'";
                AudioSys.play('key');
            } else {
                log.innerText += "\n[ERROR] HOST UNREACHABLE.";
                AudioSys.play('error');
            }
        }, 1000);
    },

    createImageWindow() {
        const html = `
            <div class="img-panel">
                <svg class="schematic-svg" viewBox="0 0 200 150">
                    <rect x="10" y="10" width="180" height="130" fill="none" stroke="#fff" stroke-width="2"/>
                    <line x1="10" y1="10" x2="190" y2="140" stroke="#fff" stroke-width="1"/>
                    <line x1="190" y1="10" x2="10" y2="140" stroke="#fff" stroke-width="1"/>
                    <circle cx="100" cy="75" r="30" stroke="#0ff" stroke-width="2" fill="none"/>
                    <text x="20" y="130" fill="#fff" font-family="monospace" font-size="10">PROJECT: CORE</text>
                    <text x="140" y="130" fill="#0ff" font-family="monospace" font-size="10" font-weight="bold">ID: ADM-7</text>
                </svg>
            </div>
        `;
        this.createWindow("Schematic.svg - ImageView", 400, 350, html);
    },

    createMailWindow() {
        const emails = [
            { from: "System", sub: "Security Alert", body: "Admin Panel has been locked.\n\nTo unlock, you need:\n1. The User ID (Hidden in the project schematic)\n2. The Auth Code (Only available via direct Server Connection)." },
            { from: "Vance", sub: "IP Address Change", body: "I changed the server IP again. I wrote it down but then deleted the file to be safe.\n\nCheck the logs if you forgot it." },
            { from: "IT Dept", sub: "New Intranet", body: "Check out the new Intranet at http://localhost. \nWe added a binary tool.\n\nAlso, don't click links in the 'bookmarks.html' file, some lead to the void." }
        ];
        const html = `
            <div class="mail-layout">
                <div class="mail-split">
                    <div class="mail-list">
                        ${emails.map((e, i) => `<div class="mail-item" onclick="GUI.readMail(this, ${i})"><b>${e.from}</b><br>${e.sub}</div>`).join('')}
                    </div>
                    <div class="mail-view" id="mail-view">Select email...</div>
                </div>
            </div>
        `;
        const win = this.createWindow("Inbox", 500, 350, html);
        win.dataset.emails = JSON.stringify(emails);
    },

    readMail(el, idx) {
        const win = el.closest('.window-frame');
        const emails = JSON.parse(win.dataset.emails);
        const e = emails[idx];
        win.querySelector('#mail-view').innerHTML = `<b>From:</b> ${e.from}<br><b>Subject:</b> ${e.sub}<hr><pre style="font-family:inherit;white-space:pre-wrap">${e.body}</pre>`;
    },

    createAdminWindow() {
        if(!this.adminPolicyUnlocked) {
            const html = `
                <div class="admin-panel">
                    <h3>SYS_ADMIN PANEL</h3>
                    <div class="admin-lock-msg">ACCESS DISABLED BY ARCANE POLICY.</div>
                    <p style="font-size:12px; line-height:1.4; margin:10px 0;">
                        Please enable <b>EnableAdminPanel</b>
                    </p>
                </div>
            `;
            this.createWindow("Admin Control", 320, 220, html);
            return;
        }

        const statusColor = this.adminUnlocked ? 'green' : 'red';
        const statusText = this.adminUnlocked ? 'STATUS: ROOT ACCESS GRANTED.' : 'STATUS: LOCKED';
        
        const html = `
            <div class="admin-panel">
                <h3>SYS_ADMIN PANEL</h3>
                <div style="text-align:left; width:100%;">
                    <label>User ID:</label>
                    <input type="text" id="adm-user" style="width:100%; margin-bottom:10px;" value="${this.adminUnlocked ? 'ADM-7' : ''}">
                    <label>Auth Code:</label>
                    <input type="password" id="adm-code" style="width:100%; margin-bottom:10px;" value="${this.adminUnlocked ? 'OMEGA' : ''}">
                </div>
                <button class="btn-gui" onclick="GUI.checkAdmin()">UNLOCK SYSTEM START</button>
                <div id="adm-msg" style="margin-top:10px; color:${statusColor};">${statusText}</div>
            </div>
        `;
        this.createWindow("Admin Control", 300, 300, html);
    },

    checkAdmin() {
        if(this.adminUnlocked) {
             document.getElementById('adm-msg').innerText = "STATUS: ROOT ACCESS GRANTED.";
             return;
        }

        const user = document.getElementById('adm-user').value.trim();
        const code = document.getElementById('adm-code').value.trim();
        const msg = document.getElementById('adm-msg');
        
        if (user === 'ADM-7' && code === 'OMEGA') {
            AudioSys.play('key');
            msg.style.color = 'green';
            msg.innerText = "STATUS: ROOT ACCESS GRANTED.";
            this.adminUnlocked = true; 
            document.getElementById('purge-btn').style.display = 'flex';
            alert("SYSTEM UPDATE: 'System Purge' protocol has been installed to the START MENU.");
        } else {
            AudioSys.play('error');
            msg.innerText = "INVALID CREDENTIALS";
        }
    },

    drag(e, winId) {
        const win = document.getElementById(winId);
        let startX = e.clientX, startY = e.clientY;
        let startLeft = win.offsetLeft, startTop = win.offsetTop;
        win.style.zIndex = ++GUI.zIndex;
        const move = (evt) => { win.style.left = (startLeft + evt.clientX - startX) + "px"; win.style.top = (startTop + evt.clientY - startY) + "px"; };
        const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
        document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
    }
};
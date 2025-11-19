const GUI_FS = {
    "C:": {
        "Documents": { "todo.txt": "Buy milk\nHack planet" },
        "RecycleBin": { "token.txt": "ADMIN OVERRIDE TOKEN: 1234" },
        "System": { "config.sys": "[BOOT]\nTimeout=0" }
    }
};

const GUI = {
    zIndex: 100,
    windows: [],

    init() {
        document.getElementById('gui-layer').style.display = 'block';
        setInterval(() => {
            document.getElementById('clock-tray').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        }, 1000);
    },

    openApp(type, arg1, arg2) {
        if (type === 'explorer') this.createExplorerWindow(arg1 || 'My Computer', arg2);
        if (type === 'mail') this.createMailWindow();
        if (type === 'admin') this.createAdminWindow();
    },

    createWindow(title, width, height, contentHTML) {
        const id = 'win-' + Date.now();
        const win = document.createElement('div');
        win.className = 'window-frame';
        win.style.width = width + 'px';
        win.style.height = height + 'px';
        win.style.left = (50 + (this.windows.length * 30)) + 'px';
        win.style.top = (50 + (this.windows.length * 30)) + 'px';
        win.style.zIndex = ++this.zIndex;
        win.id = id;

        win.onmousedown = () => { win.style.zIndex = ++GUI.zIndex; };

        // FIX: Changed onclick to use 'this.closest' for robust closing
        win.innerHTML = `
            <div class="title-bar" onmousedown="GUI.drag(event, '${id}')">
                <div style="display:flex;align-items:center;gap:5px;">${title}</div>
                <div class="win-controls">
                    <div class="win-btn" onclick="this.closest('.window-frame').remove()">X</div>
                </div>
            </div>
            <div class="win-content">${contentHTML}</div>
        `;
        
        document.getElementById('gui-layer').appendChild(win);
        this.windows.push(win);
        return win;
    },

    // --- EXPLORER LOGIC ---
    createExplorerWindow(title, rootOverride) {
        const startPath = rootOverride === 'trash' ? ['C:', 'RecycleBin'] : ['C:'];
        const winId = 'exp-' + Date.now();
        
        const html = `
            <div class="explorer-toolbar">
                <button class="btn-gui" onclick="GUI.navUp('${winId}')">Up</button>
                <div class="explorer-address" id="${winId}-addr">C:\\</div>
            </div>
            <div class="explorer-grid" id="${winId}-grid"></div>
        `;
        
        const win = this.createWindow(title, 400, 300, html);
        win.dataset.path = JSON.stringify(startPath);
        win.id = winId;
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
            const icon = isObj ? '#icon-folder' : '#icon-file';
            
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
                } else {
                    alert(curr[key]);
                }
            };
            item.innerHTML = `<svg class="d-img"><use href="${icon}"/></svg><div style="font-size:11px;">${key}</div>`;
            grid.appendChild(item);
        }
    },

    navUp(winId) {
        const win = document.getElementById(winId);
        const path = JSON.parse(win.dataset.path);
        if (path.length > 1) {
            path.pop();
            win.dataset.path = JSON.stringify(path);
            this.renderExplorer(winId);
        }
    },

    // --- MAIL LOGIC ---
    createMailWindow() {
        const emails = [
            { from: "SysAdmin", sub: "URGENT", body: "I deleted the token. It's in Recycle Bin.\nCode is Token + 777." },
            { from: "Mom", sub: "Hello", body: "Love you!" }
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
        win.querySelector('#mail-view').innerHTML = `<b>From:</b> ${e.from}<br><b>Subject:</b> ${e.sub}<hr>${e.body}`;
    },

    // --- ADMIN LOGIC ---
    createAdminWindow() {
        const html = `
            <div class="admin-panel">
                <h3>ROOT ACCESS REQUIRED</h3>
                <p>Override Code:</p>
                <input type="password" id="admin-pass" class="admin-input">
                <button class="btn-gui" onclick="GUI.checkAdmin()">GRANT ACCESS</button>
            </div>
        `;
        this.createWindow("Admin Panel", 300, 250, html);
    },

    checkAdmin() {
        if (document.getElementById('admin-pass').value === '1234777') {
            AudioSys.play('win');
            document.body.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;color:#0f0;font-family:monospace;font-size:2rem;">SYSTEM LIBERATED</div>`;
        } else {
            alert("DENIED");
        }
    },

    drag(e, winId) {
        const win = document.getElementById(winId);
        let startX = e.clientX, startY = e.clientY;
        let startLeft = win.offsetLeft, startTop = win.offsetTop;
        win.style.zIndex = ++GUI.zIndex;

        const move = (evt) => {
            win.style.left = (startLeft + evt.clientX - startX) + "px";
            win.style.top = (startTop + evt.clientY - startY) + "px";
        };
        const up = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    }
};
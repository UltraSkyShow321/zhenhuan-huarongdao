// 深宫华容道 · Electron 桌面壳
'use strict';
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 760,
    height: 980,
    minWidth: 480,
    minHeight: 640,
    useContentSize: true,
    backgroundColor: '#200a08',
    autoHideMenuBar: true,
    title: '甄嬛传 · 深宫华容道',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // 打包后 index.html 位于 resources/ 目录
  const src = app.isPackaged
    ? path.join(process.resourcesPath, 'index.html')
    : path.join(__dirname, '..', 'index.html');
  win.loadFile(src);
  // 外链一律交给系统浏览器（本游戏无外链，防御性处理）
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

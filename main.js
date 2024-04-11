// Modules to control application life and create native browser window
const {app, nativeImage, globalShortcut, BrowserWindow, Tray, Menu, dialog} = require('electron')
const path = require('path')
const os = require('os')

app.commandLine.appendSwitch ("disable-http-cache")
if (os.platform() === "linux") {
  app.commandLine.appendSwitch('--no-sandbox')
} 

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({ // Create the browser window.
    width: 600,
    height: 320,
    minWidth: 600,
    minHeight: 245,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: true,
    maximizable: true,
    title: 'pruutify2000'
  })
  mainWindow.setMenu(null)

  if (os.platform() === "linux") {
    mainWindow.loadURL('http://wa59.ddns.net:8787/pruutify/?embed=1&arc=1')
    mainWindow.setBackgroundColor('#E7E8EB') 
    mainWindow.setIcon(path.join(__dirname, 'icon.png'));
  } else {
    mainWindow.loadURL('http://wa59.ddns.net:8787/pruutify/?embed=1&win=1')
    mainWindow.setBackgroundColor('#FFFFFF')
    mainWindow.setIcon(path.join(__dirname, 'icon.ico'));
  }

  var tray = new Tray( nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAXRQTFRFAAAAAAAAKCgoExMTAAAACAgIJiYmAQEBAAAAJSUluLi4dnZ2BwcHAAAASUlJwcHBSkpKAAAABgYGmpqa/f398fHxPj4+AAAAAAAAHx8f1tbW////wsLCHBwcAAAAAAAATk5O6enpzc3NiIiIi4uLqamp/v7++vr6e3t7AAAAAAAAmJiYwcHBDAwMERERy8vL5+fnSkpKQkJC4+PjysrKzc3N29vb7e3ttLS02dnZz8/P+/v7enp6Wlpa3NzcPT09cHBwiIiIJCQk9vb2SEhIPDw8oqKiHh4excXFmZmZXl5eTExMcXFxiYmJMTEx+fn5WlpaPj4+o6OjKioq0dHRnZ2dOTk539/f7u7u6Ojo9fX1zMzM5eXl4ODg9/f3cXFxBAQEmJiY/Pz8wMDAGhoaHx8fq6urzMzMPDw8AAAAAAAAFhYWaWlpx8fH7Ozs1dXVh4eHIyMjAAAAAAAAAAAAGBgYU1NTdXV1Xl5eKSkpAQEBAAAA5/0DOgAAAHx0Uk5TACerfAVStEgHpP30SSLd/8seY/b//9g1Kq7///2VAg3G//729v3//+U0UPP+g4v//7yz////////////zMj//////////////8zL/////////////8yv///////////KXvb//ZGZ+/7CGgyF7P////WoHQRGkMPMyaBdDjWDkj0AAACwSURBVHicY2RAA4wgDAR/GBhYGRl/ggU4QAJfGHhB1HuQgBAjEnjEyCDPyPiLgR3E+crDyHidkUGL8QPcREHGy4wMeoxv4AKijOcZGYwYQdY8ZZABm3GEkcEWzPgoADF0OyOD10sJIOOyHkRgNSNDGCPjPQ7pQwz2YIGFjAwJjIw7YYZ6MM5hZOCIZTz4Bcz9GczIOB3o0iyQ0rM3GaOAVB/Yc8UgkaM2QKIV4lsUAAAjUSERSi1u5wAAAABJRU5ErkJggg=='), '7c42eb84-c981-47f3-8ba4-f1e0c4d09430'); 

  // Global Shortcuts
  globalShortcut.register('Control+PageUp', () => {
    let code = `$("#rand").click()`;
    mainWindow.webContents.executeJavaScript(code);
  });
  globalShortcut.register('Control+PageDown', () => {
    let code = `$("#prev").click()`;
    mainWindow.webContents.executeJavaScript(code);
  });
  globalShortcut.register('Control+End', () => {
    let code = `$("#stop").click()`;
    mainWindow.webContents.executeJavaScript(code);
  });
  globalShortcut.register('Control+Home', () => {
    let code = `$("#play").click()`;
    mainWindow.webContents.executeJavaScript(code);
  });

  // Context menu
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click:  function(){
        mainWindow.restore();
    } },
    { label: 'Play', click:  function(){
        let code = `$("#play").click()`;
        mainWindow.webContents.executeJavaScript(code);
    } },
    { label: 'Stop', click:  function(){
        let code = `$("#stop").click()`;
        mainWindow.webContents.executeJavaScript(code);
    } },
    { label: 'Next', click:  function(){
        let code = `$("#rand").click()`;
        mainWindow.webContents.executeJavaScript(code);
    } },
    { label: 'Previous', click:  function(){
        let code = `$("#prev").click()`;
        mainWindow.webContents.executeJavaScript(code);
    } },
    { label: 'Quit', click:  function(){
        globalShortcut.unregisterAll();
        tray.destroy();
        app.quit();
    } }
  ]);
  tray.setContextMenu(contextMenu)
  tray.setToolTip('A minimal MP3 Player')
  tray.setTitle('pruutify2000')

  tray.on('click', function(e){
    if (mainWindow.isVisible()) {
      mainWindow.setSkipTaskbar(true);
    } else {
      mainWindow.restore()
    }
  });

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.setSkipTaskbar(true);
  });

  mainWindow.on('restore', function (event) {
    mainWindow.show();
    mainWindow.setSkipTaskbar(false);
  });

  mainWindow.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });
})


app.on('window-all-closed', function () {
  globalShortcut.unregisterAll();
  app.quit();
})
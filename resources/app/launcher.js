const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

(function disAllowRemoteDebugging() {
	"use strict";
	var k, len, cl_args = process.argv, item;
	for (k = 0, len = cl_args.length; k < len; k += 1) {
		item = cl_args[k];
		if (item.indexOf('--remote-debugging-port') > -1) {
			//cl_args.splice(0, 1);
			cl_args.splice(k, 1);
			// https://github.com/electron/electron/blob/master/docs/api/app.md
			app.relaunch({
				execPath: cl_args.splice(0, 1).toString(), // the path of the executable
				args: cl_args // the command line parameters
			});
			app.exit(0);
		}
	}
}());

function createWindow() {
    "use strict";
    // Create the browser window.
    win = new BrowserWindow({
        "width": 960,
        "height": 640,
        "minWidth": 640,
        "minHeight": 480,
        "resizable": true,
        "center": false,
        //"show": false,
		"useContentSize": true,
        "web-preferences": {
            "allowRunningInsecureContent": true,
            "backgroundThrottling": false,
            "experimentalFeatures": true,
            "extra-plugin-dirs": [
                'file:///' + process.cwd().replace(/\\/g, '/') + '/plugins'
            ],
            "javascript": true,
            "page-visibility": true,
            "plugins": true,
            "webaudio": true,
            "webgl": true
        }
    });

    // and load the index.html of the app.
    //win.loadURL(`file://${__dirname}/../../index.html`);
    win.loadURL('file://' + __dirname + '/../../index.html');

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    
    win.webContents.openDevTools();
}

// https://github.com/electron/electron/blob/v0.34.1/docs/api/app.md#appmakesingleinstancecallback
var should_quit = false;
should_quit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    "use strict";
	// Someone tried to run a second instance, we should focus our window
	if (win) {
		if (win.isMinimized()) {
			win.restore();
		}
		win.focus();
	}
	return true;
});

if (should_quit) {
	app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.commandLine.appendSwitch('js-flags', '--expose-gc');
app.commandLine.appendSwitch('disable-raf-throttling');
app.commandLine.appendSwitch('enable-javascript-harmony');
app.commandLine.appendSwitch('enable-npapi');
app.commandLine.appendSwitch('enable-web-midi');

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
(function () {
    "use strict";
    var app = require('app'), // Module to control application life.
        BrowserWindow = require('browser-window'), // Module to create native browser window.
        main_window = null; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the javascript object is GCed.
    // Report crashes to our server.
    require('crash-reporter').start();
    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.commandLine.appendSwitch('js-flags', '--expose-gc');
    app.commandLine.appendSwitch('enable-javascript-harmony');
    app.commandLine.appendSwitch('enable-npapi');
    app.commandLine.appendSwitch('enable-web-midi');
    // This method will be called when atom-shell has done everything initialization and ready for creating browser windows.
    app.on('ready', function () {
        // Create the browser window.
        main_window = new BrowserWindow({
            "width": 1024,
            "height": 600,
            "minWidth": 1024,
            "minHeight": 600,
            "resizable": true,
            "center": false,
            "show": false,
            "web-preferences": {
                "javascript": true,
                "webgl": true,
                "webaudio": true,
                "allowRunningInsecureContent": true,
                "experimentalFeatures": true,
                "plugins": true,
                "extra-plugin-dirs": [
                    'file:///' + process.cwd().replace(/\\/g, '/') + '/plugins'
                ]
            }
        });
        // and load the index.html of the app.
        main_window.loadUrl('file://' + __dirname + '/../../index.html');
        //main_window.setPosition(0, 640);
        //main_window.toggleDevTools();
        // Emitted when the window is closed.
        main_window.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            main_window = null;
        });
    });
}());
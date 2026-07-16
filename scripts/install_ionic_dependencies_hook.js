/*
 * Cross-platform `after_plugin_install` hook.
 *
 * Replaces install_ionic_dependencies.bat, which is a Windows-only batch file. Cordova
 * spawned it directly on macOS/Linux ("spawn Unknown system error -8"), which aborted the
 * whole plugin install. Cordova runs `.js` hooks through Node on every OS, so this works
 * everywhere. It invokes the existing installer for each wrapper flavour and never throws
 * (a failure is logged, not fatal) so a build machine without the optional ionic deps still
 * installs the plugin.
 */
var path = require('path');
var cp = require('child_process');

var scriptsDir = __dirname;
var installer = path.join(scriptsDir, 'install_ionic_dependencies.js');
var targets = ['ionic', 'ionic/ngx', 'ionic/v4'];

targets.forEach(function (target) {
    try {
        cp.execFileSync(process.execPath, [installer, target], {
            cwd: scriptsDir,
            stdio: 'inherit'
        });
    } catch (e) {
        console.warn(
            '[cordova-plugin-fcm] optional ionic dependency step skipped for "' +
            target + '": ' + (e && e.message)
        );
    }
});

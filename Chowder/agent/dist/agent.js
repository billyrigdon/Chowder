import NodeClam from 'clamscan';
import notifier from 'node-notifier';
import * as chokidar from 'chokidar';
let scanRunning = false;
const homeDirectory = (process.env['HOME'] || process.env['USERPROFILE']); // get the user's home directory
const ClamScan = await new NodeClam().init({
    removeInfected: false,
    quarantineInfected: homeDirectory + '/infected/',
    debugMode: true,
    fileList: '/home/',
    scanRecursively: true,
    clamscan: {
        path: '/usr/bin/clamscan',
        scanArchives: true,
        active: false // you don't want to use this at all because it's evil
    },
    clamdscan: {
        socket: false,
        host: false,
        port: false,
        timeout: 60000,
        localFallback: true,
        path: '/usr/bin/clamdscan',
        multiscan: false,
        reloadDb: false,
        active: true,
        bypassTest: false, // Check to see if socket is available when applicable
    },
    preference: 'clamscan' // If clamscan is found and active, it will be used by default
});
const scanDirectory = async (dir) => {
    if (!scanRunning) {
        try {
            scanRunning = true;
            console.log('Scanning ' + dir);
            const { isInfected, viruses } = await ClamScan.scanFile(dir);
            scanRunning = false;
            notifier.notify({
                title: 'Scan Results:',
                message: 'Found ' + viruses.length + ' infected files',
            });
        }
        catch (err) {
            console.log(err);
        }
    }
};
console.log(homeDirectory);
// fs.watch(homeDirectory, async (eventType, filename) => {
// 	console.log(eventType, filename)
// 	if (eventType === 'rename' && filename) {
// 		await scanDirectory(homeDirectory)
// 	}
// });
const watcher = chokidar.watch(homeDirectory + '/Downloads', { persistent: true });
watcher
    .on('add', async (path) => await scanDirectory(homeDirectory + '/Downloads'))
    //.on('change', path => scanDirectory(path))
    .on('addDir', async (path) => await scanDirectory(homeDirectory + '/Downloads'));
//# sourceMappingURL=agent.js.map
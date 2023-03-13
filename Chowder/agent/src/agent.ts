import NodeClam from 'clamscan';
import notifier from 'node-notifier';
import * as chokidar from 'chokidar';

let scanRunning = false;

const homeDirectory = (process.env['HOME'] || process.env['USERPROFILE']) as string; // get the user's home directory

const ClamScan = await new NodeClam().init({
	removeInfected: false, // Removes files if they are infected
	quarantineInfected: homeDirectory + '/infected/', // Move file here. removeInfected must be FALSE, though.
	debugMode: true, // This will put some debug info in your js console
	fileList: '/home/', // path to file containing list of files to scan
	scanRecursively: true, // Choosing false here will save some CPU cycles
	clamscan: {
		path: '/usr/bin/clamscan', // I dunno, maybe your clamscan is just call "clam"
		scanArchives: true, // Choosing false here will save some CPU cycles
		active: false // you don't want to use this at all because it's evil
	},
	clamdscan: {
		socket: false, // Socket file for connecting via TCP
		host: false, // IP of host to connect to TCP interface
		port: false, // Port of host to use when connecting via TCP interface
		timeout: 60000, // Timeout for scanning files
		localFallback: true, // Use local preferred binary to scan if socket/tcp fails
		path: '/usr/bin/clamdscan', // Path to the clamdscan binary on your server
		multiscan: false, // Scan using all available cores! Yay!
		reloadDb: false, // If true, will re-load the DB on every call (slow)
		active: true, // If true, this module will consider using the clamdscan binary
		bypassTest: false, // Check to see if socket is available when applicable
	},
	preference: 'clamscan' // If clamscan is found and active, it will be used by default
});

const scanDirectory = async (dir: string) => {
	if (!scanRunning) {
		try {
			scanRunning = true;
			console.log('Scanning ' + dir)
			const { isInfected, viruses } = await ClamScan.scanFile(dir);
			scanRunning = false
			notifier.notify({
				title: 'Scan Results:',
				message: 'Found ' + viruses.length + ' infected files',
			});
		} catch (err) {
			console.log(err);
		}
	}
}

const watcher = chokidar.watch(homeDirectory + '/Downloads', { persistent: true });

watcher
	.on('add', async path => await scanDirectory(homeDirectory + '/Downloads'))
	.on('change', async path => await scanDirectory(homeDirectory + '/Downloads'))
	.on('addDir', async path => await scanDirectory(homeDirectory + '/Downloads'))


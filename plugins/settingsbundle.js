// @/plugins/settingsbundle.js

const fs = require('fs');
const path = require('path');
const {withXcodeProject} = require('@expo/config-plugins');

module.exports = function withSettingsBundle(config) {
	return withXcodeProject(config, async (config) => {
		const projectRoot = config.modRequest.projectRoot;
		const iosRoot = config.modRequest.platformProjectRoot;
		const srcDir = path.join(projectRoot, 'ios-settings');
		const destDir = path.join(iosRoot, 'Settings.bundle');
		if (fs.existsSync(srcDir)) {
			fs.cpSync(
				srcDir, destDir, { recursive: true, force: true }
				);
		} else {
			console.warn(`[settingsbundle] dir not found: ${srcDir}`);
		}
		const xcodeProject = config.modResults;
		if (!xcodeProject.hasFile('Settings.bundle')) {
			if (!xcodeProject.pbxGroupByName('Resources')) {
				xcodeProject.pbxCreateGroup('Resources', '""')
			}
			xcodeProject.addResourceFile('Settings.bundle')
		}
		const res = xcodeProject.getFirstProject().firstProject;
		if (res && res.knownRegions) {
			if (!res.knownRegions.includes('en')) {
				res.knownRegions.push('en')
				console.log('[settingsbundle] added en')
			}
			if (!res.knownRegions.includes('ru')) {
				res.knownRegions.push('ru');
				console.log('[settingsbundle] added ru')
			}
		}
		return config
	})
}
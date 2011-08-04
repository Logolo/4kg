var defaults, customizing = null, device,	// Variables
	pjq, keyidtostring, updatescreen, checkflag, loaddata, changedselect, customizekey, cancelcustomize,	// Functions
	keycustomized, resetdefaults, savesettings, setusbkeyboarddefault;

defaults = {
	flags: help.cloneObject(gbox._flags)
};

pjq = function (id) {
	return document.getElementById(id);
};

keyidtostring = function (id) {
	var strkey = '';
	switch (id) {
		case 38:
			strkey = 'Up Arrow';
			break;
		case 40:
			strkey = 'Down Arrow';
			break;
		case 37:
			strkey = 'Left Arrow';
			break; 
		case 39:
			strkey = 'Right Arrow';
			break;
		case 13:
			strkey = 'Enter';
			break;
		default:
			if (((id > 64) && (id < 133)) || ((id > 47) && (id < 58))) {
				strkey = String.fromCharCode(id);
			}
	}
	if (device.iswii) {
		switch (id) {
			case 175:
				strkey='Wiimote D-Pad left';
				break;
			case 176:
				strkey='Wiimote D-Pad right';
				break;
			case 177:
				strkey='Wiimote D-Pad up';
				break;
			case 178:
				strkey='Wiimote D-Pad down';
				break;
			case 173:
				strkey='Wiimote 2 button';
				break;
			case 174:
				strkey='Wiimote + button';
				break;
			case 170:
				strkey='Wiimote - button';
				break;
			case 172:
				strkey='Wiimote 1 button';
				break;
			case 13:
				strkey='Wiimote A button';
				break;
		}
	}
	return (strkey ? strkey  : '') + '<span style="float: right; color: gray;">Key ' + id + '</span>';
};

updatescreen = function () {
	pjq('keyup').innerHTML = keyidtostring(gbox._keymap['up']);
	pjq('keydown').innerHTML = keyidtostring(gbox._keymap['down']);
	pjq('keyleft').innerHTML = keyidtostring(gbox._keymap['left']);
	pjq('keyright').innerHTML = keyidtostring(gbox._keymap['right']);
	pjq('keya').innerHTML = keyidtostring(gbox._keymap['a']);
	pjq('keyb').innerHTML = keyidtostring(gbox._keymap['b']);
	pjq('keyc').innerHTML = keyidtostring(gbox._keymap['c']);
	pjq('keypause').innerHTML = keyidtostring(gbox._keymap['pause']);
	
	for (var i in gbox._flags) {	// For...in is BAD NEWS!!! Just sayin'. -Andrex
		switch (gbox._flagstype[i]) {
			case 'check':
				pjq(i).checked = gbox._flags[i];
				break;
			case 'list':
				for (var j = 0; j < pjq(i).options.length; j = j + 1) {
					if (pjq(i).options[j].value === gbox._flags[i]) {
						pjq(i).selectedIndex = j;
						break;
					}
				}
				break;
		}
	}
};

checkflag = function (t) {
	gbox._flags[t.id] = (t.checked ? true: false);
};

loaddata = function () {
	defaults.keyboardkeymap = help.cloneObject(gbox._keymap);
	device = help.akihabaraInit({ hardwareonly: true });
	defaults.defaultkeymap = help.cloneObject(gbox._keymap);
	gbox._loadsettings();
	if (device.iswii) {
		pjq('extra').innerHTML = '<div style="margin-top: 10px;"><input type="button" value="Set USB keyboard default" onclick="setusbkeyboarddefault()"></div>';
	}
	updatescreen();
};

changedselect = function (t) {
	gbox._flags[t.id] = t.options[t.selectedIndex].value;
};

customizekey = function (p) {
	cancelcustomize();
	customizing = p;
	pjq(customizing.input).style.backgroundColor = '#00A0D1';
};

cancelcustomize = function () {
	if (customizing) {
		pjq(customizing.input).style.backgroundColor = '';
		updatescreen();
		customizing = null;
	}
};

keycustomized = function (e) {
	if (customizing) {
		gbox._keymap[customizing.key] = (e.fake || window.event ? e.keyCode: e.which);
		cancelcustomize();
		return false;
	}
	return true;
};

resetdefaults = function () {
	if (confirm('Revert to default configuration?')) {
		gbox._keymap = help.cloneObject(defaults.defaultkeymap);
		gbox._flags = help.cloneObject(defaults.flags);
		updatescreen();
	}
};

savesettings = function () {
	var wipe = {
		name: '',
		world: 1,
		level: 0,
		cleared: 0,
		orbs: {},
		kudos: {},
		achievements: [],
		powerups: [],
		transAm: 0
	};
	
	if (document.getElementById("deletefile1").checked) {
		var storedData = JSON.parse(localStorage['saveData']);
		storedData.a = wipe;
		localStorage['saveData'] = JSON.stringify(storedData);
	}
	if (document.getElementById("deletefile2").checked) {
		var storedData = JSON.parse(localStorage['saveData']);
		storedData.b = wipe;
		localStorage['saveData'] = JSON.stringify(storedData);
	}
	if (document.getElementById("deletefile3").checked) {
		var storedData = JSON.parse(localStorage['saveData']);
		storedData.c = wipe;
		localStorage['saveData'] = JSON.stringify(storedData);
	}
	
	gbox._savesettings();
	window.location = '../index.html';
};

setusbkeyboarddefault = function () {
	if (confirm('Set the USB keyboard default input settings?')) {
		gbox._keymap = help.cloneObject(defaults.keyboardkeymap);
		updatescreen();
	}
};
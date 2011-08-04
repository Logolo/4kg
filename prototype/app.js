var saveFile, checkFullscreen, spawnItem, blitBottomText, blitHelpText, init, // 4kg functions.
	saveData = {}, currentFile = 'a', fullscreen = false, running = false, floatingWhiteOrbs = false, // 4kg variables.
	isPaused = false, isMuted = false,
	maingame, audioserver, currentstage, dialogues = {}, tilemaps = {}, mapmeta = {}, mapobjects = {}; // Akihabara

// Saves the data to localStorage.
saveFile = function () {
	switch (currentFile.file) {
		case 'a':
			saveData.a = currentFile;
			break;
		case 'b':
			saveData.b = currentFile;
			break;
		case 'c':
			saveData.c = currentFile;
			break;
	}
	localStorage['saveData'] = JSON.stringify(saveData);
};

// Fullscreen option.
checkFullscreen = function () {
	var width, height, newWidth, newHeight, widthToHeight, heightToWidth, canvas, div;
	
	width = document.width;
	height = document.height;
	widthToHeight = 854 / 480;
	heightToWidth = 480 / 854;
	canvas = document.getElementsByTagName('canvas')[0];
	div = document.getElementsByTagName('div')[1];
	
	// Not optimized very well...
	newWidth = height * widthToHeight + 'px';
	newHeight = height + 'px';
	
	if (gbox.keyIsHit('d')) {
		if (!fullscreen) {
			fullscreen = true;
			canvas.style.width = '100%';
			//canvas.style.width = newWidth;
			canvas.style.height = '100%';
			//canvas.style.height = newHeight;
			div.style.display = 'block';
			gbox.setFps(60);
		}
		else {
			fullscreen = false;
			canvas.style.width = '854px';
			canvas.style.height = '480px';
			div.style.display = 'table-cell';
			gbox.setFps(30);
		}
		localStorage['fullscreen'] = fullscreen;	// Saves the setting to localStorage.
	}
};

// Spawns a generic, static object.
spawnItem = function (data, pl, ts, fra, frst) {
	gbox.addObject({
		group: 'items', 
		tileset: ts, 
		score: 0, 
		initialize: function () {
			toys.platformer.initialize(this, {
				frames: {
					still: { speed: 1, frames: [fra] }, 
					walking: { speed: 1, frames: [fra] }, 
					jumping: { speed: 1, frames: [fra] }, 
					falling: { speed: 1, frames: [fra] }, 
					die: { speed: 1, frames: [fra] }
				}, 
				x: data.x, 
				y: data.y, 
				jumpaccy: 0,
				side: data.side
			});
		}, 
		first: frst,
		blit: function () {
			if (gbox.objectIsVisible(this)) {
				gbox.blitTile(gbox.getBufferContext(), { tileset: this.tileset, tile: this.frame,
					dx: this.x, dy: this.y, camera: this.camera, fliph: this.side, flipv: this.flipv });
			}
		}
	});
};

// Draws some faded text at the bottom of the screen, usually as help text.
blitBottomText = function (text) {
	gbox.blitText(gbox.getBufferContext(), { font: 'consolas', text: text, valign: gbox.ALIGN_BOTTOM,
		halign: gbox.ALIGN_CENTER, alpha: 0.5, dx: 0, dy: 0, dw: gbox.getScreenW(), dh: gbox.getScreenH()});
}

// Draws the help text at the bottom of the screen.
blitHelpText = function (text, secondText) {
	// Just one line to draw, so draw it on the bottom.
	if (!secondText) {
		gbox.blitRect(gbox.getBufferContext(), { x: 0, y: gbox.getScreenH() - 32, w: 854, h: 32, alpha: 0.65 });
		gbox.blitText(gbox.getBufferContext(), { font: 'consolas', text: text, valign: gbox.ALIGN_BOTTOM,
			halign: gbox.ALIGN_CENTER, dx: 0, dy: 0, dw: gbox.getScreenW(), dh: gbox.getScreenH()});
	}
	// There's two lines, so draw the first a little higher.
	else {
		gbox.blitRect(gbox.getBufferContext(), { x: 0, y: gbox.getScreenH() - 64, w: 854, h: 64, alpha: 0.65 });
		gbox.blitText(gbox.getBufferContext(), { font: 'consolas', text: text, valign: gbox.ALIGN_BOTTOM,
			halign: gbox.ALIGN_CENTER, dx: 0, dy: -30, dw: gbox.getScreenW(), dh: gbox.getScreenH()});
		gbox.blitText(gbox.getBufferContext(), { font: 'consolas', text: secondText, valign: gbox.ALIGN_BOTTOM,
			halign: gbox.ALIGN_CENTER, dx: 0, dy: 0, dw: gbox.getScreenW(), dh: gbox.getScreenH()});
	}
}

init = function () {
	gbox.setGroups(['background', 'player', 'foes', 'sparks', 'gamecycle', 'balloons', 'items']);
	gbox.setAudioChannels({ bgmusic: { volume: 0.2 }, sfx: { volume: 0.4 }});
	
	maingame = gamecycle.createMaingame('gamecycle', 'gamecycle');
	
	maingame.gameTitleIntroAnimation = function (reset) {
		checkFullscreen();
		
		if (!reset) {
			gbox.playAudio('bgm-menu');
			gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
			toys.logos.zoomout(this, 'zoomouter', { image: 'logo', x: gbox.getScreenHW() - gbox.getImage('logo').hwidth,
				y: 20, speed: 0.08, zoom: 3 });
		} else {
			toys.resetToy(this, 'zoomouter');
		}
	}, 
	
	maingame.pressStartIntroAnimation = function (reset) {
		checkFullscreen();
		
		if (reset) {
			toys.resetToy(this, 'fixed');
			return false;
		}
		else {
			blitBottomText('Menu Controls: Z to select, X to go back.');
			toys.text.fixed(this, 'blinker', gbox.getBufferContext(),
				{ font: 'consolas', text: 'Press Z to Start', valign: gbox.ALIGN_MIDDLE, halign: gbox.ALIGN_CENTER,
				dx: 0, dy: Math.floor(gbox.getScreenH()/3), dw: gbox.getScreenW(),
				dh: Math.floor(gbox.getScreenH() / 3) * 2 });
			return gbox.keyIsHit('a');
		}
	};
	
	maingame.gameIntroAnimation = function (reset) {
		saveFile();
		checkFullscreen();
		if (reset) {
			toys.resetToy(this, 'intro-animation');
			return false;
		} else {
			gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
			//return toys.dialogue.render(this, 'intro-animation', dialogues.intro);
			return true;
		}
	};
	
	// Blech, this menu system is so kludgy...
	maingame.gameMenu = function (reset) {
		var verticleMiddle = gbox.getScreenH() / 2 + 33, fileSelectMenu, nameSelectMenu, menuOptions, percentages,
			rightSideText, donateText;
		
		// Save data stuff.
		if (localStorage['donated'] !== 'true') {
			//donateText = 'Uses In-App Payments';
			//donateText = 'Just a click and $2.';
			donateText = '    Help Development';
		}
		else {
			donateText = '  ...do it again? :D';
		}
		percentages = {
			a: 0,
			b: 0,
			c: 0
		};
		if (saveData.a.world) {
			percentages.a = (saveData.a.cleared + saveData.a.achievements.length) / 30 * 100;
			percentages.a = percentages.a.toFixed(0);
			if (percentages.a < 10) {
				percentages.a = ' ' + percentages.a;
			}
		}
		if (saveData.b.world) {
			percentages.b = (saveData.b.cleared + saveData.b.achievements.length) / 30 * 100;
			percentages.b = percentages.b.toFixed(0);
			if (percentages.b < 10) {
				percentages.b = ' ' + percentages.b;
			}
		}
		if (saveData.c.world) {
			percentages.c = (saveData.c.cleared + saveData.b.achievements.length) / 30 * 100;
			percentages.c = percentages.c.toFixed(0);
			if (percentages.c < 10) {
				percentages.c = ' ' + percentages.c;
			}
		}
		
		// Main menu-associated stuff.
		fileSelectMenu = {
			x: 9,
			y: verticleMiddle,
			font: 'consolas',
			selector: '>',
			keys: { up: 'up', down: 'down', ok: 'a', cancel: 'b' },
			items: [' A:/' + saveData.a.name, ' B:/' + saveData.b.name, ' C:/' + saveData.c.name,
				' Support with Google Checkout\\', ' Options'],
			menuOptions: {
				FILE_A: 0,
				FILE_B: 1,
				FILE_C: 2,
				DONATE: 3,
				OPTIONS: 4
			}
		};
		rightSideText = {
			fileA: {
				dx: gbox.getScreenW() - 50,
				dy: verticleMiddle,
				font: 'consolas',
				text: percentages.a + '%',
				alpha: 0.5
			},
			fileB: {
				dx: gbox.getScreenW() - 50,
				dy: verticleMiddle + 25,
				font: 'consolas',
				text: percentages.b + '%',
				alpha: 0.5
			},
			fileC: {
				dx: gbox.getScreenW() - 50,
				dy: verticleMiddle + 50,
				font: 'consolas',
				text: percentages.c + '%',
				alpha: 0.5
			},
			donate: {
				dx: gbox.getScreenW() - 270,
				dy: verticleMiddle + 75,
				font: 'consolas',
				text: donateText,
				alpha: 0.5
			},
			options: {
				dx: gbox.getScreenW() - 280,
				dy: verticleMiddle + 100,
				font: 'consolas',
				text: 'Controls, Audio, etc.',
				alpha: 0.5
			}
		};
		
		// Name selection menu.
		nameSelectMenu = {
			x: 9,
			y: verticleMiddle,
			font: 'consolas',
			selector: '>',
			keys: { up: 'up', down: 'down', ok: 'a', cancel: 'b' },
			items: [' Assign a Name to this File', ' Continue Without Assigning a Name']
		};
		
		// Putting it all together. Sorry for all the nested junk.
		if (reset) {
			toys.resetToy(this, 'fileSelect');
			return false;
		}
		else {
			blitBottomText('Game data is saved automatically when a level is cleared.');
			gbox.blitText(gbox.getBufferContext(), rightSideText.fileA);
			gbox.blitText(gbox.getBufferContext(), rightSideText.fileB);
			gbox.blitText(gbox.getBufferContext(), rightSideText.fileC);
			gbox.blitText(gbox.getBufferContext(), rightSideText.donate);
			gbox.blitText(gbox.getBufferContext(), rightSideText.options);
			
			if (toys.ui.menu(this, 'fileSelect', fileSelectMenu)) {
				if (toys.getToyValue(this, 'fileSelect', 'ok') === -1) {
					return -1;
				}
				else {
					var selected = toys.getToyValue(this, 'fileSelect', 'selected');
					switch (selected) {
						case fileSelectMenu.menuOptions.FILE_A:
							currentFile = saveData.a;
							
							if (currentFile.name === '') {
								gbox.blitClear(gbox.getBufferContext(), { x: 0, y: 220 });
								blitBottomText('Controls: Z to jump, X to run, Enter to pause.');
								if (toys.ui.menu(this, 'nameSelect', nameSelectMenu)) {
									var nameSelected = toys.getToyValue(this, 'nameSelect', 'selected');
									if (nameSelected === 0) {
										var name = prompt('Name to be associated with this file?');
										currentFile.name = name;
										return true;
									}
									else if (nameSelected === 1) {
										currentFile.name = ' ';		// Invisible, but lets us know they've chosen not
										return true;				// to have a name so we don't bug them each time.
									}
								}
							}
							else {
								return true;
							}
							break;
						case fileSelectMenu.menuOptions.FILE_B:
							currentFile = saveData.b;
							
							if (currentFile.name === '') {
								gbox.blitClear(gbox.getBufferContext(), { x: 0, y: 220 });
								blitBottomText('Controls: Z to jump, X to run, Enter to pause.');
								if (toys.ui.menu(this, 'nameSelect', nameSelectMenu)) {
									var nameSelected = toys.getToyValue(this, 'nameSelect', 'selected');
									if (nameSelected === 0) {
										var name = prompt('Name to be associated with this file?');
										currentFile.name = name;
										return true;
									}
									else if (nameSelected === 1) {
										currentFile.name = ' ';
										return true;
									}
								}
							}
							else {
								return true;
							}
							break;
						case fileSelectMenu.menuOptions.FILE_C:
							currentFile = saveData.c;
							
							if (currentFile.name === '') {
								gbox.blitClear(gbox.getBufferContext(), { x: 0, y: 220 });
								blitBottomText('Controls: Z to jump, X to run, Enter to pause.');
								if (toys.ui.menu(this, 'nameSelect', nameSelectMenu)) {
									var nameSelected = toys.getToyValue(this, 'nameSelect', 'selected');
									if (nameSelected === 0) {
										var name = prompt('Name to be associated with this file?');
										currentFile.name = name;
										return true;
									}
									else if (nameSelected === 1) {
										currentFile.name = ' ';
										return true;
									}
								}
							}
							else {
								return true;
							}
							break;
						case fileSelectMenu.menuOptions.DONATE:
							// OK, so like you're not supposed to do In-App Payments ALL clientside. But I figure,
							// hey, it's a free and open source game, and "buying" a Donate Key isn't something
							// that needs to be verified. So screw it, we're going full clientside.
							//goog.payments.inapp.buyItem({
							//	parameters: {},
							//	jwt: 'eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJpdGVtTmFtZSI6IkRvbmF0ZSBLZXkiLCJpdGVtRGVzY3JpcHRpb24iOiJUaGFuayB5b3UgZm9yIHN1cHBvcnRpbmcgSFRNTDUgZ2FtZSBkZXZlbG9wbWVudCEiLCJpdGVtUHJpY2UiOiIyLjAwIiwiaXNvQ3VycmVuY3lDb2RlIjoiVVNEIiwiaXNzIjoiMDIyNTcxMzY2MjA0NTIxMzE3MDkiLCJhdWQiOiJnb29nLnBheW1lbnRzLmluYXBwLmJ1eUl0ZW0iLCJpYXQiOjEzMDY1NTY4ODksImV4cCI6MTMwNjY0MzI4OX0.Shtmw4MrSHjiKfnj9TeKcX9dqWiLeVmjZjGMIHiaULA',
							//	success: function() {
							//		localStorage['donated'] = 'true';
							//		window.open('pages/thanks.html', '4kgDonate');
							//	}
							//});
							
							// In-app payments currently sucks so we have to rely on the currently Blogger-only (WTF?)
							// "Support with Google Checkout" gadget. This actually works surprisingly well...
							// until Google catches on to me doing it. >_>
							window.open('http://4kg-donations.blogspot.com', '4kg-donations', 'width=640,height=330');
							return -1;
							break;
						case fileSelectMenu.menuOptions.OPTIONS:
							window.location = 'pages/options.html';
							return -1;
							break;
						default:
							return true;
					}
				}
			}
			return false;
		}
	};
	
	maingame.gameEndingIntroAnimation = function (reset) {
		checkFullscreen();
		
		if (reset) {
			toys.resetToy(this, 'intro-animation');
			maingame.hud.hideWidgets(['orbs', 'battery', 'redBattery']);
			return false;
		} else {
			gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
            return toys.dialogue.render(this, 'intro-animation', dialogues.ending);
		}
	};
	
	maingame.changeLevel = function (level) {
		if (level === null) {
			level = '1-1';
		}
		currentstage = level;
		gbox.trashGroup('foes');
		gbox.trashGroup('items');
		gbox.trashGroup('balloons');
		gbox.purgeGarbage();
		gbox.createCanvas('tileslayer', { w: tilemaps[currentstage].w, h: tilemaps[currentstage].h });
		gbox.blitTilemap(gbox.getCanvasContext('tileslayer'), tilemaps[currentstage]);
		
		// Draw the HUD.
		maingame.hud.setWidget('orbs', { widget: 'symbols', minvalue: 0, value: 0, maxshown: 3, tileset: 'hud',
			tiles: [0], dx: 2, dy: 2, gapx: 25, gapy: 0 });
		maingame.hud.setWidget('battery', { widget: 'symbols', minvalue: 1, value: 1, maxshown: 1, tileset: 'hud',
			tiles: [2], dx: gbox.getScreenW() - 120, dy: 1, gapx: 0, gapy: 0 });
		maingame.hud.setWidget('redBattery', { widget: 'symbols', minvalue: 1, value: 1, maxshown: 1, tileset: 'hud',
			tiles: [8], dx: gbox.getScreenW() - 120, dy: 1, gapx: 0, gapy: 0 });
		maingame.hud.hideWidgets(['redBattery']);
		
		this.newLife();
	};
	
	maingame.newLife = function (up) {
		var pl = gbox.getObject('player', 'player');
		
		gbox.trashGroup('foes');
		gbox.trashGroup('items');
		gbox.trashGroup('balloons');
		gbox.purgeGarbage();
		maingame.hud.setValue('orbs', 'value', 0);
		
		tilemaps[currentstage].tileIsSolidCeil = function(obj, t) {
			return (obj.group === 'foes' ? false: t > 0 && t !== null);
		};
		tilemaps[currentstage].tileIsSolidFloor = function(obj, t) {
			if (obj.id === 'player') {
				// If the player is not falling or holding the down key, make him stop on all platforms BUT
				// the dotted line ones (which are t = 0).
				if ((pl.accy < 0) || gbox.keyIsHold('down')) {
					return t > 0 && t !== null;
				}
				// Else, stop him on this platform.
				else {
					return t >= 0 && t !== null;
				}
			}
			else {
				return t >= 0 && t !== null;
			}
		};
		
		var current;
		for (var i = 0; i < mapobjects[currentstage].items.length; i = i + 1) {
			current = mapobjects[currentstage].items[i];
			switch (current.objecttype) {
				case 'player': {
					toys.platformer.spawn(pl, help.mergeWithModel(current, { accx: 0, accy: 0 }));
					break;
				}
				default: {
					maingame.addEnemy(current.objecttype, current);
					break;
				}
			}
		}
		gbox.hitAudio('ingame');
	};
	
	maingame.endlevelIntroAnimation = function (reset) {
		checkFullscreen();
		
		if (reset) {
			toys.resetToy(this, 'framecounter');
			toys.resetToy(this, 'aftercounter');
			return false;
		}
		else {
			gbox.blitText(gbox.getBufferContext(), {font: 'consolas', text: 'Level Cleared', valign: gbox.ALIGN_MIDDLE,
				halign:gbox.ALIGN_CENTER, dx: 0, dy: 0, dw: gbox.getScreenW(), dh: gbox.getScreenH()});
			
			return toys.timer.after(this, 'aftercounter', 15);
		}
	};
	
	maingame.gameEvents = function () {
		var pl = gbox.getObject('player', 'player'), bars, redBars;
		checkFullscreen();
		
		bars = {
			one: {
				w: 12,
				h: 4,
				x: gbox.getScreenW() - 90,
				y: 18,
				color: 'white'
			},
			two: {
				w: 12,
				h: 8,
				x: gbox.getScreenW() - 72,
				y: 14,
				color: 'white'
			},
			three: {
				w: 12,
				h: 12,
				x: gbox.getScreenW() - 54,
				y: 10,
				color: 'white'
			},
			four: {
				w: 12,
				h: 16,
				x: gbox.getScreenW() - 36,
				y: 6,
				color: 'white'
			},
			five: {
				w: 12,
				h: 20,
				x: gbox.getScreenW() - 18,
				y: 2,
				color: 'white'
			}
		};
		
		redBars = {
			one: {
				w: 12,
				h: 4,
				x: gbox.getScreenW() - 90,
				y: 18,
				color: 'rgb(255, 101, 101);'
			},
			two: {
				w: 12,
				h: 8,
				x: gbox.getScreenW() - 72,
				y: 14,
				color: 'rgb(255, 101, 101);'
			},
			three: {
				w: 12,
				h: 12,
				x: gbox.getScreenW() - 54,
				y: 10,
				color: 'rgb(255, 101, 101);'
			},
			four: {
				w: 12,
				h: 16,
				x: gbox.getScreenW() - 36,
				y: 6,
				color: 'rgb(255, 101, 101);'
			},
			five: {
				w: 12,
				h: 20,
				x: gbox.getScreenW() - 18,
				y: 2,
				color: 'rgb(255, 101, 101);'
			}
		};
		
		pl.transAmCounter = currentFile.transAm;
		if (!pl.transAmEnabled) {
			if (pl.transAmCounter >= 1) {
				gbox.blitRect(gbox.getBufferContext(), bars.one);
			}
			if (pl.transAmCounter >= 5) {
				gbox.blitRect(gbox.getBufferContext(), bars.two);
			}
			if (pl.transAmCounter >= 10) {
				gbox.blitRect(gbox.getBufferContext(), bars.three);
			}
			if (pl.transAmCounter >= 15) {
				gbox.blitRect(gbox.getBufferContext(), bars.four);
			}
			if (pl.transAmCounter >= 20) {
				gbox.blitRect(gbox.getBufferContext(), bars.five);
				pl.transAmEnabled = true;
				pl.transAmCountdown = 300;	// Should equal about 10 seconds.
				gbox.setAudioVolume('ingame', 0.1);
				gbox.hitAudio('transAm');
			}
		}
		else {
			maingame.hud.hideWidgets(['battery']);
			maingame.hud.showWidgets(['redBattery']);
			
			if (pl.transAmCountdown >= 1) {
				gbox.blitRect(gbox.getBufferContext(), redBars.one);
			}
			if (pl.transAmCountdown >= 65) {
				gbox.blitRect(gbox.getBufferContext(), redBars.two);
			}
			if (pl.transAmCountdown >= 130) {
				gbox.blitRect(gbox.getBufferContext(), redBars.three);
			}
			else {
				gbox.setAudioVolume('ingame', 1.0);
			}
			if (pl.transAmCountdown >= 195) {
				gbox.blitRect(gbox.getBufferContext(), redBars.four);
			}
			if (pl.transAmCountdown >= 260) {
				gbox.blitRect(gbox.getBufferContext(), redBars.five);
			}
		}
		
		// Kind of a hack...
		if (pl.touchedfloor) {
			pl.ladderMode = false;
		}
		
		// Check for mute.
		if (gbox.keyIsHit('c')) {
			if (!isMuted) {
				gbox.stopAudio('ingame');
				isMuted = true;
			}
			else {
				gbox.hitAudio('ingame');
				isMuted = false;
			}
		}
		
		// Check if the player has paused or un-paused the game.
		if (gbox.keyIsHit('pause')) {
			if (!isPaused) {
				gbox.stopAudio('ingame');
				gbox.stopGroups(['background', 'player', 'foes', 'balloons', 'items']);
				gbox.blitText(gbox.getBufferContext(), { font: 'consolas', text: 'Paused',
					valign: gbox.ALIGN_MIDDLE, halign: gbox.ALIGN_CENTER, dx: 0, dy: 0, dw: gbox.getScreenW(),
					dh: gbox.getScreenH()});
				blitBottomText('Press Enter to Resume');
				isPaused = true;
			}
			else {
				gbox.hitAudio('ingame');
				gbox.playAllGroups();
				isPaused = false;
			}
		}
		
		// If the user wants to back out of the level to the main menu...
		//if (isPaused && gbox.keyIsHit('esc')) {
		//	isPaused = false;
		//	gbox.playAllGroups();
		//	gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
		//	var x = maingame.gameMenu(true);
		//}
		
		// Check if the level's been beaten.
		if (gbox.groupIsEmpty('balloons')) {
			if (mapmeta[currentstage].nextLevel) {
				maingame.gotoLevel(mapmeta[currentstage].nextLevel);
				
				// TODO: Make sure to filter out levels the player goes back and beats again.
				if (currentFile.level > 1) {
					currentFile.world = currentFile.world + 1;
					currentFile.level = 0;
				}
				else {
					currentFile.level = currentFile.level + 1;
				}
			}
			else {
				maingame.gameIsCompleted();
			}
			
			saveFile();
		}
	};
	
	maingame.gameIsOver = function() {
		return false;
	};
	
	maingame.addEnemy = function(type, data) {
		var pl = gbox.getObject('player', 'player');
		switch (type) {
			// Enemy: Crawler!
			case 'crawler':
				gbox.addObject({
					group: 'foes', 
					tileset: 'enemies', 
					score: 100, 
					initialize: function() {
						toys.platformer.initialize(this, {
							frames: {
								still: { speed:1, frames:[0] }, 
								walking: { speed:4, frames:[0, 1] }, 
								jumping: { speed:1, frames:[0] }, 
								falling: { speed:1, frames:[0] }, 
								die: { speed:1, frames:[0] }
							}, 
							x: data.x, 
							y: data.y, 
							jumpaccy: 10, 
							side: data.side
						});
					}, 
					first: function() {
						if (gbox.objectIsVisible(this)) {
							this.counter = (this.counter + 1) % 10;
							toys.platformer.applyGravity(this);
							toys.platformer.auto.horizontalBounce(this);
							if (this.touchedfloor) {
								toys.platformer.auto.goomba(this, { moveWhileFalling: true, speed: 2 });
							}
							toys.platformer.auto.dontFall(this, tilemaps[currentstage], 'map');
							toys.platformer.verticalTileCollision(this, tilemaps[currentstage], 'map');
							toys.platformer.horizontalTileCollision(this, tilemaps[currentstage], 'map');
							if (toys.platformer.canJump(this) &&
								toys.timer.randomly(this, 'jumper', { base: 50, range: 50 })){
								this.accy = -this.jumpaccy; // Jump randomly (the toy is resetted the first call)
							}
							toys.platformer.handleAccellerations(this);
							toys.platformer.setFrame(this);
							
							if (pl.collisionEnabled()) {
								if (help.isSquished(this, pl) || (gbox.collides(this, pl, 0) && !pl.touchedfloor && !pl.ladderMode)) {
									currentFile.transAm = currentFile.transAm + 1;
									gbox.hitAudio('hit');
									gbox.trashObject(this);
									toys.platformer.bounce(pl, {jumpsize: 10});
									toys.generate.sparks.bounceDie(this, 'sparks', null, {jump: 12, flipv:true});
								}
								else if (gbox.collides(this, pl, 0)) {
									if (pl.transAmEnabled) {
										gbox.trashObject(this);
									}
									else {
										pl.kill(this);
										currentFile.transAm = 0;
									}
								}
							}
						}
					},
					blit: function() {
						if (gbox.objectIsVisible(this)) {
							gbox.blitTile(gbox.getBufferContext(), { tileset: this.tileset, tile: this.frame,
								dx: this.x, dy: this.y, camera: this.camera, fliph: this.side, flipv: this.flipv });
						}
					}
				});
				break;
			
			// Enemy: Buzzer!
			case 'buzzer':
				gbox.addObject({
					group: 'foes', 
					tileset: 'enemies', 
					score: 100, 
					initialize: function() {
						toys.platformer.initialize(this, {
							frames: {
								still: { speed: 1, frames: [6] }, 
								walking: { speed: 4, frames: [6, 7, 8, 9] }, 
								jumping: { speed: 1, frames: [6] }, 
								falling: { speed: 1, frames: [6] }, 
								die: { speed: 1, frames: [6] }
							}, 
							x: data.x, 
							y: data.y, 
							jumpaccy: 10, 
							side: data.side
						});
					}, 
					first: function() {
						if (gbox.objectIsVisible(this)) {
							this.counter = (this.counter + 1) % 10;
							//toys.platformer.applyGravity(this);
							toys.platformer.auto.horizontalBounce(this);
							if (this.touchedfloor) {
								toys.platformer.auto.goomba(this, { moveWhileFalling: true, speed: 2 });
							}
							toys.platformer.auto.dontFall(this, tilemaps[currentstage], 'map');
							toys.platformer.verticalTileCollision(this, tilemaps[currentstage], 'map');
							toys.platformer.horizontalTileCollision(this, tilemaps[currentstage], 'map');
							toys.platformer.handleAccellerations(this);
							toys.platformer.setFrame(this);
							
							if (pl.collisionEnabled()) {
								if (help.isSquished(this, pl) || (gbox.collides(this, pl, 0) && !pl.touchedfloor && !pl.ladderMode)) {
									currentFile.transAm = currentFile.transAm + 1;
									gbox.hitAudio('hit');
									gbox.trashObject(this);
									toys.platformer.bounce(pl, { jumpsize: 10 });
									toys.generate.sparks.bounceDie(this, 'sparks', null, {jump: 12, flipv:true});
								}
								else if (gbox.collides(this, pl, 0)) {
									if (pl.transAmEnabled) {
										gbox.trashObject(this);
									}
									else {
										pl.kill(this);
										currentFile.transAm = 0;
									}
								}
							}
						}
					},
					blit: function() {
						if (gbox.objectIsVisible(this)) {
							gbox.blitTile(gbox.getBufferContext(), { tileset: this.tileset, tile: this.frame,
								dx: this.x, dy: this.y, camera: this.camera, fliph: this.side, flipv: this.flipv });
						}
					}
				});
				break;
			
			// Balloon! End of the level.
			case 'balloon':
				gbox.addObject({
					group: 'balloons', 
					tileset: 'items', 
					score: 100, 
					initialize: function() {
						toys.platformer.initialize(this, {
							frames: {
								still: { speed: 4, frames: [0, 1, 2, 3, 4] }, 
								walking: { speed: 1, frames: [0] }, 
								jumping: { speed: 1, frames: [0] }, 
								falling: { speed: 1, frames: [0] }, 
								die: { speed: 4, frames: [5, 6] },
								pop: {speed: 1, frames: [5, 6] }
							}, 
							x: data.x, 
							y: data.y, 
							jumpaccy: 0,
							side: data.side
						});
					}, 
					first: function() {
						if (gbox.objectIsVisible(this)) {
							this.counter = (this.counter + 1) % 10;
							toys.platformer.applyGravity(this);
							toys.platformer.auto.horizontalBounce(this);
							this.accx = 0;
							toys.platformer.auto.dontFall(this, tilemaps[currentstage], 'map');
							toys.platformer.verticalTileCollision(this, tilemaps[currentstage], 'map');
							toys.platformer.horizontalTileCollision(this, tilemaps[currentstage], 'map');
							if (toys.platformer.canJump(this) &&
								toys.timer.randomly(this, 'jumper', { base: 50, range: 50 })){
								this.accy = -this.jumpaccy; // Jump randomly (the toy is resetted the first call)
							}
							toys.platformer.handleAccellerations(this);
							toys.platformer.setFrame(this);
							
							if (pl.collisionEnabled() && gbox.collides(this, pl, 2)) {
								gbox.hitAudio('hit');
								this.frame = help.decideFrame(this.counter, this.frames.pop);
								gbox.trashObject(this);
							}
						}
					},
					blit: function() {
						if (gbox.objectIsVisible(this)) {
							gbox.blitTile(gbox.getBufferContext(), { tileset: this.tileset, tile: this.frame,
								dx: this.x, dy: this.y, camera: this.camera, fliph: this.side, flipv: this.flipv });
						}
					}
				});
				break;
			
			// Floating white orbs!
			case 'orb':
				spawnItem(data, pl, 'items32', 4, function () {
					if (gbox.objectIsVisible(this)) {
						this.counter = (this.counter + 1) % 10;
						this.accx = 0;
						toys.platformer.handleAccellerations(this);
						toys.platformer.setFrame(this);
						
						if (pl.collisionEnabled() && gbox.collides(this, pl, 0)) {
							maingame.hud.setValue('orbs', 'value', maingame.hud.getValue('orbs', 'value') + 1);
							gbox.hitAudio('hit');
							gbox.trashObject(this);
						}
						//currentFile.orbs.mc1
					}
				});
				break;
			
			// Ladders! Good for climbing.
			case 'ladder':
				spawnItem(data, pl, 'items', 27, function () {
					if (gbox.objectIsVisible(this)) {
						this.counter = (this.counter + 1) % 10;
						this.accx = 0;
						toys.platformer.handleAccellerations(this);
						toys.platformer.setFrame(this);
						
						if (pl.collisionEnabled() && gbox.collides(this, pl, 0)) {
							// If they're in the middle of the ladder, don't let them fall.
							if (pl.ladderMode) {
								pl.accy = 0;
							}
							
							// If they want to go up, go up. If they want to go down, go down.
							if (gbox.keyIsHold('up')) {
								pl.accy = -7;
								pl.ladderMode = true;
							}
							else if (gbox.keyIsHold('down')) {
								pl.accy = 7;
								pl.ladderMode = true;
							}
						}
					}
				});
				break;
			
			// Invisible death blocks! Crucial to any platformer.
			case 'death':
				spawnItem(data, pl, 'items32', 30, function () {
					if (gbox.objectIsVisible(this)) {
						this.counter = (this.counter + 1) % 10;
						this.accx = 0;
						toys.platformer.handleAccellerations(this);
						toys.platformer.setFrame(this);
						
						if (pl.collisionEnabled() && gbox.collides(this, pl, 0)) {
							pl.kill(this);
						}
					}
				});
				break;
			
			// Help monitors, they dispense tips on the game and whatnot.
			case 'help':
				spawnItem(data, pl, 'items', 17, function () {
					if (gbox.objectIsVisible(this)) {
						this.counter = (this.counter + 1) % 10;
						this.accx = 0;
						toys.platformer.handleAccellerations(this);
						toys.platformer.setFrame(this);
						
						if (pl.collisionEnabled() && gbox.collides(this, pl, 0)) {
							blitHelpText(data.text, data.secondText);
						}
					}
				});
				break;
		}
	};
	
	maingame.initializeGame = function () {
		gbox.addObject({
			id: 'player', 
			group: 'player', 
			tileset: 'player', 
			multiplier: 0,
			jumpaccy: 10,
			ladderMode: false,
			transAmCounter: currentFile.transAm,
			transAmEnabled: false,
			transAmCountdown: 0,
			
			initialize: function () {
				toys.platformer.initialize(this, {
					frames: {
						still: { speed: 2, frames: [0] }, 
						walking: { speed: 4, frames: [1, 2, 3, 2, 1] }, 
						running: { speed: 4, frames: [6, 7, 8, 7, 6] }, 
						runningStill: { speed: 1, frames: [6] }, 
						jumping: { speed: 2, frames: [4] }, 
						falling: { speed: 2, frames: [11] }, 
						die: { speed: 1, frames: [14] },
						transAm: { speed: 1, frames: [9] },
						sliding: { speed: 1, frames: [10] },
						climbing: { speed: 4, frames: [12, 13] },
						climbingStill: { speed: 1, frames: [12] }
					}
				});
			}, 
			
			collisionEnabled: function () {
				return !maingame.gameIsHold() && !this.killed;
			},
			
			kill: function (by) {
				this.killed = true;
				gbox.hitAudio('die');
				toys.generate.sparks.bounceDie(this, 'sparks', null, { jump: 6, flipv: false });
				maingame.playerDied({ wait: 50 });
			},
			
			first: function () {
				this.counter = (this.counter + 1) % 10;
				if (!this.killed) {
					toys.platformer.applyGravity(this);
					toys.platformer.horizontalKeys(this, { left: 'left', right: 'right' });
					toys.platformer.verticalTileCollision(this, tilemaps[currentstage], 'map');
					toys.platformer.horizontalTileCollision(this, tilemaps[currentstage], 'map');
					toys.platformer.jumpKeys(this, { jump: 'a', audiojump: 'jump' });
					toys.platformer.handleAccellerations(this);
					toys.platformer.setSide(this);
					toys.platformer.setFrame(this);
				}
			},
			
			blit: function () {
				var nextLeftIsSolid = false, nextRightIsSolid = right, left = 0, right = 0,
					map = tilemaps[currentstage], tilemap = 'map';
				// Draws the translucent HUD background. Weird I have to put it here, I know.
				gbox.blitRect(gbox.getBufferContext(), { x: 0, y: 0, w: 854, h: 24, alpha: 0.65 });
				
				// Akihabara's method for checking the next solid wall turns off every other frame,
				// so we have to roll our own if we want consistent animations and behavior.
				left = help.getTileInMap(this.x - 1, this.y + 32, map, 0, tilemap);
				right = help.getTileInMap(this.x + this.w - 1 + 1, this.y + 32, map, 0, tilemap);
				if (map.tileIsSolidFloor(this, left)) {
					nextLeftIsSolid = true;
				}
				else if (map.tileIsSolidFloor(this, right)) {
					nextRightIsSolid = true;
				}
				
				// Check if the player wants to run.
				if (gbox.keyIsPressed('b')) {
					// Distinguish between actually running and standing or going through the air.
					if (gbox.keyIsHold('right') || gbox.keyIsHold('left')) {
						if (this.touchedfloor) {
							this.maxaccx = 12;
							this.frame = help.decideFrame(this.counter, this.frames.running);
						}
						else {
							this.frame = help.decideFrame(this.counter, this.frames.runningStill);
						}
					}
				}
				// Makes sure the player isn't in mid-air when releasing momentum.
				else if (!gbox.keyIsPressed('b') && this.touchedfloor) {
					this.maxaccx = 5;
				}
				
				// Check for walljumping.
				if (nextRightIsSolid && !this.touchedfloor) {
					// Slide down slowly, and only when falling.
					if (gbox.keyIsHold('right') && this.accy > 0) {
						this.accy = 2;
						this.frame = help.decideFrame(this.counter, this.frames.sliding);
					}
					
					// Walljumping can be initiated even if the player isn't holding down an arrow key, they just
					// have to be next to a wall. This makes chaining them together MUCH easier.
					if (gbox.keyIsHit('a')) {
						//this.frame = help.decideFrame(this.counter, this.frames.runningStill);
						this.maxaccx = 12;
						this.accx = -15;
						this.accy = -this.jumpaccy;
						this.curjsize = this.jumpsize;
					}
				}
				// Same as above but for the left key.
				else if (nextLeftIsSolid && !this.touchedfloor) {
					if (gbox.keyIsHold('left') && this.accy > 0) {
						this.accy = 2;
						this.frame = help.decideFrame(this.counter, this.frames.sliding);
					}
					if (gbox.keyIsHit('a')) {
						this.maxaccx = 12;
						this.accx = 15;
						this.accy = -this.jumpaccy;
						this.curjsize = this.jumpsize;
					}
				}
					
				// Climbing animation.
				if (this.ladderMode) {
					if (this.accy !== 1) {
						this.frame = help.decideFrame(this.counter, this.frames.climbing);
					}
					else {
						this.frame = help.decideFrame(this.counter, this.frames.climbingStill);
					}
				}
				
				if (this.transAmEnabled && this.transAmCountdown > 0) {
					this.frame = help.decideFrame(this.counter, this.frames.transAm);
					this.maxaccx = 30;
					this.maxaccy = 20;
					this.jumpaccy = 30;
					this.transAmCountdown = this.transAmCountdown - 1;
				}
				else if (this.transAmEnabled) {
					maingame.hud.hideWidgets(['redBattery']);
					maingame.hud.showWidgets(['battery']);
					this.transAmEnabled = false;
					this.maxaccx = 5;
					this.maxaccy = 10;
					this.jumpaccy = 10;
					currentFile.transAm = 0;
				}
				
				// If the player isn't killed, then draw him.
				if (!this.killed) {
					gbox.blitTile(gbox.getBufferContext(), { tileset: this.tileset, tile: this.frame,
						dx: this.x, dy: this.y, camera: this.camera, fliph: this.side, flipv: this.flipv });
				}
			}
		});
		
		gbox.addObject({
			id: 'machine-complex-bg',
			group: 'background',
			blit: function () {
				gbox.centerCamera(gbox.getObject('player', 'player'),
					{ w: tilemaps[currentstage].w, h: tilemaps[currentstage].h });
				gbox.blit(gbox.getBufferContext(), gbox.getImage('machine_complex_bg'), { dx :0, dy: 0,
					dw: gbox.getScreenW(), dh: gbox.getScreenH(), sourcecamera: true, parallaxx: 0.5, parallaxy: 0.5 });
				gbox.blit(gbox.getBufferContext(), gbox.getCanvas('tileslayer'), { dx: 0, dy: 0, dw: gbox.getScreenW(),
					dh: gbox.getScreenH(), sourcecamera: true });
			}
		});
	};
	
	gbox.go();
};

gbox.onLoad(function () {
	help.akihabaraInit({ title: '4kg', fps: 30, zoom: 1, width: 854, height: 480, splash: { footnotes: '' }});
	
	audioserver = 'resources/music/';
	gbox.addBundle({ file: 'resources/bundle.js' });
	gbox.loadAll(init);
	
	// Create or load save data.
	if (!localStorage['saveData']) {
		saveData = {
			a: {
				file: 'a',
				name: '',
				world: 1,
				level: 0,
				cleared: 0,	// Levels cleared.
				orbs: {
					//mc1: { first: false, second: false, third: true }
				},
				kudos: {
					//1: true
				},
				achievements: [],
				powerups: [],
				transAm: 0
			},
			b: {
				file: 'b',
				name: '',
				world: 1,
				level: 0,
				cleared: 0,	// Levels cleared.
				orbs: {},
				kudos: {},
				achievements: [],
				powerups: [],
				transAm: 0
			},
			c: {
				file: 'c',
				name: '',
				world: 1,
				level: 0,
				cleared: 0,	// Levels cleared.
				orbs: {},
				kudos: {},
				achievements: [],
				powerups: [],
				transAm: 0
			}
		};
		localStorage['saveData'] = JSON.stringify(saveData);
	}
	else {
		saveData = JSON.parse(localStorage['saveData']);
	}
	
	checkFullscreen();
}, false);
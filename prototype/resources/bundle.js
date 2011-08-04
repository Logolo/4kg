{
	// Graphic resources.
	addImage: [
		["hud", "resources/sprites/hud.png"],
		["player_robot", "resources/sprites/player_robot.png"],
		["enemies", "resources/sprites/enemies.png"],
		["items", "resources/sprites/items.png"],
		
		// Tilesets
		["machine_complex", "resources/sprites/machine_complex.png"],
		
		// Backgrounds
		["machine_complex_bg", "resources/backgrounds/machine_complex.png"],
		
		// Fonts
		["font", "resources/fonts/normal.png"],
		["fontbig", "resources/fonts/big.png"],
		["consolas", "resources/fonts/consolas.png"],
		
		// Other
		["logo", "resources/logo.png"]
	],
	addFont: [
		{ id: "small", image: "font", firstletter: " ", tileh: 16, tilew: 16, tilerow: 510, gapx: 0, gapy: 16 },
		{ id: "big", image: "fontbig", firstletter: " ", tileh: 32, tilew: 16, tilerow: 510, gapx: 0, gapy: 0 },
		{ id: "consolas", image: "consolas", firstletter: " ", tileh: 25, tilew: 13, tilerow: 510, gapx: 0, gapy: 0 }
	], 
	addTiles: [
		{ id: "hud", image: "hud", tileh: 20, tilew: 20, tilerow: 18, gapx: 0, gapy: 0 },
		{ id: "player", image: "player_robot", tileh: 64, tilew: 32, tilerow: 20, gapx: 0, gapy: 0 },
		{ id: "enemies", image: "enemies", tileh: 64, tilew: 64, tilerow: 18, gapx: 0, gapy: 0 },
		{ id: "items", image: "items", tileh: 64, tilew: 64, tilerow: 28, gapx: 0, gapy: 0 },
		{ id: "items32", image: "items", tileh: 32, tilew: 32, tilerow: 7, gapx: 0, gapy: 64 },
		{ id: "death", image: "items", tileh: 1, tilew: 32, tilerow: 1, gapx: 0, gapy: 96 },
		{ id: "machine-complex-tiles", image: "machine_complex", tileh: 32, tilew: 32, tilerow: 20, gapx: 0, gapy: 0 },
		{ id: "tiledfont", image: "consolas", tileh: 25, tilew: 13, tilerow: 510, gapx: 0, gapy: 13 }
	],
	addAudio: [
		["bgm-menu", [audioserver + "SepOOky.ogg"], { channel:"bgmusic", loop: true }],
		["ingame", [audioserver + "Triwing Madness!.ogg"], { channel:"bgmusic", loop: true }],
		["ending", [audioserver + "Double Dark Blend.ogg"], { channel:"bgmusic", loop: true }],
		["default-menu-option",["resources/sounds/select.ogg"],{channel:"sfx"}],
		["default-menu-confirm",["resources/sounds/start.ogg"],{channel:"sfx"}],
		["beep",["resources/sounds/voice_narrator.ogg"],{channel:"sfx"}],
		["die",["resources/sounds/die.ogg"],{channel:"sfx"}],
		["hit",["resources/sounds/hit.ogg"],{channel:"sfx"}],
		["jump",["resources/sounds/jump.ogg"],{channel:"sfx"}],
		["transAm",["resources/sounds/sfx-transam.ogg"],{channel:"sfx"}]
	],
	addBundle: [
		{ file: "resources/dialogue.js" },
		{ file: "resources/levels/1-1.js" },
		{ file: "resources/levels/1-2.js" },
		{ file: "resources/levels/1-3.js" }
	]
}
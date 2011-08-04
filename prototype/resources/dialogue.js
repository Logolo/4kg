{
	setObject:[
		{
			object:"dialogues",
			property:"intro",
			value:{
		  		font:"consolas",
		  		skipkey:"a",
		  		esckey:"b",
		  		who:{
		  			narrator:{
		  				x:10,
		  				y:150
		  			}
		  		},
		  		scenes:[
		  			{
		  				slide:{
		  					image:"intro1",
		  					x:0,
		  					y:40
		  				},
		  				speed:1,
		  				who:"narrator",
		  				audio:"beep",
		  				talk:[
		  					"Long long time ago there was a sad",
		  					"kid named Jin. He lives alone on a",
		  					"lonely and far beach, thinking for all",
		  					"the day."
		  				]
		  			},
		  			{
		  				slide:{
		  					image:"intro2",
		  					x:0,
		  					y:40
		  				},
		  				speed:1,
		  				who:"narrator",
		  				audio:"beep",
		  				talk:[
		  					"A bad day, the violet squids that used",
		  					"to live underwater, jumped out asking",
		  					"to play with Jin. \"Let's play",
		  					"together, Jin\" they said!"
		  				]
		  			},
		  			{
		  				slide:{
		  					image:"intro3",
		  					x:0,
		  					y:40
		  				},
		  				speed:1,
		  				who:"narrator",
		  				audio:"beep",
		  				talk:[
		  					"\"I don't want to play! I want to be",
		  					"alone!\" he screamed out.",
		  					"\"Get out of here!\" and he chased",
		  					"them for all the beach..."
		  				]
		  			},
		  		]
		  	}
		  },
		  {
		  	object: "dialogues",
		  	property: "ending",
		  	value: {
		  		font: "consolas",
		  		skipkey: "a",
		  		esckey: "b",
		  		who: {
		  			narrator:{
		  				x:10,
		  				y:150
		  			}
		  		},
		  		scenes:[
		  			{
		  				font: "consolas",
		  				speed: 1,
		  				spacing: 2,
		  				push: gbox.getScreenHH(),
		  				audiomusic: "ending",
		  				scroller: [
		  					"4kg: Prototype",
		  					"A Game by Andrex",
		  					"",
		  					"[ CODE + GRAPHICS + DESIGN ]",
		  					"",
		  					"Andrex",
		  					"",
		  					"[ MUSIC ]",
		  					"",
		  					"\"Sep00ky\"",
		  					"By Hell O-Bit!",
		  					"8bc.org/members/HeLL-Obit",
		  					"",
		  					"\"Triwing Madness!\"",
		  					"By Hell O-Bit!",
		  					"8bc.org/members/HeLL-Obit",
		  					"",
		  					"\"Double Dark Blend\"",
		  					"By Sup3r N3rd",
		  					"8bc.org/members/Sup3r+N3rd",
		  					"",					
		  					"[ CREATED USING THE AKIHABARA ENGINE ]",
		  					"",
		  					"By Kesiev",
		  					"kesiev.com/akihabara",
							"",
							"Thanks for playing!",
							"Please look forward to the final game:",
							"15 full levels, 9 music tracks, more enemies, and the story.",
							"",
							"",
							"The End"
		  				]
		  			}
		  		]
		  	}
		}
	]
}

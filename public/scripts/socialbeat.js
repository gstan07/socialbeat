app = {
	init:function(){
		
		console.log("socialbeat init");
		app.createBoard(5,5);
		
		app["me"] = app.generateUid();
		if(window.location.hash){
			app["session"] = window.location.hash.replace("#","");
		}else{
			app["session"] = app.generateUid();	
		}
		app.firebaseInit();
		app.bindStuff();
		window.location.hash = app.session;
	},
	createBoard:function(rows,columns){
		for(i=1;i<=(rows*columns);i++){
			var total_cels = rows*columns;
			var current_row = Math.ceil(i/columns);
			var current_column = columns - Math.abs(i - current_row * columns)
			var cell = $('<div class="cell" data-row="'+current_row+'" data-column="'+current_column+'"/>');
			if(current_column == 1){
				cell.css({
					"clear":"both"
				});
			}
			cell.appendTo($("#board"));
		}
	},
	broadcast:function(packet){
		firebase.database().ref(app.session+'/').push(packet);			
	},
	listen:function(packet){
		if(packet.user!=app.me){
			app.playSound(packet);
		}	
	},
	playSound:function(packet){
		$('.cell[data-row="'+packet.row+'"][data-column="'+packet.column+'"]').addClass("clicked");
		var synth = new Tone.Synth().toMaster()
		//play a middle 'C' for the duration of an 8th note
		synth.triggerAttackRelease('f'+packet.row, '12n')
	},
	bindStuff:function(){

		$(".cell").click(function(){
			
			var packet = {
				user:app.me,
				session:app.session,
				row:$(this).data("row"),
				column:$(this).data("column")
			}
			app.broadcast(packet);
			app.playSound(packet);

		});
		$(".cell").on("webkitAnimationEnd",function(){
			$(this).removeClass("clicked");
		});
		app["dbRef"].once('value', function(snapshot) {
		  app["initialdataloaded"] = true;
		});
		app["dbRef"].on('child_added', function(snapshot) {
			if(app.initialdataloaded){
				app.listen(snapshot.val());	
			}
				
		});
	},
	firebaseInit:function(){
		var config = {
	    apiKey: "AIzaSyB4We-sXgc6fTZZEu_CB1V7Kem6jgMIQbo",
	    authDomain: "socialbeat-92100.firebaseapp.com",
	    databaseURL: "https://socialbeat-92100.firebaseio.com",
	    projectId: "socialbeat-92100",
	    storageBucket: "socialbeat-92100.appspot.com",
	    messagingSenderId: "914787385253"
	  };
	  firebase.initializeApp(config);
	  app["dbRef"] = firebase.database().ref(app.session+'/');
	},
	generateUid:function(){
	    // I generate the UID from two parts here 
	    // to ensure the random number provide enough bits.
	    var firstPart = (Math.random() * 46656) | 0;
	    var secondPart = (Math.random() * 46656) | 0;
	    firstPart = ("000" + firstPart.toString(36)).slice(-3);
	    secondPart = ("000" + secondPart.toString(36)).slice(-3);
	    return firstPart + secondPart;
	}
};
$(document).ready(function(){
	app.init();
});
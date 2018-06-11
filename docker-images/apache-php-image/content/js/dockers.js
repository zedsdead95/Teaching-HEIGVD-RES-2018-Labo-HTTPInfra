$(function(){
	console.log("Loading dockers");
	
	function loadDockers(){
		$.getJSON("/api/dockers/",function(dockers){
			console.log(dockers);
			var message;
			//if(dockers.length > 0){
				message = dockers[0].containerName + " " + dockers[0].containerHash;
				//}
			$(".maclasse").text(message);				
		});
	};
	
	loadDockers();
	setInterval(loadDockers,2000);
}); 
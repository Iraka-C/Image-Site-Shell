(function(){
	if(!jQuery){
		console.log("jQuery Not Found!");
		return;
	}
	var getJSON=function(uri,callback){
		var query="select * from json where url='"+uri+"'";
		var queryURL="https://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query)+"&format=json";
		$.ajax({
	        url:queryURL,
	        success:data=>{
				callback(data.query.results.json.json);
			},
			error:(xhr,info,exception)=>{
				console.log(exception);
			}
	    });
	};
	var getXML=function(uri,callback){
		var query="select * from xml where url='"+uri+"'";
		var queryURL="https://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query)+"&format=xml";
		$.ajax({
	        url:queryURL,
	        success:data=>{
				callback($(data).children("query").children("results").children().get(0));
			},
			error:(xhr,info,exception)=>{
				console.log(exception);
			}
	    });
	};
	// TODO: getXMLGroup, time interval limitation

	$.getCrossOriginJSON=getJSON;
	$.getCrossOriginXML=getXML;
})();

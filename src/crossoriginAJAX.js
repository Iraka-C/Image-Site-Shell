/**
	New Version of CORS - Using XmlHttpRequest2
 */
function createCORSRequest(method,url){
	var xhr=new XMLHttpRequest();
	xhr.responseType = "text";
	if("withCredentials" in xhr){ // Chrome/Safari/Firefox.
		xhr.open(method,url,true);
	}
	else if(typeof XDomainRequest!="undefined"){ // IE
		xhr=new XDomainRequest();
		xhr.open(method,url);
	}
	else{ // Unsupported
		xhr=null;
	}
	return xhr;
}

// Test
function makeCORSRequest(){
	// bibliographica.org supports CORS
	var url="http://bibliographica.org/";
	var xhr=createCORSRequest("GET",url);
	if(!xhr){
		alert("CORS not supported");
		return;
	}
	// 回应处理
	xhr.onload=function(){
		var text=xhr.responseText;
		var title=getTitle(text);
		alert('Response from CORS request to '+url+': '+title);
	};
	xhr.onerror=function(){
		alert('Woops, there was an error making the request.');
	};
	xhr.send();
}


/*
	This cross origin fetcher is depricated due to the shut down of YQL.
	Other Web APIs shall be used (without cross-origin request).

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
})();*/

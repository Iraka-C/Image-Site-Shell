function selectSite(){
	if($("#setting_cover").css("display")=="block"){
		$("#setting_cover").css("display","none");
		return;
	}
	$("#setting_cover").css("display","block");
	$("#setting_panel").html("");
	for(var site in sites){
		// v ~ sites[v]
		$("#setting_panel").append(getSiteBox(site));
	}
}

function showHint(){
	$("#site_name").css("display","none");
	$("#header_hint").text("Loading Page "+profile.page+" ...");
	$("#header_hint").css("display","inline-block");
}

function hideHint(info){
	$("#header_hint").css("display","none");
	$("#site_name").text(profile.site+(info?": "+info:""));
	$("#site_name").css("display","inline-block");
}

function getSiteBox(site){
	var box=$("<div>"+(sites[site].invalid?"-":"&middot;")+"&nbsp;"+site+"</div>");
	box.click(event=>{
		//profile.rating=2; // rating not changed
		profile.site=site;
		startMainpage();
	});
	return box;
}

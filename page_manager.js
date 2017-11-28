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

function getSiteBox(site){
	var box=$("<div>"+(sites[site].invalid?"-":"&middot;")+"&nbsp;"+site+"</div>");
	box.click(event=>{
		//profile.rating=2; // rating not changed
		profile.site=site;
		startMainpage();
	});
	return box;
}

var sites={ // all cross-origin denied site has json response.
	"Yandere":{
		urlFunc:page=>"https://yande.re/post.xml?page="+page,
		parseXMLFunc:parseYandere
	},
	"Konachan":{
		urlFunc:page=>"https://konachan.com/post.xml?page="+page,
		parseXMLFunc:parseKonachan
	},
	"Danbooru":{
		urlFunc:page=>"https://danbooru.donmai.us/posts.xml?page="+page,
		parseXMLFunc:parseDanbooru
	}
};

//========================= cross origin ======================
// https://developer.yahoo.com/yql/

//========================= General Handler =======================
var toAppend=false;
var imgNum;
var imgLoad;
function appendPage(){
	if(!toAppend)return;
	toAppend=false;
	imgNum=0;
	imgLoad=0;
	showHint();
	$("#images").append( // page indicator
		$("<div class='.noselect'></div>")
		.text(profile.page)
		.addClass("imgPageNumber")
	);
	var site=sites[profile.site];

	if(site.parseXMLFunc){
		$.ajax({
			url:site.urlFunc(profile.page),
			success:text=>parsePage(text,site.parseXMLFunc),
			/* @TODO: Add timeout error */
			error:(xhr,info,exception)=>{
				console.log(exception);
				sites[profile.site].invalid=1;
				hideHint("Error");
			}
		});
	}
	else{
		hideHint("Invalid Parser");
		console.error("No parser found for this website!");
		sites[profile.site].invalid=1;
	}
}

function startMainpage(){
	if(profile.site==""){
		toAppend=false;
		$("#morePageButton").css("display","none");
		return; // not decided
	}
	//$("#morePageButton").css("display","block");
	refresh();
}

function refresh(){
	$("#images").html("");
	profile.page=1;
	toAppend=true;
	appendPage();
}

function parsePage(text,parser){
	var imgs=parser(text);
	if(!imgs||!imgs.length){ // No Valid Item Got
		hideHint("Null");
		return;
	}

	profile.page++;
	imgNum=imgs.length;
	for(var v in imgs){
		var img=imgs[v];
		if(img){
			var thumbImgBox=generateThumbImg(img);
			var coverDiv=$("<div></div>").addClass("imgCover");
			var imgDiv=$("<div></div>").append(thumbImgBox,coverDiv).addClass("imgBox");
			coverDiv.html(/*img.width+"&times;"+img.height+"&nbsp;"+*/fileSizeString(img.size));
			thumbImgBox.attr("onload",()=>{
				reportLoad();
				$("#images").append(imgDiv); // @TODO: Here change to add null box first (Loading)
			});
			/*thumbImgBox.attr("onerror",()=>{
				//imgDiv.text("Error");
				console.log("error "+imgLoad+"/"+imgNum);
				// @TODO: remove the image block on error
			});*/
		}
	}
	$("#more_page_button").css("display","block");
}

function generateThumbImg(imgURL){
	var box=$("<img/>").attr("src",imgURL.thumb);
	box.addClass("img");
	box.mousedown(event=>{
		if(event.button==0){
			var filename=imgURL.src.substr(imgURL.src.lastIndexOf("/")+1);
			saveImg(imgURL.src,filename);
		}
		else{ // @TODO: zoom in at the current page ?
			var imgWindow=window.open(imgURL.src); // @TODO: Mobile client operation ?
			imgWindow.oncontextmenu=event=>{
				// Confirm that first right_click won't trigger the menu
				if(!imgWindow._initialized){
					imgWindow._initialized=true;
					event.cancelBubble=true;
					event.returnValue=false;
					return false;
				}
				else{
					return true;
				}
			}
		}
	});
	return box;
}

function reportLoad(){
	imgLoad++;
	if(imgLoad>=imgNum){
		console.log(imgLoad+":"+imgNum+" All img loaded");
		toAppend=true;
		hideHint();
	}
}

//=========================== Tools =======================================
function saveImg(src){
	var saveLink=document.createElement("a");
	saveLink.style.display="none";
	saveLink.href=src;
	saveLink.download="";

	// @TODO: Chrome download as picture: use canvas & base64
	document.body.appendChild(saveLink);
	saveLink.click();
	document.body.removeChild(saveLink);
}

function scrollPage(){
	//console.log("scroll");
	var bottomIn=$("#images").offset().top+$("#images").height();
	var bottomOut=$("#scroll_outer").offset().top+$("#scroll_outer").height();
	//console.log(bottomIn+","+bottomOut);
	if(bottomIn-10<=bottomOut){
		console.log("you are at the bottom");
		//$("#morePageButton").css("display","none");
		appendPage();
	}
}

function shiftRating(rating){
	if(profile.site==""||sites[profile.site].invalid){
		return;
	}

	// Safe Button
	if(!rating){
		if(!shiftRating.record){
			shiftRating.record=1;
			return;
		}
		else if(shiftRating.record<10){
			shiftRating.record++;
			switch(shiftRating.record){
				case 7:
					$("#site_name").text("Beware!!");
					break;
				case 8:
				case 9:
				case 10:
					hideHint();
					break;
				default:
			}
			return;
		}
		profile.rating=(profile.rating+2)%3;
	}
	else{
		profile.rating={"s":2,"q":1,"e":0}[rating]||2;
	}


	console.log("Shift Rating");
	// Change address bar color - mobile browser

	$("#rating").text(["R18+","R15+","Safe"][profile.rating]);

	var color=["#E00","#EA0","#AEF"][profile.rating];
	$("#banner").css("background-color",color);
	$(".theme-color-meta").attr("content",color);
	startMainpage();
}

function fileSizeString(size){
	const unit=" KMGTPEZYBND";
	var cnt=0;
	for(;size>=1024;cnt++){
		size/=1024;
	}
	return size.toFixed(2)+unit[cnt]+"B";
}
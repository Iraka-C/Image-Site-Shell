var sites={ // all corss-origin denied site has json response.
	"yande.re":{
		urlFunc:page=>"https://yande.re/post?page="+page,
		parseFunc:parseYandeRe
	},
	"Konachan":{
		urlFunc:page=>"https://konachan.net/post.json?page="+page,
		parseJSONFunc:parseKonachan
	},
	"Danbooru":{
		urlFunc:page=>"https://danbooru.donmai.us/posts?page="+page,
		parseFunc:parseDanbooru
	},
	"Lolibooru":{
		urlFunc:page=>"https://lolibooru.moe/post.json?page="+page,
		//xmlFunc:page=>"https://lolibooru.moe/post/index.xml",
		// or .json also works -> use jsonp ? NO!
		parseJSONFunc:parseLolibooru
	}
	//"Safebooru": API cross-origin limitation
	//"Zerochan": No API applied
	//"MiniTokyo": No API applied
	//"E-Shuushuu": No applicable API applied
};

//========================= cross origin ======================
// https://developer.yahoo.com/yql/

//========================= General Handler =======================
var toAppend=true;
var imgNum;
var imgLoad;
function appendPage(){
	if(!toAppend)return;
	toAppend=false;
	imgNum=0;
	imgLoad=0;
	$("#site_name").text("Loading Page "+profile.page+" ...");
	$("#images").append( // page indicator
		$("<div class='.noselect'></div>")
		.text(profile.page)
		.addClass("imgPageNumber")
	);
	var site=sites[profile.site];
	if(site.parseFunc){
		$.ajax({
			url:site.urlFunc(profile.page),
			success:text=>parsePage(text,site.parseFunc),
			error:(xhr,info,exception)=>{
				console.log(exception);
				$("#site_name").text(profile.site+" ~ Error");
				sites[profile.site].invalid=1;
			}
		});
	}
	else if(site.parseJSONFunc){
		$.getCrossOriginJSON(
			site.urlFunc(profile.page),
			text=>parsePage(text,site.parseJSONFunc)
		);
	}
}

function startMainpage(){
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
	if(!imgs){ // No Valid Item Got
		$("#site_name").text(profile.site+" ~ Empty");
		return;
	}

	profile.page++;
	imgNum=imgs.length;
	for(var v in imgs){
		if(imgs[v]){
			var thumbImg=generateThumbImg(imgs[v]);
			var imgDiv=$("<div></div>").append(thumbImg).addClass("imgBox");
			thumbImg.attr("onload",()=>{
				reportLoad();
				$("#images").append(imgDiv);
			});
			/*thumbImg.attr("onerror",()=>{
				//imgDiv.text("Error");
				console.log("error");
			});*/
		}
	}
}

function generateThumbImg(imgURL){
	var box=$("<img/>").attr("src",imgURL.thumb);
	box.addClass("img");
	box.mousedown(event=>{
		if(event.button==0){
			saveImg(imgURL.src);
		}
		else{ // zoom in at the current page ?
			var imgWindow=window.open(imgURL.src);
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
		$("#site_name").text(profile.site);
	}
}
//========================== yande.re ===========================
function parseYandeRe(text){
	//console.log(text);
	/*for(var i=text.indexOf("Post.register(",text.indexOf("Post.register_tags(")); // extract all json info ?
	    i>=0;
		i=text.indexOf("Post.register(",i+1)){
		console.log(i);
	}*/

	var posts=$(text).find("ul#post-list-posts").children();
	var imgs=[];
	for(var i=0;i<posts.length;i++){
		var box=parseYandeRePost($(posts.get(i))); // posts is NOT an array!
		if(box){
			imgs.push(box);
		}
	}
	return imgs;
}

function parseYandeRePost(post){
	var thumbDiv=post.children("div").children("a").children("img").get(0);
	var thumbURL=thumbDiv.src;
	var imgLink=post.children("a").get(0).href;

	var imgRating=thumbDiv.alt;
	imgRating=imgRating.slice(8,imgRating.indexOf("Score:")-1);
	imgRating={"Safe":2,"Questionable":1,"Explicit":0}[imgRating]||0;
	// Always consider an undefined as NOT safe

	//console.log(imgRating);
	if(imgRating>=profile.rating){
		return {thumb:thumbURL,src:imgLink};
	}
	else{
		return undefined;
	}
}

//========================== konachan.net ===========================
function parseKonachan(posts){
	//console.log(text);
	// Cross Origin
	var imgs=[];
	for(var i=0;i<posts.length;i++){
		var post=posts[i];
		var thumbURL="https:"+post.preview_url;
		var imgLink="https:"+post.file_url;
		var imgRating={"s":2,"q":1,"e":0}[post.rating]||0;
		if(imgRating>=profile.rating){
			imgs.push({thumb:thumbURL,src:imgLink});
		}
	}
	return imgs;
}

//========================== danbooru ===========================
function parseDanbooru(text){
	var posts=$(text).find("#posts").children().first().children();
	var imgs=[];
	for(var i=0;i<posts.length;i++){
		var box=parseDanbooruPost($(posts.get(i)));
		if(box){
			imgs.push(box);
		}
	}
	return imgs;
}

function parseDanbooruPost(post){
	var thumbDiv=post.children("a").children("img").get(0);
	var thumbURL=thumbDiv.src;
	thumbURL="http://danbooru.donmai.us"+thumbURL.slice(thumbURL.indexOf("/data/"),thumbURL.length);
	var imgLink=post.attr("data-file-url");
	imgLink="http://danbooru.donmai.us"+imgLink.slice(imgLink.indexOf("/data/"),imgLink.length);

	var imgRating=post.attr("data-rating");
	imgRating={"s":2,"q":1,"e":0}[imgRating]||0;
	if(imgRating>=profile.rating){
		return {thumb:thumbURL,src:imgLink};
	}
	else{
		return undefined;
	}
}

//========================== lolibooru ===========================
function parseLolibooru(posts){
	//console.log(posts);
	var imgs=[];
	for(var i=0;i<posts.length;i++){ // Basically same to Konachan
		var post=posts[i];
		var thumbURL=post.preview_url;
		var imgLink=post.file_url;
		var imgRating={"s":2,"q":1,"e":0}[post.rating]||0;
		if(imgRating>=profile.rating){
			imgs.push({thumb:thumbURL,src:imgLink});
		}
	}
	return imgs;
}

//========================== safebooru ===========================
function parseSafebooru(text){
	console.log(text);
	// Cross Origin
}

//========================== zerochan ===========================
function parseZerochan(text){
	console.log(text);
	// Cross Origin
}

//========================== zerochan ===========================
function parseMiniTokyo(text){
	console.log(text);
	// Cross Origin
}

//========================== zerochan ===========================
function parseEShuushuu(text){
	console.log(text);
	// Cross Origin
}

//=========================== Tools =======================================

function saveImg(src){
    var $a=$("<a></a>").attr("href",src).attr("download",src);
    $a[0].click();
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

function shiftRating(){

	// Safe Button
	console.log(shiftRating.record);
	if(shiftRating.record===undefined){
		shiftRating.record=0;
		return;
	}
	else if(shiftRating.record<10){
		shiftRating.record++;
		switch(shiftRating.record){
			case 7:
				$("#site_name").text("Beware!!");
				break;
			/*case 8:
				$("#site_name").text("");
				break;
			case 9:
				$("#site_name").text("");
				break;
			case 10:
				$("#site_name").text("");
				break;*/
			default:
		}
		return;
	}

	console.log("Shift Rating");
	// Change address bar color - mobile browser
	profile.rating=(profile.rating+2)%3;
	$("#rating").text(["R18+","R15+","Safe"][profile.rating]);

	var color=["#E00","#EA0","#AEF"][profile.rating];
	$("#banner").css("background-color",color);
	$(".theme-color-meta").attr("content",color);
	startMainpage();
}

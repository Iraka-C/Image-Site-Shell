var sites={
	"yande.re":{
		urlFunc:page=>"https://yande.re/post?page="+page,
		parseFunc:parseYandeRe
	},
	"Konachan":{
		urlFunc:page=>"https://konachan.net/post?page="+page,
		parseFunc:parseKonachan
	},
	"Danbooru":{
		urlFunc:page=>"https://danbooru.donmai.us/posts?page="+page,
		parseFunc:parseDanbooru
	},
	"Lolibooru":{
		urlFunc:page=>"https://lolibooru.moe/post?page="+page,
		//xmlFunc:page=>"https://lolibooru.moe/post/index.xml",
		parseFunc:parseLolibooru
	},
	"Safebooru":{
		urlFunc:page=>"http://safebooru.org/index.php?page=post&s=list&pid="+(page-1)*40,
		parseFunc:parseSafebooru
	},
	"Zerochan":{
		urlFunc:page=>"https://www.zerochan.net/?p="+page,
		parseFunc:parseZerochan
	},
	"MiniTokyo":{
		urlFunc:page=>"http://gallery.minitokyo.net/wallpapers?page="+page,
		parseFunc:parseMiniTokyo
	},
	"E-Shuushuu":{
		urlFunc:page=>"http://e-shuushuu.net/?page="+page,
		parseFunc:parseEShuushuu
	}

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
	profile.page++;
	$("#site_name").text("Loading Page "+profile.page+" ...");

	var site=sites[profile.site];
	/*$.get(site.urlFunc(profile.page),text=>{
		parsePage(text,site.parseFunc);
	});*/
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

function startMainpage(){
	//$("#morePageButton").css("display","block");
	refresh();
}

function refresh(){
	$("#images").html("");
	profile.page=0;
	toAppend=true;
	appendPage();
}

function parsePage(text,parser){
	var imgs=parser(text);
	if(!imgs){ // No Valid Item Got
		$("#site_name").text(profile.site+" ~ Empty");
		return;
	}
	imgNum=imgs.length;
	for(var v in imgs){
		if(imgs[v]){
			var thumbImg=generateThumbImg(imgs[v]);
			var imgDiv=$("<div></div>").append(thumbImg).addClass("imgBox");
			$("#images").append(imgDiv);
		}
	}
}

function generateThumbImg(imgURL){
	var box=$("<img/>").attr("src",imgURL.thumb);
	box.addClass("img").attr("onload",reportLoad);
	box.mousedown(event=>{
		if(event.button==0){
			saveImg(imgURL.src);
		}
		else{ // zoom in in the current page ?
			window.open(imgURL.src);
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
	imgRating={"Safe":0,"Questionable":1,"Explicit":2}[imgRating]||0;
	//console.log(imgRating);
	if(imgRating<=profile.rating){
		return {thumb:thumbURL,src:imgLink};
	}
	else{
		return undefined;
	}
}

//========================== konachan.net ===========================
function parseKonachan(text){
	console.log(text);
	// Cross Origin
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
	thumbURL="https://danbooru.donmai.us"+thumbURL.slice(thumbURL.indexOf("/data/"),thumbURL.length);
	var imgLink=post.attr("data-file-url");
	imgLink="https://danbooru.donmai.us"+imgLink.slice(imgLink.indexOf("/data/"),imgLink.length);

	var imgRating=post.attr("data-rating");
	console.log(imgRating);
	imgRating={"s":0,"q":1,"e":2}[imgRating]||0;
	if(imgRating<=profile.rating){
		return {thumb:thumbURL,src:imgLink};
	}
	else{
		return undefined;
	}
}

//========================== lolibooru ===========================
function parseLolibooru(text){
	console.log(text);
	// Cross Origin
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
	console.log(bottomIn+","+bottomOut);
	if(bottomIn-10<=bottomOut){
		console.log("you are at the bottom");
		//$("#morePageButton").css("display","none");
		appendPage();
	}
}

function shiftRating(){
	console.log("Shift Rating");
	profile.rating=(profile.rating+1)%3;
	$("#rating").text(["Safe","R15+","R18+"][profile.rating]);
	$("#banner").css("background-color",["#AEF","#EA0","#E00"][profile.rating]);
	startMainpage();
}

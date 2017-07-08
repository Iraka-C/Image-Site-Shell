var sites={
	"yande.re":{url:"https://yande.re/post",func:parseYandeRe}
};
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
	$("#banner").text("Loading Page "+profile.page+" ...");

	var site=sites[profile.site];
	$.get(site.url,{page:profile.page},text=>{
		parsePage(text,site.func);
	});
}

function startMainpage(){
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
	imgNum=imgs.length;
	for(var i=0;i<imgNum;i++){
		imgs[i].attr("onload",reportLoad).addClass("img");
		var imgDiv=$("<div></div>").append(imgs[i]).addClass("imgBox");
		$("#images").append(imgDiv);
	}
}

function reportLoad(){
	imgLoad++;
	if(imgLoad>=imgNum){
		console.log("All img loaded");
		toAppend=true;
		$("#banner").text(profile.site);
	}
}
//========================== yande.re ===========================
function parseYandeRe(text){
	var posts=$(text).find("ul#post-list-posts").children();
	var imgs=[];
	for(var i=0;i<posts.length;i++){
		var box=parsePost($(posts.get(i)));
		if(box){
			imgs.push(box);
		}
	}
	return imgs;
}

function parsePost(post){
	var thumbDiv=post.children("div").children("a").children("img").get(0);
	var thumbURL=thumbDiv.src;
	var imgLink=post.children("a").get(0).href;

	var imgRating=thumbDiv.alt;
	imgRating=imgRating.slice(8,imgRating.indexOf("Score:")-1);
	imgRating={"Safe":0,"Questionable":1,"Explicit":2}[imgRating];
	imgRating=imgRating||0;
	console.log(imgRating);
	if(imgRating<=profile.rating){
		var thumbImg=$("<img/>").attr("src",thumbURL);
		thumbImg.click(function(event){
			//window.open(imgLink);
			saveImg(imgLink);
		});
		return thumbImg;
	}
	else{
		return undefined;
	}
}

//=========================== Tools =======================================

function saveImg(src){
    var $a=$("<a></a>").attr("href",src).attr("download",src);
    $a[0].click();
}

function scroll(){
	var bottomIn=$("#images").offset().top+$("#images").height();
	var bottomOut=$("#scrollOuter").offset().top+$("#scrollOuter").height();
	//console.log(bottomIn+","+bottomOut);
	if(bottomIn-10<=bottomOut){
		console.log("you are at the bottom");
		appendPage();
	}
}

function shiftRating(){
	console.log("Yes");
	profile.rating=(profile.rating+1)%3;
	$("#rating").text(["Safe","R15+","R18+"][profile.rating]);
	$("#banner").css("background-color",["#AEF","#EA0","#E00"][profile.rating]);
	refresh();
}

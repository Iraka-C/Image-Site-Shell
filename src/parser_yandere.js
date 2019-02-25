/*
	yande.re parser
 */

function parseYandere(text){
	var posts=$(text).find("post");
	
	var imgs=[];
	for(var i=0;i<posts.length;i++){
		var img=parseYanderePost($(posts.get(i))); // posts is NOT an array!
		if(img){
			imgs.push(img);
		}
	}
	return imgs;
}

function parseYanderePost(post){
	//console.log(post);
	
	// Decide ratings first
	var rating=post.attr("rating");
	rating={"s":2,"q":1,"e":0}[rating]||0;
	// Always consider an undefined as NOT safe

	if(rating>=profile.rating){
		var img={};
		img.thumb=post.attr("preview_url");
		img.src=post.attr("file_url");
		img.width=post.attr("width");
		img.height=post.attr("height");
		img.prevWidth=post.attr("actual_preview_width");
		img.prevHeight=post.attr("actual_preview_height");
		img.size=post.attr("file_size");
		img.id=post.attr("id");
		return img;
	}
	else{
		return undefined;
	}
}
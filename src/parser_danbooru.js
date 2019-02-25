/*
	danbooru.donmai.us parser
 */

function parseDanbooru(text){
	var posts=$(text).find("post");
	
	var imgs=[];
	for(var i=0;i<posts.length;i++){
		var img=parseDanbooruPost($(posts.get(i))); // posts is NOT an array!
		if(img){
			imgs.push(img);
		}
	}
	return imgs;
}

function parseDanbooruPost(post){
	//console.log(post);
	
	// Decide ratings first
	var rating=post.children("rating").text();
	
	rating={"s":2,"q":1,"e":0}[rating]||0;
	// Always consider an undefined as NOT safe

	if(rating>=profile.rating){
		var img={};
		img.thumb=post.children("preview-file-url").text();
		img.src=post.children("file-url").text();
		img.width=post.children("image-width").text();
		img.height=post.children("image-height").text();
		img.size=post.children("file-size").text();
		img.id=post.children("id").text();
		img.pixivId=post.children("pixiv-id").text();
		return img;
	}
	else{
		return undefined;
	}
}
# Image Site Shell
## Introduction
A simple shell for some image resource sites.<br/>
[You can try it here](https://iraka-c.github.io/Image-Site-Shell/index.html)<br/>
Scroll downwards or click on "Load More" to load a following page.<br/>
Click on the image to download the original file.<br/>
Right click on the image to show original file. (Experimental)<br/><br/>
Currently support:<br/>
* yande.re<br/>
* Konachan<br/>
* Danbooru<br/>
<!-- * Lolibooru<br/> -->
etc.<br/>
<br/>

By recomposing the UI, an easier environment to browse pictures is provided, and you needn't worry about finding the source URL, blocking ads or manually switching pages.

## Cross Origin Resources
Image Site Shell uses YQL Ajax service for cross-origin xml/json data fetching, therefore proxies are not necessary for this shell and all operations can be performed at the browser front-end.

## Possible Issues
* Some access to the original file (left/right click) via https may respond with 403 error. You can change the URI to http instead.<br/>
* When a new page is added at the original site, duplicated images may appear. This is not a big problem as you can continue asking the shell to load another new page.<br/>

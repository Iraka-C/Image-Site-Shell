# Image Site Viewer

## Introduction

A simple shell for some image resource sites.

[You can try it here](https://iraka-c.github.io/Image-Site-Shell/index.html)

Scroll downwards or click on "Load More" to load a following page.

Click on the image to download the original file. (Except for **Chrome**)

Right click on the image to show original file. (Experimental)

Currently support:

* yande.re
* Danbooru

etc.

By recomposing the UI, an easier environment to browse pictures is provided, and you needn't worry about finding the source URL, blocking ads or manually switching pages.

## Possible Issues

* Some access to the original file (left/right click) via https may respond with **403** error. [You can change the URI to **http** instead.]()
* When a new page is added at the original site, duplicated images may appear. This is not a big problem as you can continue asking the shell to load another new page.
* In Chrome, left-click to download is deprecated because of safety concerns. Don't left-click on an image as it clears all the loaded contents. Instead, right-click and use the **save-image-as** function.
* CORS is disabled by some sites (such as konachan) and Image Site Viewer doesn't support laying out the posts of these sites.

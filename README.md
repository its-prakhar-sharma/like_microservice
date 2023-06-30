# Like Microservice

##Work in progress for documentation.

###Installation:
run `docker composer up` currently not working giving some error in docker only. Still fixing

###Routes:

1. POST /likes/  require(content_id,user_id): post the like with content_id and user_id.
2. GET likes/:userId/:contentId : to get boolean to check if it is liked or not
3. GET likes/count/:contentId  : to get the like count


   Also added functionality to log when content reach 100 likes. 

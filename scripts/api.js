'use strict';

const api = (function(){

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/nikkie';

  const getBookmarks = function(success){
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'GET',
      contentType: 'application/json',
      //if its sucessfull, pass whatever bookmarks we recieved from the server to the callback fn 
      success: bookmarks => {
        success(bookmarks);
      }
    });
  };

  const createBookmark = function(title,url,description,rating, success, error){
    //QUESTION: WILL THIS HAVE 2 URLS? url base and url that user wants? 
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      title: JSON.stringify(title),
      // url: JSON.stringify(url),
      description: JSON.stringify(description),
      rating: JSON.stringify(rating),
      //QUESTION: don't understand all these callbacks below and how they work
      //if its successful, take whatever the server returned and pass it into the callback "success"
      success: bookmark => {
        success(bookmark);
      },
      //if its not successful, pass in whatever the server responded to the error callback fn
      error: response =>{
        error(response);
      }
    });
  };

  return{
    getBookmarks,
    createBookmark
  };
}());
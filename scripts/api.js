'use strict';

const api = (function(){

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/nikkie';

  const getBookmarks = function(onSuccess){
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'GET',
      contentType: 'application/json',
      //if its sucessfull, pass whatever bookmarks we recieved from the server to the callback fn 
      success: onSuccess
    });
  };

  const createBookmark = function(title,url,desc,rating, onSuccess, onError){
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({title: title, url: url, desc: desc, rating: rating}),
      // title: JSON.stringify(title),
      // url: JSON.stringify(url),
      // description: JSON.stringify(description),
      // rating: JSON.stringify(rating),
      
      //if its successful, take whatever the server returned and pass it into the callback "success"
      success: onSuccess,
      //if its not successful, pass in whatever the server responded to the error callback fn
      error: onError,
    });
  };

  const deleteBookmark = function(id, onSuccess){
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: onSuccess,
    });
  };

  return{
    getBookmarks,
    createBookmark,
    deleteBookmark,
  };
}());
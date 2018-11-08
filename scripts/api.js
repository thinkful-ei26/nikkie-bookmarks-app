'use strict';

const api = (function(){

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/nikkie';

  const getBookmarks = function(onSuccess, onError){
    console.log('in getbookmarks');
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'GET',
      contentType: 'application/json',
      //if its sucessfull, pass whatever bookmarks we recieved from the server to the callback fn 
      success: onSuccess,
      error: onError
    });
  };

  const createBookmark = function(newBookmark, onSuccess, onError){
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newBookmark),
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

  const updateBookmark = function(updatedBookmark, id, onSuccess, onError){
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updatedBookmark),
      success: onSuccess,
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
    updateBookmark,
  };
}());
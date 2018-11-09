'use strict';

const api = (function(){

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/nikkie';

  //api dealing with requesting whatever bookmarks are on the server, so we can render it to the page
  const getBookmarks = function(onSuccess){
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'GET',
      contentType: 'application/json',
      //if its sucessfull, pass whatever bookmarks we recieved from the server to the callback fn 
      success: onSuccess,
    });
  };

  //api requesting to create a new bookmark 
  const createBookmark = function(newBookmark, onSuccess, onError){
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newBookmark),
      //if its successful, take whatever the server returned and pass it into the callback "success"
      success: onSuccess,
      //if its not successful, pass in whatever the server responded to the error callback fn
      error: onError,
    });
  };

  //api requesting to update a bookmark with given id
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

  //api requesting to delete bookmark from server
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
'use strict';
/*global api, store, bookmarkList */

$(document).ready(function(){

  //when the doc is ready, bind all the event listeners so we can trigger an event if something happens
  bookmarkList.bindEventListeners();

  //and call the getBookmarks fn, and when we get a response back from the server, add each item to the store, and render it 
  api.getBookmarks(bookmarks => {
    bookmarks.forEach(bookmark=>{
      bookmark.expanded = false; //add this in manually bc server doesnt include this as a property
      bookmark.editing = false; //same with this
      store.addBookmark(bookmark); 
    });
    bookmarkList.render();
    
  }
  );
});
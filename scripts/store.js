'use strict';

const store = (function(){
  const bookmarks=[];
  const filter = null;
  const error = null;
  const adding = false;

  const addBookmark = function(bookmark){
    this.bookmarks.push(bookmark);
  };

  const findAndDelete = function(id){
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  return{
    bookmarks,
    filter,
    error,
    adding,
    addBookmark,
    findAndDelete,
  };
}());
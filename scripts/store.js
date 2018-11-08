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

  const findBookmarkById = function(id){
    //QUESTION why does "this" not work here? need to keep the "this" context through the function chain 
    console.log(bookmarks);
    return bookmarks.find(bookmark=> bookmark.id===id);
  };

  const toggleExpandedForBookmark = function(id){
    const bookmark = findBookmarkById(id);
    bookmark.expanded = !bookmark.expanded;
  };

  const toggleEditedForBookmark = function(id){
    const bookmark = findBookmarkById(id);
    bookmark.editing=!bookmark.editing;
  };

  const setError = function(error){
    this.error = error;
  };

  const setFilterRating = function (filter_rating){
    this.filter = filter_rating;
  };

  return{
    bookmarks,
    filter,
    error,
    adding,
    addBookmark,
    findAndDelete,
    toggleExpandedForBookmark,
    setError,
    setFilterRating,
    toggleEditedForBookmark
  };
}());
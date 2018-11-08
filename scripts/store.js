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
    return this.bookmarks.find(bookmark=> bookmark.id===id);
  };

  const toggleExpandedForBookmark = function(id){
    const bookmark = this.findBookmarkById(id);
    bookmark.expanded = !bookmark.expanded;
  };

  const toggleEditedForBookmark = function(id){
    const bookmark = this.findBookmarkById(id);
    bookmark.editing=!bookmark.editing;
  };

  const toggleAddingABookmark = function(){
    store.adding = !store.adding;
  };

  const setError = function(error){
    this.error = error;
  };

  const setFilterRating = function (filter_rating){
    this.filter = filter_rating;
  };

  const updateBookmark = function(newBookmark, id){
    const bookmark = this.findBookmarkById(id); //changed this, and now it works?
    console.log(bookmark);
    Object.assign(bookmark, newBookmark);//not being properly reassigned here
    console.log('this is the found bookmark',bookmark);
    console.log('this is the new bookbark',newBookmark);
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
    toggleEditedForBookmark,
    updateBookmark,
    findBookmarkById,
    toggleAddingABookmark
  };
}());
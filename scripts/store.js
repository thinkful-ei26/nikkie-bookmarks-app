'use strict';

/*eslint-disable no-unused-vars */
const store = (function(){
  const bookmarks=[];
  const filter = null;
  const error = null;
  const adding = false;
  const disabled = false;

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
    this.adding = !this.adding;
    //toggle the hidden bool for the form 
    $('form').toggle();
  };

  const setError = function(error){
    this.error = error;
  };

  const setDisabled = function (bool_val){
    this.disabled = bool_val;
  };

  const setFilterRating = function (filter_rating){
    this.filter = filter_rating;
  };

  const updateBookmark = function(newBookmark, id){
    const bookmark = this.findBookmarkById(id);
    Object.assign(bookmark, newBookmark); //mutates the reference to the current bookmark to the new bookmark
  };

  return{
    bookmarks,
    filter,
    error,
    adding,
    disabled,
    setDisabled,
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
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
    //QUESTION why does "this" not work here?
    console.log(store.bookmarks);
    return store.bookmarks.find(bookmark=> bookmark.id===id);
  };

  const toggleExpandedForBookmark = function(id){
    const bookmark = findBookmarkById(id);
    bookmark.expanded = !bookmark.expanded;
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
  };
}());
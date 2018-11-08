'use strict';

const store = (function(){
  const bookmarks=[];
  const filter = null;
  const error = null;
  const adding = false;

  return{
    bookmarks,
    filter,
    error,
    adding,
  };
}());
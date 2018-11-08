'use strict';
/*global store, api */
const bookmarkList = (function(){

  const handleAddBookmark = function(){
    //event listener for when user hits add bookmark button. 
    $('.js-begin-add-bookmark').click(event=>{
      store.adding = !store.adding; //toggle adding in store (is it okay that I do that here?)
      //toggle the hidden bool???
      render();
    });
    //toggle adding in store 
    //render 

  };

  const handleCreateBookmark = function(){
    //event listener on button (event delegation) //QUESTION: when i did event delegation, didnt work. But button doesnt exist yet... 
    $('form').on('submit', event => {
      //prevent default
      event.preventDefault();
      //grab all the values (title, url, rating, desc) - remember, rating and desc might not exist
      const title = $(event.target).find('.js-bookmark-title').val();
      const url = $(event.target).find('.js-bookmark-url').val();
      const description = $(event.target).find('.js-bookmark-description').val();
      const rating = $(event.target).find('.js-bookmark-rating').val();
      //make form disappear by toggling the adding 
      store.adding = !store.adding;
      //call an api fn that will send/post this info to the server to create this bookmark. Pass in all the info, a callback anonymous function if its successful, and a callback anonymous function that deals with an error   
      api.createBookmark(title,url,description,rating,
        //if the async function was successful, it'll run this fn
        bookmark =>{
          console.log(bookmark);
        },
        //if the async function returned an error, it'll run this fn 
        error => {
          console.log(error.responseJSON.message);
        }
      );
      //render in that callback 
     
    });
  };

  const generateAddBookmarkForm = function(){
    return `
    <h3>Create A New Bookmark</h3>
          <input type="text" class = "bookmark-title js-bookmark-title" placeholder = "Title">
          <br>
          <input type="text" class = "bookmark-url js-bookmark-url" placeholder="URL">
          <br>
          <textarea name="bookmark-desc" cols="20" rows="9" class = "bookmark-desc js-bookmark-description" placeholder="Write a brief description about your bookmark"></textarea>
          <br>
          <label for="bookmark-rating">Rating:</label>
          <select class = "bookmark-rating js-bookmark-rating">
            <option selected disabled>Choose a Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="4">5 Stars</option>
          </select>
          <br>
          <button type = "submit" class = "create-bookmark-button js-create-bookmark-button">Create Bookmark</button>
    `;
  };

  const render = function(){
    let bookmarks = [...store.bookmarks];

    if(store.adding){
      $('.js-adding-new-bookmark-form').html(generateAddBookmarkForm());
    }
    else{
      $('.js-adding-new-bookmark-form').html('');
    }
  };



  const bindEventListeners = function(){
    handleAddBookmark();
    handleCreateBookmark();
  };

  return {
    bindEventListeners,
    render
  };
}());
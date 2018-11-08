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
      const title = $(event.target).find('.js-input-bookmark-title').val();
      const url = $(event.target).find('.js-input-bookmark-url').val();
      let desc = $(event.target).find('.js-input-bookmark-description').val();
      if (!desc){
        desc = null;
      } //if desc is left blank, send in null
      const rating = $(event.target).find('.js-input-bookmark-rating').val();
      //make form disappear by toggling the adding 
      //call an api fn that will send/post this info to the server to create this bookmark. Pass in all the info, a callback anonymous function if its successful, and a callback anonymous function that deals with an error   
      api.createBookmark(title,url,desc,rating,
        //if the async function was successful, it'll run this callback fn
        bookmark => {
          //take the bookmark (and give it an expanded property=false) and add it to the store 
          bookmark.expanded = false;
          store.adding = !store.adding;
          console.log(bookmark);
          store.addBookmark(bookmark);
          store.setError(null);
          render();
        },
        //if the async function returned an error, it'll run this fn 
        error => {
          store.setError(error.responseJSON.message);
          render();
        }
      );
      //render in that callback 
     
    });
  };

  const generateAddBookmarkForm = function(){
    //if there's an error message in store
    const err = store.error ? store.error : '';
    return `
    <h3>Create A New Bookmark</h3>
          <input type="text" class = "input-bookmark-title js-input-bookmark-title" placeholder = "Title">
          <br>
          <input type="text" class = "input-bookmark-url js-input-bookmark-url" placeholder="URL">
          <br>
          <textarea name="bookmark-desc" cols="20" rows="9" class = "input-bookmark-desc js-input-bookmark-description" placeholder="Write a brief description about your bookmark"></textarea>
          <br>
          <label for="bookmark-rating">Rating:</label>
          <select class = "input-bookmark-rating js-input-bookmark-rating">
            <option selected disabled>Choose a Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="4">5 Stars</option>
          </select>
          <br>
          <p class = "error-message js-error-message">${err}</p>
          <button type = "submit" class = "create-bookmark-button js-create-bookmark-button">Create Bookmark</button>
    `;
  };

  const generateAddBookmarksList = function(bookmarks){
    return bookmarks.map(bookmark=>generateBookmarkElement(bookmark)).join('');
  };

  const generateBookmarkElement = function(bookmark){
    //check if rating and desc have values 

    //if rating has a value, give that many stars. If not, just write no rating yet
    let rating = ''; 
    if(bookmark.rating){
      const number_of_stars = bookmark.rating;
      for (let i =0; i < number_of_stars; i++){
        rating+='<i class="fas fa-star"></i>';
      }
    }
    else{
      rating = 'No rating yet';
    }
    // const rating = bookmark.rating!==null ? bookmark.rating : 'No rating yet';
    const desc = bookmark.desc!==null ? bookmark.desc : 'No description yet';

    if (bookmark.expanded){
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <button class = "delete-bookmark  js-delete-bookmark"><i class="fas fa-trash-alt "></i></button>
      <div>
        <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
        <p>${rating}</p>
        <p>${desc}</p>
        <a href="${bookmark.url} class = "visit-site" target = "_blank">Visit site</a>
        <br>
      </div>
    </li>
      `;
    }
    else{
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <button class = "delete-bookmark js-delete-bookmark"><i class="fas fa-trash-alt "></i></button>
      <div>
        <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
        <p>${rating}</p>
      </div>
    </li>
      `;   
    }

  };

  //return the id of the given bookmark 
  const getIdFromBookmark = function(bookmark){
    return $(bookmark).closest('.js-bookmark-element').data('bookmark-id');
  };

  const handleDeleteBookmark = function(){
    //event listener for when user clicks on trash icon 
    $('.js-bookmark-list').on('click', '.js-delete-bookmark', event=>{
      //figure out which bookmark we're deleting - get its id 
      const id = getIdFromBookmark(event.target);
      //make a request to server to delete (it doesnt return anything)
      api.deleteBookmark(id, ()=> {
        //find and delete from store
        store.findAndDelete(id);
        render();
      });
    });
    //render 
  };

  const handleExpandBookmark = function(){
    //event listener on the titles of the elements, when its clicked toggle the expanded property on that bookmark. then render 
    $('.js-bookmark-list').on('click', '.js-bookmark-title', event =>{
      const id = getIdFromBookmark(event.target);
      store.toggleExpandedForBookmark(id);
      render();
    });
  };

  const render = function(){
    let bookmarks = [...store.bookmarks];

    //check if the adding mode is true. if it is, generate the adding form, if it isn't, dont have the form be there
    if(store.adding){
      $('.js-adding-new-bookmark-form').html(generateAddBookmarkForm());
    }
    else{
      $('.js-adding-new-bookmark-form').html('');
    }

    //generate string from what's in the store
    const html = generateAddBookmarksList(bookmarks);
    $('.js-bookmark-list').html(html);
  };



  const bindEventListeners = function(){
    handleAddBookmark();
    handleCreateBookmark();
    handleDeleteBookmark();
    handleExpandBookmark();
  };

  return {
    bindEventListeners,
    render
  };
}());
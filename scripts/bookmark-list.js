'use strict';
/*global store, api */
const bookmarkList = (function(){

  const handleAddBookmark = function(){
    //event listener for when user hits add bookmark button. 
    $('.js-begin-add-bookmark').click(event=>{
      store.toggleAddingABookmark(); //toggle adding in store
      //toggle the hidden bool
      $('form').toggle();
      store.setError(null); //dont keep any error messages 
      //render the adding form 
      renderAddBookmarkForm();
    });
  };

  const handleCancelAddBookmark = function(){
    $('form').on('click', '.js-cancel-create-bookmark-button', event => {
      store.toggleAddingABookmark(); //toggle adding in store (is it okay that I do that here? Move elsewhere?)
      //toggle the hidden bool
      $('form').toggle();
      store.setError(null); //dont keep any error messages
      // render the adding form 
      renderAddBookmarkForm(); 
    });
  };

  const handleCreateBookmark = function(){
    //event listener on button (event delegation)
    $('form').on('submit', event => {
      //prevent default
      event.preventDefault();
      //grab the form values into this object
      const newBookmark = $(event.target).serializeJson();
      // if (!desc){
      //   desc = null;
      // } //if desc is left blank, send in null
     
      //call an api fn that will send/post this info to the server to create this bookmark. Pass in all the info, a callback anonymous function if its successful, and a callback anonymous function that deals with an error   
      api.createBookmark(newBookmark,
        //if the async function was successful, it'll run this callback fn
        bookmark => {
          //take the bookmark (and give it an expanded property=false) and add it to the store 
          bookmark.expanded = false;
          store.toggleAddingABookmark();
          //make form disappear by toggling the adding 
          $('form').toggle();
          store.addBookmark(bookmark);
          store.setError(null);
          renderAddBookmarkForm();
          render();
        },
        //if the async function returned an error, it'll run this fn 
        error => {
          store.setError(error.responseJSON.message);
          showErrorMessage(store.error);
        }
      );     
    });
  };

  const generateAddBookmarkForm = function(){
    //if there's an error message in store
    // const err = store.error ? store.error : '';
    return `
          <h3>Create A New Bookmark</h3>
          <label for = "title">Title:</label>
          <br>
          <input for = "title" name = "title" type="text" class = "input-bookmark-title js-input-bookmark-title" placeholder = "Title">
          <br>
          <br>
          <label for = "url">URL:</label>
          <br>
          <input for = "url" name = "url" type="text" class = "input-bookmark-url js-input-bookmark-url" placeholder="URL">
          <br>
          <br>
          <label for = "desc">Description:</label>
          <br>
          <textarea for = "desc" name = "desc" name="bookmark-desc" class = "input-bookmark-desc js-input-bookmark-description" placeholder="Write a brief description about your bookmark"></textarea>
          <br>
          <br>
          <label for="rating">Rating:</label>
          <br>
          <select for = "rating" name = "rating" class = "input-bookmark-rating js-input-bookmark-rating">
            <option selected disabled>Choose a Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <br>
          <p class = "error-message js-error-message"></p>
          <button type = "submit" class = "create-bookmark-button js-create-bookmark-button">Create Bookmark</button>
          <button type = "button" class = "cancel-create-bookmark-button js-cancel-create-bookmark-button">Cancel </button>
    `;
  };

  const generateAddBookmarksList = function(bookmarks){
    return bookmarks.map(bookmark=>generateBookmarkElement(bookmark)).join('');
  };

  const generateBookmarkElement = function(bookmark){
    //if rating has a value, give that many stars. If not, just write no rating yet
    let rating = ''; 
    if(bookmark.rating){
      const number_of_stars = bookmark.rating;
      for (let i =0; i < number_of_stars; i++){
        rating+='<i class="fas fa-star"></i>';
      }
      //also put in empty stars
      for(let i = 0; i < 5 - number_of_stars; i++){
        rating+='<i class="far fa-star"></i>';
      }
    }
    else{
      rating = 'No rating yet';
    }

    //check if desc has a value 
    const desc = bookmark.desc!=='' ? bookmark.desc : 'No description yet';

    //return a different string if it's in editing mode (NEEDS TO REMEMBER STARS)
    if (bookmark.editing){
      //deals with the edit remembering which rating was selected
      const cell = ['','','','',''];
      cell[bookmark.rating-1] = 'selected';
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <p class = "edit-bookmark-title-p js-bookmark-title">${bookmark.title}</p>
      <form class = "editing-form js-editing-form ">
        <br>
        <label for = "title">Title:</label>
        <br>
        <input for = "title" name = "title" type = "text" class = "edit-bookmark-title js-edit-bookmark-title" value = "${bookmark.title}"></input>
        <br>
        <br>
        <label for = "url">URL:</label>
        <br>
        <input for = "url" name = "url" type = "text" class = "edit-bookmark-url js-edit-bookmark-url" value = "${bookmark.url}"></input>
        <br>
        <br>
        <label for = "desc">Description:</label>
        <br>
        <textarea for = "desc" name = "desc" class = "edit-bookmark-desc js-edit-bookmark-description" value = "${desc}" >${bookmark.desc}</textarea>
        <br>
        <br>
        <label for = "rating">Rating:</label>
        <br>
        <select for = "rating" name = "rating" class = "input-edit-bookmark-rating js-input-edit-bookmark-rating">
              <option selected disabled>Choose a Rating</option>
              <option ${cell[0]} value="1">1 Star</option>
              <option ${cell[1]} value="2">2 Stars</option>
              <option ${cell[2]} value="3">3 Stars</option>
              <option ${cell[3]} value="4">4 Stars</option>
              <option ${cell[4]} value="5">5 Stars</option>
        </select>
        <br>
        <output class = "edit-error-message js-edit-error-message"></output>
        <br>
        <button type = "submit" class = "save-edit-button js-save-edit-button"> Save </button>
        <button type = "button" class = "cancel-edit-button js-cancel-edit-button"> Cancel </button>
      </form> 
    </li>
      `;
    }
    else if (bookmark.expanded){
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <button class = "delete-bookmark  js-delete-bookmark"><i class="fas fa-trash-alt "></i></button>
      <button class = "edit-bookmark  js-edit-bookmark"><i class="fas fa-edit"></i></button>
      <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
      <div>
        <p>${rating}</p>
        <p>${desc}</p>
        <br>
        <a href="${bookmark.url} class = "visit-site" target = "_blank">Visit site</a>
        <br>
        <br>
        <p class = "details js-details" > Less Details <i class="fas fa-caret-up"></i> </p>
      </div>
    </li>
      `;
    }
    else{
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <button class = "delete-bookmark js-delete-bookmark"><i class="fas fa-trash-alt "></i></button>
      <button class = "edit-bookmark  js-edit-bookmark"><i class="fas fa-edit"></i></button>
      <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
      <div>
        <p>${rating}</p>
        <p class = "details js-details" > More Details <i class="fas fa-caret-down"></i> </p>
      </div>
    </li>
      `;   
    }

  };

  const generateNumbersOfBookmarks = function(bookmarks){
    return `
    ${bookmarks.length} bookmarks
    `;
  };

  //return the id of the given bookmark 
  const getIdFromBookmark = function(bookmark){
    return $(bookmark).closest('.js-bookmark-element').data('bookmark-id');
  };

  const handleDeleteBookmark = function(){
    //event listener for when user clicks on trash icon 
    $('.js-bookmark-list').on('click', '.js-delete-bookmark', event=>{
      //first make sure they really want to delete 
      const delete_confirm = confirm('Are you sure you want to delete this bookmark?');
      if(delete_confirm){
      //figure out which bookmark we're deleting - get its id 
        const id = getIdFromBookmark(event.target);
        //make a request to server to delete (it doesnt return anything)
        api.deleteBookmark(id, ()=> {
        //find and delete from store
          store.findAndDelete(id);
          render();
        });
      }
    });
    //render 
  };

  const handleExpandBookmark = function(){
    //event listener on the titles of the elements, when its clicked toggle the expanded property on that bookmark. then render 
    $('.js-bookmark-list').on('click', '.js-details', event =>{
      const id = getIdFromBookmark(event.target);
      store.toggleExpandedForBookmark(id);
      render();
    });
  };

  const handleFilterRatings = function(){
    //listen for when an option is clicked/state of dropdown is changed
    $('.js-filter-rating-dropdown').change(event=>{
      //grab the value of what they chose
      const filter_rating = $('.js-filter-rating-dropdown').val();
      store.setFilterRating(filter_rating);
      render();
    });
  };

  const handleEditingBookmark = function(){
    //event listener for when user hits edit button 
    $('.js-bookmark-list').on('click', '.js-edit-bookmark', event=>{
      //find out which bookmark we're editing
      const id = getIdFromBookmark(event.target);

      //change it's editing property to true 
      store.toggleEditedForBookmark(id);

      render();
      //then render the correct rating 
    });


    //render - if editing is true, have a different form with the current values in there, let them change it, then recall the API and UPDATE it (using patch method)

  };

  $.fn.extend({
    serializeJson: function(){
      const obj = {};
      const data = new FormData(this[0]);
      data.forEach((value,key)=>{
        obj[key] = value;
      });
      return obj;
    }
  });


  //I would have to see what the user actually edited, and only pass that into the update API. Compare what you get back from newBoookmark to what you already had in current. Strip out anything that hasn't changed.

  const handleSaveEditBookmark = function(){
    //event listener on submiting the save button - needs to be on the form 
    $('.js-bookmark-list').on('submit', '.js-editing-form', event =>{
      event.preventDefault();
      //grab info from form and place it in newBookmark
      const newBookmark = $(event.target).serializeJson();
      //keep another variable pointing to the actual bookmark in the DOM so we can pass it into store later
      const currentBookmark = $(event.target).closest('.js-bookmark-element');
      // if (!desc){
      //   desc = null;
      // } //if desc is left blank, send in null
      const id = getIdFromBookmark(currentBookmark);

      //call api fn to update item on server's end. returns nothing
      api.updateBookmark(newBookmark,id,
        //if the async function was successful, it'll run this callback fn
        () => {
          //take the bookmark (and give it an expanded property=false) 
          newBookmark.expanded = false;
          //update the bookmark in the store
          store.updateBookmark(newBookmark, id);
          //toggle the edit property bc we're done successfully editing
          store.toggleEditedForBookmark(id);
          //set error to null
          store.setError(null);
          //render
          render();
        },
        //if the async function returned an error, it'll run this fn 
        error => {
          store.setError(error.responseJSON.message);
          showErrorMessageForEdit(store.error);
        }
      );  
    });
  };

  const handleCancelEditBookmark = function(){
    //event listener on cancel button - if it cancels, just toggle editing and render     
    $('.js-bookmark-list').on('click', '.js-cancel-edit-button', event =>{
      //toggle editing for that bookmark 
      const bookmark = $(event.target).closest('.js-bookmark-element');
      const id = getIdFromBookmark(bookmark);
      store.toggleEditedForBookmark(id);
      render();
    });
  };

  const render = function(){
    //copy the store bookmarks so we can filter it if necassary, but doesnt change the store itself 

    let bookmarks = [...store.bookmarks];

    console.log(bookmarks);
    if (store.filter){
      bookmarks = bookmarks.filter(bookmark=>bookmark.rating>=store.filter);
    }
    
    //generate string from what's in the store
    const html = generateAddBookmarksList(bookmarks);
    $('.js-bookmark-list').html(html);

    //generate number of items
    const numbers_html = generateNumbersOfBookmarks(bookmarks);
    $('.js-number-of-items').html(numbers_html);

  };

  //check if the adding mode is true. if it is, generate the adding form, if it isn't, dont have the form be there
  const renderAddBookmarkForm = function(){
    if(store.adding){
      $('.js-adding-new-bookmark-form').html(generateAddBookmarkForm());
    }
    else{
      $('.js-adding-new-bookmark-form').html('');
    }
  };

  const showErrorMessage = function (error){
    $('.js-error-message').html(error);
  };

  const showErrorMessageForEdit = function(error){
    $('.js-edit-error-message').html(error);
  };

  const bindEventListeners = function(){
    handleAddBookmark();
    handleCreateBookmark();
    handleDeleteBookmark();
    handleExpandBookmark();
    handleFilterRatings();
    handleCancelAddBookmark();
    handleEditingBookmark();
    handleCancelEditBookmark();
    handleSaveEditBookmark();
  };

  return {
    bindEventListeners,
    render
  };
}());
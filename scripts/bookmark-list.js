'use strict';
/*global store, api */

/*eslint-disable no-unused-vars */
const bookmarkList = (function(){

  /***************** HANDLER FUNCTIONS *****************/

  //in charge of handing the add bookmark functionality 
  const handleAddBookmark = function(){
    //event listener for when user hits add bookmark button
    $('.js-begin-add-bookmark').click(event=>{
      //toggle adding in store
      store.toggleAddingABookmark(); 
      //dont keep any error messages that might have been left over
      store.setError(null);  
      //disable ability to edit bookmarks in the meantime by setting disabled in the store = true
      store.setDisabled(true);
      //disable this button being clicked now that we're adding a bookmark
      disableAddBookmarkForm();
      //render the adding form 
      renderAddBookmarkForm();
    });
  };

  //in charge of the cancel adding bookmark functionality
  const handleCancelAddBookmark = function(){
    //event listener for when user clicks cancel in the form
    $('.js-adding-new-bookmark-form').on('click', '.js-cancel-create-bookmark-button', event => {
      //toggle adding in the store
      store.toggleAddingABookmark();
      //dont keep any error messages that might be lef tover
      store.setError(null);
      //reenable ability to edit bookmarks
      store.setDisabled(false);
      //reenable ability to click add bookmark
      reenableAddBookmarkForm();
      // render the adding form (which will now print an empty string)
      renderAddBookmarkForm(); 
    });
  };

  //handles when the user clicks create bookmark
  const handleCreateBookmark = function(){
    //event listener on button the create button in the form
    $('.js-adding-new-bookmark-form').on('submit', event => {
      //prevent default bc its submt
      event.preventDefault();
      //grab the form values into this object using serialize
      const newBookmark = $(event.target).serializeJson();
      //call an api fn that will send this new bookmark to the server. Pass in the bookmark, a callback anonymous function if its successful, and a callback anonymous function that deals with an error   
      api.createBookmark(newBookmark,
        //if the async function was successful, it'll run this callback fn
        bookmark => {
          //take the bookmark (and give it an expanded property=false)
          bookmark.expanded = false;
          //toggle the adding property (we're no longer adding!)
          store.toggleAddingABookmark();
          //now add the bookmark to the store
          store.addBookmark(bookmark);
          //make sure no leftover errors
          store.setError(null);
          //reenable ability to edit bookmark
          store.setDisabled(false);
          //reenable ability to click add bookmark
          reenableAddBookmarkForm();
          //render the adding form (will print nothing)
          renderAddBookmarkForm();
          //render the rest of the page 
          render();
        },
        //if the async function returned an error, it'll run this fn 
        error => {
          //set the error in the store to whatever was returned 
          store.setError(error.responseJSON.message);
          //show the error message
          showErrorMessage(store.error);
        }
      );     
    });
  };

  //handles user wanting to delete a bookmark
  const handleDeleteBookmark = function(){
    //event listener for when user clicks on trash icon 
    $('.js-bookmark-list').on('click', '.js-delete-bookmark', event=>{
      //first make sure they really want to delete 
      const delete_confirm = confirm('Are you sure you want to delete this bookmark?');
      //if they confirm, go forward to delete
      if(delete_confirm){
      //figure out which bookmark we're deleting - get its id 
        const id = getIdFromBookmark(event.target);
        //make a request to server to delete it from the server (it doesnt return anything)
        api.deleteBookmark(id, ()=> {
        //find and delete the bookmark from store
          store.findAndDelete(id);
          //render
          render();
        });
      }
    });
  };


  //handles user wanting to expand a given bookmark
  const handleExpandBookmark = function(){
    //event listener on the more/less details button 
    $('.js-bookmark-list').on('click', '.js-details', event =>{
      //find the id of the bookmark
      const id = getIdFromBookmark(event.target);
      //toggle the expanded property for the bookmark with that id
      store.toggleExpandedForBookmark(id);
      //render
      render();
    });
  };

  //handles user wanting to filter the page
  const handleFilterRatings = function(){
    //listen for when an option is clicked/state of dropdown is changed
    $('.js-filter-rating-dropdown').change(event=>{
      //grab the value of what they chose
      const filter_rating = $('.js-filter-rating-dropdown').val();
      //set the filter in the store to that ratiing
      store.setFilterRating(filter_rating);
      //render
      render();
    });
  };

  //handles user hitting the edit icon/button on a bookmark
  const handleEditingBookmark = function(){
    //event listener for when user hits edit button 
    $('.js-bookmark-list').on('click', '.js-edit-bookmark', event=>{
      //find out which bookmark we're editing
      const id = getIdFromBookmark(event.target);
      //change it's editing property to true 
      store.toggleEditedForBookmark(id);
      //disable the ability to add a bookmark
      disableAddBookmarkForm();
      //disable the abilty to edit other bookmarks
      store.setDisabled(true);
      //render
      render();
    });
  };

  //handles saving and updating the edits the user made
  const handleSaveEditBookmark = function(){
    //event listener on submiting the save button - needs to be on the form 
    $('.js-bookmark-list').on('submit', '.js-editing-form', event =>{
      //prevent default
      event.preventDefault();
      //grab info from form and place it in newBookmark
      const newBookmark = $(event.target).serializeJson();
      //keep another variable pointing to the actual bookmark in the DOM so we can pass it into store later
      const currentBookmark = $(event.target).closest('.js-bookmark-element');
      //get the id of the current bookmark
      const id = getIdFromBookmark(currentBookmark);

      //call api fn to update item on server's end. pass in the new bookmark and the id. (returns nothing)
      api.updateBookmark(newBookmark,id,
        //if the async function was successful, it'll run this callback fn
        () => {
          //take the bookmark (and give it an expanded property=false) 
          newBookmark.expanded = false;
          //update the bookmark in the store
          store.updateBookmark(newBookmark, id);
          //toggle the edit property bc we're done successfully editing
          store.toggleEditedForBookmark(id);
          //reenable ability to add a bookmark
          reenableAddBookmarkForm();
          //set error to null so no leftovers
          store.setError(null);
          //reenable ability to edit bookmarks
          store.setDisabled(false);
          //render
          render();
        },
        //if the async function returned an error, it'll run this fn 
        error => {
          //set the error in the store to whatever server returned 
          store.setError(error.responseJSON.message);
          //display error to user
          showErrorMessageForEdit(store.error);
        }
      );  
    });
  };

  //handles user cancelling edit on a bookmark
  const handleCancelEditBookmark = function(){
    //event listener on cancel button    
    $('.js-bookmark-list').on('click', '.js-cancel-edit-button', event =>{
      //find out which bookmark was being edited
      const bookmark = $(event.target).closest('.js-bookmark-element');
      //get the id of the bookmark
      const id = getIdFromBookmark(bookmark);
      //toggle the editing propery of that id
      store.toggleEditedForBookmark(id);
      //reenable the ability to add a bookmark
      reenableAddBookmarkForm();
      //reenable ability to edit bookmarks
      store.setDisabled(false);
      //render
      render();
    });
  };

  /***************** RENDERING FUNCTIONS *****************/

  //renders the page
  const render = function(){
    //copy the store bookmarks so we can filter it if necassary, but doesnt change the store itself 
    let bookmarks = [...store.bookmarks];

    //if we want to filter, filter
    if (store.filter){
      bookmarks = bookmarks.filter(bookmark=>bookmark.rating>=store.filter);
    }

    //generate string from what's in the store for the bookmarks list
    const html = generateAddBookmarksList(bookmarks);
    $('.js-bookmark-list').html(html);

    //generate number of items to display on top
    const numbers_html = generateNumbersOfBookmarks(bookmarks);
    $('.js-number-of-items').html(numbers_html);

    //this has to be done after the string templates are done to add in disabled if need be
    if(store.disabled === true){
      disableEditForBookmarks();
    }
    else{
      reenableEditForBookmarks();
    }
  };

  //check if the adding mode is true. if it is, generate the adding form, if it isn't, generate empty string 
  const renderAddBookmarkForm = function(){
    if(store.adding){
      $('.js-adding-new-bookmark-form').html(generateAddBookmarkForm());
    }
    else{
      $('.js-adding-new-bookmark-form').html('');
    }

    //see what the status of disabled here is 
    if(store.disabled === true){
      disableEditForBookmarks();
    }
    else{
      reenableEditForBookmarks();
    }
  };

  /***************** GENERATING STRING TEMPLATES FUNCTIONS *****************/

  //generates the form for the user to add a bookmark
  const generateAddBookmarkForm = function(){
    return `
          <h3>Create A New Bookmark</h3>
          <label for = "title">Title:</label>
          <input id = "title" name = "title" type="text" class = "input-bookmark-title js-input-bookmark-title" placeholder = "Title">
          <label for = "url">URL:</label>
          <input id = "url" name = "url" type="text" class = "input-bookmark-url js-input-bookmark-url" placeholder="URL">
          <label for = "desc">Description:</label>
          <textarea id = "desc" name = "desc" name="bookmark-desc" class = "input-bookmark-desc js-input-bookmark-description" placeholder="Write a brief description about your bookmark" rows = "4"></textarea>
          <label for="rating">Rating:</label>
          <select id = "rating" name = "rating" class = "input-bookmark-rating js-input-bookmark-rating">
            <option selected disabled>Choose a Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <p class = "error-message js-error-message"></p>
          <button type = "submit" class = "create-bookmark-button js-create-bookmark-button">Create Bookmark</button>
          <button type = "button" class = "cancel-create-bookmark-button js-cancel-create-bookmark-button">Cancel </button>
    `;
  };

  //goes through the bookmarks and generates an li element for each bookmark
  const generateAddBookmarksList = function(bookmarks){
    return bookmarks.map(bookmark=>generateBookmarkElement(bookmark)).join('');
  };

  //generates the string for a bookmark element 
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

    //check if desc has a value, if not write "no description yet" 
    const desc = bookmark.desc!=='' ? bookmark.desc : 'No description yet';

    //return a different string if this bookmark is in expanded mode vs not
    let details = bookmark.expanded ? `  <p>${desc}</p>
        <a href="${bookmark.url}" class = "visit-site" target = "_blank">Visit site</a>
        <button type = "button" class = "details js-details" > Less Details <i class="fas fa-caret-up"></i> </button>
        ` : '<button type = "button" class = "details js-details" > More Details <i class="fas fa-caret-down"></i> </button>';

    //return a different string if it's in editing mode
    if (bookmark.editing){
      //deals with the edit remembering which rating value was selected
      const cell = ['','','','',''];
      cell[bookmark.rating-1] = 'selected';

      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <p class = "edit-bookmark-title-p js-bookmark-title">${bookmark.title}</p>
      <form class = "editing-form js-editing-form ">
        <label for = "title">Title:</label>
        <input id = "title" name = "title" type = "text" class = "edit-bookmark-title js-edit-bookmark-title" value = "${bookmark.title}"></input>
        <label for = "url">URL:</label>
        <input id = "url" name = "url" type = "text" class = "edit-bookmark-url js-edit-bookmark-url" value = "${bookmark.url}"></input>
        <label for = "desc">Description:</label>
        <textarea id = "desc" name = "desc" class = "edit-bookmark-desc js-edit-bookmark-description" value = "${desc}" rows = "4">${bookmark.desc}</textarea>
        <label for = "rating">Rating:</label>
        <select id = "rating" name = "rating" class = "input-edit-bookmark-rating js-input-edit-bookmark-rating">
              <option selected disabled>Choose a Rating</option>
              <option ${cell[0]} value="1">1 Star</option>
              <option ${cell[1]} value="2">2 Stars</option>
              <option ${cell[2]} value="3">3 Stars</option>
              <option ${cell[3]} value="4">4 Stars</option>
              <option ${cell[4]} value="5">5 Stars</option>
        </select>
        <output class = "edit-error-message js-edit-error-message"></output>
        <button type = "submit" class = "save-edit-button js-save-edit-button"> Save </button>
        <button type = "button" class = "cancel-edit-button js-cancel-edit-button"> Cancel </button>
      </form> 
    </li>
      `;
    }

    else {
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${bookmark.id}">
      <div class = "float-right">
      <button aria-label = "edit bookmark" class = "edit-bookmark  js-edit-bookmark"><i class="fas fa-edit"></i></button>
      <span class = "edit-span js-edit-span">Edit</span>
      <button aria-label = "delete bookmark" class = "delete-bookmark js-delete-bookmark"><i class="fas fa-trash-alt "></i></button>
      <span class = "delete-span js-delete-span">Delete</span>
      </div>
      <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
      <div>
        <p>${rating}</p>
        ${details}
      </div>
    </li>
      `;
    }
  };

  //generates the string that tells user how many bookmarks are on page
  const generateNumbersOfBookmarks = function(bookmarks){
    //bookmark vs bookmarks depending on how many there are 
    const word = bookmarks.length >1 || bookmarks.length===0 ? 'Bookmarks' : 'Bookmark';
    return `${bookmarks.length} ${word}`;
  };

  /***************** DISPLAYING ERROR FUNCTIONS *****************/

  const showErrorMessage = function (error){
    $('.js-error-message').html(error);
  };

  const showErrorMessageForEdit = function(error){
    $('.js-edit-error-message').html(error);
  };

  /***************** MISC HELPER FUNCTIONS *****************/

  //return the id of the given bookmark by traversng through the DOM and finding its data attribute
  const getIdFromBookmark = function(bookmark){
    return $(bookmark).closest('.js-bookmark-element').data('bookmark-id');
  };

  //helps us serialize
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

  //disables the ability to click on the button to add a bookmark
  const disableAddBookmarkForm = function(){
    $('.js-begin-add-bookmark').prop('disabled', true);
  };

  //reenables the ability to click on the button to add a bookmark
  const reenableAddBookmarkForm = function(){
    $('.js-begin-add-bookmark').prop('disabled', false);
  };

  //disables the abiliity to edit bookmarks
  const disableEditForBookmarks = function(){
    //is it not working bc of event delegation? 
    $('.js-edit-bookmark').prop('disabled', true);
  };

  //reenables the ability to edit bookmarks
  const reenableEditForBookmarks = function(){
    $('.js-edit-bookmark').prop('disabled', false);
  };

  //bind all the event listeners
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
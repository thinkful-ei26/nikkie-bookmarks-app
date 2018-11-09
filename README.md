# Nikkie's Bookmark App

## Features
1. User can see any bookmarks they've previously added (if the server hasn't deleted them) on page load. Bookmarks default to condensed view on page load 

2. User can add bookmarks to their bookmark list. Bookmarks must include a title and a URL, and can include an optional description and rating (1-5 stars)

3. User can click on "more details" to get an expanded view of the bookmark, and on "less details" to see a condensed view of the bookmark. Detailed view expands to additionally display description and a "Visit Site" link

4. User can remove bookmarks from their bookmark list

5. User receives appropriate feedback when they can't submit a new bookmark, or an update for a bookmark (API handles validations) 

6. User can select from a dropdown a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection

## Extended Features
1. User can edit title, url, description, and rating of a bookmark

2. User is prompted to confirm that they want to delete a bookmark incase they hit the button accidentally 

3. While adding a bookmark, user does not have the ability to edit any of their bookmarks. While editing a bookmark, user does not have the ability to add a bookmark or edit other bookmarks

4. When the user hovers over the edit or trash icon, a small pop up of what that icon is for appears

5. User's rating is converted into stars for a visually appealing rating look

6. User is told how many bookmarks are their list

## Technical Requirements 
- [x] Uses jQuery for AJAX and DOM manipulation

- [x] Uses namespacing to adhere to good architecture practices
* Minimal global variables
* Creates modules in separate files to keep code organized
* Logically groups functions (e.g. API methods, store methods...)

- [x] Keeps data out of the DOM
* No direct DOM manipulation in event handlers
* Follows the React-ful design pattern: changes state, re-renders component

- [x] Uses semantic HTML

- [x] Uses responsive design
* Visually and functionally solid in viewports for mobile and desktop

- [x] Follow a11y best practices
* User can use the screen reader to navigate through page
* Buttons without text are given an aria-label for the screen reader
* Whenever a bookmark is added or deleted, user is told how many bookmarks are now on the list (using aria-live) 

- [ ] (Extension) Follows AJAX and a11y best practices


## Known Issues:
* Server side: On creating the bookmark a description isn't requiried, but on updating the bookmark it is. If left blank, user is sent an error
* Server side: User's bookmarks are wiped every 24 hours

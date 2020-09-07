# Crudbook-craigslist-lite
Deployed to: https://causey96bc.github.io/Crudbook-craigslist-lite/
//\
User Story

this app requires users to be able to be logged in, this is the most important part of the app to me.

First I created a form which sends the correct data to the backend. My register form has a place to enter a username, a place to enter a password, and a place to enter password confirmation.

I set a min property on password and username length, and I make them required on the form inputs.

If the form is filled out sufficiently, the information will make a correct AJAX request to the back end. On successful user creation, you'll be given a token.

That token will be stored inside pf localStorage, and sent with all future requests. Any fetch request with a valid token is considered authenticated, and the user corresponding to the token is assumed by the API to be the one making the requests.

Once somoeone is registered, we will render a form to be able to login, and a button to be able to log out.

The presence of the token in localStorage is how the front end treats the user as logged in/logged out, for all decisions it needs to make regarding rendering.

    logIn - which sets the token in localStorage
    logOut - which clears the token in localStorage
    isLoggedIn - which lets you know if there's a current user logged in



There is also feedback provided on the form if the user provides incorrect credentials, as well as if the user tries to provide bad usernames or passwords.
Post Form

There is a form for users to make new listings. The fields for the form match the fields that the API expects, and the submit button is intercepted so that the user will touch the right fetch request.


The returned object is the new post. Since the state keeps track of all available posts, I add the returned one to that array and call a re-render when it comes back.
Posts View


As the app loads we fetch the initial posts, and populates them into the element which holds the posts.

When a user makes a GET request to /api/posts, if they don't have a token, the API will only provide you with all posts. If you do, the posts made by the active user will also have the messages on them included.


The posts has a way for the active user to delete them, and its only if isAuthor is true for the post. 

We also add a click handler to make that DELETE request. For each post, the delete handler attaches a way to recover the post._id that also helps form the correct URL for the request.

On successful delete, it removes the post from the page as well as from the array that is holding all posts in state.
Messages Form

For any post, there is a form that can be filled out by the user to send a message to the post author, only if there is a logged in user and the logged in user is not the one who made it.


On page load, if there is a user logged in, a user can make a GET request to /api/users/me and be given a user object. It will have all messages they've received, as well as all posts they've made (with messages partitioned by post).

Search Form

Here we add a little search form. That listens to the user typing into the field, and filter the listings in your state based on that. It Re-renders the filtered listings.

I keep a searchTerm in the user state, and when they render, render the postList after the filter is applied.

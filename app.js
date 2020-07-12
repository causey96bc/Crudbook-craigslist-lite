//GLOBAL VARIABLES
const postURL = ' https://strangers-things.herokuapp.com/api/2004-UNF-HY-WEB-PT/posts';
const messages = "/messages"
let TOKEN_KEY = localStorage.getItem("TOKEN_KEY")
// const preMadePost = $("#readable-content");
let loggedIn
let post_id = ""
let state = {
    myposts: [],
    searchterm: ""
}
// let newSearch

// sets the token key inside of local storage that will be used
// throughout the rest of the application. 
// also it calls bootstrap so when the page is refreshed it keeps the account registered
async function isregistered() {
    try {
        const response = await fetch('https://strangers-things.herokuapp.com/api/2004-UNF-HY-WEB-PT/users/register', {
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: $("#create-account").val(),
                    password: $("#create-password").val(),
                }
            }),
            headers: { "content-type": "application/json; charset=utf-8" }
        })
        const { data } = await response.json()
        const { token } = data
        TOKEN_KEY = token
        localStorage.setItem("TOKEN_KEY", TOKEN_KEY)
        bootstrap()
        alert("you have no created an account. Please login to access features.")
    }
    catch (error) {
        (console.error);
    }

};
// fetches the endopoint for login and will return a data object if you are logged in. 
async function login() {

    try {
        const response = await fetch('https://strangers-things.herokuapp.com/api/2004-UNF-HY-WEB-PT/users/login', {
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: $("#login-username").val(),
                    password: $("#login-password").val(),
                }
            }),
            headers: { "content-type": "application/json; charset=utf-8" }
        })
        const { data } = await response.json()
        const { token } = data

        TOKEN_KEY = token
        localStorage.setItem("TOKEN_KEY", TOKEN_KEY)

        bootstrap()
        if (loggedIn) {
            alert("you are now logged in, please continue to the site")
        } else {
            alert("Incorrect username or password.")
        }
    }
    catch (error) {

        console.error(error);
    }

};
// sets the loggedin global variable throughout the page to whatever the users web token is. 
function isloggedIn() {
    if (localStorage.getItem("TOKEN_KEY")) {
        loggedIn = true
    } else {
        loggedIn = false

    }
}
// updates the modal selection depending on if a users is logged in or logged out.
function updateLogin() {
    if (loggedIn) {
        $(".logout-user").removeClass('hide')
        $(".register, .log-user").addClass('hide')
    }
    else {
        $(".logout-user").addClass('hide')
        $(".register, .log-user").removeClass('hide')

    }

}
// toggles the dark mode based on the selected css classes 
$(".dark-mode").on("click", function () {
    $("body").toggleClass("dark-mode")
    $(".readable-content").toggleClass("dark-mode2")
    $(".header-dsc").toggleClass("dark-mode")
    $("input").toggleClass("dark-mode")
    $(".modal-content").toggleClass("dark-mode")

})


// emptys the readable content div and loops through and renders the post into it that is created into load posts
function renderHelper(posts) {
    const root = $("#readable-content")
    root.empty()
    posts.forEach(function (post) {
        root.prepend(loadPosts(post))
        // console.log(post)
    })
}
// fetch for the post endpoint that will actually take the results of it and the posts and append them to my state
//variable declared up above.
async function grabPosts() {
    try {
        const response = await fetch(`${postURL}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN_KEY} `
            }
        });
        const result = await response.json();
        // console.log(result.data.posts)
        state.myposts = result.data.posts
        renderHelper(state.myposts)
    } catch (error) {
        console.error(error)
    }
}
// this is the render posts goes through and deconstructs the post obj turning it into html.
// for messages it actually maps through it turning it into a new array which we can use to return message elements
// that are inside the posts
function loadPosts(post) {
    const { author, isAuthor, description, title, messages, location, willDeliver, price, createdAt, updatedAt, _id } = post
    const { username } = post.author
    //using moment.js to manipulate the date and time. 
    const created = moment(createdAt).fromNow();

    //.. the data-postid was a way to pass the data into the modal it seemed easier but it seems like its risky 
    let postEl = $(`<div class='readable-content'> <span id="titles">Title: ${title ? title : ''}</span><br>
                        <div id="authors"> Author: ${username ? username : ''}</div></br>
    
                         <p id="descriptions"> Decsription: ${description ? description : ''}</p>
                         <div id="prices"> Price: ${price ? price : ''}</div> <br>
                         <div id="deliveries"> Delivery Offered? ${willDeliver ? willDeliver : ''}</div>
                         </br>
                    <div id="deliveries"> last updated: ${created}</div>
                       <div> <button data-postId="${post._id}" class="delete-post">Delete</button></div>
                       <div class="login-dropdown"><button class="button" data-modal="#message">Message</button></div>

    <div class="messages">
    <button class="show-messages"> See Messages</button>
        ${messages ? messages.length : "0"} 
            ${
        messages
            ? messages.map(function (message) {
                return `<div class="message">${message.content}</div>
                        <div class="message"> ${message.fromUser.username}
 `
            }).join(`<div class="divide"></div>`)
            : ""



        }
    </div >

 </div > `).data('post', post)

    return postEl
}



// create post endpoint fetch stringifys the post object that i create down below inside of my create post button
// that was the data from this is passed through the functions.
async function createPosts(postObj) {
    try {
        if (loggedIn) {
            const response = await fetch(`${postURL} `, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN_KEY} `
                },
                body: JSON.stringify(
                    postObj
                )
            })
            const newpostObj = await response.json()
            return newpostObj
        } else {
            alert("you must log in to create a post")
        }
    } catch (error) {

        console.error(error)
    }
}
// creates a new post on click 
// by passing in the new post object which a user will input the values for. 
// it also will add the new post into my state prepending it to the begginning of the posts list.
$('.create-post').on('click', async function (event) {
    event.preventDefault();
    const postObj = {
        post: {
            title: $('.selected-title').val(),
            description: $('.selected-body').val(),
            price: $(".selected-price").val(),
            willDeliver: $('#deliver').val()
        }
    }
    try {
        if (loggedIn) {
            const newPost = await createPosts(postObj);
            state.myposts.push(newPost.data.post)
            renderHelper(state.myposts)
            alert("you made a post")
        } else {
            alert("You must log in or create an account to create a post.")
        }
    }
    catch (error) {
        (console.error);
    }
});
// click handlers for login logout and register.
//also sets the logic for the logout button
// when its clicked it will remove any token key currently 
// inside of  local storage and delete it.
$(".create-btn").on("click", function () {
    isregistered()

})
function logOut() {
    localStorage.removeItem("TOKEN_KEY")
    TOKEN_KEY = undefined
    bootstrap()

}
$(".logout-user").on("click", function () {
    logOut()
})


$(".login-btn").on("click", function () {
    login()


})
// these click handlers toggle modal controls
$(".button").on("click", function () {
    const modal = $(this).data("modal");
    $(modal).show();

})
// this one is special because it passes data into the modal based upon 
// which of the nearest posts to that button is clicked.
$("#readable-content").on("click", ".button", function () {
    const modal = $(this).data("modal");
    const target = $(this).closest(".readable-content")
    const post = target.data("post")
    post_id = post._id
    $(modal).show();


});

$(".modal").on("click", function (e) {
    const className = e.target.className;
    if (className === "modal" || className === "close") {
        $(this).closest(".modal").hide();
    }
});
// endpoint fetch for deleting the post it uses a POST_ID paramater to pass the data from the readable 
// content modal into it to form a endpoint that only selects a certain post id if you are logged in.
async function deletePosts(POST_ID) {
    try {
        console.log(POST_ID)
        if (loggedIn) {
            const response = await fetch(`${postURL}/${POST_ID}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN_KEY}`
                },
            })
            const results = await response.json()
            return results
        } else {
            alert("you need to login to delete a post, and you can only delete posts which you make.")
        }
    } catch (error) {
        (console.error);
    } finally {
        console.log("just delete it");
    }

}


// click handler for  deleting content calls the deleteposts function with the POST_ID 
// the post id is pulled from data attribute set inside my render posts and passes it through to the modal.
// it also will delete the post in real time using the slideup function. 

$("#readable-content").on("click", ".delete-post", async function () {

    POST_ID = $(this).attr("data-postId")

    // console.log(POST_ID)

    try {
        if (loggedIn) {
            const deletedPost = await deletePosts(POST_ID)
            // console.log("is this working", deletedPost)
            return $(".readable-content").slideUp(deletedPost)
        } else {
            alert("unauthorized")
        }
    } catch (error) {
        console.error(error)
    } finally {
        POST_ID = ""
        bootstrap()
    }

})


// returns the show messages endpoint that allows you to see only messages you create it also
// allows you to send a message to users.
// it also stringifys the method object into the endpoint that will allow a user to create a message.
async function messagesAPI(messageObj, POST_ID) {
    try {
        if (loggedIn) {
            const response = await fetch(`${postURL}/${POST_ID}/messages`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN_KEY}`
                },
                body: JSON.stringify(messageObj)
            })
            const results = await response.json()
            return results
        } else {
            alert("please log in or create an account")
        }

    } catch (error) {
        (console.error);

    }
}
//allows a user to send a comment to a certain post by selecting the post id of that post and adds it to its data
// also passes through the users inputs into the message obj.
$(".message-btn").on("click", async function () {
    const POST_ID = post_id

    console.log(POST_ID)
    const messageObj = {
        message: {
            content: $("#messages-Post").val(),
        }
    }

    try {
        if (loggedIn) {
            bootstrap()
            const messagePost = await messagesAPI(messageObj, POST_ID)
            // console.log("is this working", messagePost)
        } else {
            alert("please log in or create an account to send a message")
        }
    } catch (error) {
        console.error(error)
    } finally {
        bootstrap()
    }

})
// returns the users that logged ins information.
async function myUser() {
    try {
        if (loggedIn) {
            const response = await fetch('https://strangers-things.herokuapp.com/api/2004-UNF-HY-WEB-PT/users/me', {

                headers: {
                    "content-type": "application/json; charset=utf-8",
                    'Authorization': `Bearer ${TOKEN_KEY}`
                }
            })
            const data = await response.json()
            const token = data
            return token
        } else {
            alert("Please log in or create an account to access this sites many features. Also you will only be able to delete posts you create, and only see messages on a post you make.")
        }
    }
    catch (error) {
        (console.error);
    }

};
// this allows search functionality in posts.
// of filters through the posts and adds the results of the filter to my state.
// the filter will then return the results of a users inputs and run them through the description and title of the posts.
function filterPosts() {
    let keyword = $("#keywords").val()
    const mystate = state.myposts
    const newSearch = mystate.filter(function (post) {
        return post.description.includes(keyword) || post.title.includes(keyword)
    })
    console.log("newsearch", newSearch)

    if (newSearch.length === 0) {
        return state.myposts
    } else {
        return newSearch
    }
}

// renders the search into the state by looping through the posts and prepending the loaded posts 
// into the results of filter posts into the click handler below
function renderSearch(posts) {
    const searchDisplay = $("#readable-content")
    posts.forEach(post => {

        searchDisplay.prepend(loadPosts(post))

    })
    console.log("post", posts)
    console.log("search display", searchDisplay)

}
// emptys the already rendered posts and adds the results of filterpost to the new state.
$(".searchForm").on("click", function (event) {
    event.preventDefault()
    $("#readable-content").empty()
    const postlist = filterPosts();
    renderSearch(postlist)
})
// toggles the show message css on click
$("#readable-content").on("click", ".show-messages", function () {
    console.log(this)
    let findMessage = $(this).closest(".messages")
    let target = findMessage.find(".message")
    //     target.css("display", "block")
    target.toggleClass("message")
})



// bootstrap function that allows my data to stay on the page even if it is refreshed.
function bootstrap() {
    grabPosts()
    isloggedIn()
    updateLogin()
    myUser()
}
bootstrap()

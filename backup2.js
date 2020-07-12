

const postURL = 'http://strangers-things.herokuapp.com/api/posts';

let TOKEN_KEY;
// const preMadePost = $("#readable-content");
let loggedIn


async function isregistered() {
    try {
        const response = await fetch('http://strangers-things.herokuapp.com/api/users/register', {
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
        localStorage.setItem("token", token)

        TOKEN_KEY = localStorage.getItem("token")
        console.log("registered", TOKEN_KEY)

    }
    catch (error) {
        (console.error);
    }

};

async function login() {

    try {
        const response = await fetch('http://strangers-things.herokuapp.com/api/users/login', {
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
        localStorage.setItem("token", token)
        TOKEN_KEY = localStorage.getItem("token")

        console.log("logged in", token)
    }
    catch (error) {
        isloggedIn()
        console.error(error);
    }

};
function isloggedIn() {
    if (localStorage.getItem("token")) {
        return loggedIn = true
    } else {
        return loggedIn = false

    }
}



function renderHelper(posts) {
    const root = $("#readable-content")
    posts.forEach(function (post) {
        root.append(loadPosts(post))
    })
}

async function grabPosts() {
    try {
        const response = await fetch(`${postURL}`);
        const result = await response.json();
        renderHelper(result.data.posts)
    } catch (error) {
        console.error(error)
    }
}
function loadPosts(post) {
    const { author, isAuthor, description, title, location, willDeliver, price, createdAt, updatedAt } = post
    const { _id, username } = post.author
    // console.log(post)
    if (loggedIn) {
        return $(`<main class='readable-content'> <span id="titles">Title: ${title ? title : ''}</span><br>
    <span id="authors"> Author: ${username ? username : ''}</span></br>
    <div>${isAuthor}</div>
    
    <p id="descriptions"> Decsription: ${description ? description : ''}</p>
     <span id="prices"> Price: ${price ? price : ''}</span> <br>
     <span id="deliveries"> Delivery : ${willDeliver ? willDeliver : ''}</span>

     </main>`).data('post', post)
    } else {
        alert("log in please")
    }
}

grabPosts()
isloggedIn()

async function createPosts(postObj) {
    try {
        const response = await fetch(`${postURL}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN_KEY}`
            },
            body: JSON.stringify({
                postObj
            })
        })
        const newpostObj = await response.json()
        console.log(newpostObj)
        return newpostObj
    } catch (error) {

        console.error(error)
    }
}

$('.create-post').on('click', async function (event) {
    event.preventDefault();
    const postObj = {
        post: {
            title: $('.selected-title').val(),
            description: $('.selected-body').val(),
            price: '$8.00',
            willDeliver: true
        }
    };
    try {
        const newPost = await createPost(postObj);
        console.log('this is a new post', newPost);
        alert("you made a post")
    }


    catch (error) {
        (console.error);
    }
});

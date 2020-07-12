let state = {
    mypost: []
};

const postURL = 'http://strangers-things.herokuapp.com/api/posts';

let TOKEN_KEY;
const preMadePost = $(".readable-content");


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
        isloggedIn()
        console.log("logged in", token)
    }
    catch (error) {
        isloggedIn()
        console.error(error);
    }

};
function isloggedIn() {
    if (TOKEN_KEY) {
        return alert("login successful")
    } else {
        return alert("login unsuccessful please try again!")

    }
}



function renderHelper() {
    const root = preMadePost;
    root.append(preMadePost)
    preMadePost.empty()
    preMadePost.append(mainPosts(state.mypost))
}

async function grabPosts() {
    try {
        const response = await fetch(`${postURL}`);
        const { data } = await response.json();
        console.log('fetch posts console', state.mypost);
        state.mypost = data.posts;
        console.log(state.mypost)
        renderHelper();
        return data;
    } catch (error) {
        console.error(error)
    }
}
function loadPosts(post) {
    const { author: { _id, username }, description, title, location, willDeliver, price, createdAt, updatedAt } = post
    // console.log(post)
    return $(`<main class='readable-content'> <span id="titles">Title: ${title ? title : ''}</span><br>
    <span id="authors"> Author: ${username ? username : ''}</span></br>
    <span id="created-at> uploaded at: ${createdAt}</span>
    <span id="created-at> uploaded at: ${updatedAt}</span>
    <p id="descriptions"> Decsription: ${description ? description : ''}</p>
     <span id="prices"> Price: ${price ? price : ''}</span> <br>
     <input id="${location}" type="text" placeholder="select location" />
     <span id="deliveries"> Delivery : ${willDeliver ? willDeliver : ''}</span>
     </main>`).data('post', post)

}

//UPDATE MAIN POST
function mainPosts(mypost) {
    return mypost.map(function (mypost) {
        return loadPosts(mypost)
    });
}

grabPosts()

//create function
// fetch update api for create 
// then add the create button into your render 
// if tokenkey {
// create post ()
//} else { disable the create 
// }
async function createPosts() {
    try {
        const response = await fetch(`${postURL}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN_KEY}`
            },
            body: JSON.stringify({
                post: {
                    title: $(".selected-title").val(),
                    description: $(".selected-body").val(),
                    willDeliver: true,
                    price: "800$"
                },
            })
        })
        isloggedIn()
        const data = await response.json()
        console.log(data)
        renderCreatedPosts()
    } catch (error) {
        isloggedIn()
        console.error(error)
    }
}
function renderCreatedPosts(post) {
    const { title, description, willDeliver, price } = post
    let newPosts = (`<main class='readable-content'> <span id="titles">Title: ${title ? title : ''}</span><br>
    <p id="descriptions"> Decsription: ${description ? description : ''}</p>
     <span id="prices"> Price: ${price ? price : ''}</span> <br>
     <span id="deliveries"> Delivery : ${willDeliver ? willDeliver : ''}</span>
     </main>`).data("post", post)
    $(".readable-content").prepend(newPosts)
}



$(".create-post").on("click", function () {
    console.log(this)
    if (TOKEN_KEY) {
        createPosts()
    } else {
        return alert("you must login to create posts")
    }
})

$(".create-btn").on("click", function () {
    isregistered()
    console.log(this)
})

$(".logout-user").on("click", function () {
    if (TOKEN_KEY) {
        TOKEN_KEY = ""
        alert(" logout successful")
    } else {
        alert("not signed in")

    }
})


$(".login-btn").on("click", function () {
    login()

    console.log(this)

})

$(".button").on("click", function () {
    const modal = $(this).data("modal");
    $(modal).show();
});

$(".modal").on("click", function (e) {
    const className = e.target.className;
    if (className === "modal" || className === "close") {
        $(this).closest(".modal").hide();
    }
});
// async function deletePosts(POSTS_ID) {
//     try {
//         const response = await fetch(`${postURL}/${POSTS_ID}`, {
//             method: "DELETE",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${TOKEN_KEY}`
//             },
//         })
//         const results = await response.json()
//         console.log("deleted", results)
//     } catch (error) {
//         (console.error);
//     } finally {
//         console.log("just delete it");
//     }

// }
// console.log(deletePosts())


// $("#delete-posts").on("click", async function () {
//     console.log(this)
//     const postElement = $(this).closest("readable-content")
//     const post = postElement.data("post")
//     try {
//         const response = await deletePosts(post, _id)
//         console.log("is this working", response)
//         postElement.slideup()
//         const results = response.json()
//         return results


//     } catch (error) {
//         console.error(error)
//     }

// })

// async function createPosts(postObj) {
//     try {
//         const response = await fetch(`${postURL}`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${TOKEN_KEY}`
//             },
//             body: JSON.stringify({
//                 postObj
//             })
//         })
//         const newpostObj = await response.json()
//         console.log(newpostObj)
//         return newpostObj
//     } catch (error) {

//         console.error(error)
//     }
// }

// $('.create-post').on('click', async function (event) {
//     event.preventDefault();
//     const postObj = {
//         post: {
//             title: $('.selected-title').val(),
//             description: $('.selected-body').val(),
//             price: '$8.00',
//             willDeliver: true
//         }
//     };
//     try {
//         const newPost = await createPost(postObj);
//         console.log('this is a new post', newPost);
//         alert("you made a post")
//     }


//     catch (error) {
//         (console.error);
//     }
// });
// INICIALIZATION
updateProfilePics();

// CONST
const urlBase = 'https://jsonplaceholder.typicode.com/posts';
let posts = [];

// API CONNECTION
function getData(){
    fetch(urlBase)
    .then(data => data.json())
    .then(data => {
        posts = [...posts, ...data]; // Returns posts array
        renderPostList();
    })
    .catch(error => console.error("API Error: ", error));
}
getData();
// POST RENDER
function renderPostList(){
    const postList = document.getElementById("postList");
    postList.innerHTML = '';
    console.log(posts);
    posts.forEach(post =>{
        const listItem = crearPosteo(post);
        postList.appendChild(listItem);
    });
}

function crearPosteo(post){
    const title = post.title;
    const body = post.body;
    const id = post.id;
    const listItem = document.createElement('li');
    listItem.id = `listItem-${id}`
    listItem.classList.add('publicPost');
    listItem.innerHTML = `
        <div class="postProfilePicContainer"><img class="profilePic" src="${getRandomAvatar()}" alt="Profile Picture"></div>
        <p id="publicPostTitle-${id}" class="publicPostTitle">${capitalizeFirstLetter(title)}</p>
        <p id="publicPostBody-${id}" class="publicPostBody">${capitalizeFirstLetter(body)}</p>
        <div id="button-DE-Container" class="button-DE-Container">
            <button onclick="editPost(${id})" id="editButton-${id}" class="DE-Button">Edit</button>
            <button onclick="deletePost(${id})" id="deleteButton-${id}" class="DE-Button">Delete</button>
        </div>

        <div id="editForm-${id}" class="editForm" onsubmit="confirmEdit()" style="display:none">
            <label id="editPostTitle" for="editPostTitleInput-${id}">Title</label>
            <input type="text" value="${capitalizeFirstLetter(title)}" class="editPostTitleInput" id="editPostTitleInput-${id}" required>
                
            <label id="editPostBody" for="editPostBodyInput-${id}">Body</label>
            <textarea rows="5" cols="50" type="text" class="editPostBodyInput" id="editPostBodyInput-${id}" required>${capitalizeFirstLetter(body)}</textarea>
                
            <button onclick="confirmEdit(${id})" id="" class="confirmButton">Confirm</button>
        </div>
    `;
    return listItem;
}

//POST
function postData(){
    const postTitle = document.getElementById("postTitleInput").value;
    console.log(postTitle);
    const postBody = document.getElementById("postBodyInput").value;
    console.log(postBody);

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        posts.unshift(data);
        renderPostList();
    })
    .catch(error => console.error("Error while creating post: " + error));
}

// EDIT
function editPost(id){
    const post = posts.find(post => post.id == id);
    const editForm = document.getElementById(`editForm-${post.id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none';
}

function confirmEdit(id){
    console.log("Entre");
    const editTitle = document.getElementById(`editPostTitleInput-${id}`).value;
    console.log(`Nuevo titulo ${editTitle}`);
    const editBody = document.getElementById(`editPostBodyInput-${id}`).value;
    console.log(`Nuevo cuerpo ${editBody}`);

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: id,
          title: editTitle,
          body: editBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id == data.id)
        if(index != -1){
            posts[index] = data;
        }
        else{
            alert("Error al actualizar el posteo");
        }
        renderPostList();
    })
    .catch(error => console.error("Error while editing post: " + error));
}

// DELETE
function deletePost(id){
    console.log("Entre");
    fetch(`${urlBase}/${id}`,{
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok){
            posts = posts.filter(post => post.id != id);
            renderPostList();
        }
        else{
            alert('Error while deleting post');
        }
    })
    .catch(error => console.error("Error while deleting post: " + error));
}


// PHOTOS
function getRandomAvatar() {
    const randomNumber = Math.floor(Math.random() * 10);
    return `assets/avatar (${randomNumber}).png`;
}

function updateProfilePics() {
    const profilePics = document.querySelectorAll("img.profilePic");
    profilePics.forEach(img => {
        img.src = getRandomAvatar();
    });
}

// CHARACTER COUNTER
document.addEventListener("DOMContentLoaded", () => {
    const textArea = document.getElementById("postBodyInput");
    const charCount = document.getElementById("charCount");
    const maxChars = 300;

    textArea.addEventListener("input", () => {
        const remaining = maxChars - textArea.value.length;

        if (remaining >= 0) {
            charCount.textContent = `${remaining} characters left`;
        } else {
            textArea.value = textArea.value.slice(0, maxChars);
        }
    });
});


// AUX
function capitalizeFirstLetter(sentence) {
    if (!sentence || typeof sentence !== "string") {
        return "";
    }
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
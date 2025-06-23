function main() {
    displayPosts();
    addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);

const BASE_URL = "http://localhost:3000/posts";
const postList = document.getElementById("post-list");

function displayPosts() {
    fetch(BASE_URL)
    .then((res) => res.json())
    .then((posts) => {
        postList.innerHTML = "";
        posts.forEach(renderPostTitle);
    });
}

function renderPostTitle(post) {
    const div = document.createElement("div");
    div.textContent = post.title;
    div.classList.add("post-title");
    div.addEventListener("click", () => handlePostClick(post.id));
    postList.appendChild(div);
}

const postDetail = document.getElementById("post-detail");

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then((res) => res.json())
    .then((post) => renderPostDetails(post));
}

function renderPostDetails(post) {
  postDetail.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.content}</p>
    <small>By ${post.author}</small>
    <br>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;

  document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));
  document.getElementById("delete-btn").addEventListener("click", () => deletePost(post.id));
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPost = {
      title: form["new-title"].value,
      content: form["new-content"].value,
      author: form["new-author"].value,
    };
    createPost(newPost);
    form.reset();
  });
}

function createPost(post) {
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
    .then((res) => res.json())
    .then((newPost) => {
      renderPostTitle(newPost);
      renderPostDetails(newPost);
    });
}

const editForm = document.getElementById("edit-post-form");

function showEditForm(post) {
  editForm.classList.remove("hidden");
  editForm["edit-title"].value = post.title;
  editForm["edit-content"].value = post.content;

  editForm.onsubmit = function (e) {
    e.preventDefault();
    const updatedPost = {
      title: editForm["edit-title"].value,
      content: editForm["edit-content"].value,
    };
    updatePost(post.id, updatedPost);
    editForm.classList.add("hidden");
  };

  document.getElementById("cancel-edit").onclick = () => {
    editForm.classList.add("hidden");
  };
}

function updatePost(id, data) {
  fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((updated) => {
      displayPosts();
      renderPostDetails(updated);
    });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  }).then(() => {
    displayPosts();
    postDetail.innerHTML = "<p>Select a post to view details.</p>";
  });
}

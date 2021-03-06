
let activePost;

// gets post from the server:
const getPost = () => {
    // get post id from url address:
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);

    // fetch post:
    fetch('/api/posts/' + id + '/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            activePost = data;
            renderPost();
        });
};

const getComments = () => {
    fetch('/api/comments/?post_id' + id)
        .then(response => response.json())
        .then(displayComments); // this is a callback function
};

const createComment = () => {
    const data = {
        post: activePost.id,
        comment: document.querySelector('#comment-content').value,
        author: document.querySelector('#comment-author').value

    };
    console.log(data);

    fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(showConfirmationComment);

    // this line overrides the default form functionality:
    ev.preventDefault();
};


const showConfirmationComment = (data) => {ƒ
    console.log('response from the server:', data);
    if (data.message && data.id) {
        document.querySelector('#post-form').classList.toggle("hide");
        document.querySelector('#confirmation').classList.toggle("hide");
    }
};

const deleteComment = (commentID) => {
    const doIt = confirm('Are you sure you want to delete this comment?');
    if (!doIt) {
        return;
    }
    fetch('/api/comments/' + commentID + '/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // navigate back to main page:
        window.location.href = '/';
    });
    ev.preventDefault()
};



const displayComments = (data) => {
    const entries = [];
    let htmlComments = '';

    for (const comment of data) {

       if (comment.post_id == activePost.id)
       {
            htmlComments += `<section class="comment">
            <p>${comment.comment}</p>
            <strong>Author </strong>${comment.author}
            <button onClick="deleteComment('${comment.id}')" class="btn" id="delete-comment" type="submit">Delete</button>
            
          </section>`;
        }
    }
    document.querySelector('#comments').innerHTML = htmlComments;

};


// updates the post:
const updatePost = (ev) => {
    const data = {
        title: document.querySelector('#title').value,
        content: document.querySelector('#content').value,
        author: document.querySelector('#author').value
    };
    console.log(data);
    fetch('/api/posts/' + activePost.id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            activePost = data;
            renderPost();
            showConfirmation();
        });

    // this line overrides the default form functionality:
    ev.preventDefault();
};

const deletePost = (ev) => {
    const doIt = confirm('Are you sure you want to delete this blog post?');
    if (!doIt) {
        return;
    }
    fetch('/api/posts/' + activePost.id + '/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // navigate back to main page:
        window.location.href = '/';
    });
    ev.preventDefault()
};

// creates the HTML to display the post:
const renderPost = (ev) => {
    const paragraphs = '<p>' + activePost.content.split('\n').join('</p><p>') + '</p>';
    const template = `
        <p id="confirmation" class="hide"></p>
        <h1>${activePost.title}</h1>
        <div class="date">${formatDate(activePost.published)}</div>
        <div class="content">${paragraphs}</div>
        <p>
            <strong>Author: </strong>${activePost.author}
        </p>

    `;
    document.querySelector('.post').innerHTML = template;
    document.querySelector('#render-comment').onclick = renderComment;
    toggleVisibility('view');

    // prevent built-in form submission:
    if (ev) { ev.preventDefault(); }
};

const renderComment = () => {

    const htmlSnippet = `
        <div class="input-section">
            <label for="author">Comment Author</label>
            <input type="text" name="author" id="comment-author" value="author name">
        </div>
        <div class="input-section">
            <label for="comment">Comment</label>
            <textarea name="comment" id="comment-content">comment</textarea>
        </div>
        <button onClick="createComment()" class="btn btn-main" id="make-comment" type="submit">Save</button>
        <button class="btn" id="cancel" type="submit">Cancel</button>
     
    `;

    // after you've updated the DOM, add the event handlers:
    document.querySelector('#post-form').innerHTML = htmlSnippet;
    document.querySelector('#make-comment').onclick = createComment;
    document.querySelector('#cancel').onclick = renderPost;

    toggleVisibility('edit');
};

// creates the HTML to display the editable form:
const renderForm = () => {
    const htmlSnippet = `
        <div class="input-section">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" value="${activePost.title}">
        </div>
        <div class="input-section">
            <label for="author">Author</label>
            <input type="text" name="author" id="author" value="${activePost.author}">
        </div>
        <div class="input-section">
            <label for="content">Content</label>
            <textarea name="content" id="content">${activePost.content}</textarea>
        </div>
        <button class="btn btn-main" id="save" type="submit">Save</button>
        <button class="btn" id="cancel" type="submit">Cancel</button>
        
    `;

    // after you've updated the DOM, add the event handlers:
    document.querySelector('#post-form').innerHTML = htmlSnippet;
    document.querySelector('#save').onclick = updatePost;
    document.querySelector('#cancel').onclick = renderPost;
    toggleVisibility('edit');
};

const formatDate = (date) => {
    const options = {
        weekday: 'long', year: 'numeric',
        month: 'long', day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
};

// handles what is visible and what is invisible on the page:
const toggleVisibility = (mode) => {
    if (mode === 'view') {
        document.querySelector('#view-post').classList.remove('hide');
        document.querySelector('#menu').classList.remove('hide');
        document.querySelector('#post-form').classList.add('hide');
    } else {
        document.querySelector('#view-post').classList.add('hide');
        document.querySelector('#menu').classList.add('hide');
        document.querySelector('#post-form').classList.remove('hide');
    }
};

const showConfirmation = () => {
    document.querySelector('#confirmation').classList.remove('hide');
    document.querySelector('#confirmation').innerHTML = 'Post successfully saved.';
};

// called when the page loads:
const initializePage = () => {
    // get the post from the server:
    getPost();
    getComments();
    // add button event handler (right-hand corner:
    document.querySelector('#edit-button').onclick = renderForm;
    document.querySelector('#delete-button').onclick = deletePost;
    document.querySelector('#render-comment').onclick = renderForm;

};

initializePage();

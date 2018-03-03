// Should be precompiled
//https://stackoverflow.com/questions/19653030/only-allow-certain-domain-to-access-web-api

var postTemplate = Handlebars.compile(document.getElementById("post-template").innerHTML);
var articleTemplate = Handlebars.compile(document.getElementById("article-template").innerHTML);
var threadTemplate = Handlebars.compile(document.getElementById("thread-template").innerHTML);
var commentTemplate = Handlebars.compile(document.getElementById("comment-template").innerHTML);



localStorage.clear()
example.forEach(function(thread) {
  localStorage.setItem(thread.id, JSON.stringify(thread))
})



function renderIndex() {
  clearContentDiv()

  var contentDiv = document.getElementById('content');
  Object.keys(localStorage).forEach(function (id) {
    thread = JSON.parse(localStorage.getItem(id))
    if (thread !== null) {
      rendered = postTemplate({title: thread.title, author: thread.by, time: timeAgo(thread.time), id: thread.id, commentsCount: thread.descendants});
      contentDiv.insertAdjacentHTML('beforeend', rendered);
    }
  })
}


function renderThread(threadId) {
  clearContentDiv()
  var contentDiv = document.getElementById('content');
  thread = JSON.parse(localStorage.getItem(threadId))
  if (thread !== null) {
    rendered = threadTemplate({title: thread.title, id: thread.id});
    contentDiv.insertAdjacentHTML('beforeend', rendered);
  }
  renderKids(thread)
}


function renderKids(item) {
  var parentDiv = document.getElementById('item-' + item.id + '-kids');
  item.kids.forEach(function(kid) {
    rendered = commentTemplate({title: kid.title, commentHtml: kid.text, author: kid.by, time: timeAgo(kid.time), id: kid.id});
    parentDiv.insertAdjacentHTML('beforeend', rendered);
    if (kid.kids) {
      renderKids(kid)
    }
  })
}


function clearContentDiv() {
  var contentDiv = document.getElementById('content');
  while (contentDiv.firstChild) {
    contentDiv.removeChild(contentDiv.firstChild);
  }
}



function renderArticle(threadId) {
  clearContentDiv()
  var contentDiv = document.getElementById('content');
  thread = JSON.parse(localStorage.getItem(threadId))
  rendered = articleTemplate({title: thread.title, articleHtml: thread.summary, id: thread.id});
  contentDiv.insertAdjacentHTML('beforeend', rendered);
}


// convert timestamp to hn style "x unit ago"
function timeAgo(timestamp) {
  console.log({
    now: new Date().getTime(),
    ts: timestamp
  })
  var seconds = Math.floor((new Date().getTime() - timestamp * 1000) / 1000)
  var minutes = Math.floor(seconds / 60)
  var hours = Math.floor(minutes / 60)
  var days = Math.floor(hours / 24)
  var years = Math.floor(days / 365)

  if (years) {
    return years + " years ago"
  } else if (days) {
    return days + " days ago"
  } else if (hours) {
    return hours + " hours ago"
  } else if (minutes) {
    return minutes + " minutes ago"
  } else if (seconds) {
    return seconds + " seconds ago"
  }
}



document.addEventListener('click', function(e) {
  var threadId = e.target.getAttribute('data-thread-id')
  if (threadId) {
    renderThread(threadId);
  }

  var articleId = e.target.getAttribute('data-article-id')
  if (articleId) {
    renderArticle(articleId);
  }
})

renderIndex()




// var request = new XMLHttpRequest();
// request.open('GET', 'http://localhost:4000/top_stories', true);
// request.onload = function() {
//   if (request.status >= 200 && request.status < 400) {
//     var threads = JSON.parse(request.responseText);
//     console.log(threads[0])

//     // render(story);
//   }
// };
// request.send();

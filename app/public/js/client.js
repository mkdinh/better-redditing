// GATHER SAVED SUBREDDITS
// ------------------------------------------------
(function updateSubreddit(){
    $.ajax({
        url: "/subreddit/all",
        method: "GET",
        dataType: "json",
        success: (subreddits) => {
            // append subreddit to browser
            subreddits.forEach((sub) => {
                var name = sub.name;
                var btn  = `<button class='button btn-subreddit' data-name='${name}'>${name}</button>`
                $('#column-subreddit').append(btn)
            })
        }
    });
}())

// HANDLE LISTENER EVENTS
// ------------------------------------------------------------

// click listener on sub reddit btn
$('#column-subreddit').on('click','.btn-subreddit' , (ev) => {
    let btn = ev.currentTarget;
    let name = $(btn).attr('data-name');
    scrape(name);
});

$('#column-preview').on('click', '.post', (ev) => {
    let postID = $(ev.currentTarget).attr('data-id');
    scrapePost(postID);
});

// search new subreddit
$('#search-subreddit').on('keyup', (ev) => {
    if(ev.which === 13){
        var textBox = ev.currentTarget;
        let name = $(textBox).val().trim();
        scrape(name);

        var btn  = `<button class='button btn-subreddit' data-name='${name}'>${name}</button>`
        $('#column-subreddit').append(btn)
    };
});

// scrape subreddit and append to browser

function scrape(name){
    $.ajax({
        url: `/scrape/${name}`,
        method: "GET",
        success: (subreddit) => {
            console.log(subreddit)
            // empty out div
            $("#column-preview-content").empty();
        
            // append post to browser with results
            subreddit.posts.forEach(mediabuilder);

            // fade in posts
            $('.post').animate({opacity: 1}, 400);
        }
    })
}

// scrape post content 
function scrapePost(id){
    $.ajax({
        url: `/scrape/post/${id}`,
        method: "GET",
        success: (post) => {
            let content = post.content;
            console.log(content)
            $(`#preview-${id}`).append(content);
        }
    });
}


// media object builder
function mediabuilder(obj){
    let media = `<article class="media box post" data-id='${obj._id}'>
        <figure class="media-left">
        <p class="image is-64x64">
            <img src="${obj.img}">
            <p class='post-rank'>${obj.rank}</p>
        </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                <strong>${obj.title}</strong>
                <br>
                <small>upvote: ${obj.upvote}</small>
                </p>
            </div>
            <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item">
                    <span class="icon is-small"><i class="fa fa-external-link" href='${obj.link}'></i></span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small"><i class="fa fa-comment"></i></span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small"><i class="fa fa-heart"></i></span>
                  </a>
                </div>
                
            </nav>

        </div>

        <div class="media-right">
        <button class="delete"></button>
        </div>

        <div class='level hidden preview' id='preview-${obj._id}'>
        
        </div>

        <div class='level hidden comment' id='comment-${obj._id}'>

        </div>
  </article>
  <hr>`

  $('#column-preview-content').append(media);
}


// GATHER SAVED SUBREDDITS
// ------------------------------------------------
let currentSub;

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
$('#column-subreddit').on('click','.btn-subreddit' , ev => {
    let btn = ev.currentTarget;
    let name = $(btn).attr('data-name');
    scrape(name);
    currentSub = name;
});

$('#saved-posts').on('click', ev => {
    console.log(currentSub)
    $.ajax({
        url: `post/saved/${currentSub}`,
        method: 'GET',
        success: (posts) => {
            $('#column-preview-content').hide();
            $('#column-saved-content').empty();
            $('#column-saved-content').show();
            posts.forEach((post) => {mediabuilder(post,'saved')});

            // fade in posts
            $('.post').animate({opacity: 1}, 400);
        }
    });
});

$('#recent-posts').on('click', ev => {
    $('#column-saved-content').hide()
    $('#column-preview-content').fadeIn();
});

// search new subreddit
$('#search-subreddit').on('keyup', ev => {
    if(ev.which === 13){
        var textBox = ev.currentTarget;
        let name = $(textBox).val().trim();
        scrape(name);

        var btn  = `<button class='button btn-subreddit' data-name='${name}'>${name}</button>`
        $('#column-subreddit').append(btn)
    };
});

$('#column-preview').on('click','.delete', ev => {
    let id = $(ev.currentTarget).attr('data-id');
    $(`#post-${id}`).fadeOut(300, (post) => {
        $(post.currentTarget).remove();
    });
})

$('#column-preview').on('click','.comment-icon',ev => {
    let id = $(ev.currentTarget).attr('data-id');
    $(`#comment-display-${id}`).hide();
    $(`#comment-edit-${id}`).show();

});

$('#column-preview').on('keyup','.comment-input',ev => {
    if(ev.which === 13){
        let id = $(ev.currentTarget).attr('data-id');
        let comment = $(ev.currentTarget).val().trim();
        $.ajax({
            url: `post/comment/${id}`,
            method: "POST",
            dataType: 'json',
            data: {body: comment},
            success: (commentdb) => {
                $(`#comment-edit-${id}`).hide();
                console.log(commentdb)
                $(`#comment-edit-${id}`).val('');
                $(`#comment-display-${id}`).text(`Comment: ${comment}`);
                $(`#comment-display-${id}`).show();
            }
        });
    }
});


// SCRAPING AJAX
// ------------------------------------------------------------

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
            subreddit.posts.forEach((post) => {mediabuilder(post,'preview')});

            // fade in posts
            $('.post').animate({opacity: 1}, 400);
            currentSub = name;
        }
    })
}

// media object builder
function mediabuilder(obj,column){
    let media = `<article class="media box post" data-id='${obj._id}' id='post-${obj._id}' data-scrape-state='false'>
        <figure class="media-left">
        <p class="image is-64x64">
            <img src="${obj.img}">
            <p class='post-rank'>${obj.rank}</p>
        </p>
        </figure>
        <div class="media-content">    
            <div class="content">
                <h4>${obj.title}</h4>
                </div>
                <nav class="level is-mobile">
                <div class="level-left">
                    <small class='post-upvote'>upvote: ${obj.upvote}</small>
                    
                    <a class="level-item" target='_blank' href='${obj.link}'>
                        <span class="icon"><i class="fa fa-external-link"></i></span>
                    </a>

                    <a class="comment-icon level-item" data-id='${obj._id}'>
                        <span class="icon"><i class="fa fa-comment"></i></span>
                    </a>
                    </div>
                </nav>

                <div class='level'>
                    <div class='level-left no-shrink'>
                        <div class='level-item comment-display' id='comment-display-${obj._id}'>
                            Comment: ${ comment(obj.comment) }
                        </div>
                
                        <div class='level-item comment-edit no-shrink' id='comment-edit-${obj._id}'>
                            Comment: <input class='comment-input' data-id='${obj._id}' placeholder='press Enter to save'/>
                        </div>
                    </div>
                </div>

            </div>
            <div class="media-right">
                <button class="delete" data-id='${obj._id}'></button>
            </div>
        </div>

  </article>
  `



  $(`#column-${column}-content`).append(media);
}

function comment(comment){
    if(comment){
        return comment.body;
    }else{
        return "No Comment";
    }
}

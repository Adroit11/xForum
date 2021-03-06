jQuery(document).ready(function() {
    $('abbr.timeago').timeago();
	socket.on('newPost', function(post) {
		if(post.topic.forum == $('#forumid').val())
		{
			var thisTopic = $('div#topic-'+ post.topic.slug);
			thisTopic.find('.topic-replies').html(post.topic.replies.length);
			thisTopic.find('.topic-last-post-author').html(post.author.username);
            thisTopic.find('.topic-last-post-time').untimeago();
            thisTopic.find('.topic-last-post-time').attr('title', post.postedOn).text(post.postedOn).timeago();
			thisTopic.find('.topic-status').html('<i class = "icon-folder-close"></i>');
            $('.forum-topics').prepend(thisTopic);


            thisTopic.effect('highlight', {}, 1000);
            setTimeout(function(){
                $('.forum-topics-jpages').jPages('destroy');
                $('.forum-topics-jpages').jPages(jPagesOptions);
            }, 1100);
		}
	});

    socket.on('deletedPost', function(post) {
        if(post.topic.forum == $('#forumid').val())
        {
            var thisTopic = $('div#topic-'+ post.topic.slug);
            thisTopic.find('.topic-replies').html(post.topic.replies.length).effect('highlight', {}, 1000);
        }
    });
    var pageUrl = document.location.pathname;
    var curPage = 1;
    var matches = pageUrl.match(/\/page\/(.*)\/$/);
    if (matches) {
        curPage = matches[1];
    }

    pageUrl = pageUrl.replace(/\/page\/(.*)\/$/, '/');

    var jPagesOptions = {
        containerID: 'forum-topics-paginate',
        perPage : 5,
        startPage: curPage,
        first: '«',
        last: '»',
        previous : '‹',
        next : '›',
        minHeight: 'true',
        callback    : function( pages, items ){
            $('html').animate({scrollTop:0}, 'slow');//IE, FF
            $('body').animate({scrollTop:0}, 'slow');//WebKit
            curPage = pages.current;
            $('#forum-topics-paginate').css('min-height', '');
            window.history.pushState(null, 'Page', pageUrl +'page/'+ pages.current+'/');
        }
    };
	
	$('.forum-topics-jpages').jPages(jPagesOptions);

    socket.on('deletedTopic', function(deletedTopic){
        $('div#topic-'+ deletedTopic.slug).effect('highlight', {mode: 'hide', color: "#CC0033"}, 1000);
        $('#nav-topic-'+ deletedTopic.slug).remove();
        setTimeout(function() {
            $('div#topic-'+ deletedTopic.slug).remove();
            $('.forum-topics-jpages').jPages('destroy');
            $('.forum-topics-jpages').jPages(jPagesOptions);
            $('#forum-topics-paginate').css('min-height', '');
        }, 1000);
    });
	
	socket.on('newTopic', function(topic) {
		if(topic.forum == ''+$('#forumid').val())
		{
            var newPost = browserijade("topic-list", {topic: topic});
			$('section.forum-topics').prepend(newPost).find("div#topic-" + topic.slug).effect('highlight', {}, 1000).find('abbr.timeago').timeago();
			
			$('li.category-nav').after("<li class = 'forum-nav' id = 'nav-topic-"+ topic.slug+"'><a href = '/topic/"+ topic.slug +"/'><i class = 'icon-chevron-right'></i> "+ topic.title +"</a></li>");
			$('ul.bs-docs-sidenav').find('li#nav-topic-'+ topic.slug).effect('highlight', {}, 1000);

            $('.forum-topics-jpages').jPages('destroy');
            $('.forum-topics-jpages').jPages(jPagesOptions);
		}
	})
});
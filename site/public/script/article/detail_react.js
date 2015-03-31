// article detail_react script
var app = app || {};

$().ready(function() {
    if (app.articleId) {
        getArticleDetail(app.articleId, showArticleDetail);
    }
});

function getArticleDetail(articleId, callback) {
    var articleDetailUrl = '/data/articles/' + articleId + '/detail';
    $.get(articleDetailUrl, function(data) {
        var article =  data.docs && data.docs[0] || null;
        article.id = article._id + '';
        console.log('article=',article);
        callback && callback(article);
    });
}

function showArticleDetail(article) {
    app.itemDetail = React.render(
        <ItemDetail data={ article } />,
        document.getElementById('articleDetail')
    );
}

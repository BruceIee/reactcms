var util = require('util');
var tool = require('leaptool');
var pagedown = require("pagedown");
var converter = pagedown.getSanitizingConverter();
var pagedownExtra = require("pagedown-extra").Extra;
pagedownExtra.init(converter);

module.exports = function(app) {
  var moduleName = "forum_post";

  var block = {
    app: app,
    model: {
      author: {
        type: 'string',
        subType: {
          type: 'object'
        }
      },
      thread: {
        type: 'string',
        subType: {
          type: 'object'
        }
      },
      content: {
        type: 'string'
      },
      content_markdown: {
        type: 'string'
      },
      title: {
        type: 'string'
      },
      create_date: {
        type: 'date'
      }
    }
  };

  block.data = tool.object(require('basedata')(app, moduleName));
  block.page = tool.object(require('basepage')(app, moduleName, block.data));

  block.data.addForumPost = function(req, res) {
    block.createPost(tool.getReqParameter(req), function (post, error) {
      if (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(error));
        res.end();
        throw error;
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(post));
      res.end();
    });
  };

  block.createPost = function (post) {
    var date = new Date();
    post.create_date = date;
    post.thread.last_updated = date;
    post.content = converter.makeHtml(post.content_markdown);
    post.author = req.session && req.session.user || null;
    block.data.add(req, res, post, function(error, docs, info) {
      app.cb(error, docs, info, {}, {}, cb(post, error));
    });
  };
  app.server.all('/forum/posts', block.page.checkLogin);
  app.server.post('/forum/posts', block.data.addForumPost);

  return block;
};


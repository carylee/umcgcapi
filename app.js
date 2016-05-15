var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');
var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/petitions/:id', function(req, res) {
  res.redirect('/petitions/' + req.params.id);
});

app.get('/petitions/:id', function (req, res) {
  var id = req.params.id;
  if (id.length === 5) {
    id = id.substring(2);
  }

  var url = 'http://calms2016.umc.org/Text.aspx?mode=Petition&Number=' + id;

  if (req.is("text/plain")) {
    res.header("Content-Type", "text/plain");
    request(url, function(error, response, body) {
      $ = cheerio.load(body);
      var html = $("#innercontent_text").find("table").remove().end().html()
      res.send(markdownify(html));
    });
  } else {
    res.header("Content-Type", "text/html");
    request(url, function(error, response, body) {
      $ = cheerio.load(body);
      var html = $("#innercontent_text").find("table").remove().end().html()
      res.send(html);
    });
  }
});

app.listen(port, function () {
    console.log('UMC GC app listening on port ' + port + '!');
});

function stripExtraHtml(html) {
  return html.replace(/<\/?ins>/g, '').replace(/<\/?italicunderline>/g, '')
}

function markdownify(html) {
  return stripExtraHtml(toMarkdown(html, {'gfm':true}));
}

var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');

app.get('/api/petitions/:id', function (req, res) {
  var id = req.param('id');
  if (id.length === 5) {
    id = id.substring(2);
  }

  res.header("Content-Type", "text/plain");
  request('http://calms2016.umc.org/Text.aspx?mode=Petition&Number=' + id, function(error, response, body) {
    $ = cheerio.load(body);
    var html = $("#innercontent_text").find("table").remove().end().html()
    res.send(markdownify(html));
  });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function stripExtraHtml(html) {
  return html.replace(/<\/?ins>/g, '').replace(/<\/?italicunderline>/g, '')
}

function markdownify(html) {
  return stripExtraHtml(toMarkdown(html, {'gfm':true}));
}

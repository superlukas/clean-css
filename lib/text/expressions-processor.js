var EscapeStore = require('./escape-store');

var EXPRESSION_NAME = 'expression';
var EXPRESSION_START = '(';
var EXPRESSION_END = ')';
var EXPRESSION_PREFIX = EXPRESSION_NAME + EXPRESSION_START;
var BODY_START = '{';
var BODY_END = '}';

function findEnd(data, start) {
  var end = start + EXPRESSION_NAME.length;
  var level = 0;
  var quoted = false;
  var braced = false;

  while (true) {
    var current = data[end++];

    if (quoted) {
      quoted = current != '\'' && current != '"';
    } else {
      quoted = current == '\'' || current == '"';

      if (current == EXPRESSION_START)
        level++;
      if (current == EXPRESSION_END)
        level--;
      if (current == BODY_START)
        braced = true;
      if (current == BODY_END && !braced && level == 1) {
        end--;
        level--;
      }
    }

    if (level === 0 && current == EXPRESSION_END)
      break;
    if (!current) {
      end = data.substring(0, end).lastIndexOf(BODY_END);
      break;
    }
  }

  return end;
}

var ExpressionsProcessor = function ExpressionsProcessor() {
  this.expressions = new EscapeStore('EXPRESSION');
};

ExpressionsProcessor.prototype.escape = function (data) {
  var nextStart = 0;
  var nextEnd = 0;
  var cursor = 0;
  var tempData = [];

  for (; nextEnd < data.length;) {
    nextStart = data.indexOf(EXPRESSION_PREFIX, nextEnd);
    if (nextStart == -1)
      break;

    nextEnd = findEnd(data, nextStart);

    var expression = data.substring(nextStart, nextEnd);
    var placeholder = this.expressions.store(expression);
    tempData.push(data.substring(cursor, nextStart));
    tempData.push(placeholder);

    cursor = nextEnd;
  }

  return tempData.length > 0 ?
    tempData.join('') + data.substring(cursor, data.length) :
    data;
};

ExpressionsProcessor.prototype.restore = function (data) {
  var tempData = [];
  var cursor = 0;

  for (; cursor < data.length;) {
    var nextMatch = this.expressions.nextMatch(data, cursor);
    if (nextMatch.start < 0)
      break;

    tempData.push(data.substring(cursor, nextMatch.start));
    var comment = this.expressions.restore(nextMatch.match);
    tempData.push(comment);

    cursor = nextMatch.end;
  }

  return tempData.length > 0 ?
    tempData.join('') + data.substring(cursor, data.length) :
    data;
};

module.exports = ExpressionsProcessor;

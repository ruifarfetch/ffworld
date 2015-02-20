/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

    /**
    Hogan javaScript file. It contains the template Engine<br>
    http://twitter.github.io/hogan.js/<br><br>
    Example<br>
    // require hogan<br>
    var hogan = require("hogan.js");<br>
     <br>
    // construct template string<br>
    var template = "Hello {{world}}!";<br>
     <br>
    // compile template<br>
    var hello = hogan.compile(template);<br>
    <br>
    @deprecated plugins/
    @class hogan-2.0.0.js
    **/

    /**
    * This module contains global methods of Hogan - Javascript Templating
    * @module Hogan
    */



var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    /**
     * render: replaced by generated code.
     * @method r
     * @param {} context
     * @param {} partials
     * @param {} indent
     * @return Literal
     */
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    /**
     * Render contents
     * @method render
     * @param {} context
     * @param {} partials
     * @param {} indent
     * @return CallExpression
     */
    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    /**
     * render internal -- a hook for overrides that catches partials too
     * @method ri
     * @param {} context
     * @param {} partials
     * @param {} indent
     * @return CallExpression
     */
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    /**
     * tries to find a partial in the curent scope and render it
     * @method rp
     * @param {} name
     * @param {} context
     * @param {} partials
     * @param {} indent
     * @return CallExpression
     */
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    /**
     * render a section
     * @method rs
     * @param {} context
     * @param {} partials
     * @param {} section
     * @return 
     */
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    /**
     * maybe start a section
     * @method s
     * @param {} val
     * @param {} ctx
     * @param {} partials
     * @param {} inverted
     * @param {} start
     * @param {} end
     * @param {} tags
     * @return pass
     */
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    /**
     * find values with dotted names
     * @method d
     * @param {} key
     * @param {} ctx
     * @param {} partials
     * @param {} returnFound
     * @return val
     */
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    /**
     * find values with normal names
     * @method f
     * @param {} key
     * @param {} ctx
     * @param {} partials
     * @param {} returnFound
     * @return val
     */
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    /**
     * higher order templates
     * @method ho
     * @param {} val
     * @param {} cx
     * @param {} partials
     * @param {} text
     * @param {} tags
     * @return Literal
     */
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    /**
     * lambda replace section
     * @method ls
     * @param {} val
     * @param {} ctx
     * @param {} partials
     * @param {} inverted
     * @param {} start
     * @param {} end
     * @param {} tags
     * @return t
     */
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    /**
     * lambda replace variable
     * @method lv
     * @param {} val
     * @param {} ctx
     * @param {} partials
     * @return CallExpression
     */
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  /**
   * Convert to String
   * @method coerceToString
   * @param {} val
   * @return CallExpression
   */
  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  /**
   * Escape String
   * @method hoganEscape
   * @param {} str
   * @return ConditionalExpression
   */
  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);




(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      tagTypes = {
        '#': 1, '^': 2, '/': 3,  '!': 4, '>': 5,
        '<': 6, '=': 7, '_v': 8, '{': 9, '&': 10
      };

  /**
   * Scan text
   * @method scan
   * @param {} text
   * @param {} delimiters
   * @return tokens
   */
  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    /**
     * Add to buffer
     * @method addBuf
     */
    function addBuf() {
      if (buf.length > 0) {
        tokens.push(new String(buf));
        buf = '';
      }
    }

    /**
     * Check if line is white Space
     * @method lineIsWhitespace
     * @return isAllWhitespace
     */
    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (tokens[j].tag && tagTypes[tokens[j].tag] < tagTypes['_v']) ||
          (!tokens[j].tag && tokens[j].match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    /**
     * Filter each line
     * @method filterLine
     * @param {} haveSeenTag
     * @param {} noNewLine
     */
    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (!tokens[j].tag) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    /**
     * Change the delimiters
     * @method changeDelimiters
     * @param {} text
     * @param {} index
     * @return BinaryExpression
     */
    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = tagTypes[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - ctag.length : i + otag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  /**
   * Clena the substring
   * @method cleanTripleStache
   * @param {} token
   * @return 
   */
  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  /**
   * Trim function
   * @method trim
   * @param {} s
   * @return CallExpression
   */
  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  /**
   * Change Tag
   * @method tagChange
   * @param {} tag
   * @param {} text
   * @param {} index
   * @return Literal
   */
  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Buil dom Tree
   * @method buildTree
   * @param {} tokens
   * @param {} kind
   * @param {} stack
   * @param {} customTags
   * @return instructions
   */
  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        token = null;

    while (tokens.length > 0) {
      token = tokens.shift();
      if (token.tag == '#' || token.tag == '^' || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
        instructions.push(token);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else {
        instructions.push(token);
      }
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  /**
   * Is tag opener
   * @method isOpener
   * @param {} token
   * @param {} tags
   * @return 
   */
  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  /**
   * Is tag to close
   * @method isCloser
   * @param {} close
   * @param {} open
   * @param {} tags
   * @return 
   */
  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  /**
   * Generates the HTML
   * @method generate
   * @param {} tree
   * @param {} text
   * @param {} options
   * @return NewExpression
   */
  Hogan.generate = function (tree, text, options) {
    var code = 'var _=this;_.b(i=i||"");' + walk(tree) + 'return _.fl();';
    if (options.asString) {
      return 'function(c,p,i){' + code + ';}';
    }

    return new Hogan.Template(new Function('c', 'p', 'i', code), text, Hogan, options);
  }

  /**
   * Replace slashes and newlines
   * @method esc
   * @param {} s
   * @return CallExpression
   */
  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r');
  }

  /**
   * Choose method
   * @method chooseMethod
   * @param {} s
   * @return ConditionalExpression
   */
  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  /**
   * Walk on the tree
   * @method walk
   * @param {} tree
   * @return code
   */
  function walk(tree) {
    var code = '';
    for (var i = 0, l = tree.length; i < l; i++) {
      var tag = tree[i].tag;
      if (tag == '#') {
        code += section(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n),
                        tree[i].i, tree[i].end, tree[i].otag + " " + tree[i].ctag);
      } else if (tag == '^') {
        code += invertedSection(tree[i].nodes, tree[i].n,
                                chooseMethod(tree[i].n));
      } else if (tag == '<' || tag == '>') {
        code += partial(tree[i]);
      } else if (tag == '{' || tag == '&') {
        code += tripleStache(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag == '\n') {
        code += text('"\\n"' + (tree.length-1 == i ? '' : ' + i'));
      } else if (tag == '_v') {
        code += variable(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag === undefined) {
        code += text('"' + esc(tree[i]) + '"');
      }
    }
    return code;
  }

  /**
   * Nodes sections
   * @method section
   * @param {} nodes
   * @param {} id
   * @param {} method
   * @param {} start
   * @param {} end
   * @param {} tags
   * @return BinaryExpression
   */
  function section(nodes, id, method, start, end, tags) {
    return 'if(_.s(_.' + method + '("' + esc(id) + '",c,p,1),' +
           'c,p,0,' + start + ',' + end + ',"' + tags + '")){' +
           '_.rs(c,p,' +
           'function(c,p,_){' +
           walk(nodes) +
           '});c.pop();}';
  }

  /**
   * Inverted Sections
   * @method invertedSection
   * @param {} nodes
   * @param {} id
   * @param {} method
   * @return BinaryExpression
   */
  function invertedSection(nodes, id, method) {
    return 'if(!_.s(_.' + method + '("' + esc(id) + '",c,p,1),c,p,1,0,0,"")){' +
           walk(nodes) +
           '};';
  }

  /**
   * Partial tokens
   * @method partial
   * @param {} tok
   * @return BinaryExpression
   */
  function partial(tok) {
    return '_.b(_.rp("' +  esc(tok.n) + '",c,p,"' + (tok.indent || '') + '"));';
  }

  /**
   * Triple Stache
   * @method tripleStache
   * @param {} id
   * @param {} method
   * @return BinaryExpression
   */
  function tripleStache(id, method) {
    return '_.b(_.t(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  /**
   * Define variable
   * @method variable
   * @param {} id
   * @param {} method
   * @return BinaryExpression
   */
  function variable(id, method) {
    return '_.b(_.v(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  /**
   * Define text
   * @method text
   * @param {} id
   * @return BinaryExpression
   */
  function text(id) {
    return '_.b(' + id + ');';
  }

  /**
   * Parse Function
   * @method parse
   * @param {} tokens
   * @param {} text
   * @param {} options
   * @return CallExpression
   */
  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  },

  Hogan.cache = {};

  /**
   * Compile Text
   * @method compile
   * @param {} text
   * @param {} options
   * @return AssignmentExpression
   */
  Hogan.compile = function(text, options) {
    // options
    //
    // asString: false (default)
    //
    // sectionTags: [{o: '_foo', c: 'foo'}]
    // An array of object with o and c fields that indicate names for custom
    // section tags. The example above allows parsing of {{_foo}}{{/foo}}.
    //
    // delimiters: A string that overrides the default delimiters.
    // Example: "<% %>"
    //
    options = options || {};

    var key = text + '||' + !!options.asString;

    var t = this.cache[key];

    if (t) {
      return t;
    }

    t = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = t;
  };
})(typeof exports !== 'undefined' ? exports : Hogan);


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

(function ($, sr) {

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    $.fn[sr] = function (fn, threshold) {
        return fn ? this.bind('resize', debounce(fn, threshold)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');
/**
Main javaScript file. It contains the main functions to use. Defines global variables and the FFAPI
@deprecated api/
@class main-2.0.0.js
**/

/**
 * This module contains global methods of our API
 * @module FFAPI
 */
//try {

/// Initial declaration
/// This is the ONLY time "var" must be used withing the FFAPI namespace
var FFAPI = FFAPI || {};

///////////////////////////////////////////////////////////////////////////
//////////////////////////   Keyboard Keycodes   //////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * Indicates keycodes. With these attributes you can check what key the user pressed. <br /><br />
 *   <i>FFAPI.keycode.backspace = 8;<br />
 *   FFAPI.keycode.tab = 9;<br />
 *   FFAPI.keycode.enter = 13;<br />
 *   FFAPI.keycode.shift = 16;<br />
 *   FFAPI.keycode.ctrl = 17;<br />
 *   FFAPI.keycode.alt = 18;<br />
 *   FFAPI.keycode.pause = 19;<br />
 *   FFAPI.keycode.caps_lock = 20;<br />
 *   FFAPI.keycode.escape = 27;<br />
 *   FFAPI.keycode.page_up = 33;<br />
 *   FFAPI.keycode.page_down = 34;<br />
 *   FFAPI.keycode.end = 35;<br />
 *   FFAPI.keycode.home = 36;<br />
 *   FFAPI.keycode.left_arrow = 37;<br />
 *   FFAPI.keycode.up_arrow = 38;<br />
 *   FFAPI.keycode.right_arrow = 39;<br />
 *   FFAPI.keycode.down_arrow = 40;<br />
 *   FFAPI.keycode.insert = 45;<br />
 *   FFAPI.keycode.del = 46;<br /></i>
 *
 * @property FFAPI.keycode.key
 * @static
 * @final
 * @type Number
 */
FFAPI.keycode = FFAPI.keycodes || {};
FFAPI.keycode.backspace = 8;
FFAPI.keycode.tab = 9;
FFAPI.keycode.enter = 13;
FFAPI.keycode.shift = 16;
FFAPI.keycode.ctrl = 17;
FFAPI.keycode.alt = 18;
FFAPI.keycode.pause = 19;
FFAPI.keycode.caps_lock = 20;
FFAPI.keycode.escape = 27;
FFAPI.keycode.page_up = 33;
FFAPI.keycode.page_down = 34;
FFAPI.keycode.end = 35;
FFAPI.keycode.home = 36;
FFAPI.keycode.left_arrow = 37;
FFAPI.keycode.up_arrow = 38;
FFAPI.keycode.right_arrow = 39;
FFAPI.keycode.down_arrow = 40;
FFAPI.keycode.insert = 45;
FFAPI.keycode.del = 46;


///////////////////////////////////////////////////////////////////////////
//////////////////////////////   Variables   //////////////////////////////
///////////////////////////////////////////////////////////////////////////
/**
 * FFAPI Variables object. You can include on this object all the variables you need on your page
 * @property FFAPI.variables
 * @type Object
 */
FFAPI.variables = FFAPI.variables || {};
/**
 * FFAPI Variables animationSpeed. The time the animation takes<br /> We use 300ms by default.
 * <b><i>FFAPI.variables.animationSpeed = 300;<br /></i></b>
 * @property FFAPI.variables.animationSpeed
 * @type Number
 */
FFAPI.variables.animationSpeed = 300;
/**
 * FFAPI Variables resizeWindowTime. The time after resizing the window<br /> We use 200ms by default.
 * <b><i>FFAPI.variables.resizeWindowTime = 200;<br /></i></b>
 * @property FFAPI.variables.resizeWindowTime
 * @type Number
 */
FFAPI.variables.resizeWindowTime = 200;
/**
 * FFAPI Variables isTestEnvironment. Verify if is test environment.
 * <b><i>FFAPI.variables.isTestEnvironment = true;<br /></i></b>
 * @property FFAPI.variables.isTestEnvironment
 * @type Number
 */
FFAPI.variables.isTestEnvironment = true;
/**
 * FFAPI Variables hasPlurals. If the language uses more than ths standard lexical plurals<br /> Only Russia uses this by now (default is false).
 * <b><i>FFAPI.variables.animationSpeed = true;<br /></i></b>
 * @property FFAPI.variables.hasPlurals
 * @type Bool
 */
FFAPI.variables.hasPlurals = false;
/**
 * FFAPI Variables Body element
 * <b><i>FFAPI.variables.bodyElement = $('body');<br /></i></b>
 * @property FFAPI.variables.bodyElement
 * @type Object
 */
$(document).ready(function () {
    FFAPI.variables.bodyElement = $('body');
    //Subfolder Attributes Configuration - China Request
    if (FFAPI.variables.enableBlankLinks && !FFAPI.variables.touchSupported) {
        $('a.blankLink').attr('target', '_blank');
    }
});
/**
 * FFAPI Variables Body element JS
 * <b><i>FFAPI.variables.bodyElement = document.getElementsByTagName('body');<br /></i></b>
 * @property FFAPI.variables.bodyElementJS
 * @type Object
 */
FFAPI.variables.bodyElementJS = document.getElementsByTagName('body');

///////////////////////////////////////////////////////////////////////////
///////////////////////////////   Methods   ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
/**
 * FFAPI methods object. All our main functions are added to this object
 * @property FFAPI.methods
 * @type Object
 */
FFAPI.methods = FFAPI.methods || {};

/**
 * Initial global bindings; called at the end of the code
 * @method FFAPI.methods.init
 */
FFAPI.methods.init = function () { };


/**
 * Generic event handler for preventing click on any desired element
 * @method FFAPI.methods.preventClick
 * @param {event} event
 */

FFAPI.methods.preventClick = function (event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    return false;
};

FFAPI.methods.addBlankLinks = function () {
    //Subfolder Attributes Configuration - China Request    
    if (FFAPI.variables.enableBlankLinks && !FFAPI.variables.touchSupported) {
        $('a.blankLink').attr('target', '_blank');
    }
};

/**
 * Outputs message to console if it's in a test environment
 * @method FFAPI.methods.debug
 * @param {String} msg
 */
FFAPI.methods.debug = function (msg) {
    if (FFAPI.variables.isTestEnvironment && window.console && window.console.msg) {
        window.console.log(msg);
    }
};

/**
 * Converts decimal to hexadecimal
 * @method FFAPI.methods.d2h
 * @param {String} d Decimal to convert
 * @return String
 */
FFAPI.methods.d2h = function (d) {
    return d.toString(16);
};

/**
 * Converts hexadecimal to decimal
 * @method FFAPI.methods.h2d
 * @param {String} h Hexdecimal to convert
 * @return String
 */
FFAPI.methods.h2d = function (h) {
    return parseInt(h, 16);
};

/**
 * Checks if email string is valid against RegExp
 * @method FFAPI.methods.validateEmail
 * @param {email} email to validate
 * @return Boolean
 */
FFAPI.methods.validateEmail = function (email) {
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
};

/**
 * Generic hasClass function - Detects if element has a certain class
 * @method FFAPI.methods.hasClass
 * @param {Object} ele HTML Object
 * @param {String} cls ClassName to check
 * @return Boolean
 */
FFAPI.methods.hasClass = function (ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};


/**
 * Generic adds class function - Adds a certain class from an element
 * @method FFAPI.methods.addClass
 * @param {Object} ele HTML object
 * @param {String} cls ClassName to add
 */
FFAPI.methods.addClass = function (ele, cls) {
    if (!FFAPI.methods.hasClass(ele, cls)) ele.className += " " + cls;
};

/**
 * Generic remove class function - Removes a certain class from an element
 * @method FFAPI.methods.removeClass
 * @param {Object} ele HTML Object
 * @param {String} cls ClassName to check
 */

FFAPI.methods.removeClass = function (ele, cls) {
    if (FFAPI.methods.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ').trim();
    }
};


/**
 * Generic get Height of an element
 * @method FFAPI.methods.getElementHeight
 * @param {Object} ele HTML Object
 * @return {[int]} Height of the element
 */

FFAPI.methods.getElementHeight = function (ele) {
    /// console.log(ele);
    if (typeof ele != "undefined") {
        var helper = ele.getBoundingClientRect().height;
        if (typeof helper === 'undefined') helper = 0;

        return Math.max(
            ele.clientHeight,
            helper,
            ele.offsetHeight);
    } else {
        return 0;
    }
};

/**
 * Generic get document Height
 * @method FFAPI.methods.getDocHeight
 * @param {Object} ele HTML Object
 * @return {[int]} Height of the element
 */
FFAPI.methods.getDocHeight = function () {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
};
/**
 * Generic get Width of an element
 * @method FFAPI.methods.getElementWidth
 * @param {Object} ele HTML Object
 * @return {[int]} Width of the element
 */

FFAPI.methods.getElementWidth = function (ele) {
    var helper = ele.getBoundingClientRect().width;
    if (typeof helper === 'undefined') helper = 0;

    return Math.max(
        ele.clientWidth,
        helper,
        ele.offsetWidth);
};

/**
 * Generic remove element from DOM Width of an element
 * @method FFAPI.methods.removeElementDom
 * @param {Object} ele HTML Object
 * @param {Object} par Parent element HTML Object
 */
FFAPI.methods.removeElementDom = function (ele, par) {
    /// Remove Unobtrousive Mask
    var unobtrusiveMask = document.getElementsByClassName(ele),
        unobtrusiveParent = document.getElementsByClassName(par);
    for (var i = 0; i < unobtrusiveMask.length; i++) {
        unobtrusiveParent[0].removeChild(unobtrusiveMask[i]);
    }
};

/**
 * Makes an async request using POST method and returns JSON
 * @method FFAPI.methods.doRelativeJsonPost
 * @param {String} url Relative Url of the Webservice
 * @param {Object} data Data to be passed to webservice
 * @param {Function} callback functio to execute at the end
 */
FFAPI.methods.doRelativeJsonPost = function (url, data, callback) {
    $.ajax({
        type: "POST",
        url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result, e) {
            if (typeof (callback) === "function") {
                callback(result, e);
            }
        }
    });
};

/**
 * Fade Out native function
 * @method FFAPI.methods.fadeOut
 * @param  {[type]} HTMl elemento to hide
 */
FFAPI.methods.fadeOut = function (element) {
    var s = element.style;
    element.setAttribute('style', '');
    s.opacity = 1;
    FFAPI.methods.fadeOutElement(s);
};
/**
 * Fade Out native function behavior
 * @method FFAPI.methods.fadeOutElement
 * @param  {[type]} HTMl element to hide
 */
FFAPI.methods.fadeOutElement = function (style) {
    /// Get the style opactity with just one decimal part
    style.opacity = Math.round((Number(style.opacity) - Number(0.1)) * 10) / 10;
    /// If it's not equal to zero 
    if (Number(style.opacity) > Number(0.1)) {
        setTimeout(function () {
            FFAPI.methods.fadeOutElement(style);
        }, 40);

    } else {
        style.opacity = 0;
    }
}

/**
 * Fade In native function
 * @method FFAPI.methods.fadeIn
 * @param  {[type]} HTMl element to hide
 */
FFAPI.methods.fadeIn = function (element, display) {
    var s = element.style;
    element.setAttribute('style', '');
    if (display === 1) {
        s.display = 'block';
    }
    s.opacity = 0.1;

    FFAPI.methods.fadeInElement(s);

};
/**
 * Fade In native function behavior
 * @method FFAPI.methods.fadeInElement
 * @param  {[type]} HTMl element to hide
 */
FFAPI.methods.fadeInElement = function (style) {
    /// Get the style opactity with just one decimal part
    style.opacity = Math.round((Number(style.opacity) + Number(0.1)) * 10) / 10;
    /// If it's not equal to one
    /// SetTimeout of the function itself
    if (Number(style.opacity) < 1) {
        setTimeout(function () {
            FFAPI.methods.fadeInElement(style);
        }, 40);
    } else {
        style.opacity = 1;
    }
}





/**
 * This functions caches the new image using another function, and it has a callback function
 * @method FFAPI.responsive.cacheAndLoadImage
 * @param {Object} node - Image Object
 * @param {URL} newSrc - Image URL
 * @param {function} callback
 * @return Callback function
 */
FFAPI.methods.doFunctionAndCallback = function (functionFirst, callback) {
    functionFirst();
    callback();
};

/**
 * Binds clicking on the element.
 * @method FFAPI.methods.bindElemClick
 * @param {Array} elems - Elems array
 * @param {function} clickFunction
 */
FFAPI.methods.bindElemClick = function (elems, clickFunction) {
    var elemsLength = elems.length;
    for (var i = 0; i < elemsLength; i++) {
        if (!elems[i].removeEventListener) {
            elems[i].detachEvent("onclick", FFAPI.methods.preventClick);
        } else {
            elems[i].removeEventListener("click", FFAPI.methods.preventClick, false);
        }

        if (!elems[i].addEventListener) {
            elems[i].attachEvent("onclick", clickFunction);
        } else {
            elems[i].addEventListener("click", clickFunction, false);
        }
    }
};

/**
 * Temporarily unbinds clicking on the elems.
 * @method FFAPI.methods.unbindElemClick
 * @param {Array} elems - Elems array
 * @param {function} clickFunction
 */
FFAPI.methods.unbindElemClick = function (elems, clickFunction) {
    var elemsLength = elems.length;
    for (var i = 0; i < elemsLength; i++) {
        if (!elems[i].removeEventListener) {
            elems[i].detachEvent("onclick", clickFunction);
        } else {
            elems[i].removeEventListener("click", clickFunction, false);
        }

        if (!elems[i].addEventListener) {
            elems[i].attachEvent("onclick", FFAPI.methods.preventClick);
        } else {
            elems[i].addEventListener("click", FFAPI.methods.preventClick, false);
        }
    }
};

/**
 * To remove all the listners we replace the child with a new one, this way it's easier to remove all
 * @param  {[Object]} el DOM element
 * @method FFAPI.methods.removeEventListener
 */
FFAPI.methods.removeEventListener = function (el) {
    if (!ffbrowser.isIE8) {
        var par = el.parentNode,
            clone = el.cloneNode(false);

        par.replaceChild(clone, el);

        for (var index = el.childNodes.length - 1; index >= 0; --index) {
            clone.insertBefore(el.childNodes[index], clone.childNodes[0]||null);
        }
    }
}
/**
 * To remove all the listners we replace the child with a new one, this way it's easier to remove all
 * @param  {[Object]} el DOM element array
 * @method FFAPI.methods.removeListernerAll
 */
FFAPI.methods.removeListenerAll = function (el) {
    for (var i = 0; i < el.length; i++) {
        FFAPI.methods.removeEventListener(el[i]);
    }
}


/**
 * On submitting the forms we change the form buttons to loading buttons
 * @method FFAPI.methods.loadingButtons
 */
FFAPI.methods.loadingButtons = function (formId) {
    var formId = document.getElementById(formId),
        formButtons = formId.getElementsByClassName('js-wait-button'),
        formButtonsLength = formButtons.length,
        formWaitText = formId.getElementsByClassName('js-wait-text'),
        formWaitIcon = formId.getElementsByClassName('js-wait-icon'),
        j = 0;

    for (j = 0; j < formButtonsLength; j++) {
        formButtons[j].setAttribute('disabled', 'true');
        formButtons[j].value = formButtons[j].getAttribute('data-loader');
        formWaitText[j].innerHTML = formButtons[j].getAttribute('data-loader');
        FFAPI.methods.addClass(formWaitIcon[0], 'animation-fade-inSlower');
        FFAPI.methods.addClass(formWaitIcon[0], 'icon-loader');
    }
};

/**
 * Reset the loading buttons
 * @method FFAPI.methods.resetButtons
 */
FFAPI.methods.resetButtons = function (formId) {
    var formId = document.getElementById(formId),
        formButtons = formId.getElementsByClassName('js-wait-button'),
        formButtonsLength = formButtons.length,
        formWaitText = formId.getElementsByClassName('js-wait-text'),
        formWaitIcon = formId.getElementsByClassName('js-wait-icon'),
        j = 0;

    for (j = 0; j < formButtonsLength; j++) {
        formButtons[j].setAttribute('disabled', 'false');
        formButtons[j].removeAttribute("disabled");
        formButtons[j].value = formButtons[j].getAttribute('data-original');
        formWaitText[j].innerHTML = formButtons[j].getAttribute('data-original');
        FFAPI.methods.removeClass(formWaitIcon[0], 'animation-fade-inSlower');
        FFAPI.methods.removeClass(formWaitIcon[0], 'icon-loader');
    }
};



/**
 * Adds a custom variable to the FFAPI namespace. 
 &#10;Useful if we want to add something to the global namespacing using server tags.
 &#10;Eg.: initDynFFAPI("method", "foo", function(param1, param2) { console.log("bar"); });
 * @param  {[String]} type      Value type. Eg.: method, variable
 * @param  {[Value type. Eg.: method, variable]} fieldname [description]
 * @param  {[Object]} value     Object to be stored
 * @param  {[String]} replacing [description]
 * @return {[Object]}           [description]
 */
FFAPI.methods.initDynFFAPI = function (type, fieldname, value, replacing) {
    if (typeof (replacing) === "undefined") {
        replacing = false;
    }
    if (!FFAPI[type]) {
        FFAPI[type] = {};
    }
    if (typeof (FFAPI[type][fieldname]) !== "undefined" && !replacing) {
        console.log('WARNING: Replacing existing variable \'' + fieldname + '\' of type \'' + type + '\'!');
    }
    FFAPI[type][fieldname] = value;

    return value;
};

/// <summary>
///    Gets the genderId 
/// </summary>
/// <returns type="Int" />
FFAPI.methods.getGenderId = function () {

    var genderID = 249;

    try {
        if (universal_variable.page.contextGenderId != 0)
            genderID = universal_variable.page.contextGenderId;
    } catch (e) {
    }

    return genderID;
};

FFAPI.variables.wishlistItems = FFAPI.variables.wishlistItems || {};
FFAPI.methods.clearWishList = function () {
    FFAPI.variables.wishlistItems = {};
}
FFAPI.methods.addWishListItem = function (itemId, triggerEvent) {
    FFAPI.variables.wishlistItems[itemId] = true;
    if (triggerEvent) {
        $('body').trigger('wishlistUpdated');
    }
};
FFAPI.methods.removeWishListItem = function (itemId, triggerEvent) {
    FFAPI.variables.wishlistItems[itemId] = false;
    if (triggerEvent) {
        $('body').trigger('wishlistUpdated');
    }
};
FFAPI.methods.triggerWishlistUpdated = function () {
    $('body').trigger('wishlistUpdated');
};

$(document).ready(function () {
    /* Clickstream */
    FFAPI.variables.bodyElement.on('chosen:showing_dropdown', function (event, data) {
        try {
            if (typeof (_fftrkobj) !== "undefined") {
                var chosen = data.chosen;
                var select = $(chosen.form_field);
                _fftrkobj.extract(select);
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });

    FFAPI.variables.bodyElement.on('change', 'select', function () {
        try {
            if (typeof (_fftrkobj) !== "undefined") {
                var selectedElement = $(this).find('option:selected');
                if (selectedElement.attr('trk') != undefined) {
                    _fftrkobj.extract(selectedElement);
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });

    //CLICKSTREAM HEADER ACTIONS
    $("#header-bag-button").click(function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    $("#header-wishlist-button").click(function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    FFAPI.variables.bodyElement.on("click", "#sliderwishlist .sliderTabs-slide:not(.bx-clone) a.global-button-a", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    FFAPI.variables.bodyElement.on("click", "#sliderbag .sliderTabs-slide:not(.bx-clone) a.global-button-a", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.extract($(this)); }
    });

    FFAPI.variables.bodyElement.on("click", "#header-tabs-2 .bx-prev,#header-tabs-2 .bx-next", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("243"); }
    });

    FFAPI.variables.bodyElement.on("click", "#header-tabs-3 .bx-prev,#header-tabs-3 .bx-next", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("244"); }
    });

    FFAPI.variables.bodyElement.on("click", ".header-tabs-close", function () {
        if (typeof (_fftrkobj) !== "undefined") { _fftrkobj.parse("74"); }
    });
});


FFAPI.methods.header = FFAPI.methods.header || {};
/**
 * Mark wishlist to be refreshed
 * @method FFAPI.methods.header.needRefreshHeaderTab
 * @param  {string} tabid
 */
FFAPI.methods.header.needRefreshHeaderTab = function (tabId) {
    ///$('#' + tabId).attr('data-loaded', '').attr('data-content-started', '');
    /// Just inform the id to change of the header-tabs (1,2 or 3)
    //console.log(tabId);
    if (FFAPI.variables.header == undefined || FFAPI.variables.header.tabOpeners == undefined) {
        return;
    }
    var tabIdObject = FFAPI.variables.header.tabOpeners[tabId];
    if (tabIdObject == undefined) {
        return;
    }
    //console.log(tabIdObject);
    tabIdObject.setAttribute('data-content-started', '');
    tabIdObject.setAttribute('data-loaded', '');

};

/**
 * Update the Wishlist Item count
 * @method FFAPI.methods.header.updateWishListItemCount
 * @param  {int} newValue New value to add on the wishlist item count
 * @param  {string} itemTranslate value for "Item" or "Items"
 */
FFAPI.methods.header.updateWishListItemCount = function (newValue, itemTranslation) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-wishlist-item-count").html(newValue);
        var elements = document.getElementsByClassName('js-wishlist-item-count');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }

        if (itemTranslation !== undefined && itemTranslation !== null && itemTranslation != "") {
            var elm = document.getElementsByClassName('js-wishlist-item-Translation');
            for (i = 0; i < elm.length; i++) {
                //console.log(elements[i]);
                elm[i].innerHTML = itemTranslation;
            }
        }
        else {
            var elm = document.getElementsByClassName('js-wishlist-item-Translation');
            for (i = 0; i < elm.length; i++) {
                //console.log(elements[i]);
                elm[i].innerHTML = FFAPI.translations["wbt_item_" + FFAPI.methods.header.getPluralRule(parseInt(newValue))];
            }
        }
        //Doesnt show the number if it is zero
        newValueCounter = newValue == 0 ? "" : newValue;

        elements = document.getElementsByClassName('header-user-counter');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = newValueCounter;
        }
    }
};



/**
 * Update the Bag Item count
 * @method FFAPI.methods.header.updateBagItemCount
 * @param  {int} newValue New value to add on the bag item count
 */
FFAPI.methods.header.updateBagItemCount = function (newValue) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-bag-item-count").html(newValue);
        var elements = document.getElementsByClassName('js-bag-item-count');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }

        //Doesnt show the number if it is zero
        newValueCounter = newValue == 0 ? "" : newValue;

        elements = document.getElementsByClassName('header-user-counter-bag-items');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = newValueCounter;
        }


    }
};
/**
 * Update the Bag Item count
 * @method FFAPI.methods.header.updateBagTotal
 * @param  {int} newValue New value to add on the bag total formatted
 */
FFAPI.methods.header.updateBagTotal = function (newValue) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-bag-total-formatted").html(newValue);
        var elements = document.getElementsByClassName('js-bag-total-formatted');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }
    }
};
/**
 * [updateBagInstallments description]
 * @param2m  {[type]} newValue [description]
 * @return {[type]}          [description]
 */
FFAPI.methods.header.updateBagInstallments = function (newValue) {
    if (newValue !== undefined && newValue !== null) {
        //$(".js-bag-installments").html(newValue);
        var elements = document.getElementsByClassName('js-bag-installments');
        for (var i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].innerHTML = newValue;
        }
    }
};

FFAPI.methods.header.getPluralRule = function (intQty) {

    if (FFAPI.variables.hasPlurals == true) {

        if (intQty == 11 || intQty == 12 || intQty == 13 || intQty == 14) {
            return "3";
        }

        var lastNumber = Math.abs(intQty) % 10;
        switch (lastNumber) {
            case 1:
                return "1";
            case 2:
                return "2";
            case 3:
                return "2";
            case 4:
                return "2";
            default:
                return "3";
        }

    }
    else {
        switch (intQty) {
            case 0:
                return "2";
            case 1:
                return "1";
            default:
                return "2";
        }

    }
};
///////////////////////////////////////////////////////////////////////////
//////////////////////////////// Prototypes ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

FFAPI.methods.urlHash = function(url) {
    return url ? url.split('#')[1] : window.location.hash.substring(1);
}

/**
 * Binds an event on an element
 * @param  {Element}  el     Element to bind event
 * @param  {String}   evt    Event name
 * @param  {Function} fn     Callback function
 * @param  {boolean}  bubble Capturing or bubling phase
 * @return {[type]}          [description]
 */
FFAPI.methods.on = function(el, evt, fn, bubble) {
    if("addEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
            el.addEventListener(evt, fn, bubble);
        } catch(e) {
            if(typeof fn == "object" && fn.handleEvent) {
                el.addEventListener(evt, function(e){
                    // Bind fn as this and set first arg as event object
                    fn.handleEvent.call(fn,e);
                }, bubble);
            } else {
                throw e;
            }
        }
    } else if("attachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if(typeof fn == "object" && fn.handleEvent) {
            el.attachEvent("on" + evt, function(){
                // Bind fn as this
                fn.handleEvent.call(fn);
            });      
        } else {
            el.attachEvent("on" + evt, fn);
        }
    }
};

FFAPI.methods.off = function(el, evt, fn, bubble) {
    if("removeEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
            el.removeEventListener(evt, fn, bubble);
        } catch(e) {
            if(typeof fn == "object" && fn.handleEvent) {
                el.removeEventListener(evt, fn.handleEvent, bubble);
            } else {
                throw e;
            }
        }
    } else if("detachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if(typeof fn == "object" && fn.handleEvent) {
            el.detachEvent("on" + evt, fn.handleEvent);      
        } else {
            el.detachEvent("on" + evt, fn);
        }
    }
};

//} catch (e) {
//    try {
//        if (window.debug) {
//            console.log(e);
//        }
//    } catch (ex) {
//    }
//}
/*!
 * hoverintent v0.1.0 (2013-05-20)
 * http://tristen.ca/hoverintent
 * Copyright (c) 2013 ; Licensed MIT
*/

;(function(global) {
    var hoverintent = function(el, over, out) {
        var x, y, pX, pY;
        var h = {},
            state = 0,
            timer = 0;

        var options = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };

        var defaults = function(opt) {
            options = merge(opt || {}, options);
        };

        var merge = function(obj) {
            for (var i = 1; i < arguments.length; i++) {
                var def = arguments[i];
                for (var n in def) {
                    if (obj[n] === undefined) obj[n] = def[n];
                }
            }
            return obj;
        };

        // Cross browser events
        var addEvent = function(object, event, method) {
            if (object.attachEvent) {
                object['e'+event+method] = method;
                object[event+method] = function(){object['e'+event+method](window.event);};
                object.attachEvent('on'+event, object[event+method]);
            } else {
                object.addEventListener(event, method, false);
            }
        };

        var removeEvent = function(object, event, method) {
            if (object.detachEvent) {
                object.detachEvent('on'+event, object[event+method]);
                object[event+method] = null;
            } else {
                object.removeEventListener(event, method, false);
            }
        };

        var track = function(e) { x = e.clientX; y = e.clientY; };

        var delay = function(el, outEvent, e) {
            if (timer) timer = clearTimeout(timer);
            state = 0;
            return outEvent.call(el, e);
        };

        var dispatch = function(e, event, over) {
            var tracker = function() {
                track(e);
            };

            if (timer) timer = clearTimeout(timer);
            if (over) {
                pX = e.clientX;
                pY = e.clientY;
                addEvent(el, 'mousemove', tracker);

                if (state !== 1) {
                    timer = setTimeout(function() {
                        compare(el, event, e);
                    }, options.interval);
                }
            } else {
                removeEvent(el, 'mousemove', tracker);

                if (state === 1) {
                    timer = setTimeout(function() {
                        delay(el, event, e);
                    }, options.timeout);
                }
            }
            return this;
        };

        var compare = function(el, overEvent, e) {
            if (timer) timer = clearTimeout(timer);
            if ((Math.abs(pX - x) + Math.abs(pY - y)) < options.sensitivity) {
                state = 1;
                return overEvent.call(el, e);
            } else {
                pX = x; pY = y;
                timer = setTimeout(function () {
                    compare(el, overEvent, e);
                }, options.interval);
            }
        };

        // Public methods
        h.options = function(opt) {
            defaults(opt);
        };

        var dispatchOver = function(e) { dispatch(e, over, true); }
        var dispatchOut = function(e) { dispatch(e, out); }

        h.remove = function() {
            if (!el) return
            removeEvent(el, 'mouseover', dispatchOver);
            removeEvent(el, 'mouseout', dispatchOut);
        }

        if (el) {
            addEvent(el, 'mouseover', dispatchOver);
            addEvent(el, 'mouseout', dispatchOut);
        }

        defaults();
        return h;
    };

    global.hoverintent = hoverintent;
    if (typeof module !== 'undefined' && module.exports) module.exports = hoverintent;

})(this);
/*global navigator, FFAPI, Modernizr, hoverintent */
/*jslint browser: true */

/**
 Responsive javaScript file. It contains the functions for responsiveness.<br>
 <b>NOTE: To have responsive images they need to have the following structure</b>: <br><br>
 &lt;img src="http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_54.jpg" <br> class="responsive" <br> data-large = "http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_1000.jpg" <br> data-medium = "http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_800.jpg" <br>data-small = "http://cdn-images.farfetch.com/10/59/54/56/10595456_2939615_400.jpg" &gt;
 @deprecated api/
 @class responsive-1.0.0.js
 **/

/**
 * This module contains global methods of our API
 * @module FFAPI
 */

//try {
/**
 * FFAPI responsive object. You can include on this object all the responsive variables and methods you need on your page
 * @property FFAPI.responsive
 * @type Object
 */
FFAPI.responsive = FFAPI.responsive || {};//Is variable initialized
/// General variables for our media queries
/**
 * FFAPI Responsive Mobile Width. The media querie size for mobiles<br /> We use 480 by default.
 * <b><i> FFAPI.responsive.mobile = 480;<br /></i></b>
 * @property FFAPI.responsive.mobile
 * @type Number
 */
FFAPI.responsive.mobile = 480;
/**
 * FFAPI Responsive Fablet Width. The media querie size for fablets <br /> We use 768 by default.
 * <b><i> FFAPI.responsive.fablet = 768;<br /></i></b>
 * @property FFAPI.responsive.fablet
 * @type Number
 */
FFAPI.responsive.fablet = 767;
/**
 * FFAPI Responsive Tablet Width. The media querie size for tablets <br /> We use 1024 by default.
 * <b><i> FFAPI.responsive.tablet = 1024;<br /></i></b>
 * @property FFAPI.responsive.tablet
 * @type Number
 */
FFAPI.responsive.tablet = 1024;
/**
 * FFAPI Responsive Desktops Width. The media querie size for desktops <br /> We use 1440 by default.
 * <b><i> FFAPI.responsive.desktop = 1440;<br /></i></b>
 * @property FFAPI.responsive.desktop
 * @type Number
 */
FFAPI.responsive.desktop = 1440;

/// Check what responsive images we have loaded
/**
 * FFAPI Responsive Loaded Huge Images. Variable to check if Huge Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedHugeImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedHugeImages
 * @type Boolean
 */
FFAPI.responsive.loadedHugeImages = false;
/**
 * FFAPI Responsive Loaded Large Images. Variable to check if Large Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedXLImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedXLImages
 * @type Boolean
 */
FFAPI.responsive.loadedXLImages = false;
/**
 * FFAPI Responsive Loaded Medium Images. Variable to check if Medium Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedMDImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedMDImages
 * @type Boolean
 */
FFAPI.responsive.loadedMDImages = false;
/**
 * FFAPI Responsive Loaded Small Images. Variable to check if Small Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedSMImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedSMImages
 * @type Boolean
 */
FFAPI.responsive.loadedSMImages = false;
/**
 * FFAPI Responsive Loaded Extra Small Images. Variable to check if Extra Small Images are loaded <br />
 * <b><i> FFAPI.responsive.loadedXSImages = false;<br /></i></b>
 * @property FFAPI.responsive.loadedXSImages
 * @type Boolean
 */
FFAPI.responsive.loadedXSImages = false;
/**
 * FFAPI Responsive is bigger than Large. Variable to check if images loaded are bigger than Large <br />
 * <b><i> FFAPI.responsive.biggerThanXL = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanXL
 * @type Boolean
 */
FFAPI.responsive.biggerThanXL = false;
/**
 * FFAPI Responsive is bigger than Medium. Variable to check if images loaded are bigger than Medium <br />
 * <b><i> FFAPI.responsive.biggerThanMD = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanMD
 * @type Boolean
 */
FFAPI.responsive.biggerThanMD = false;
/**
 * FFAPI Responsive is bigger than Small. Variable to check if images loaded are bigger than Small <br />
 * <b><i> FFAPI.responsive.biggerThanSM = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanSM
 * @type Boolean
 */
FFAPI.responsive.biggerThanSM = false;
/**
 * FFAPI Responsive is bigger than Extra Small. Variable to check if images loaded are bigger than Extra Small <br />
 * <b><i> FFAPI.responsive.biggerThanXS = false;<br /></i></b>
 * @property FFAPI.responsive.biggerThanXS
 * @type Boolean
 */
FFAPI.responsive.biggerThanXS = false;

/// Responsive images names
/**
 * FFAPI Responsive Large Image Name end. Variable that tells us the end name of the Large images <br />
 * <b><i> FFAPI.responsive.imageXL = "1000";<br /></i></b>
 * @property FFAPI.responsive.imageXL
 * @type String
 */
FFAPI.responsive.imageXL = "1000";
/**
 * FFAPI Responsive Medium Image Name end. Variable that tells us the end name of the Medium images <br />
 * <b><i> FFAPI.responsive.imageMD = "800";<br /></i></b>
 * @property FFAPI.responsive.imageMD
 * @type String
 */
FFAPI.responsive.imageMD = "800";
/**
 * FFAPI Responsive Small Image Name end. Variable that tells us the end name of the Small images <br />
 * <b><i> FFAPI.responsive.imageSM = "400";<br /></i></b>
 * @property FFAPI.responsive.imageSM
 * @type String
 */
FFAPI.responsive.imageSM = "400";

/// Responsive MediaQueries
/**
 * FFAPI Responsive Media Querie Huge. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieHuge = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieHuge
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieHuge = false;
/**
 * FFAPI Responsive Media Querie Large. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieXL = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieXL
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieXL = false;
/**
 * FFAPI Responsive Media Querie Medium. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieMD = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieMD
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieMD = false;
/**
 * FFAPI Responsive Media Querie Small. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieSM = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieSM
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieSM = false;
/**
 * FFAPI Responsive Media Querie Extra Small. Variable will be a Window matchMedia. It will helps us to check when the users screen change to a different mediaQuerie <br /> We start as boolean to prevent errors.
 * <b><i> FFAPI.responsive.mediaQuerieXS = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieXS
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieXS = false;
/**
 * FFAPI Responsive Media Querie Header. Variable will be a Window matchMedia. It will helps us to check when the user needs to load the header-2.0.0.js and the event Listeners on this file..
 * <b><i> FFAPI.responsive.mediaQuerieHeader = false;<br /></i></b>
 * @property FFAPI.responsive.mediaQuerieHeader
 * @type Boolean
 */
FFAPI.responsive.mediaQuerieHeader = false;
/**
 * FFAPI Responsive Media Querie Gone Small. Variable will be a Window matchMedia. It will helps us to check when the screen goes small and the behaviours we need
 * <b><i> FFAPI.responsive.goneSmallQuerie = false;<br /></i></b>
 * @property FFAPI.responsive.goneSmallQuerie
 * @type Boolean
 */
FFAPI.responsive.goneSmallQuerie = false;
/**
 * FFAPI Responsive Media Querie Gone Big. Variable will be a Window matchMedia. It will helps us to check when the screen goes big and the behaviours we need
 * <b><i> FFAPI.responsive.goneBigQuerie = false;<br /></i></b>
 * @property FFAPI.responsive.goneBigQuerie
 * @type Boolean
 */
FFAPI.responsive.goneBigQuerie = false;

$(document).ready(function () {
    /**
     * FFAPI Variables header trigger. The header trigger - Used for the ffmenu
     * <b><i>FFAPI.variables.headerTrigger =  $(".header-trigger");<br /></i></b>
     * @property FFAPI.variables.headerTrigger
     * @type Object
     */
    FFAPI.variables.headerTrigger = $('.header-trigger');
    /**
     * FFAPI Variables close mobile menu transparent div
     * <b><i>FFAPI.variables.closeMobile =  $(".js-close-mobile");<br /></i></b>
     * @property FFAPI.variables.closeMobile
     * @type Object
     */
    FFAPI.variables.closeMobileJS = document.getElementsByClassName('js-close-mobile');
    /**
     * FFAPI Variables header Nav List Items. The header Nav list items
     * <b><i>FFAPI.variables.headerNavLi =  $(".js-primary-nav");<br /></i></b>
     * @property FFAPI.variables.headerNavLi
     * @type Object
     */
    FFAPI.variables.headerNavLi = $('.js-primary-nav');
    /**
     * FFAPI Variables notice error close button.
     * <b><i>FFAPI.variables.noticeErrorCloseButton = $(".notice_error span.icon-close");<br /></i></b>
     * @property FFAPI.variables.noticeErrorCloseButton
     * @type Object
     */
    FFAPI.variables.noticeErrorCloseButton = $('.notice_error span.icon-close');
    /**
     * FFAPI Variables Touchstart detection
     * <b><i>FFAPI.variables.touchSupported = false;<br /></i></b>
     * @property FFAPI.variables.touchSupported
     * @type Object
     */
});
FFAPI.variables.touchSupported = false;
if (Modernizr.touch) {
    FFAPI.variables.touchSupported = true;
}




/// Responsive Images Checker function
/**
 * Nothing for now
 * @method FFAPI.responsive.checkResponsiveImages
 */
FFAPI.responsive.checkResponsiveImages = function () {
};

/**
 * This functions changes the src of the image for the newSrc
 * @method FFAPI.responsive.changeImageSrc
 * @param {Object} node - Image object
 * @param {URL} newSrc - Image Url
 * @return true
 */
FFAPI.responsive.changeImageSrc = function (node, newSrc) {
    node.src = newSrc;
    return true;
};

/**
 * This functions caches the new image using another function, and it has a callback function
 * @method FFAPI.responsive.cacheAndLoadImage
 * @param {Object} node - Image Object
 * @param {URL} newSrc - Image URL
 * @param {function} callback
 * @return Callback function
 */
FFAPI.responsive.cacheAndLoadImage = function (node, newSrc, callback) {
    FFAPI.responsive.isImageCached(newSrc);
    callback(node, newSrc);
};

/**
 * Checks if image is cached and caches the image
 * @method FFAPI.responsive.isImageCached
 * @param {String} imgUrl
 * @return Boolean
 */
FFAPI.responsive.isImageCached = function (imgUrl) {
    /// console.log(imgUrl);
    if (imgUrl != null) {
        var imgEle = document.createElement("img");
        imgEle.src = imgUrl;
        return imgEle.complete || (imgEle.width + imgEle.height) > 0;
    } else {
        return false;
    }
};


/// Just make this if matchmedia is available
if (window.matchMedia && ffbrowser.isIE8 === false) {
    ///Bigger then the FFAPI.responsive.desktop
    FFAPI.responsive.mediaQuerieHuge = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.desktop + 1) + 'px)');

    ///Between tablet and desktop
    FFAPI.responsive.mediaQuerieXL = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.tablet + 1) + 'px) and (max-width:' + (FFAPI.responsive.desktop) + 'px)');

    ///Between fablet and tablet
    FFAPI.responsive.mediaQuerieMD = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.fablet + 1) + 'px) and (max-width:' + (FFAPI.responsive.tablet) + 'px)');

    /// Bigger than tablet - big devices responsive actions
    FFAPI.responsive.goneBigQuerie = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.tablet + 1) + 'px)');
    FFAPI.responsive.fromSmallToBig = FFAPI.responsive.goneBigQuerie;

    ///Between mobile and fablet
    FFAPI.responsive.mediaQuerieSM = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.mobile + 1) + 'px) and (max-width:' + (FFAPI.responsive.fablet) + 'px)');

    ///Between mobile and fablet - for the header
    FFAPI.responsive.mediaQuerieHeader = window.matchMedia('screen and ' + '(min-width: ' + (FFAPI.responsive.mobile + 1) + 'px) and (max-width:' + (FFAPI.responsive.fablet) + 'px)');

    /// Between mobile and tablet - for the responsive actions
    FFAPI.responsive.goneSmallQuerie = window.matchMedia('screen and ' + '(max-width:' + (FFAPI.responsive.tablet) + 'px)');
    FFAPI.responsive.fromBigToSmall = FFAPI.responsive.goneSmallQuerie;

    ///Smaller size for mobiles devices
    FFAPI.responsive.mediaQuerieXS = window.matchMedia('screen and ' + '(max-width: ' + (FFAPI.responsive.mobile) + 'px)');

    /**
     * Matches the mediaQuerie for Huge screens - Bigger then the FFAPI.responsive.desktop Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieHugeListener
     */
    FFAPI.responsive.mediaQuerieHugeListener = function () {
        /// <summary>
        ///     Matches the mediaQuerie for Huge screens
        ///     Bigger then the FFAPI.responsive.desktop Listener
        /// </summary>
        /// <returns type="undefined" />
        if (FFAPI.responsive.mediaQuerieHuge.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-large'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedHugeImages = true;
            FFAPI.responsive.biggerThanXS = true;
            FFAPI.responsive.biggerThanSM = true;
            FFAPI.responsive.biggerThanMD = true;
            FFAPI.responsive.biggerThanXL = true;
        }
    };

    /**
     *Matches the mediaQuerie for Extra Large screens - Between tablet and desktop Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieXLListener
     */
    FFAPI.responsive.mediaQuerieXLListener = function () {
        if (FFAPI.responsive.mediaQuerieXL.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-large'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedXLImages = true;
            FFAPI.responsive.biggerThanXS = true;
            FFAPI.responsive.biggerThanSM = true;
            FFAPI.responsive.biggerThanMD = true;
        }
    };

    /**
     *Matches the mediaQuerie for Medium screens - Between fablet and tablet screen Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieMDListener
     */
    FFAPI.responsive.mediaQuerieMDListener = function () {
        if (FFAPI.responsive.mediaQuerieMD.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-medium'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedMDImages = true;
            FFAPI.responsive.biggerThanXS = true;
            FFAPI.responsive.biggerThanSM = true;

        }
    };

    /**
     *Matches the mediaQuerie for Small screens -  Between mobile and fablet Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieSMListener
     */
    FFAPI.responsive.mediaQuerieSMListener = function () {
        if (FFAPI.responsive.mediaQuerieSM.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-small'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedSMImages = true;
            FFAPI.responsive.biggerThanXS = true;
        }
    };

    /**
     *Matches the mediaQuerie for Extra Small screens - For mobile screens Listener.<br>It gets all the images with the class .responsive and changes it's source to the large image. It then change sthe variables of what images has already loaded.
     * @method FFAPI.responsive.mediaQuerieXSListener
     */
    FFAPI.responsive.mediaQuerieXSListener = function () {
        if (FFAPI.responsive.mediaQuerieXS.matches) {
            var nodes = document.getElementsByClassName('responsive');
            for (var j = 0; j <= nodes.length - 1; j++) {
                FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute('data-small'), FFAPI.responsive.changeImageSrc);
            }
            FFAPI.responsive.loadedXSImages = true;
        }
    };

    /**
     * Loads the specific image on a matchMedia
     * @method FFAPI.responsive.mediaQuerieLoaderImage
     * @param {String} attribute - What data attribute to get from the image
     * @param {Boolean} querieMatches - If is on the match of the mediaquerie
     * @param {Boolean} imageSizeChecker - If it has to load these images
     * @param {String} imageLoaded - What image has just loaded to change the variables value
     * @return
     */
    FFAPI.responsive.mediaQuerieLoaderImage = function (attribute, querieMatches, imageSizeChecker, imageLoaded) {
        if (querieMatches === true) {
            var nodes = document.getElementsByClassName('responsive'),
                nodesLength = nodes.length - 1;
            var j;
            for (j = 0; j <= nodesLength; j++) {
                if (nodes[j].getAttribute("data-resize") === "false") {
                    FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute(attribute), FFAPI.responsive.changeImageSrc);
                } else {
                    if ((imageSizeChecker === false)) {
                        FFAPI.responsive.cacheAndLoadImage(nodes[j], nodes[j].getAttribute(attribute), FFAPI.responsive.changeImageSrc);
                        switch (imageLoaded) {
                            case "huge":
                                FFAPI.responsive.loadedHugeImages = true;
                                FFAPI.responsive.loadedXLImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                FFAPI.responsive.biggerThanSM = true;
                                FFAPI.responsive.biggerThanMD = true;
                                break;
                            case "xl":
                                FFAPI.responsive.loadedXLImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                FFAPI.responsive.biggerThanSM = true;
                                FFAPI.responsive.biggerThanMD = true;
                                break;
                            case "md":
                                FFAPI.responsive.loadedMDImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                FFAPI.responsive.biggerThanSM = true;
                                break;
                            case "sm":
                                FFAPI.responsive.loadedSMImages = true;
                                FFAPI.responsive.biggerThanXS = true;
                                break;
                            case "xs":
                                FFAPI.responsive.loadedXSImages = true;
                                break;
                        }
                    }
                }
            }
        }
    };

    /**
     * Starts the mediaQuerie add Listeners
     * @method FFAPI.responsive.mediaQuerieStartListeners
     */
    FFAPI.responsive.mediaQuerieStartListeners = function () {
        FFAPI.responsive.mediaQuerieHuge.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieHuge.matches, FFAPI.responsive.loadedHugeImages, "huge");
        });

        FFAPI.responsive.mediaQuerieXL.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieXL.matches, FFAPI.responsive.biggerThanXL, "xl");
        });

        FFAPI.responsive.mediaQuerieMD.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-medium", FFAPI.responsive.mediaQuerieMD.matches, FFAPI.responsive.biggerThanMD, "md");
        });

        FFAPI.responsive.mediaQuerieSM.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-small", FFAPI.responsive.mediaQuerieSM.matches, FFAPI.responsive.biggerThanSM, "sm");
        });

        FFAPI.responsive.mediaQuerieXS.addListener(function () {
            FFAPI.responsive.mediaQuerieLoaderImage("data-xsmall", FFAPI.responsive.mediaQuerieXS.matches, FFAPI.responsive.biggerThanXS, "xs");
        });
    };

    /**
     * Starts the mediaQuerie chnage image on load
     * @method FFAPI.responsive.startImagesLoad
     */
    FFAPI.responsive.startImagesLoad = function () {
        "use strict";
        FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieHuge.matches, FFAPI.responsive.loadedHugeImages, "huge");
        FFAPI.responsive.mediaQuerieLoaderImage("data-large", FFAPI.responsive.mediaQuerieXL.matches, FFAPI.responsive.biggerThanXL, "xl");
        FFAPI.responsive.mediaQuerieLoaderImage("data-medium", FFAPI.responsive.mediaQuerieMD.matches, FFAPI.responsive.biggerThanMD, "md");
        FFAPI.responsive.mediaQuerieLoaderImage("data-small", FFAPI.responsive.mediaQuerieSM.matches, FFAPI.responsive.biggerThanSM, "sm");
        FFAPI.responsive.mediaQuerieLoaderImage("data-xsmall", FFAPI.responsive.mediaQuerieXS.matches, FFAPI.responsive.biggerThanXS, "xs");
    };

    /**
     * Setting initial Listeners for the media queries
     * @method FFAPI.responsive.mediaQuerieSetValues
     */
    FFAPI.responsive.mediaQuerieSetValues = function () {
        "use strict";
        FFAPI.responsive.startImagesLoad();
        FFAPI.responsive.mediaQuerieStartListeners();
    };


    /**
     * Start the Set values of mediaQueries and the mediaQueriesListeners
     * @method FFAPI.responsive.checkResponsiveImages
     */
    FFAPI.responsive.checkResponsiveImages = function () {
        FFAPI.responsive.mediaQuerieSetValues();
        FFAPI.responsive.mediaQuerieStartListeners();
    };

    /**
     * Hide the mobile menu when clicking on the wrapper.
     * @method FFAPI.responsive.closeNavDrawer
     * @param {Event} event
     */
    FFAPI.responsive.closeNavDrawer = function () {
        /// Prevent default the event
        /// event.preventDefault();
        /// Trigger click 
        FFAPI.responsive.hamburguerMenuClick(event);
    }

    /**
     * Click or tapping on the headerTrigger we chnage the class of headerUtilities and headerNav
     * @method FFAPI.responsive.hamburguerMenuClick
     * @param {Event} event
     */
    FFAPI.responsive.hamburguerMenuClick = function (event) {

        if (event != undefined) {
            /// Prevent Default event
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation()
            } else {
                event.returnValue = false;
            }
        }
        //alert("OPEN;");
        /// console.log("hamburguerMenuClick");
        var auxScroll = window.scrollY + 'px';
        /// Change the variable to indcate the ffmenu is not visible
        FFAPI.variables.ffmenu.menuVisible = true;

        if (!Modernizr.csstransitions) {
            /// Animate the bodyElement
            FFAPI.variables.bodyElement.animate({ left: 270 }, FFAPI.variables.animationSpeed, function () {
                /// Add the necessary classes to the bodyElement
                FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
                /// Remove the necessary classes to the bodyElement
                FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');

            });
        } else {
            /// Add the necessary classes to the bodyElement
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
            /// Remove the necessary classes to the bodyElement
            FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');

        }

        FFAPI.variables.headerTrigger
        .off('click', FFAPI.responsive.hamburguerMenuClick)
        .on('click', FFAPI.responsive.hamburguerMenuClose);

        /*
        FFAPI.variables.bodyElementJS[0].style.top = auxScroll;
        auxScroll = 0;
        document.querySelector('header').style.top = auxScroll;
        document.getElementsByClassName('header-action-wrapper')[0].style.top= auxScroll;
        document.getElementsByClassName('header-nav-wrapper')[0].style.top= auxScroll;
        document.getElementsByClassName('header-primary-nav-overlay')[0].style.top= auxScroll;
        document.getElementsByClassName('header-primary-nav-bg')[0].style.top= auxScroll;*/








        ///Show the closeMobile and add a height to it
        FFAPI.variables.closeMobileJS[0].style.height = FFAPI.methods.getDocHeight() + 'px';
        FFAPI.methods.removeClass(FFAPI.variables.closeMobileJS[0], 'hide');


        /*
        $('body').bind('touchmove', function(e){e.preventDefault()});*/
    };

    /**
     * Click or tapping on the headerTrigger again will close it
     * @method FFAPI.responsive.hamburguerMenuClose
     * @param {Event} event
     */
    FFAPI.responsive.hamburguerMenuClose = function (event) {

        if (event != undefined) {
            /// Prevent Default event
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation()
            } else {
                event.returnValue = false;
            }
        }
        //alert("CLOSE;");
        ///console.log("hamburguerMenuClose");

        //$('body').unbind('touchmove');

        /// Change the variable to indcate the ffmenu is not visible
        FFAPI.variables.ffmenu.menuVisible = false;

        if (!Modernizr.csstransitions) {
            /// Animate the bodyElement
            FFAPI.variables.bodyElement.animate({ left: 0 }, FFAPI.variables.animationSpeed, function () {
                var auxScroll = '';
                FFAPI.variables.bodyElementJS[0].style.top = auxScroll;
                document.querySelector('header').style.top = auxScroll;
                document.getElementsByClassName('header-action-wrapper')[0].style.top = auxScroll;
                document.getElementsByClassName('header-nav-wrapper')[0].style.top = auxScroll;
                document.getElementsByClassName('header-primary-nav-overlay')[0].style.top = auxScroll;
                document.getElementsByClassName('header-primary-nav-bg')[0].style.top = auxScroll;
            });
            /// Add the necessary classes to the bodyElement
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');
            /// Remove the necessary classes to the bodyElement
            FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');


        } else {
            /// Add the necessary classes to the bodyElement
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-open');
            /// Remove the necessary classes to the bodyElement
            FFAPI.methods.addClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');

        }


        /// Remove the header-nav-drawer-close class from the bodyElement
        setTimeout(function () {
            FFAPI.methods.removeClass(FFAPI.variables.bodyElementJS[0], 'header-nav-drawer-close');
            var auxScroll = '';
            FFAPI.variables.bodyElementJS[0].style.top = auxScroll;
            document.querySelector('header').style.top = auxScroll;
            document.getElementsByClassName('header-action-wrapper')[0].style.top = auxScroll;
            document.getElementsByClassName('header-nav-wrapper')[0].style.top = auxScroll;
            document.getElementsByClassName('header-primary-nav-overlay')[0].style.top = auxScroll;
            document.getElementsByClassName('header-primary-nav-bg')[0].style.top = auxScroll;
        }, FFAPI.variables.resizeWindowTime);

        /// Hide the js-close-mobile
        FFAPI.methods.addClass(FFAPI.variables.closeMobileJS[0], 'hide');

        /// Bind the headerTrigger events
        FFAPI.variables.headerTrigger
        .off('click', FFAPI.responsive.hamburguerMenuClose)
        .on('click', FFAPI.responsive.hamburguerMenuClick);




        /// Be sure the ffmenu searchHideEvent is hidden
        FFAPI.methods.ffmenu.searchHideEvent();
    };

    /**
     * Binds clicking on the tabs. To be used while tab is not animating. 
     * Has to prevent any action while animations are on course
     * @method FFAPI.responsive.bindHamburguerMenuClick
     */
    FFAPI.responsive.bindHamburguerMenuClick = function () {
        FFAPI.variables.headerTrigger = $('.header-trigger');
        FFAPI.variables.headerTrigger.on('click', FFAPI.responsive.hamburguerMenuClick);







    };



    $(document).ready(function () {
        /// CloseMobile bind element click with function to close
        FFAPI.methods.bindElemClick(FFAPI.variables.closeMobileJS, FFAPI.responsive.hamburguerMenuClose);


        /**
         * Click or tapping on the noticeErrorCloseButton close the alert element
         * @method FFAPI.variables.noticeErrorCloseButton.on('click tap', function)
         */
        FFAPI.variables.noticeErrorCloseButton.on('click', function () {
            $(this).closest(".notice_error").hide();
            globalPosWrapper = $(".globalposWrapper");
            if (globalPosWrapper.length > 0) {
                globalPosWrapper.removeClass('hide');
            }
        });
    });


    /**
     * On document ready load the mediaQuerieSetValues
     * @method $(document).ready(function($)
     */
    $(document).ready(function () {
        FFAPI.responsive.bindHamburguerMenuClick();
    });

}


/**
* Redirect to search resultss
* @method FFAPI.methods.redirectToSearchResults
* @param  {[type]} value    [description]
* @param  {[type]} genderID [description]
*/
FFAPI.methods.redirectToSearchResults = function (value, genderID) {

    var gender = "", designersPage = "";
    if (genderID === undefined || genderID === null || genderID === 0) {
        genderID = FFAPI.methods.getGenderId();
    }

    if (genderID == 248) {
        gender = "men";
        designersPage = "/designers-men.aspx";
    }
    else {
        gender = "women";
        designersPage = "/designers-women.aspx";
    }
    var homeUrl = location.protocol + "//" + location.host + window.universal_variable.page.subfolder;
    var valueHex = FFAPI.methods.stringToHex(value.replace(/</gi, "").replace(/>/gi, ""));
    var valueEncoded = encodeURIComponent(value);

    if (value) {
        var obj = { searchTerm: valueEncoded, gender: genderID };
        $.ajax({
            type: "POST",
            url: (typeof (globalAsyncReqDomain) == "undefined" ? "" : globalAsyncReqDomain) + window.universal_variable.page.subfolder + "/FFAPI/AsyncUtil.asmx/GetStopWords",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(obj),
            success: function (data) {
                if (data.hasOwnProperty("d") && data.d != null && data.d != "") {
                    window.location = homeUrl + "/shopping/" + gender + "/" + data.d;
                }
                else {
                    window.location = homeUrl + "/shopping/" + gender + "/search/schid-" + valueHex + "/items.aspx?q=" + valueEncoded;
                }
            },
            error: function () {
                window.location = homeUrl + "/shopping/" + gender + "/search/schid-" + valueHex + "/items.aspx?q=" + valueEncoded;
            }
        });


    }
    else {
        // redirects to designers page                
        window.location = homeUrl + designersPage;
    }
};


/**
 * Destroy the ffmenu and start it again width the touch event
 * @method FFAPI.responsive.startffmenuHover
 */
FFAPI.responsive.startffmenuHover = function () {
    FFAPI.variables.headerNavLi.ffmenu('destroy');

    if (FFAPI.variables.touchSupported === true) {
        FFAPI.variables.ffmenu.touchDesktopMenu();
    } else {
        FFAPI.variables.headerNavLi.ffmenu({});
    }
};

/**
 * Destroy the ffmenu and start it again width the click event
 * @method FFAPI.responsive.startffmenuClick
 */
FFAPI.responsive.startffmenuClick = function () {
    FFAPI.variables.headerNavLi.ffmenu('destroy');
    FFAPI.variables.headerNavLi.ffmenu({ eventAction: 'click' });
};


if (FFAPI.variables.touchSupported === true) {
    $('.meganav-mask').mouseup(function (e) {
        e.preventDefault();
        FFAPI.variables.headerNavLi.ffmenu();
    });
}


/*
} catch (e) {
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}*/


FFAPI.responsive.forceUserAuthentication = function() {
    /// <summary>
    ///     Checks whether a user's logged in or not
    /// </summary>
    /// <returns type="Boolean" />
    var isLogged = window.universal_variable.user.isLogged;
    if (!isLogged) {
        if (Modernizr.touch || FFAPI.responsive.goneSmallQuerie.matches) {
            var url = document.URL;
            $('#loginMobileHeader')[0].click();
            //TODO: link for signIn
        } else {
            if (FFAPI.responsive.goneSmallQuerie.matches) {
                var url = document.URL;
                $('#loginMobileHeader')[0].click();
            } else {
                $('a[data-tab="header-tabs-1"]').trigger('click');
            }
        }
        return isLogged;
    }
}
/**
 Scroll javaScript file. It contains the functions to scroll to anchors.
 @class scroll-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive scroll
     */
    FFAPI.plugins.scroll = {

        /**
         * Trigger default class name
         * @type {String}
         */
        defaultClass: 'scroll-to',

        /**
         * Control class to tell that trigger was processed
         * @type {String}
         */
        processedClass: 'js-scroll-to',

        /**
         * Data attribute that indicates the ID of target element
         * @type {String}
         */
        dataTarget: 'data-target',

        /**
         * Data attribute to increment target top offset
         * @type {String}
         */
        dataOffset: 'data-offset',

        /**
         * Offset of the header nav for responsive purposes
         * @type {Number}
         * @default 0
         */
        headerOffset: 0,

        /**
         * Extra offset to incremenet header
         * @type {Number}
         * @default 20
         */
        extraOffset: 20,

        /**
         * Animating state
         * @type {Boolean}
         * @default false
         */
        animating: false,

        /**
         * List of processed triggers
         * @type {Array}
         */
        list: [],

        /**
         * Find trigger elements and processes them
         * Also checks header offset depends on responsive media
         * @return {void}
         */
        init: function() {

            var triggers = document.getElementsByClassName(FFAPI.plugins.scroll.defaultClass);

            for (var i = 0; i < triggers.length; i++) {
                FFAPI.plugins.scroll.bind(triggers[i]);
            }
            
            if (ffbrowser.isIE8 === false) {
                // Device - on load check
                FFAPI.plugins.scroll._responsive();

                // Tablet devices - when something changes
                FFAPI.responsive.goneSmallQuerie.addListener(FFAPI.plugins.scroll._responsive);

                // Desktop devices - when something changes
                FFAPI.responsive.goneBigQuerie.addListener(FFAPI.plugins.scroll._responsive);
            } else {
                // IE8 Browser - on load check
                FFAPI.plugins.scroll.headerOffset = (document.getElementsByTagName('header').length > 0 ? document.getElementsByTagName('header')[0].offsetHeight : 0) + FFAPI.plugins.scroll.extraOffset;
            }

        },

        /**
         * Scrolls the page to target element and calls a callback function
         * @param  {Element}   target
         * @param  {Number}   offset
         * @param  {Function} callback
         * @return {void}
         */
        to: function(target, offset, callback) {

            // Avoid scroll page twice
            if(FFAPI.plugins.scroll.animating) return;

            // If target element is on right position, just call the callback function
            if(FFAPI.plugins.scroll._top(target) + offset - FFAPI.plugins.scroll.headerOffset == 0) {
                if(callback) callback.call(); else return;
            }

            // Scroll start
            FFAPI.plugins.scroll.animating = true;

            // Scroll page to target
            $.Velocity(target, 'scroll', {
                duration: 750,
                offset: offset - FFAPI.plugins.scroll.headerOffset,
                complete: function() {
                    // Scroll stop
                    FFAPI.plugins.scroll.animating = false;

                    if(callback) callback.call(); else return;
                }
            });
        },

        /**
         * Tries to bind a new scroll trigger
         * @param  {Element} trigger
         * @return {boolean}
         */
        bind: function(trigger) {
            // Check if trigger processed
            if(!FFAPI.methods.hasClass(trigger, FFAPI.plugins.scroll.processedClass)) {
                FFAPI.plugins.scroll.list.push(new Scroll(trigger));

                return true;
            }

            return false;
        },

        /**
         * Updates the header offset when media query matches
         * @return {void}
         */
        _responsive: function() {

            if(FFAPI.responsive.goneSmallQuerie.matches || FFAPI.responsive.goneBigQuerie.matches) {
                FFAPI.plugins.scroll.headerOffset = (document.getElementsByTagName('header').length > 0 ? document.getElementsByTagName('header')[0].offsetHeight : 0) + FFAPI.plugins.scroll.extraOffset;
            }

        },

        /**
         * Returns the top position of an element
         * @param  {[type]} el
         * @return {[type]}
         */
        _top: function(el) {
            return el.getBoundingClientRect().top;
        }
    };

    /**
     * In order we have a single scroll system for our website, Scroll class makes all needed requirements.
     * @param {Element} element
     * @return {Scroll} Scroll object
     */
    function Scroll(element) {

        /**
         * Trigger element
         * @type {Element}
         */
        this.el = element;

        /**
         * Target element
         * @type {Element}
         * @default null
         */
        this.target = null;

        /**
         * Offset value
         * @type {Number}
         * @default 0
         */
        this.offset = 0;

        // Sets data attributes
        this._dataAttr();
        
        // Adds the processed class on trigger element
        FFAPI.methods.addClass(this.el, FFAPI.plugins.scroll.processedClass);

        // Binds click event on trigger element
        FFAPI.methods.on(this.el, 'click', this, false);

        return this;
    }

    /**
     * Methods for Scroll object
     * @type {Object}
     */
    Scroll.prototype = {

        /**
         * Finds and sets data attributes
         * @return {void}
         */
        _dataAttr: function() {

            // Try to set target attribute
            if(this.el.hasAttribute(FFAPI.plugins.scroll.dataTarget)) {
                this.target = document.getElementById(this.el.getAttribute(FFAPI.plugins.scroll.dataTarget));
            } else {
                this.target = document.getElementsByTagName('html')[0];
            }

            // Try to set offset attribute
            if(this.el.hasAttribute(FFAPI.plugins.scroll.dataOffset)) {
                this.offset = parseInt(this.el.getAttribute(FFAPI.plugins.scroll.dataOffset));
            }
        },

        /**
         * Handles click event
         * @param  {Event} e
         * @return {boolean}
         */
        handleEvent: function(e) {
            // Scrolls page to target element
            FFAPI.plugins.scroll.to(this.target, this.offset);

            // Prvents default action
            var evt = e ? e:window.event;
            if (evt.preventDefault) evt.preventDefault();
            evt.returnValue = false;
            return false;
        }

    };

} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}/**
 Tabs javaScript file. It contains the functions for control page tabs.
 @class tabs-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive tabs
     */
    FFAPI.plugins.tabs = {

        /**
         * The default class of the tab
         * @type {String}
         */
        defaultClass: 'tabs',

        /**
         * The processed class of the tab
         * @type {String}
         */
        processedClass: 'js-tabs',

        /**
         * The active class of the item
         * @type {String}
         */
        activeClass: 'active',

        /**
         * The class of the trigger button
         * @type {String}
         */
        itemTitleClass: 'tabs-title',

        /**
         * The class of the content
         * @type {String}
         */
        itemContentClass: 'tabs-content',

        dataIndex: 'data-index',

        // Tabs list
        list: {
            'xs': [],
            'sm': [],
            'md': [],
            'xl': [],
            'only-xl': []
        },

        // Initialize registered tabs
        init: function() {

            // Default suffix
            var defaultSuffix = 'xl';

            var tabs = document.getElementsByClassName(FFAPI.plugins.tabs.defaultClass);

            for (var i = 0; i < tabs.length; i++) {

                // Set tabs suffix
                var tabsSuffix = FFAPI.plugins.tabs._suffix(tabs[i].className);
                if(!tabsSuffix) tabsSuffix = defaultSuffix;

                // Tries to bind a new tabs
                FFAPI.plugins.tabs.bind(tabs[i], tabsSuffix);
            }

            if (ffbrowser.isIE8 === false) {
            
                // Mobile devices - on load check
                FFAPI.plugins.tabs._goneXS();
                
                // Mobile devices - when something changes
                FFAPI.responsive.mediaQuerieXS.addListener(FFAPI.plugins.tabs._goneXS);
                
                // Fablet devices - on load check
                FFAPI.plugins.tabs._goneSM();

                // Fablet devices - when something changes
                FFAPI.responsive.mediaQuerieSM.addListener(FFAPI.plugins.tabs._goneSM);
                
                // Tablet devices - on load check
                FFAPI.plugins.tabs._goneMD();

                // Tablet devices - when something changes
                FFAPI.responsive.mediaQuerieMD.addListener(FFAPI.plugins.tabs._goneMD);

                // Desktop devices - on load check
                FFAPI.plugins.tabs._goneXL();

                // Desktop devices - when something changes
                FFAPI.responsive.goneBigQuerie.addListener(FFAPI.plugins.tabs._goneXL);
            } else {
                // IE8 browser - on load check
                FFAPI.plugins.tabs._goneIE8();
            }

            // On hash change
            window.onhashchange = function () {
                FFAPI.plugins.tabs.hashHandler(FFAPI.methods.urlHash());
            };

        },

        get: function(element) {

            // If element invalid
            if(!element) return null;

            var suffix = FFAPI.plugins.tabs._suffix(element.className);
            if(suffix && FFAPI.plugins.tabs.list.hasOwnProperty(suffix) && FFAPI.plugins.tabs._processed(element)) {
                if(element.hasAttribute(FFAPI.plugins.tabs.dataIndex)) {
                    return FFAPI.plugins.tabs.list[suffix][parseInt(element.getAttribute(FFAPI.plugins.tabs.dataIndex))];
                }
            }

            return null;

        },

        bind: function(element, suffix) {
            // Check if element processed
            if(!FFAPI.plugins.tabs._processed(element)) {

                // Add index attribute to tabs
                element.setAttribute(FFAPI.plugins.tabs.dataIndex, FFAPI.plugins.tabs.list[suffix].length);

                // Push new tabs
                FFAPI.plugins.tabs.list[suffix].push(new Tabs(element));
            }
        },

        hashHandler: function(refName) {
            
            var tabsEl = refName.split('-')[0];

            var tabs = FFAPI.plugins.tabs.get(document.getElementById(tabsEl));

            if(!tabs || !tabs.built) return;

            // Show tab
            tabs.show(document.getElementById(refName));
        },

        _processed: function(element) {
            return FFAPI.methods.hasClass(element, FFAPI.plugins.tabs.processedClass);
        },

        _suffix: function(className) {
            // Detect suffix
            var matches = className.match(""+FFAPI.plugins.tabs.defaultClass+"-[a-z\-]+");
            if(matches) {
                return matches[0].replace(FFAPI.plugins.tabs.defaultClass + '-', '');
            }

            return null;
        },

        // When IE8 Browser
        _goneIE8: function () {

            // Build 'xl' tabs
            FFAPI.plugins.tabs._build('xl');
            FFAPI.plugins.tabs._destroy('md');
            FFAPI.plugins.tabs._destroy('sm');
            FFAPI.plugins.tabs._destroy('xs');
            FFAPI.plugins.tabs._build('only-xl');

        },

        // When Desktop
        _goneXL: function() {

            if (FFAPI.responsive.goneBigQuerie.matches) {
                
                // Build 'xl' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._destroy('md');
                FFAPI.plugins.tabs._destroy('sm');
                FFAPI.plugins.tabs._destroy('xs');
                FFAPI.plugins.tabs._build('only-xl');

            }

        },

        // When Tablet
        _goneMD: function() {

            if (FFAPI.responsive.mediaQuerieMD.matches) {
                
                // Build 'md' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._build('md');
                FFAPI.plugins.tabs._destroy('sm');
                FFAPI.plugins.tabs._destroy('xs');
                FFAPI.plugins.tabs._destroy('only-xl');

            }

        },

        // When Fablet
        _goneSM: function() {

            if (FFAPI.responsive.mediaQuerieSM.matches) {
                
                // Build 'sm' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._build('md');
                FFAPI.plugins.tabs._build('sm');
                FFAPI.plugins.tabs._destroy('xs');
                FFAPI.plugins.tabs._destroy('only-xl');

            }

        },

        // When Mobile
        _goneXS: function() {

            if (FFAPI.responsive.mediaQuerieXS.matches) {
                
                // Build 'xs' tabs
                FFAPI.plugins.tabs._build('xl');
                FFAPI.plugins.tabs._build('md');
                FFAPI.plugins.tabs._build('sm');
                FFAPI.plugins.tabs._build('xs');
                FFAPI.plugins.tabs._destroy('only-xl');

            }

        },

        // Build all tabss of a given suffix
        _build: function(suffix) {

            // Build 'suffix' tabs
            for (var i = 0; i < FFAPI.plugins.tabs.list[suffix].length; i++) {
                FFAPI.plugins.tabs.list[suffix][i].build();
            }

        },

        // Destroy all tabss of a given suffix
        _destroy: function(suffix) {

            // Destroy 'suffix' tabs
            for (var i = 0; i < FFAPI.plugins.tabs.list[suffix].length; i++) {
                FFAPI.plugins.tabs.list[suffix][i].destroy();
            }

        }
    };

    /**
     * [Tabs] In order we have a single tabs plugin for our website, we've developed this one that makes all possible combinations in one.
     * @param {[type]} element              [the tabs element]
     */
    function Tabs(element) {

        // Tabs element
        this.el = element;

        // Active item
        this.activeItem = null;
        
        // Tabs items
        this.items = [];

        // Built flag
        this.built = false;

        // Opening state
        this.opening = false;

        // URL hash
        this.urlHash = FFAPI.methods.urlHash();

        // Callbacks
        this.callbacks = {
            'show': [],
            'hide': []
        };

        // Process tabs items
        this._processItems();

        // Add processed class to tabs
        FFAPI.methods.addClass(this.el, FFAPI.plugins.tabs.processedClass);

        return this;
    }

    /**
     * Tabs public methods
     * 
     */
     Tabs.prototype = {

        show: function(el) {
            if(el !== null && typeof(el) !== 'object') {
                this._show(this.items[parseInt(el)]);
            }

            if(!el || !el.hasAttribute(FFAPI.plugins.tabs.dataIndex)) return;

            // Tries to parse index attribute
            var idx = parseInt(el.getAttribute(FFAPI.plugins.tabs.dataIndex));
            if(idx >= this.items.length) return;

            this._show(this.items[idx]);
        },

        bindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._bindClick(this.items[idx]);
        },

        build: function() {

            if(this.built) return;

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Bind click event
                this._bindClick(this.items[i]);

                if((!this.urlHash && this.items[i].el.getAttribute('data-active')) || this.urlHash === this.items[i].hash) {
                    this._show(this.items[i], true);
                }
            }

            this.built = true;

        },

        unbindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._unbindClick(this.items[idx]);
        },

        destroy: function() {

            if(!this.built) return;

            // Hide active item
            if(this.activeItem) {
                this._hide(this.activeItem);
            }

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Unbind click event
                this._unbindClick(this.items[i]);
            }

            this.built = false;

        },

        setCallback: function(event, fn) {
            this.callbacks[event].push(fn);
        },

        _processItems: function() {

            var items = this.el.getElementsByClassName(FFAPI.plugins.tabs.itemTitleClass);
            
            // Loop through items
            for (var i = 0; i < items.length; i++) {

                var hash = items[i].href;
                if(!hash) {
                    hash = items[i].getElementsByTagName('a')[0].href;
                }
                hash = FFAPI.methods.urlHash(hash);
                
                var item = {
                    el: items[i],
                    idx: i,
                    hash: hash,
                    content: document.getElementById(hash)
                };

                // Add index attribute
                item.el.setAttribute(FFAPI.plugins.tabs.dataIndex, i);
                item.content.setAttribute(FFAPI.plugins.tabs.dataIndex, i);

                // Push item to items array
                this.items.push(item);
                
                if((!this.urlHash && item.el.getAttribute('data-active')) || this.urlHash === item.hash) {
                    this._show(item, true);
                }
            }
        },

        _toggle: function(item, e) {
            if(!FFAPI.methods.hasClass(item.el, FFAPI.plugins.tabs.activeClass)) {
                this._show(item);
            }

            // Prvents default action
            var evt = e ? e:window.event;
            if (evt.preventDefault) evt.preventDefault();
            evt.returnValue = false;
            return false;
        },

        _hide: function(item) {
            var instance = this;

            $.Velocity(item.content, { opacity: 0 }, { 
                duration: 0,
                display: 'none',
                complete: function() {
                    // Remove active class from the title
                    FFAPI.methods.removeClass(item.el, FFAPI.plugins.tabs.activeClass);

                    // Remove active class from the content
                    FFAPI.methods.removeClass(item.content, FFAPI.plugins.tabs.activeClass);

                    // Remove display: none
                    item.content.removeAttribute('style');

                    for (var i = 0; i < instance.callbacks['hide'].length; i++) {
                        instance.callbacks['hide'][i]('hide', item);
                    }
                } 
            });
        },

        _show: function(item, onload) {
            var instance = this;

            // Avoid opening multiple items
            if(instance.opening) return;

            // Hide active item before animation starts
            if(instance.activeItem) {
                instance._hide(instance.activeItem);
            }

            // Start opening state
            instance.opening = true;

            // Expand selected item
            $.Velocity(item.content, { opacity: 1 }, { 
                duration: 0,
                display: 'inline-block',
                complete: function() {
                    // Add active class to title
                    FFAPI.methods.addClass(item.el, FFAPI.plugins.tabs.activeClass);

                    // Add active class to content
                    FFAPI.methods.addClass(item.content, FFAPI.plugins.tabs.activeClass);

                    // Remove display: block
                    item.content.removeAttribute('style');

                    // Set active item
                    instance.activeItem = item;

                    // Opening state finished
                    instance.opening = false;

                    for (var i = 0; i < instance.callbacks['show'].length; i++) {
                        instance.callbacks['show'][i]('show', item);
                    }
                }
            });
        },

        _bindClick: function(item) {

            if(!item.toggleHandler) {
                item.toggleHandler = this._toggle.bind(this, item);
            }

            if(document.addEventListener) {
                item.el.addEventListener('click', item.toggleHandler);
            } else {
                item.el.attachEvent('onclick', item.toggleHandler);
            }
        },

        _unbindClick: function(item) {

            if(document.removeEventListener) {
                item.el.removeEventListener('click', item.toggleHandler);
            } else {
                item.el.detachEvent('onclick', item.toggleHandler);
            }
        }

    };

} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}/**
 Accordion javaScript file. It contains the functions for control page accordions.
 @class accordion-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive accordions
     */
    FFAPI.plugins.accordion = {

        /**
         * FFAPI Accordion defaultClass. The default class of the accordion
         * <b><i>FFAPI.plugins.accordion.defaultClass = 'accordion';<br /></i></b>
         * @property FFAPI.plugins.accordion.defaultClass
         * @type String
         */
        defaultClass: 'accordion',

        /**
         * FFAPI Accordion defaultClass. The default class of the accordion
         * <b><i>FFAPI.plugins.accordion.defaultClass = 'accordion';<br /></i></b>
         * @property FFAPIs.accordion.defaultClass
         * @type String
         */
        processedClass: 'js-accordion',

        /**
         * FFAPI Accordion itemClass. The item class of the accordion
         * <b><i>FFAPI.plugins.accordion.itemClass = 'accordion-title';<br /></i></b>
         * @property FFAPI.plugins.accordion.itemClass
         * @type String
         */
        itemClass: 'accordion-item',

        /**
         * FFAPI Accordion itemActiveClass. The active class of the item
         * <b><i>FFAPI.plugins.accordion.itemActiveClass = 'active';<br /></i></b>
         * @property FFAPI.plugins.accordion.itemActiveClass
         * @type String
         */
        itemActiveClass: 'active',

        /**
         * FFAPI Accordion titleClass. The title class of the accordion
         * <b><i>FFAPI.plugins.accordion.titleClass = 'accordion-title';<br /></i></b>
         * @property FFAPI.plugins.accordion.titleClass
         * @type String
         */
        itemTitleClass: 'accordion-title',

        /**
         * FFAPI Accordion contentClass. The content class of the accordion
         * <b><i>FFAPI.plugins.accordion.contentClass = 'accordion-content';<br /></i></b>
         * @property FFAPI.plugins.accordion.contentClass
         * @type String
         */
        itemContentClass: 'accordion-content',

        dataIndex: 'data-index',

        // Accordions list
        list: {
            'xs': [],
            'sm': [],
            'md': [],
            'xl': [],
            'only-xl': []
        },

        // Initialize registered accordions
        init: function () {
            
            if (ffbrowser.isIE8 === false) {

                // Mobile devices - on load check
                FFAPI.plugins.accordion._goneXS();

                // Mobile devices - when something changes
                FFAPI.responsive.mediaQuerieXS.addListener(FFAPI.plugins.accordion._goneXS);

                // Fablet devices - on load check
                FFAPI.plugins.accordion._goneSM();

                // Fablet devices - when something changes
                FFAPI.responsive.mediaQuerieSM.addListener(FFAPI.plugins.accordion._goneSM);

                // Tablet devices - on load check
                FFAPI.plugins.accordion._goneMD();

                // Tablet devices - when something changes
                FFAPI.responsive.mediaQuerieMD.addListener(FFAPI.plugins.accordion._goneMD);

                // Desktop devices - on load check
                FFAPI.plugins.accordion._goneXL();

                // Desktop devices - when something changes
                FFAPI.responsive.goneBigQuerie.addListener(FFAPI.plugins.accordion._goneXL);
            } else {
                // IE8 browser - on load check
                FFAPI.plugins.accordion._goneIE8();
            }

        },

        // Register accordions by a container element
        register: function(container) {

            // Default suffix
            var defaultSuffix = 'xl';

            // Nothing to do here if container not valid
            if(!container) return;

            var accordions = container.getElementsByClassName(FFAPI.plugins.accordion.defaultClass);

            for (var i = 0; i < accordions.length; i++) {

                // Set accordion suffix
                var accordionSuffix = FFAPI.plugins.accordion._suffix(accordions[i].className);
                if(!accordionSuffix) accordionSuffix = defaultSuffix;

                // Tries to bind a new accordion
                FFAPI.plugins.accordion.bind(accordions[i], accordionSuffix);
            }
        },

        get: function(element) {

            // If element invalid
            if(!element) return null;

            var suffix = FFAPI.plugins.accordion._suffix(element.className);
            if(suffix && FFAPI.plugins.accordion.list.hasOwnProperty(suffix) && FFAPI.plugins.accordion._processed(element)) {
                if(element.hasAttribute(FFAPI.plugins.accordion.dataIndex)) {
                    return FFAPI.plugins.accordion.list[suffix][parseInt(element.getAttribute(FFAPI.plugins.accordion.dataIndex))];
                }
            }

            return null;

        },

        bind: function(element, suffix) {
            // Check if element processed
            if(!FFAPI.plugins.accordion._processed(element)) {

                // Add index attribute to accordion
                element.setAttribute(FFAPI.plugins.accordion.dataIndex, FFAPI.plugins.accordion.list[suffix].length);

                // Push new accordion
                FFAPI.plugins.accordion.list[suffix].push(new Accordion(element));
            }
        },

        _processed: function(element) {
            return FFAPI.methods.hasClass(element, FFAPI.plugins.accordion.processedClass);
        },

        _suffix: function(className) {
            // Detect suffix
            var matches = className.match(""+FFAPI.plugins.accordion.defaultClass+"-[a-z\-]+");
            if(matches) {
                return matches[0].replace(FFAPI.plugins.accordion.defaultClass + '-', '');
            }

            return null;
        },

        // When IE8 Browser
        _goneIE8: function () {

            // Build 'xl' accordions
            FFAPI.plugins.accordion._build('xl');
            FFAPI.plugins.accordion._destroy('md');
            FFAPI.plugins.accordion._destroy('sm');
            FFAPI.plugins.accordion._destroy('xs');
            FFAPI.plugins.accordion._build('only-xl');

        },

        // When Desktop
        _goneXL: function() {

            if (FFAPI.responsive.goneBigQuerie.matches) {
                
                // Build 'xl' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._destroy('md');
                FFAPI.plugins.accordion._destroy('sm');
                FFAPI.plugins.accordion._destroy('xs');
                FFAPI.plugins.accordion._build('only-xl');

            }

        },

        // When Tablet
        _goneMD: function() {

            if (FFAPI.responsive.mediaQuerieMD.matches) {
                
                // Build 'md' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._build('md');
                FFAPI.plugins.accordion._destroy('sm');
                FFAPI.plugins.accordion._destroy('xs');
                FFAPI.plugins.accordion._destroy('only-xl');

            }

        },

        // When Fablet
        _goneSM: function() {

            if (FFAPI.responsive.mediaQuerieSM.matches) {
                
                // Build 'sm' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._build('md');
                FFAPI.plugins.accordion._build('sm');
                FFAPI.plugins.accordion._destroy('xs');
                FFAPI.plugins.accordion._destroy('only-xl');

            }

        },

        // When Mobile
        _goneXS: function() {

            if (FFAPI.responsive.mediaQuerieXS.matches) {
                
                // Build 'xs' accordions
                FFAPI.plugins.accordion._build('xl');
                FFAPI.plugins.accordion._build('md');
                FFAPI.plugins.accordion._build('sm');
                FFAPI.plugins.accordion._build('xs');
                FFAPI.plugins.accordion._destroy('only-xl');

            }

        },

        // Build all accordions of a given suffix
        _build: function(suffix) {

            // Build 'suffix' accordions
            for (var i = 0; i < FFAPI.plugins.accordion.list[suffix].length; i++) {
                FFAPI.plugins.accordion.list[suffix][i].build();
            }

        },

        // Destroy all accordions of a given suffix
        _destroy: function(suffix) {

            // Destroy 'suffix' accordions
            for (var i = 0; i < FFAPI.plugins.accordion.list[suffix].length; i++) {
                FFAPI.plugins.accordion.list[suffix][i].destroy();
            }

        }
    };

    /**
     * [Accordion] In order we have a single accordion plugin for our website, we've developed this one that makes all possible combinations in one.
     * @param {[type]} element              [the accordion element]
     */
    function Accordion(element) {

        // Accordion element
        this.el = element;

        // Active item
        this.activeItem = null;
        
        // Accordion items
        this.items = [];

        // Collapse active item
        this.collapseActiveItem = (this.el.getAttribute('data-collapse') == 'false' ? false : true);

        // Built flag
        this.built = false;

        // Opening state
        this.opening = false;

        // Process accordion items
        this._processItems();

        // Add processed class to accordion
        FFAPI.methods.addClass(this.el, FFAPI.plugins.accordion.processedClass);

        return this;
    }

    /**
     * Accordion public methods
     * 
     */
     Accordion.prototype = {

        toggle: function(idx) {
            if(idx >= this.items.length) return;

            this._toggle(this.items[idx]);
        },

        slideUp: function(idx) {
            if(idx >= this.items.length) return;

            this._slideUp(this.items[idx]);
        },

        slideDown: function(el) {
            if(!el || !el.hasAttribute(FFAPI.plugins.accordion.dataIndex)) return;

            // Tries to parse index attribute
            var idx = parseInt(el.getAttribute(FFAPI.plugins.accordion.dataIndex));
            if(idx >= this.items.length) return;

            this._slideDown(this.items[idx]);
        },

        bindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._bindClick(this.items[idx]);
        },

        build: function() {

            if(this.built) return;

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Bind click event
                this._bindClick(this.items[i]);
            }

            this.built = true;

        },

        unbindClick: function(idx) {
            if(idx >= this.items.length) return;

            this._unbindClick(this.items[idx]);
        },

        destroy: function() {

            if(!this.built) return;

            // Slide up active item
            if(this.activeItem) {
                this._slideUp(this.activeItem);
            }

            // Loop through items
            for (var i = 0; i < this.items.length; i++) {

                // Unbind click event
                this._unbindClick(this.items[i]);
            }

            this.built = false;

        },

        _processItems: function() {
            var items = this.el.getElementsByClassName(FFAPI.plugins.accordion.itemClass);

            // Loop through items
            for (var i = 0; i < items.length; i++) {

                var item = {
                    el: items[i],
                    idx: i,
                    title: items[i].getElementsByClassName(FFAPI.plugins.accordion.itemTitleClass),
                    content: items[i].getElementsByClassName(FFAPI.plugins.accordion.itemContentClass)[0]
                };

                // Add index attribute
                item.el.setAttribute(FFAPI.plugins.accordion.dataIndex, i);

                // Push item to items array
                this.items.push(item);

                if(item.el.getAttribute('data-active')) {
                    this._slideDown(item, true);
                }
            }
        },

        _toggle: function(item) {
            if(FFAPI.methods.hasClass(item.el, FFAPI.plugins.accordion.itemActiveClass)) {
                this._slideUp(item);
            } else {
                this._slideDown(item);
            }

        },

        _slideUp: function(item) {
            var instance = this;

            $.Velocity(item.content, 'slideUp', { 
                duration: 400,
                display: 'none',
                complete: function() {
                    // Remove active class
                    FFAPI.methods.removeClass(item.el, FFAPI.plugins.accordion.itemActiveClass);

                    // Remove display: none
                    item.content.removeAttribute('style');
                } 
            });

            if(this.activeItem && item.idx == this.activeItem.idx) {
                this.activeItem = null;
            }
        },

        _slideDown: function(item, onload) {
            var instance = this;

            // Avoid opening multiple items when accordion collapse active item
            if(instance.collapseActiveItem && instance.opening) return;

            // Collapse active item before animation starts
            if(instance.collapseActiveItem && instance.activeItem) {
                instance._slideUp(instance.activeItem);
            }

            // Start opening state
            instance.opening = true;

            // Expand selected item
            $.Velocity(item.content, 'slideDown', { 
                duration: 400,
                display: 'inline-block',
                complete: function() {
                    // Add active class to item element
                    FFAPI.methods.addClass(item.el, FFAPI.plugins.accordion.itemActiveClass);

                    // Remove display: block
                    item.content.removeAttribute('style');

                    // Scroll plugin is active?
                    // Lets animate window when item title is above header
                    if(!onload && instance.collapseActiveItem && FFAPI.plugins.scroll && FFAPI.plugins.scroll._top(item.title[0]) < FFAPI.plugins.scroll.headerOffset) {
                        FFAPI.plugins.scroll.to(item.title[0], 0);
                    }

                    // Set active item
                    instance.activeItem = item;

                    // Opening state finished
                    instance.opening = false;
                }
            });
        },

        _bindClick: function(item) {
            var instance = this;

            if(!item.toggleHandler) {
                item.toggleHandler = this._toggle.bind(this, item);
            }

            if(document.addEventListener) {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].addEventListener('click', item.toggleHandler);
                }
            } else {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].attachEvent('onclick', item.toggleHandler);
                }
            }
        },

        _unbindClick: function(item) {
            var instance = this;

            if(document.removeEventListener) {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].removeEventListener('click', item.toggleHandler);
                }
            } else {
                for (var i = 0; i < item.title.length; i++) {
                    item.title[i].detachEvent('onclick', item.toggleHandler);
                }
            }
        }

    };

} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}/**
 Chooser javaScript file. It contains the functions for control page choosers.
 @class chooser-1.0.0.js
 **/

 try {

    FFAPI.plugins = FFAPI.plugins || {};

    /**
     * Global methods to register and control responsive choosers
     */
    FFAPI.plugins.chooser = {

        win: typeof window != 'undefined' && window,
        doc: typeof document != 'undefined' && document,

        /**
         * Default class of the target element
         * @type {String}
         */
        selectClass: 'chooser-select',

        /**
         * Class to append to a processed item
         * @type {String}
         */
        processedClass: 'js-chooser',

        /**
         * Class of the chooser container
         * @type {String}
         */
        chooserClass: 'chooser',

        /**
         * Class of the chooser container
         * @type {String}
         */
        chooserOpenClass: 'chooser-open',

        /**
         * Class of the placeholder
         * @type {String}
         */
        placeholderClass: 'chooser-placeholder',

        /**
         * Class of the chooser container
         * @type {String}
         */
        contentClass: 'chooser-content',

        /**
         * Class of the list container
         * @type {String}
         */
        listClass: 'chooser-list',

        /**
         * Class of the chooser search container
         * @type {String}
         */
        searchClass: 'chooser-search',

        /**
         * Class of the chooser search input
         * @type {String}
         */
        searchInputClass: 'chooser-search-input input_black',

        /**
         * Class of the no results element
         * @type {String}
         */
        noResultsClass: 'chooser-no-results hide',

        /**
         * Class of the list item
         * @type {String}
         */
        itemClass: 'chooser-item',

        /**
         * Class of the list item selected
         * @type {String}
         */
        itemSelectedClass: 'chooser-item-selected',

        dataPlaceholder: 'data-placeholder',

        dataSearch: 'data-search',

        dataTpl: 'data-tpl',

        dataItemIndex: 'data-item-index',

        dataIndex: 'data-index',

        noResultsText: 'No results match "%s"',

        /**
         * Glyph HTML to append to the placeholder
         * @type {String}
         */
        placeholderTpl: '<span></span><span class="glyphs icon-down"></span>',

        threshold: 34,

        list: [],

        // Initialize registered choosers
        init: function () {

            this.docElem = this.doc && this.doc.documentElement;
            
            var choosers = document.getElementsByClassName(this.selectClass);

            for (var i = 0; i < choosers.length; i++) {
                // Tries to bind a new chooser
                this.bind(choosers[i]);
            }

        },

        get: function(element) {

            // If element invalid
            if(!element) return null;

            if(FFAPI.plugins.chooser._processed(element)) {
                if(element.hasAttribute(this.dataIndex)) {
                    return this.list[parseInt(element.getAttribute(this.dataIndex))];
                }
            }

            return null;

        },

        bind: function(element) {
            // Check if element processed
            if(!this._processed(element)) {

                // Add index attribute to chooser
                element.setAttribute(this.dataIndex, this.list.length);

                // Push new chooser
                FFAPI.plugins.chooser.list.push(new Chooser(element));
            }
        },

        _processed: function(element) {
            return FFAPI.methods.hasClass(element, this.processedClass);
        },

        rectangle: function (el) {
            el = el && !el.nodeType ? el[0] : el;
            if (!el || 1 !== el.nodeType) return false;
            var rect = el.getBoundingClientRect();
            var t = rect['top'] + this.scrolly();
            var b = t + rect['height'];
            return { t: t, b: b };
        },

        viewport: function () {
            return { t: FFAPI.plugins.chooser.vt(), b: FFAPI.plugins.chooser.vb(), th: FFAPI.plugins.chooser.threshold };
        },

        vb: function () {
            return (Math.max(this.docElem['clientHeight'], this.win['innerHeight'] || 0) + this.scrolly());
        },

        vt: function () {
            return this.win.pageYOffset || this.docElem.scrollTop;
        },

        scrolly: function () {
            return this.win.pageYOffset || this.docElem.scrollTop;
        }
    };

    /**
     * [Chooser] In order we have a single chooser plugin for our website, we've developed this one that makes all possible combinations in one.
     * @param {[type]} element              [the chooser element]
     */
    function Chooser(select) {

        // Select element
        this.select = select;

        // Default size
        this.size = 10;

        // Chooser element
        this.chooser = null;

        // Placeholder
        this.placeholder = null;

        // Chooser container
        this.content = null;

        // Chooser list
        this.list = null;

        // Chooser list max-height
        this.listHeight = 0;

        // Items array
        this.items = [];

        // Item HTML template
        this.tpl = null;

        // Selected item
        this.itemSelected = null;

        // Open state
        this.opened = false;

        // Orientation
        this.orientation = 'down';

        // Initialize chooser
        this.layout();

        // Add processed class to chooser
        FFAPI.methods.addClass(this.select, FFAPI.plugins.chooser.processedClass);

        return this;
    }

    /**
     * Chooser public methods
     * 
     */
     Chooser.prototype = {

        layout: function() {
            // Transform select
            this.transform();

            // Bind events
            this.bindEvents();
        },

        transform: function() {

            // Create placeholder
            this.placeholder = document.createElement('SPAN');
            FFAPI.methods.addClass(this.placeholder, FFAPI.plugins.chooser.placeholderClass);
            this.placeholder.innerHTML = FFAPI.plugins.chooser.placeholderTpl;
            this.setPlaceholder();

            // Create content element
            this.content = document.createElement('DIV');
            FFAPI.methods.addClass(this.content, FFAPI.plugins.chooser.contentClass);

            // Create list container
            this.list = document.createElement('UL');
            FFAPI.methods.addClass(this.list, FFAPI.plugins.chooser.listClass);

            // Set search
            this.setSearch();

            // Set template
            this.setTemplate();

            var opts = this.select.options;
            for (var i = 0; i < opts.length; i++) {
                var classes = opts[i].getAttribute('class');

                // Create item
                var li = document.createElement('LI');
                FFAPI.methods.addClass(li, FFAPI.plugins.chooser.itemClass);

                // Copy classes
                if(classes) {
                    FFAPI.methods.addClass(li, classes);
                }

                // Fill element
                li.setAttribute(FFAPI.plugins.chooser.dataItemIndex, opts[i].index);
                this.parseTpl(li, opts[i].text, opts[i].getAttribute(FFAPI.plugins.chooser.dataTpl));

                // Append to content
                this.list.appendChild(li);

                // Push new item to array
                this.items.push(li);

                // Selected option?
                if(opts[i].getAttribute('selected')) {
                    this.setSelected(li);
                }
            }

            // Append list to container
            this.content.appendChild(this.list);

            // Create chooser
            this.chooser = document.createElement('DIV');
            FFAPI.methods.addClass(this.chooser, FFAPI.plugins.chooser.chooserClass);

            // Append placeholder and items container
            this.chooser.appendChild(this.placeholder);
            this.chooser.appendChild(this.content);

            // Insert chooser after select element
            this.insertAfter(this.chooser, this.select);

            // Hide select element
            this.select.style.display = 'none';

            // Set size of dropdown
            this.setSize();

            // Set orientation
            this.setOrientation();
        },

        bindEvents: function() {
            var self = this;

            this.placeholder.onmousedown = this.toggle.bind(this);

            for (var i = 0; i < this.items.length; i++) {
                FFAPI.methods.on(this.items[i], 'click', function() {
                    if(self.opened) {
                        self.setSelected(this);
                        self.close();
                    }
                }, false);
            }

            FFAPI.methods.on(document, 'click', function(e) {
                if(!self.opened) {
                    return;
                }
                for (var el = e.target; el; el = el.parentNode) {
                    if (el == self.chooser) {
                        return;
                    }
                }
                self.close();
            }, false);

            if(this.search) {
                this.searchInput.onkeyup = this.filter.bind(this);
            }
        },

        setSelected: function(item) {
            if(this.itemSelected) {
                // Remove class from active item
                FFAPI.methods.removeClass(this.itemSelected, FFAPI.plugins.chooser.itemSelectedClass);
            }

            // Set option selected
            this.select.selectedIndex = parseInt(item.getAttribute(FFAPI.plugins.chooser.dataItemIndex));

            // Change placeholder text
            this.setPlaceholder(item.innerHTML);
            
            // Add class to selected item
            FFAPI.methods.addClass(item, FFAPI.plugins.chooser.itemSelectedClass);

            // Clear search input
            if(this.search && this.searchInput.value !== '') {
                this.searchInput.value = '';
                this.filter();
            }

            // Set active item
            this.itemSelected = item;
        },

        filter: function() {
            var term = this.searchInput.value.toLowerCase();

            FFAPI.methods.addClass(this.noResults, 'hide');

            var hidden = 0;
            for (var i = 0; i < this.items.length; i++) {
                var str = this.items[i].textContent.toLowerCase();
                if(str.indexOf(term) > -1) {
                    FFAPI.methods.removeClass(this.items[i], 'hide');
                } else {
                    FFAPI.methods.addClass(this.items[i], 'hide');
                    hidden++;
                }
            }

            if(hidden == this.items.length) {
                this.noResults.textContent = FFAPI.plugins.chooser.noResultsText.replace('%s', term);
                FFAPI.methods.removeClass(this.noResults, 'hide');
            }
        },

        toggle: function() {
            this.opened ? this.close() : this.open();
        },

        open: function() {
            var self = this;

            this.checkOrientation();

            $.Velocity(self.content, 'slideDown', { 
                duration: 400,
                display: 'block',
                complete: function() {
                    if(self.search) {
                        self.searchInput.focus();
                    }

                    // Add opened class
                    FFAPI.methods.addClass(self.chooser, FFAPI.plugins.chooser.chooserOpenClass);

                    // Remove inline styles
                    self.content.removeAttribute('style');

                    self.opened = true;
                } 
            });
        },

        close: function() {
            var self = this;
            $.Velocity(self.content, 'slideUp', { 
                duration: 400,
                display: 'none',
                complete: function() {
                    // Add opened class
                    FFAPI.methods.removeClass(self.chooser, FFAPI.plugins.chooser.chooserOpenClass);

                    // Remove inline styles
                    self.content.removeAttribute('style');

                    self.opened = false;
                } 
            });
        },

        checkOrientation: function() {
            FFAPI.methods.removeClass(this.chooser, FFAPI.plugins.chooser.chooserClass + '-up');
            switch(this.orientation) {
                case 'auto':
                    var v = FFAPI.plugins.chooser.viewport();
                    var e = FFAPI.plugins.chooser.rectangle(this.chooser);
                    if(v.b - v.th < e.b + this.listHeight) {
                        if(e.t - v.t + v.th > v.b - v.th - e.b) {
                            FFAPI.methods.addClass(this.chooser, FFAPI.plugins.chooser.chooserClass + '-up');
                        }
                    }
                    break;
                case 'up':
                    FFAPI.methods.addClass(this.chooser, FFAPI.plugins.chooser.chooserClass + '-' + this.orientation);
                    break;
            }
        },

        parseTpl: function(item, optText, data) {
            if(data) {
                var parsed = JSON.parse(data);
                var itemTpl = null;
                for(var key in parsed) {
                    itemTpl = (itemTpl ? itemTpl : this.tpl).replace('%' + key + '%', parsed[key]);
                }
                item.innerHTML = itemTpl;
            } else {
                item.innerHTML = optText;
            }
        },

        setTemplate: function() {
            var tplAttr = this.select.getAttribute(FFAPI.plugins.chooser.dataTpl);
            if(!tplAttr || tplAttr === '') {
                return;
            }

            var tags = JSON.parse(tplAttr);
            if(tags instanceof Array) {
                var parent = document.createElement('DIV');
                for (var i = 0; i < tags.length; i++) {
                    var el = document.createElement(tags[i].tag.toUpperCase());
                    if(tags[i].attr) {
                        for(var attr in tags[i].attr) {
                            el.setAttribute(attr, tags[i].attr[attr]);
                        }
                    }

                    if(tags[i].text) {
                        el.textContent = tags[i].text;
                    }

                    parent.appendChild(el);
                }
                this.tpl = parent.innerHTML;
            }
        },

        setSearch: function() {
            var search = this.select.getAttribute(FFAPI.plugins.chooser.dataSearch);
            if(search === 'true') {
                // Create search container
                this.search = document.createElement('DIV');
                FFAPI.methods.addClass(this.search, FFAPI.plugins.chooser.searchClass);

                // Create search input
                this.searchInput = document.createElement('INPUT');
                this.searchInput.type = 'text';
                FFAPI.methods.addClass(this.searchInput, FFAPI.plugins.chooser.searchInputClass);

                this.search.appendChild(this.searchInput);
                this.content.appendChild(this.search);

                // Create no results
                this.noResults = document.createElement('LI');
                FFAPI.methods.addClass(this.noResults, FFAPI.plugins.chooser.noResultsClass);

                this.list.appendChild(this.noResults);
            }
        },

        setPlaceholder: function(html) {
            this.placeholder.childNodes[0].innerHTML = html || this.select.getAttribute(FFAPI.plugins.chooser.dataPlaceholder);
        },

        setSize: function() {
            var sizeAttr = this.select.getAttribute('size');
            if(sizeAttr && parseInt(sizeAttr) < this.size) {
                this.size = parseInt(sizeAttr);
            }

            // Set styles to accurate items height
            this.content.style.position = 'absolute';
            this.content.style.visibility = 'hidden';
            this.content.style.display = 'block';

            var height = 0;
            for (var i = 0; i < this.size; i++) {
                height += this.items[i].offsetHeight;
            }

            // Remove inline styles
            this.content.removeAttribute('style');

            // Set max-height of the list container
            this.listHeight = height;
            this.list.style.maxHeight = height + 'px';
        },

        setOrientation: function() {
            var orAttr = this.select.getAttribute('data-orientation');
            if(orAttr) {
                this.orientation = orAttr;
            }
        },

        insertAfter: function(node, ref) {
            ref.parentNode.insertBefore(node, ref.nextSibling);
        }
    };

} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}//DEBUG TOOL FOR SUBFOLDERS VERSION
//Inject on URL metatag_debug for Metatags
//Inject on URL subfolder_debug for Subfolders Links
$(function () {

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    if (document.location.href.indexOf("ff_debug") > 0 || getCookie("ff_debug") == 1) {
        //document.cookie = "ff_debug=1;path=/";

        var containerStyle =
            "<style>" +                
            "   #ffDebuggerWrapper {" +
            "       padding: 0;" +
            "       margin: 0;" +
            "       position: fixed;" +
            "       right: 0;" +
            "       top: 0;" +
            "       bottom: 0;" +
            "       width: 300px;" +
            "       z-index: 99999;" +
            "       background: #F0F0F0;" +
            "       border-left: 2px solid grey;" +
            "   }" +
            "   #ffDebuggerHeader {" +
            "       position: absolute;" +
            "       top: 0;" +
            "       height: 40px;" +
            "       overflow: hidden;" +
            "       background: grey;" +
            "       width: 100%;" +
            "       display: table;" +
            "   }" +
            "       #ffDebuggerHeader a {" +
            "           cursor: pointer;" +
            "           display: table-cell;" +
            "           width: 40px;" +
            "           height: 40px;" +
            "       }" +
            "       #ffDebuggerHeader a:hover {" +
            "               background: #ddd;" +
            "       }" +
            "           #ffDebuggerHeader a div {" +
            "               background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIjSURBVHja7JfPS1VREMc/n+vrB2qilOQiEjfu+rHSok21CgokaBvtiv6GNm4CadXKVaGrFkFgENHGNKlFi8BAA4PSVxCFtbOIQqaF54E9rvrS63sEDgz33nPmnPmemfnO4RIR5Grf4VEgNqNr7pmjGXnS3z0KXKEOUqpy3A7crpfzvwGsOJ8EjlFHyRrpfAVAf/dxYLoRzgFKdxaXhtqasnlgPmd+crsBmKiTKxFhfWqggbIDoOEA1i1C4EyN+yxExMJmQUQBOvgvF9DGl9FOEf6PANRqHciy7F6WZa1Zlj1U+3NsiitCYBdwCtgLNKvv1DJwVP2tjifWdQAn0vuGNDxdYwDKQJc6FREX1WlgDmgGvgOtajkieiPiqjoUEUeA+dK6/Ix4Vmv4gd4Uhc6I6FCb0wFb016dEbEP6AJaErj1U1Arl5P0qEvqG/W+Gjk6on5WF1IqCgWAOqD+WMN5Rb+oJ7eDBe3AU2BmA9MXwIzaVlgE1EF1Qf2qLq867SdgMKWmMvYr2b0Frm8ZQDr9slpWZ6vCPZXm31eNv1K/qYtbTkECkUXEcETcrW50akvOmpvAGHCgVFAJjAETQE+N9h+Bx4m2hbFgv/qyKtTP1ZacFDyq/BQVyYJrQF9EDAMf0vDu1Iz2pO/XETECnAcuFX0bHkzPGxFxDhhX59Sf6izwICIuALeSXWfRjegy8KTSelNUmrIsQ11da4fUCeAswJ8BAPKiDYyty2jDAAAAAElFTkSuQmCC) no-repeat center;" +
            "               width: 40px;" +
            "               height: 40px;" +
            "           }" +
            "       #ffDebuggerHeader h2 {" +
            "           display: table-cell;" +
            "           line-height: 40px;" +
            "           vertical-align: middle;" +
            "           text-align: center;" +
            "       }" +
            "   #ffDebuggerTypeDrop {" +
            "       width: 100%;" +
            "       padding: 5px;" +
            "       font-weight: bold;" +
            "       position: absolute;" +
            "       top: 40px;" +
            "   }" +
            "   #ffDebuggerBody {" +
            "       position: absolute;" +
            "       top: 74px;" +
            "       bottom: 0;" +
            "       overflow: auto;" +
            "       width: 100%;" +
            "   }" +
            "   #ffDebuggerBody .ffDebuggerBodyContainer {" +
            "       padding: 5px;" +
            "   }" +

            " #ffDebuggerBody input{" +
                "-webkit-appearance: checkbox;" +
            "}" +
            //Hidden mode
            "   #ffDebuggerWrapper.ffDebuggerHidden {" +
            "       width: 40px;" +
            "       height: 40px;" +
            "       border: none;" +
            "   }" +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerBody," +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerTypeDrop," +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerHeader h2 {" +
            "       display: none;" +
            "   }" +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerHeader a {" +
            "           background: #F0F0F0;" +
            "   }" +
            "   #ffDebuggerWrapper.ffDebuggerHidden #ffDebuggerHeader a:hover {" +
            "           background: #ddd;" +
            "   }" +
            "</style>";
        var containerHtml =
            "<div id='ffDebuggerWrapper' " + (getCookie("ff_debug_open") == 1 ? "" : "class='ffDebuggerHidden'") + ">" +
            "   <div id='ffDebuggerHeader'>" +
            "       <h2>Farfetch Debugger</h2>" +
            "       <a href='javascript:document.ff_debug.toogle();'>" +
            "           <div></div>" +
            "       </a>" +
            "   </div>" +
            "   <select id='ffDebuggerTypeDrop'></select>" +
            "   <div id='ffDebuggerBody'>" +
            "   </div>" +
            "</div>";

        document.ff_debug = {
            wrapper: $(containerHtml),
            toogle: function () {
                if (document.ff_debug.wrapper.hasClass("ffDebuggerHidden")) {
                    document.ff_debug.wrapper.removeClass('ffDebuggerHidden');
                    document.cookie = "ff_debug_open=1;path=/";
                } else {
                    document.ff_debug.wrapper.addClass('ffDebuggerHidden');
                    document.cookie = "ff_debug_open=0;path=/";
                }
            },
            translations: {
                toggleHighlight: function () {
                    if ($(this).is(':checked')) {
                        $('body').highlight('NO_TRAD');
                        $('[value*=NO_TRAD],[placeholder*=NO_TRAD],[text*=NO_TRAD]').css('border', '2px solid red');
                    }
                    else {

                        $('body').removeHighlight('NO_TRAD');
                        $('[value*=NO_TRAD],[placeholder*=NO_TRAD],[text*=NO_TRAD]').css('border', 'none');
                    }
                }
            },
            clickstream: {
                toggleTracking: function () {
                    if ($(this).is(':checked')) {
                        $("[trk]").each(function () {
                            $(this).css('color', 'orange');
                            $(this).attr('alt', $(this).attr('trk'));
                            $(this).attr('title', $(this).attr('trk'));
                        });
                    } else {
                        $("[trk]").each(function () {
                            $(this).css('color', 'black');
                            $(this).attr('alt', '');
                            $(this).attr('title', '');
                        });
                    }
                }
            },
            flatContent: {
                toggleTracking: function () {
                    if ($(this).is(':checked')) {
                        $("[data-flat]").each(function () {
                            $(this).css('border', '2px solid red');
                            $(this).attr('alt', $(this).attr('data-flat'));
                            $(this).attr('title', $(this).attr('data-flat'));
                        });
                    } else {
                        $("[data-flat]").each(function () {
                            $(this).css('border', 'none');
                            $(this).attr('alt', '');
                            $(this).attr('title', '');
                        });
                    }
                },
                flatIdentityOn: function() {
                    var flatId = $(this).data("flat-id");
                    $("[data-flat='" + flatId + "']").addClass("identifyOn");
                },
                flatIdentityOff: function () {
                    var flatId = $(this).data("flat-id");
                    $("[data-flat='" + flatId + "']").removeClass("identifyOn");
                }
            }                           
        };
        document.ff_debug.typeDrop = document.ff_debug.wrapper.find("#ffDebuggerTypeDrop");
        document.ff_debug.body = document.ff_debug.wrapper.find("#ffDebuggerBody");
        document.ff_debug.typeDrop.change(function () {
            var $selectedOption = $(this).find("option:selected");
            $(".ffDebuggerBodyContainer").hide();
            $("#ffDebuggerContainer_" + $selectedOption.val()).show();
            document.cookie = "ff_debug_type=" + $selectedOption.val() + ";path=/";
        });

        document.ff_debug.wrapper.prepend(containerStyle);



        //START - SubFolders
        document.ff_debug.typeDrop.append("<option value='subfolder'>Subfolder</option>");
        var $container = $("<div id='ffDebuggerContainer_subfolder' class='ffDebuggerBodyContainer'>");
        //Universial Variable Status
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Universial Variable Status</h4>");
        $container.append("<p><b>Current Subfolder: </b>" + window.universal_variable.page.subfolder + "</p><hr style='margin: 3px 0;'>");
        $container.append("<p><b>User Subfolder: </b>" + window.universal_variable.page.userSubfolder + "</p><hr style='margin: 3px 0;'>");
        $container.append("<p><b>Geo Subfolder: </b>" + window.universal_variable.page.geoSubfolder + "</p><hr style='margin: 3px 0;'>");
        $container.append("<p><b>Ip: </b>" + window.universal_variable.user.ip + "</p><hr style='margin: 3px 0;'>");
        
        //Links
        var $links = $("a[href]");
        if ($links.length > 0) {
            var $ul,
                $dataIgnoreLinks = [],
                $errorLinks = [],
                $subfolderLinks = [],
                $fullUrlLinks = [],
                $anchorsLinks = [],
                $javascriptLinks = [];

            $container.append("<h4 style='text-align: center; margin: 10px 0;'>Links</h4>");

            $links.sort(function (a, b) {
                return $(a).attr("href") > $(b).attr("href") ? 1 : -1;;
            });

            $links.each(function (index, elem) {
                var $elem = $(elem),
                    elemHref = $elem.attr("href");

                if (elemHref.indexOf(window.universal_variable.page.subfolder) == 0) {//Sulfolder
                    $subfolderLinks.push(elem);
                } else if (elemHref.indexOf('#') == 0 || !elemHref) {//Anchors
                    $anchorsLinks.push(elem);
                } else if (elemHref.indexOf('javascript') == 0) {//Javascript Execution
                    $javascriptLinks.push(elem);
                } else if ($elem.attr("data-ignore")) {//Mark data-ignore
                    $dataIgnoreLinks.push(elem);
                } else if (elemHref.indexOf('http://') == 0 || elemHref.indexOf('https://') == 0) {//Full Url
                    $fullUrlLinks.push(elem);
                } else {//Error
                    $errorLinks.push(elem);
                }
            });

            //Error
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Errors</h5>");
            $ul = $("<ul>");
            if ($errorLinks.length) {
                $.each($errorLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No errors found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Subfolders
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Subfolders</h5>");
            $ul = $("<ul>");
            if ($subfolderLinks.length) {
                $.each($subfolderLinks, function (index, elem) {
                    $ul.append("<li><a href='" + $(elem).attr("href") + "'>" + $(elem).attr("href") + "</a></li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No sulfolder links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //data-ignore
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Data-ignore</h5>");
            $ul = $("<ul>");
            if ($dataIgnoreLinks.length) {
                $.each($dataIgnoreLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No data-ignore links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Full Url
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Full Url</h5>");
            $ul = $("<ul>");
            if ($fullUrlLinks.length) {
                $.each($fullUrlLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No data-ignore links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Anchors
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Anchors</h5>");
            $ul = $("<ul>");
            if ($anchorsLinks.length) {
                $.each($anchorsLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No anchors links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);
            //Javascript Execution
            $container.append("<h5 style='text-align: right; margin: 10px 0;'>Javascript</h5>");
            $ul = $("<ul>");
            if ($javascriptLinks.length) {
                $.each($javascriptLinks, function (index, elem) {
                    $ul.append("<li>" + $(elem).attr("href") + "</li><hr style='margin: 3px 0;'>");
                });
            } else {
                $ul.append("<li><i>No javascript execution links found</i></li><hr style='margin: 3px 0;'>");
            }
            $container.append($ul);




            //$links.each(function (index, elem) {
            //    var $elem = $(elem);
            //    $ul.append("<li><b>Href: </b>" + $elem.attr("href") + "</li><hr style='margin: 3px 0;'>");
            //});
        } else {
            $container.append("<i style='text-align: center;'>No links found on page</i>");
        }
        document.ff_debug.body.append($container);
        //END - SubFolders

        //START - Metatags
        document.ff_debug.typeDrop.append("<option value='metatag'>Metatag</option>");
        $container = $("<div id='ffDebuggerContainer_metatag' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Metatags</h4>");
        var $metaTags = $("meta");
        if ($metaTags.length > 0) {
            $ul = $("<ul>");
            $metaTags.each(function (index, elem) {
                var metaHtml = "<li>";
                $.each(elem.attributes, function (i, tagAttr) {
                    if (tagAttr.specified) {
                        metaHtml += "<b>" + tagAttr.name + ": </b> " + tagAttr.value + ";";
                    }
                });
                metaHtml += "</li><hr style='margin: 3px 0;'>";
                $ul.append(metaHtml);
            });
            $container.append($ul);
        } else {
            $container.append("<i style='text-align: center;'>No metatags found on page</i>");
        }
        document.ff_debug.body.append($container);
        //END - Metatags


        //START - H1
        document.ff_debug.typeDrop.append("<option value='h1'>H1</option>");
        $container = $("<div id='ffDebuggerContainer_h1' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>H1</h4>");
        var $h1 = $("h1");
        if ($h1.length > 0) {
            $ul = $("<ul>");
            $h1.each(function (index, elem) {
                $ul.append("<li>" + $(elem).text() + "</li><hr style='margin: 3px 0;'>");
            });
            $container.append($ul);
        } else {
            $container.append("<i style='text-align: center;'>No h1 found on page</i>");
        }
        document.ff_debug.body.append($container);
        //END - H1

        //START - Translations
        document.ff_debug.typeDrop.append("<option value='Trans'>Translations</option>");
        $container = $("<div id='ffDebuggerContainer_Trans' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Translations</h4>");

        $container.append("<div><input type='checkbox'/> Highlight no Trad</div>");
        $container.find('input[type=checkbox]').change(document.ff_debug.translations.toggleHighlight);

        document.ff_debug.body.append($container);
        //END - Translations

        //START - ClickStream
        document.ff_debug.typeDrop.append("<option value='ClkStream'>ClickStream</option>");
        $container = $("<div id='ffDebuggerContainer_ClkStream' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>ClickStream</h4>");

        $container.append("<div><input type='checkbox'/> Color Clickstream Events</div>");
        $container.find('input[type=checkbox]').change(document.ff_debug.clickstream.toggleTracking);



        document.ff_debug.body.append($container);
        //END - ClickStream
        
        //START - Flat Contents
        document.ff_debug.typeDrop.append("<option value='fltContent'>Flat Contents</option>");
        $container = $("<div id='ffDebuggerContainer_fltContent' class='ffDebuggerBodyContainer' style='display: none;'>");
        $container.append("<h4 style='text-align: center; margin: 10px 0;'>Flat Content</h4><style> .identifyOn{border:2px solid yellow !important;} </style>");

        $container.append("<div><input type='checkbox'/>View Flat Content</div>");       
        $container.find('input[type=checkbox]').change(document.ff_debug.flatContent.toggleTracking);
        
        $("[data-flat]").each(function () {            
            $container.append("<div class='flatId' data-flat-id='" + $(this).attr('data-flat') + "' >" + $(this).attr('data-flat') + "</div>");
            $container.append("</br>");
        });

        $container.find('.flatId').hover(document.ff_debug.flatContent.flatIdentityOn);
        $container.find('.flatId').mouseout(document.ff_debug.flatContent.flatIdentityOff);
        document.ff_debug.body.append($container);
        //END - ClickStream


        document.ff_debug.wrapper.appendTo("body");
        if (getCookie("ff_debug_type")) {
            document.ff_debug.typeDrop.val(getCookie("ff_debug_type")).change();
        }
    }
});/*

highlight v4

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                spannode.style.border = '2px solid red';
                spannode.appendChild(node.cloneNode(true));
                node.parentNode.replaceChild(spannode, node);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function () {
    return this.find("span.highlight").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};FFAPI.notifications = FFAPI.notifications || {};

FFAPI.notifications.errorTemplateUrl = "/static/js/ajax/notifications_error.html";

FFAPI.notifications.init = function () {
    FFAPI.notifications.notifications_container = $('#notifications_container');
}

/**
 * Adds an error message to the current page
 * @method FFAPI.notifications.addErrorMessage
 * @param {String} message - Error message
 * @param {String} errorId - An ID to identify the error (useful when we have multiple notifications, and we want to update/remove a specific error)
 */
FFAPI.notifications.addErrorMessage = function (message, errorId) {
    FFAPI.notifications.setErrorMessage(message, errorId, true);
}

/**
 * Removes a specific error message
 * @method FFAPI.notifications.removeErrorMessage
 * @param {String} errorId - The error message ID
 */
FFAPI.notifications.removeErrorMessage = function (errorId) {
    var container = FFAPI.notifications.notifications_container;
    var errorsListContainer = container.find('.container');
    if (errorsListContainer.length > 0) {
        if (errorId != undefined) {
            errorId = 'errId_' + errorId;
            errorsListContainer.find('.' + errorId).remove();
            var currentErrors = container.find('.field').length;
            if (currentErrors == 0) {
                container.empty();
            }
        }
    }
}

/**
 * Removes all error messages
 * @method FFAPI.notifications.clearErrors
 */
FFAPI.notifications.clearErrors = function () {
    var container = FFAPI.notifications.notifications_container;
    container.empty();
}

/**
 * Sets the error message to the current page 
 * @method FFAPI.notifications.setErrorMessage
 * @param {String} message - Error message
 * @param {String} errorId - An ID to identify the error (useful when we have multiple notifications, and we want to update/remove a specific error)
 * @param {boolean} addNew - If true, a new error message will be added, if false, all error messages will be cleared, and a new one will be displayed
 */
FFAPI.notifications.setErrorMessage = function (message, errorId, addNew) {
    var elem = FFAPI.notifications.notifications_container;
    if (elem.length > 0) {
        $.get(FFAPI.notifications.errorTemplateUrl, function (template) {
            var template = Hogan.compile(template);
            var output = '';
            if (errorId == undefined) {
                output = template.render({ "Message": message });
            }
            else {
                errorId = 'errId_' + errorId;
                output = template.render({ "Message": message, "ErrorId": errorId });
            }

            var container = FFAPI.notifications.notifications_container;
            var currentErrors = container.find('.field').length;
            if (addNew !== true || currentErrors == 0) {
                container.html(output);
            } else {
                var errorsListContainer = container.find('.container');
                if (errorsListContainer.length > 0) {
                    if (errorId != undefined) {
                        errorsListContainer.find('.' + errorId).remove();
                    }
                    $(output).find('.field').appendTo(errorsListContainer);
                }
            }
            $(document).scrollTop(0);
        });
    }
}

FFAPI.notifications.init();
FFAPI = FFAPI || {};
FFAPI.methods = FFAPI.methods || {};
FFAPI.methods.newsletter = FFAPI.methods.newsletter || {};
FFAPI.variables = FFAPI.variables || {};
FFAPI.variables.newsletter = FFAPI.variables.newsletter || {};
FFAPI.variables.newsletter.SelectedDesigners = [];
FFAPI.variables.newsletter.SelectedCategories = [];

FFAPI.methods.newsletter.addDesigner = function (designerId) {
    if (FFAPI.variables.newsletter.SelectedDesigners.indexOf(designerId) == -1) {
        FFAPI.variables.newsletter.SelectedDesigners.push(designerId);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.removeDesigner = function (designerId) {
    var elementPos = FFAPI.variables.newsletter.SelectedDesigners.indexOf(designerId);
    if (elementPos != -1) {
        FFAPI.variables.newsletter.SelectedDesigners.splice(elementPos, 1);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.addCategory = function (catId) {
    if (FFAPI.variables.newsletter.SelectedCategories.indexOf(catId) == -1) {
        FFAPI.variables.newsletter.SelectedCategories.push(catId);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.removeCategory = function (catId) {
    var elementPos = FFAPI.variables.newsletter.SelectedCategories.indexOf(catId);
    if (elementPos != -1) {
        FFAPI.variables.newsletter.SelectedCategories.splice(elementPos, 1);
        return true;
    }
    return false;
}

FFAPI.methods.newsletter.updateSelectedDesignersInput = function () {
    var selectedDesigners = FFAPI.variables.newsletter.SelectedDesigners.join(",");
    FFAPI.variables.newsletter.selectedDesignersElement.val(selectedDesigners);
}

FFAPI.methods.newsletter.updateSelectedCategoriesInput = function () {
    var selectedCategories = FFAPI.variables.newsletter.SelectedCategories.join(",");
    FFAPI.variables.newsletter.selectedCategoriesElement.val(selectedCategories);
}

FFAPI.methods.newsletter.addDesignerTag = function (suggestion) {
    if (FFAPI.methods.newsletter.addDesigner(suggestion.data)) {
        var template = '<div class="float-left pr20" data-id="' + suggestion.data + '"><span class="newsLetterRemoveDesigner singup-delete-icon glyphs icon-close float-left pr10"></span><p class="color-medium-grey float-left">' + suggestion.value + '</p></div>';
        FFAPI.variables.newsletter.newsletterDesignersTagsElement.append(template);
        FFAPI.methods.newsletter.updateSelectedDesignersInput();
    }
};

FFAPI.methods.newsletter.initDesignersSearch = function (genderId, url) {
    require(['root_essentials_plugins'], function () {
        $(document).ready(function () {
            $('#preferedDesigners').autocomplete({
                serviceUrl: url,
                minChars: 3,
                maxHeight: 200,
                appendTo: '#newsletter_suggestions_container',
                width: '100%',
                zIndex: 1,
                params: { genderId: genderId },
                deferRequestBy: 200, //miliseconds
                onSelect: function (suggestion) {
                    FFAPI.methods.newsletter.addDesignerTag(suggestion);
                    $('#preferedDesigners').val('');
                    $('#preferedDesigners').focus();
                },
            });
        });
    });

    FFAPI.variables.bodyElement.on('click', '.newsLetterRemoveDesigner', function () {
        var jQThis = $(this).parent();
        var designerId = jQThis.data('id');
        FFAPI.methods.newsletter.removeDesigner(designerId);
        FFAPI.methods.newsletter.updateSelectedDesignersInput();
        jQThis.remove();
    });
}

FFAPI.methods.newsletter.initNewsletter = function (genderId, url) {
    FFAPI.methods.newsletter.disableSubmitOnEnterPreferedDesigners();
    // Initialize variables
    FFAPI.variables.newsletter.selectedCategoriesElement = $('#selectedCategories');
    FFAPI.variables.newsletter.selectedDesignersElement = $('#selectedDesigners');
    FFAPI.variables.newsletter.newsletterDesignersTagsElement = $('#newsletterDesignersTags');

    FFAPI.methods.newsletter.initDesignersSearch(genderId, url);

    // Initialize bindings
    $('#btnNewsletterPrefSubmit').on('click', function () {
        $('input[type=checkbox]:checked').each(function () {
            var categoryId = $(this).val();
            FFAPI.methods.newsletter.addCategory(categoryId);
        });
        FFAPI.methods.newsletter.updateSelectedCategoriesInput();
        $('.signup_news_modal').trigger('click.dismiss.bs.modal');
    });

    $("#CountryList").chosen().bind("change", function () {
        $('#SelectedCountry').val($(this).val());
    });
}

FFAPI.methods.newsletter.initPreferencesPopup = function (genderId, url) {
    FFAPI.methods.newsletter.disableSubmitOnEnterPreferedDesigners();
    // Initialize variables
    FFAPI.variables.newsletter.selectedCategoriesElement = $('#selectedCategories');
    FFAPI.variables.newsletter.selectedDesignersElement = $('#selectedDesigners');
    FFAPI.variables.newsletter.newsletterDesignersTagsElement = $('#newsletterDesignersTags');

    // Initialize plugins
    $('.label-check, .label-radio').checkradio();
    FFAPI.plugins.methods.initJQueryDropdowns($(document));
    $.validator.unobtrusive.parse(document);
    FFAPI.methods.newsletter.initDesignersSearch(genderId, url);

    // Initialize bindings
    $('#btnNewsletterPrefSubmit').on('click', function () {
        $('input[type=checkbox]:checked').each(function () {
            var categoryId = $(this).val();
            FFAPI.methods.newsletter.addCategory(categoryId);
        });
        FFAPI.methods.newsletter.updateSelectedCategoriesInput();
        $('.signup_news_modal').trigger('click.dismiss.bs.modal');
    });

};

FFAPI.methods.newsletter.showThankYouPopup = function () {
    $('#signup_thankyou_modal').modal();
    $(document).trigger('subscribedEmail');
    window.setTimeout(function () {
        window.location = '/';
    }, 3000);
    $('#signup_thankyou_modal').on('click.dismiss.bs.modal', function () {
        window.location = '/';
    });
}

$('.icon-close').on('click', function () {
    $(this).closest('.info').slideUp();
});

FFAPI.methods.newsletter.disableSubmitOnEnterPreferedDesigners = function () {
    document.getElementById('preferedDesigners').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
};

$("body").on("click", ".editorial-backTop a", function (e) {
    e.preventDefault();
    $(document).scrollTop(0);
});try {


    require(['loads'], function () {
        require(['essentials'], function () {
            $(document).ready(function ($) {
                if (document.getElementsByClassName('animation-br-one') && document.getElementsByClassName('animation-br-one')[1]) {
                    /*Newsletter BR animation variables*/
                    FFAPI.variables.animationBanner = document.getElementsByClassName('animation-br-one');
                    FFAPI.variables.animationBannerLength = FFAPI.variables.animationBanner.length;
                    FFAPI.variables.animationBannerAux = 0;
                    FFAPI.variables.intervalAnimated = '';
                    FFAPI.variables.animationBannerNewsletterClose = document.getElementsByClassName('newsletter-close');

                    //Close function for the x on the newsletter
                    FFAPI.methods.animationBannerNewsletterClose = function () {
                        ///Fade in this element and add the zIndex to the animated banner 0
                        FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0], 0);
                        FFAPI.variables.animationBanner[0].style.zIndex = 10;
                        FFAPI.variables.animationBanner[1].style.zIndex = 1;
                        FFAPI.variables.animationBanner[1].style.display = 'none';
                        FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                        ///Clear the interval function
                        window.clearInterval(FFAPI.variables.intervalAnimated);
                        /// Create a cookie so we know to don't shpw it again
                        FFAPI.methods.createCookieNewsletter('newsletterbrcookie', 'visible', 7000);
                        FFAPI.variables.readCookieNewsletterBr = FFAPI.methods.readCookie('newsletterbrcookie');
                    };

                    /**
                     * Animation Banner function to fade in between elements.
                     */
                    FFAPI.methods.animationBanner = function () {
                        if (FFAPI.variables.animationBanner.length === 1) {
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0]);
                            FFAPI.variables.animationBanner[0].style.zIndex = 10;
                            return;
                        }
                        if (FFAPI.variables.animationBannerAux === 0) {
                            FFAPI.methods.fadeOut(FFAPI.variables.animationBanner[0]);
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[1]);
                            FFAPI.variables.animationBanner[0].style.zIndex = 1;
                            FFAPI.variables.animationBanner[1].style.zIndex = 10;
                            FFAPI.variables.animationBannerAux = 1;
                            ///Clear the interval function
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(5000);

                        } else {
                            FFAPI.methods.fadeOut(FFAPI.variables.animationBanner[1]);
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0]);
                            FFAPI.variables.animationBanner[1].style.zIndex = 1;
                            FFAPI.variables.animationBanner[0].style.zIndex = 10;
                            FFAPI.variables.animationBannerAux = 0;
                            ///Clear the interval function
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(3500);
                        }
                    };
                    /**
                     * Interval trigger animation newsletter
                     */
                    FFAPI.methods.intervalTriggerNewsletter = function (time) {
                        return window.setInterval(FFAPI.methods.animationBanner, time);
                    };


                    FFAPI.methods.createCookieNewsletter = function (name, value, days) {
                        if (days) {
                            var date = new Date();
                            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                            var expires = "; expires=" + date.toGMTString();
                        }
                        else var expires = "";
                        document.cookie = name + "=" + value + expires + "; path=/";
                    };

                    FFAPI.methods.readCookie = function (name) {
                        var nameEQ = name + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                        }
                        return null;
                    };

                    FFAPI.methods.eraseCookie = function (name) {
                        FFAPI.methods.createCookieNewsletter(name, "", -1);
                    }

                    FFAPI.variables.readCookieNewsletterBr = FFAPI.methods.readCookie('newsletterbrcookie');

                    /**END BANNER ANIMATION**/
                    FFAPI.methods.endBannerAnimation = function () {
                        if (!FFAPI.variables.readCookieNewsletterBr) {
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[1]);
                            FFAPI.variables.animationBanner[1].style.zIndex = 10;
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            /// Bind the click to the close button
                            FFAPI.methods.bindElemClick(FFAPI.variables.animationBannerNewsletterClose, FFAPI.methods.animationBannerNewsletterClose);
                        } else {
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                        }

                        return;
                    };

                    /**START BANNER ANIMATION**/
                    FFAPI.methods.startBannerHomeAnimation = function () {
                        ///If the cookie doesn't exist
                        if (!FFAPI.variables.readCookieNewsletterBr) {
                            FFAPI.methods.addClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(3500);
                            /// Bind the click to the close button
                            FFAPI.methods.bindElemClick(FFAPI.variables.animationBannerNewsletterClose, FFAPI.methods.animationBannerNewsletterClose);
                        }
                        else {
                            window.clearInterval(FFAPI.variables.intervalAnimated);
                            FFAPI.variables.animationBanner[0].style.zIndex = 10;
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[0], 'animation-newsletter-signup');
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[0]);
                            return;
                        }
                    };
                    /**
                     * Document ready for the newsletter br animatiob
                     */

                    FFAPI.methods.startBannerHomeAnimation();


                    /**
                     * On Showing the modal we control the animation to stop
                     */
                    $(document)
                        /// On showing modal
                        .on('show.bs.modal', '.modal', function () {
                            ///Clear the interval function
                            ///Fade in this element and add the zIndex to the animated banner 0
                            FFAPI.methods.fadeIn(FFAPI.variables.animationBanner[1], 0);
                            FFAPI.variables.animationBanner[1].style.zIndex = 10;
                            FFAPI.methods.removeClass(FFAPI.variables.animationBanner[1], 'animation-newsletter-signup');
                            ///Clear the interval function
                            window.clearInterval(FFAPI.variables.intervalAnimated);

                        })
                        /// On hidding modal
                        .on('hidden.bs.modal', '.modal', function () {
                            ///Start the animation again
                            ///FFAPI.variables.intervalAnimated = FFAPI.methods.intervalTriggerNewsletter(3500);

                        });
                }
            });
        });
    });
} catch (e) {
    console.log(e);
    try {
        if (window.debug) {
            console.log(e);
        }
    } catch (ex) {
    }
}
/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

;(function($){

    var plugin = {};

    var defaults = {

        // GENERAL
        mode: 'horizontal',
        slideSelector: '',
        infiniteLoop: true,
        hideControlOnEnd: false,
        speed: 500,
        easing: null,
        slideMargin: 0,
        startSlide: 0,
        randomStart: false,
        captions: false,
        ticker: false,
        tickerHover: false,
        adaptiveHeight: false,
        adaptiveHeightSpeed: 500,
        video: false,
        useCSS: true,
        preloadImages: 'visible',
        responsive: true,
        slideZIndex: 50,
        wrapperClass: 'bx-wrapper',

        // TOUCH
        touchEnabled: true,
        swipeThreshold: 50,
        oneToOneTouch: true,
        preventDefaultSwipeX: true,
        preventDefaultSwipeY: false,

        // PAGER
        pager: true,
        pagerType: 'full',
        pagerShortSeparator: ' / ',
        pagerSelector: null,
        buildPager: null,
        pagerCustom: null,

        // CONTROLS
        controls: true,
        nextText: '',
        prevText: '',
        nextSelector: null,
        prevSelector: null,
        autoControls: false,
        startText: 'Start',
        stopText: 'Stop',
        autoControlsCombine: false,
        autoControlsSelector: null,

        // AUTO
        auto: false,
        pause: 4000,
        autoStart: true,
        autoDirection: 'next',
        autoHover: false,
        autoDelay: 0,
        autoSlideForOnePage: false,

        // CAROUSEL
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 0,
        slideWidth: 0,

        // CALLBACKS
        onSliderLoad: function() {},
        onSlideBefore: function() {},
        onSlideAfter: function() {},
        onSlideNext: function() {},
        onSlidePrev: function() {},
        onSliderResize: function() {}
    }

    $.fn.bxSlider = function(options){

        if(this.length == 0) return this;

        // support mutltiple elements
        if(this.length > 1){
            this.each(function(){$(this).bxSlider(options)});
            return this;
        }

        // create a namespace to be used throughout the plugin
        var slider = {};
        // set a reference to our slider element
        var el = this;
        plugin.el = this;

        /**
		 * Makes slideshow responsive
		 */
        // first get the original window dimens (thanks alot IE)
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();



        /**
		 * ===================================================================================
		 * = PRIVATE FUNCTIONS
		 * ===================================================================================
		 */

        /**
		 * Initializes namespace settings to be used throughout plugin
		 */
        var init = function(){
            // merge user-supplied options with the defaults
            slider.settings = $.extend({}, defaults, options);
            // parse slideWidth setting
            slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
            // store the original children
            slider.children = el.children(slider.settings.slideSelector);
            // check if actual number of slides is less than minSlides / maxSlides
            if(slider.children.length < slider.settings.minSlides) slider.settings.minSlides = slider.children.length;
            if(slider.children.length < slider.settings.maxSlides) slider.settings.maxSlides = slider.children.length;
            // if random start, set the startSlide setting to random number
            if(slider.settings.randomStart) slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
            // store active slide information
            slider.active = { index: slider.settings.startSlide }
            // store if the slider is in carousel mode (displaying / moving multiple slides)
            slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
            // if carousel, force preloadImages = 'all'
            if(slider.carousel) slider.settings.preloadImages = 'all';
            // calculate the min / max width thresholds based on min / max number of slides
            // used to setup and update carousel slides dimensions
            slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
            slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
            // store the current state of the slider (if currently animating, working is true)
            slider.working = false;
            // initialize the controls object
            slider.controls = {};
            // initialize an auto interval
            slider.interval = null;
            // determine which property to use for transitions
            slider.animProp = slider.settings.mode == 'vertical' ? 'top' : 'left';
            // determine if hardware acceleration can be used
            slider.usingCSS = slider.settings.useCSS && slider.settings.mode != 'fade' && (function(){
                // create our test div element
                var div = document.createElement('div');
                // css transition properties
                var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                // test for each property
                for(var i in props){
                    if(div.style[props[i]] !== undefined){
                        slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                        slider.animProp = '-' + slider.cssPrefix + '-transform';
                        return true;
                    }
                }
                return false;
            }());
            // if vertical mode always make maxSlides and minSlides equal
            if(slider.settings.mode == 'vertical') slider.settings.maxSlides = slider.settings.minSlides;
            // save original style data
            el.data("origStyle", el.attr("style"));
            el.children(slider.settings.slideSelector).each(function() {
                $(this).data("origStyle", $(this).attr("style"));
            });
            // perform all DOM / CSS modifications
            setup();
        }

        /**
		 * Performs all DOM and CSS modifications
		 */
        var setup = function(){
            // wrap el in a wrapper
            el.wrap('<div class="' + slider.settings.wrapperClass + '"><div class="bx-viewport"></div></div>');
            // store a namspace reference to .bx-viewport
            slider.viewport = el.parent();
            // add a loading div to display while images are loading
            slider.loader = $('<div class="bx-loading" />');
            slider.viewport.prepend(slider.loader);
            // set el to a massive width, to hold any needed slides
            // also strip any margin and padding from el
            el.css({
                width: slider.settings.mode == 'horizontal' ? (slider.children.length * 100 + 215) + '%' : 'auto',
                position: 'relative'
            });
            // if using CSS, add the easing property
            if(slider.usingCSS && slider.settings.easing){
                el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
                // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
            }else if(!slider.settings.easing){
                slider.settings.easing = 'swing';
            }
            var slidesShowing = getNumberSlidesShowing();
            // make modifications to the viewport (.bx-viewport)
            slider.viewport.css({
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            });
            slider.viewport.parent().css({
                maxWidth: getViewportMaxWidth()
            });
            // make modification to the wrapper (.bx-wrapper)
            if(!slider.settings.pager) {
                slider.viewport.parent().css({
                    margin: '0 auto 0px'
                });
            }
            // apply css to all slider children
            slider.children.css({
                'float': slider.settings.mode == 'horizontal' ? 'left' : 'none',
                listStyle: 'none',
                position: 'relative'
            });
            // apply the calculated width after the float is applied to prevent scrollbar interference
            slider.children.css('width', getSlideWidth());
            // if slideMargin is supplied, add the css
            if(slider.settings.mode == 'horizontal' && slider.settings.slideMargin > 0) slider.children.css('marginRight', slider.settings.slideMargin);
            if(slider.settings.mode == 'vertical' && slider.settings.slideMargin > 0) slider.children.css('marginBottom', slider.settings.slideMargin);
            // if "fade" mode, add positioning and z-index CSS
            if(slider.settings.mode == 'fade'){
                slider.children.css({
                    position: 'absolute',
                    zIndex: 0,
                    display: 'none'
                });
                // prepare the z-index on the showing element
                slider.children.eq(slider.settings.startSlide).css({zIndex: slider.settings.slideZIndex, display: 'block'});
            }
            // create an element to contain all slider controls (pager, start / stop, etc)
            slider.controls.el = $('<div class="bx-controls" />');
            // if captions are requested, add them
            if(slider.settings.captions) appendCaptions();
            // check if startSlide is last slide
            slider.active.last = slider.settings.startSlide == getPagerQty() - 1;
            // if video is true, set up the fitVids plugin
            if(slider.settings.video) el.fitVids();
            // set the default preload selector (visible)
            var preloadSelector = slider.children.eq(slider.settings.startSlide);
            if (slider.settings.preloadImages == "all") preloadSelector = slider.children;
            // only check for control addition if not in "ticker" mode
            if(!slider.settings.ticker){
                // if pager is requested, add it
                if(slider.settings.pager) appendPager();
                // if controls are requested, add them
                if(slider.settings.controls) appendControls();
                // if auto is true, and auto controls are requested, add them
                if(slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
                // if any control option is requested, add the controls wrapper
                if(slider.settings.controls || slider.settings.autoControls || slider.settings.pager) slider.viewport.after(slider.controls.el);
                // if ticker mode, do not allow a pager
            }else{
                slider.settings.pager = false;
            }
            // preload all images, then perform final DOM / CSS modifications that depend on images being loaded
            loadElements(preloadSelector, start);
        }

        var loadElements = function(selector, callback){
            var total = selector.find('img, iframe').length;
            if (total == 0){
                callback();
                return;
            }
            var count = 0;
            selector.find('img, iframe').each(function(){
                $(this).one('load', function() {
                    if(++count == total) callback();
                }).one('error', function() {
                    var $li = $(this).parents('li:first');
                    if(slider.pagerEl) {
                        slider.pagerEl.find('a:eq('+$li.index()+')').remove();
                    }
                    $li.remove();
                    if(++count == total) callback();
                }).each(function() {
                    if(this.complete) $(this).load();
                });
            });
        }

        /**
		 * Start the slider
		 */
        var start = function(){
            // if infinite loop, prepare additional slides
            if(slider.settings.infiniteLoop && slider.settings.mode != 'fade' && !slider.settings.ticker){
                var slice = slider.settings.mode == 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides;
                var sliceAppend = slider.children.slice(0, slice).clone().addClass('bx-clone');
                var slicePrepend = slider.children.slice(-slice).clone().addClass('bx-clone');
                el.append(sliceAppend).prepend(slicePrepend);
            }
            // remove the loading DOM element
            slider.loader.remove();
            // set the left / top position of "el"
            setSlidePosition();
            // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
            if (slider.settings.mode == 'vertical') slider.settings.adaptiveHeight = true;
            // set the viewport height
            slider.viewport.height(getViewportHeight());
            // make sure everything is positioned just right (same as a window resize)
            el.redrawSlider();
            // onSliderLoad callback
            slider.settings.onSliderLoad(slider.active.index);
            // slider has been fully initialized
            slider.initialized = true;
            // bind the resize call to the window
            if (slider.settings.responsive) $(window).bind('resize', resizeWindow);
            // if auto is true and has more than 1 page, start the show
            if (slider.settings.auto && slider.settings.autoStart && (getPagerQty() > 1 || slider.settings.autoSlideForOnePage)) initAuto();
            // if ticker is true, start the ticker
            if (slider.settings.ticker) initTicker();
            // if pager is requested, make the appropriate pager link active
            if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
            // check for any updates to the controls (like hideControlOnEnd updates)
            if (slider.settings.controls) updateDirectionControls();
            // if touchEnabled is true, setup the touch events
            if (slider.settings.touchEnabled && !slider.settings.ticker) initTouch();
        }

        /**
		 * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
		 */
        var getViewportHeight = function(){
            var height = 0;
            // first determine which children (slides) should be used in our height calculation
            var children = $();
            // if mode is not "vertical" and adaptiveHeight is false, include all children
            if(slider.settings.mode != 'vertical' && !slider.settings.adaptiveHeight){
                children = slider.children;
            }else{
                // if not carousel, return the single active child
                if(!slider.carousel){
                    children = slider.children.eq(slider.active.index);
                    // if carousel, return a slice of children
                }else{
                    // get the individual slide index
                    var currentIndex = slider.settings.moveSlides == 1 ? slider.active.index : slider.active.index * getMoveBy();
                    // add the current slide to the children
                    children = slider.children.eq(currentIndex);
                    // cycle through the remaining "showing" slides
                    for (i = 1; i <= slider.settings.maxSlides - 1; i++){
                        // if looped back to the start
                        if(currentIndex + i >= slider.children.length){
                            children = children.add(slider.children.eq(i - 1));
                        }else{
                            children = children.add(slider.children.eq(currentIndex + i));
                        }
                    }
                }
            }
            // if "vertical" mode, calculate the sum of the heights of the children
            if (slider.settings.mode == 'vertical') {
               
                children.each(function(index) {
                    height += $(this).outerHeight();
                });
                // add user-supplied margins
                if(slider.settings.slideMargin > 0){
                    height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
                }
                
                // if not "vertical" mode, calculate the max height of the children
            }else{
                height = Math.max.apply(Math, children.map(function(){
                    return $(this).outerHeight(false);
                }).get());
            }
            
            if (slider.viewport.css('box-sizing') == 'border-box') {
                height +=	parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom'));

            }else if(slider.viewport.css('box-sizing') == 'padding-box'){
                height +=	parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom'));
            }
            
            return height;
        }

        /**
		 * Returns the calculated width to be used for the outer wrapper / viewport
		 */
        var getViewportMaxWidth = function(){
            var width = '100%';
            if(slider.settings.slideWidth > 0){
                if(slider.settings.mode == 'horizontal'){
                    width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
                }else{
                    width = slider.settings.slideWidth;
                }
            }
            return width;
        }

        /**
		 * Returns the calculated width to be applied to each slide
		 */
        var getSlideWidth = function(){
            // start with any user-supplied slide width
            var newElWidth = slider.settings.slideWidth;
            // get the current viewport width
            var wrapWidth = slider.viewport.width();
            // if slide width was not supplied, or is larger than the viewport use the viewport width
            if(slider.settings.slideWidth == 0 ||
				(slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
				slider.settings.mode == 'vertical'){
                newElWidth = wrapWidth;
                // if carousel, use the thresholds to determine the width
            }else if(slider.settings.maxSlides > 1 && slider.settings.mode == 'horizontal'){
                if(wrapWidth > slider.maxThreshold){
                    // newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
                }else if(wrapWidth < slider.minThreshold){
                    newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
                }
            }
            return newElWidth;
        }

        /**
		 * Returns the number of slides currently visible in the viewport (includes partially visible slides)
		 */
        var getNumberSlidesShowing = function(){
            var slidesShowing = 1;
            if(slider.settings.mode == 'horizontal' && slider.settings.slideWidth > 0){
                // if viewport is smaller than minThreshold, return minSlides
                if(slider.viewport.width() < slider.minThreshold){
                    slidesShowing = slider.settings.minSlides;
                    // if viewport is larger than minThreshold, return maxSlides
                }else if(slider.viewport.width() > slider.maxThreshold){
                    slidesShowing = slider.settings.maxSlides;
                    // if viewport is between min / max thresholds, divide viewport width by first child width
                }else{
                    var childWidth = slider.children.first().width() + slider.settings.slideMargin;
                    slidesShowing = Math.floor((slider.viewport.width() +
						slider.settings.slideMargin) / childWidth);
                }
                // if "vertical" mode, slides showing will always be minSlides
            }else if(slider.settings.mode == 'vertical'){
                slidesShowing = slider.settings.minSlides;
            }
            return slidesShowing;
        }

        /**
		 * Returns the number of pages (one full viewport of slides is one "page")
		 */
        var getPagerQty = function(){
            var pagerQty = 0;
            // if moveSlides is specified by the user
            if(slider.settings.moveSlides > 0){
                if(slider.settings.infiniteLoop){
                    pagerQty = Math.ceil(slider.children.length / getMoveBy());
                }else{
                    // use a while loop to determine pages
                    var breakPoint = 0;
                    var counter = 0
                    // when breakpoint goes above children length, counter is the number of pages
                    while (breakPoint < slider.children.length){
                        ++pagerQty;
                        breakPoint = counter + getNumberSlidesShowing();
                        counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
                    }
                }
                // if moveSlides is 0 (auto) divide children length by sides showing, then round up
            }else{
                pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
            }
            return pagerQty;
        }

        /**
		 * Returns the number of indivual slides by which to shift the slider
		 */
        var getMoveBy = function(){
            // if moveSlides was set by the user and moveSlides is less than number of slides showing
            if(slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()){
                return slider.settings.moveSlides;
            }
            // if moveSlides is 0 (auto)
            return getNumberSlidesShowing();
        }

        /**
		 * Sets the slider's (el) left or top position
		 */
        var setSlidePosition = function(){
            // if last slide, not infinite loop, and number of children is larger than specified maxSlides
            if(slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop){
                if (slider.settings.mode == 'horizontal'){
                    // get the last child's position
                    var lastChild = slider.children.last();
                    var position = lastChild.position();
                    // set the left position
                    setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.outerWidth())), 'reset', 0);
                }else if(slider.settings.mode == 'vertical'){
                    // get the last showing index's position
                    var lastShowingIndex = slider.children.length - slider.settings.minSlides;
                    var position = slider.children.eq(lastShowingIndex).position();
                    // set the top position
                    setPositionProperty(-position.top, 'reset', 0);
                }
                // if not last slide
            }else{
                // get the position of the first showing slide
                var position = slider.children.eq(slider.active.index * getMoveBy()).position();
                // check for last slide
                if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
                // set the repective position
                if (position != undefined){
                    if (slider.settings.mode == 'horizontal') setPositionProperty(-position.left, 'reset', 0);
                    else if (slider.settings.mode == 'vertical') setPositionProperty(-position.top, 'reset', 0);
                }
            }
        }

        /**
		 * Sets the el's animating property position (which in turn will sometimes animate el).
		 * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
		 *
		 * @param value (int)
		 *  - the animating property's value
		 *
		 * @param type (string) 'slider', 'reset', 'ticker'
		 *  - the type of instance for which the function is being
		 *
		 * @param duration (int)
		 *  - the amount of time (in ms) the transition should occupy
		 *
		 * @param params (array) optional
		 *  - an optional parameter containing any variables that need to be passed in
		 */
        var setPositionProperty = function(value, type, duration, params){
            // use CSS transform
            if(slider.usingCSS){
                // determine the translate3d value
                var propValue = slider.settings.mode == 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
                // add the CSS transition-duration
                el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
                if(type == 'slide'){
                    // set the property value
                    el.css(slider.animProp, propValue);
                    // bind a callback method - executes when CSS transition completes
                    el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                        // unbind the callback
                        el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                        updateAfterSlideTransition();
                    });
                }else if(type == 'reset'){
                    el.css(slider.animProp, propValue);
                }else if(type == 'ticker'){
                    // make the transition use 'linear'
                    el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
                    el.css(slider.animProp, propValue);
                    // bind a callback method - executes when CSS transition completes
                    el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                        // unbind the callback
                        el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                        // reset the position
                        setPositionProperty(params['resetValue'], 'reset', 0);
                        // start the loop again
                        tickerLoop();
                    });
                }
                // use JS animate
            }else{
                var animateObj = {};
                animateObj[slider.animProp] = value;
                if(type == 'slide'){
                    el.animate(animateObj, duration, slider.settings.easing, function(){
                        updateAfterSlideTransition();
                    });
                }else if(type == 'reset'){
                    el.css(slider.animProp, value)
                }else if(type == 'ticker'){
                    el.animate(animateObj, speed, 'linear', function(){
                        setPositionProperty(params['resetValue'], 'reset', 0);
                        // run the recursive loop after animation
                        tickerLoop();
                    });
                }
            }
        }

        /**
		 * Populates the pager with proper amount of pages
		 */
        var populatePager = function(){
            var pagerHtml = '';
            var pagerQty = getPagerQty();
            // loop through each pager item
            for(var i=0; i < pagerQty; i++){
                var linkContent = '';
                // if a buildPager function is supplied, use it to get pager link value, else use index + 1
                if(slider.settings.buildPager && $.isFunction(slider.settings.buildPager)){
                    linkContent = slider.settings.buildPager(i);
                    slider.pagerEl.addClass('bx-custom-pager');
                }else{
                    linkContent = i + 1;
                    slider.pagerEl.addClass('bx-default-pager');
                }
                // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
                // add the markup to the string
                pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
            };
            // populate the pager element with pager links
            slider.pagerEl.html(pagerHtml);
        }

        /**
		 * Appends the pager to the controls element
		 */
        var appendPager = function(){
            if(!slider.settings.pagerCustom){
                // create the pager DOM element
                slider.pagerEl = $('<div class="bx-pager" />');
                // if a pager selector was supplied, populate it with the pager
                if(slider.settings.pagerSelector){
                    $(slider.settings.pagerSelector).html(slider.pagerEl);
                    // if no pager selector was supplied, add it after the wrapper
                }else{
                    slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
                }
                // populate the pager
                populatePager();
            }else{
                slider.pagerEl = $(slider.settings.pagerCustom);
            }
            // assign the pager click binding
            slider.pagerEl.on('click', 'a', clickPagerBind);
        }

        /**
		 * Appends prev / next controls to the controls element
		 */
        var appendControls = function(){
            slider.controls.next = $('<a class="bx-next" href="">' + /*slider.settings.nextText*/ + '</a>');
            slider.controls.prev = $('<a class="bx-prev" href="">' + /*slider.settings.prevText*/ + '</a>');
            // bind click actions to the controls
            slider.controls.next.bind('click', clickNextBind);
            slider.controls.prev.bind('click', clickPrevBind);
            // if nextSlector was supplied, populate it
            if(slider.settings.nextSelector){
                $(slider.settings.nextSelector).append(slider.controls.next);
            }
            // if prevSlector was supplied, populate it
            if(slider.settings.prevSelector){
                $(slider.settings.prevSelector).append(slider.controls.prev);
            }
            // if no custom selectors were supplied
            if(!slider.settings.nextSelector && !slider.settings.prevSelector){
                // add the controls to the DOM
                slider.controls.directionEl = $('<div class="bx-controls-direction" />');
                // add the control elements to the directionEl
                slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
                // slider.viewport.append(slider.controls.directionEl);
                slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
            }
        }

        /**
		 * Appends start / stop auto controls to the controls element
		 */
        var appendControlsAuto = function(){
            slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
            slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
            // add the controls to the DOM
            slider.controls.autoEl = $('<div class="bx-controls-auto" />');
            // bind click actions to the controls
            slider.controls.autoEl.on('click', '.bx-start', clickStartBind);
            slider.controls.autoEl.on('click', '.bx-stop', clickStopBind);
            // if autoControlsCombine, insert only the "start" control
            if(slider.settings.autoControlsCombine){
                slider.controls.autoEl.append(slider.controls.start);
                // if autoControlsCombine is false, insert both controls
            }else{
                slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
            }
            // if auto controls selector was supplied, populate it with the controls
            if(slider.settings.autoControlsSelector){
                $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
                // if auto controls selector was not supplied, add it after the wrapper
            }else{
                slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
            }
            // update the auto controls
            updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
        }

        /**
		 * Appends image captions to the DOM
		 */
        var appendCaptions = function(){
            // cycle through each child
            slider.children.each(function(index){
                // get the image title attribute
                var title = $(this).find('img:first').attr('title');
                // append the caption
                if (title != undefined && ('' + title).length) {
                    $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
                }
            });
        }

        /**
		 * Click next binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickNextBind = function(e){
            // if auto show is running, stop it
            if (slider.settings.auto) el.stopAuto();
            el.goToNextSlide();
            e.preventDefault();
        }

        /**
		 * Click prev binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickPrevBind = function(e){
            // if auto show is running, stop it
            if (slider.settings.auto) el.stopAuto();
            el.goToPrevSlide();
            e.preventDefault();
        }

        /**
		 * Click start binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickStartBind = function(e){
            el.startAuto();
            e.preventDefault();
        }

        /**
		 * Click stop binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickStopBind = function(e){
            el.stopAuto();
            e.preventDefault();
        }

        /**
		 * Click pager binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickPagerBind = function(e){
            // if auto show is running, stop it
            if (slider.settings.auto) el.stopAuto();
            var pagerLink = $(e.currentTarget);
            if(pagerLink.attr('data-slide-index') !== undefined){
                var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
                // if clicked pager link is not active, continue with the goToSlide call
                if(pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
                e.preventDefault();
            }
        }

        /**
		 * Updates the pager links with an active class
		 *
		 * @param slideIndex (int)
		 *  - index of slide to make active
		 */
        var updatePagerActive = function(slideIndex){
            // if "short" pager type
            var len = slider.children.length; // nb of children
            if(slider.settings.pagerType == 'short'){
                if(slider.settings.maxSlides > 1) {
                    len = Math.ceil(slider.children.length/slider.settings.maxSlides);
                }
                slider.pagerEl.html( (slideIndex + 1) + slider.settings.pagerShortSeparator + len);
                return;
            }
            // remove all pager active classes
            slider.pagerEl.find('a').removeClass('active');
            // apply the active class for all pagers
            slider.pagerEl.each(function(i, el) { $(el).find('a').eq(slideIndex).addClass('active'); });
        }

        /**
		 * Performs needed actions after a slide transition
		 */
        var updateAfterSlideTransition = function(){
            // if infinte loop is true
            if(slider.settings.infiniteLoop){
                var position = '';
                // first slide
                if(slider.active.index == 0){
                    // set the new position
                    position = slider.children.eq(0).position();
                    // carousel, last slide
                }else if(slider.active.index == getPagerQty() - 1 && slider.carousel){
                    position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
                    // last slide
                }else if(slider.active.index == slider.children.length - 1){
                    position = slider.children.eq(slider.children.length - 1).position();
                }
                if(position){
                    if (slider.settings.mode == 'horizontal') { setPositionProperty(-position.left, 'reset', 0); }
                    else if (slider.settings.mode == 'vertical') { setPositionProperty(-position.top, 'reset', 0); }
                }
            }
            // declare that the transition is complete
            slider.working = false;
            // onSlideAfter callback
            slider.settings.onSlideAfter(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
        }

        /**
		 * Updates the auto controls state (either active, or combined switch)
		 *
		 * @param state (string) "start", "stop"
		 *  - the new state of the auto show
		 */
        var updateAutoControls = function(state){
            // if autoControlsCombine is true, replace the current control with the new state
            if(slider.settings.autoControlsCombine){
                slider.controls.autoEl.html(slider.controls[state]);
                // if autoControlsCombine is false, apply the "active" class to the appropriate control
            }else{
                slider.controls.autoEl.find('a').removeClass('active');
                slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
            }
        }

        /**
		 * Updates the direction controls (checks if either should be hidden)
		 */
        var updateDirectionControls = function(){
            if(getPagerQty() == 1){
                slider.controls.prev.addClass('disabled');
                slider.controls.next.addClass('disabled');
            }else if(!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd){
                // if first slide
                if (slider.active.index == 0){
                    slider.controls.prev.addClass('disabled');
                    slider.controls.next.removeClass('disabled');
                    // if last slide
                }else if(slider.active.index == getPagerQty() - 1){
                    slider.controls.next.addClass('disabled');
                    slider.controls.prev.removeClass('disabled');
                    // if any slide in the middle
                }else{
                    slider.controls.prev.removeClass('disabled');
                    slider.controls.next.removeClass('disabled');
                }
            }
        }

        /**
		 * Initialzes the auto process
		 */
        var initAuto = function(){
            // if autoDelay was supplied, launch the auto show using a setTimeout() call
            if(slider.settings.autoDelay > 0){
                var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
                // if autoDelay was not supplied, start the auto show normally
            }else{
                el.startAuto();
            }
            // if autoHover is requested
            if(slider.settings.autoHover){
                // on el hover
                el.hover(function(){
                    // if the auto show is currently playing (has an active interval)
                    if(slider.interval){
                        // stop the auto show and pass true agument which will prevent control update
                        el.stopAuto(true);
                        // create a new autoPaused value which will be used by the relative "mouseout" event
                        slider.autoPaused = true;
                    }
                }, function(){
                    // if the autoPaused value was created be the prior "mouseover" event
                    if(slider.autoPaused){
                        // start the auto show and pass true agument which will prevent control update
                        el.startAuto(true);
                        // reset the autoPaused value
                        slider.autoPaused = null;
                    }
                });
            }
        }

        /**
		 * Initialzes the ticker process
		 */
        var initTicker = function(){
            var startPosition = 0;
            // if autoDirection is "next", append a clone of the entire slider
            if(slider.settings.autoDirection == 'next'){
                el.append(slider.children.clone().addClass('bx-clone'));
                // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
            }else{
                el.prepend(slider.children.clone().addClass('bx-clone'));
                var position = slider.children.first().position();
                startPosition = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
            }
            setPositionProperty(startPosition, 'reset', 0);
            // do not allow controls in ticker mode
            slider.settings.pager = false;
            slider.settings.controls = false;
            slider.settings.autoControls = false;
            // if autoHover is requested
            if(slider.settings.tickerHover && !slider.usingCSS){
                // on el hover
                slider.viewport.hover(function(){
                    el.stop();
                }, function(){
                    // calculate the total width of children (used to calculate the speed ratio)
                    var totalDimens = 0;
                    slider.children.each(function(index){
                        totalDimens += slider.settings.mode == 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
                    });
                    // calculate the speed ratio (used to determine the new speed to finish the paused animation)
                    var ratio = slider.settings.speed / totalDimens;
                    // determine which property to use
                    var property = slider.settings.mode == 'horizontal' ? 'left' : 'top';
                    // calculate the new speed
                    var newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
                    tickerLoop(newSpeed);
                });
            }
            // start the ticker loop
            tickerLoop();
        }

        /**
		 * Runs a continuous loop, news ticker-style
		 */
        var tickerLoop = function(resumeSpeed){
            speed = resumeSpeed ? resumeSpeed : slider.settings.speed;
            var position = {left: 0, top: 0};
            var reset = {left: 0, top: 0};
            // if "next" animate left position to last child, then reset left to 0
            if(slider.settings.autoDirection == 'next'){
                position = el.find('.bx-clone').first().position();
                // if "prev" animate left position to 0, then reset left to first non-clone child
            }else{
                reset = slider.children.first().position();
            }
            var animateProperty = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
            var resetValue = slider.settings.mode == 'horizontal' ? -reset.left : -reset.top;
            var params = {resetValue: resetValue};
            setPositionProperty(animateProperty, 'ticker', speed, params);
        }

        /**
		 * Initializes touch events
		 */
        var initTouch = function(){
            // initialize object to contain all touch values
            slider.touch = {
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            }
            slider.viewport.bind('touchstart', onTouchStart);
        }

        /**
		 * Event handler for "touchstart"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var onTouchStart = function(e){
            if(slider.working){
                e.preventDefault();
            }else{
                // record the original position when touch starts
                slider.touch.originalPos = el.position();
                var orig = e.originalEvent;
                // record the starting touch x, y coordinates
                slider.touch.start.x = orig.changedTouches[0].pageX;
                slider.touch.start.y = orig.changedTouches[0].pageY;
                // bind a "touchmove" event to the viewport
                slider.viewport.bind('touchmove', onTouchMove);
                // bind a "touchend" event to the viewport
                slider.viewport.bind('touchend', onTouchEnd);
            }
        }

        /**
		 * Event handler for "touchmove"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var onTouchMove = function(e){
            var orig = e.originalEvent;
            // if scrolling on y axis, do not prevent default
            var xMovement = Math.abs(orig.changedTouches[0].pageX - slider.touch.start.x);
            var yMovement = Math.abs(orig.changedTouches[0].pageY - slider.touch.start.y);
            // x axis swipe
            if((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX){
                e.preventDefault();
                // y axis swipe
            }else if((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY){
                e.preventDefault();
            }
            if(slider.settings.mode != 'fade' && slider.settings.oneToOneTouch){
                var value = 0;
                // if horizontal, drag along x axis
                if(slider.settings.mode == 'horizontal'){
                    var change = orig.changedTouches[0].pageX - slider.touch.start.x;
                    value = slider.touch.originalPos.left + change;
                    // if vertical, drag along y axis
                }else{
                    var change = orig.changedTouches[0].pageY - slider.touch.start.y;
                    value = slider.touch.originalPos.top + change;
                }
                setPositionProperty(value, 'reset', 0);
            }
        }

        /**
		 * Event handler for "touchend"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var onTouchEnd = function(e){
            slider.viewport.unbind('touchmove', onTouchMove);
            var orig = e.originalEvent;
            var value = 0;
            // record end x, y positions
            slider.touch.end.x = orig.changedTouches[0].pageX;
            slider.touch.end.y = orig.changedTouches[0].pageY;
            // if fade mode, check if absolute x distance clears the threshold
            if(slider.settings.mode == 'fade'){
                var distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
                if(distance >= slider.settings.swipeThreshold){
                    slider.touch.start.x > slider.touch.end.x ? el.goToNextSlide() : el.goToPrevSlide();
                    el.stopAuto();
                }
                // not fade mode
            }else{
                var distance = 0;
                // calculate distance and el's animate property
                if(slider.settings.mode == 'horizontal'){
                    distance = slider.touch.end.x - slider.touch.start.x;
                    value = slider.touch.originalPos.left;
                }else{
                    distance = slider.touch.end.y - slider.touch.start.y;
                    value = slider.touch.originalPos.top;
                }
                // if not infinite loop and first / last slide, do not attempt a slide transition
                if(!slider.settings.infiniteLoop && ((slider.active.index == 0 && distance > 0) || (slider.active.last && distance < 0))){
                    setPositionProperty(value, 'reset', 200);
                }else{
                    // check if distance clears threshold
                    if(Math.abs(distance) >= slider.settings.swipeThreshold){
                        distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
                        el.stopAuto();
                    }else{
                        // el.animate(property, 200);
                        setPositionProperty(value, 'reset', 200);
                    }
                }
            }
            slider.viewport.unbind('touchend', onTouchEnd);
        }

        /**
		 * Window resize event callback
		 */
        var resizeWindow = function(e){
            // don't do anything if slider isn't initialized.
            if(!slider.initialized) return;
            // get the new window dimens (again, thank you IE)
            var windowWidthNew = $(window).width();
            var windowHeightNew = $(window).height();
            // make sure that it is a true window resize
            // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
            // are resized. Can you just die already?*
            if(windowWidth != windowWidthNew || windowHeight != windowHeightNew){
                // set the new window dimens
                windowWidth = windowWidthNew;
                windowHeight = windowHeightNew;
                // update all dynamic elements
                el.redrawSlider();
                // Call user resize handler
                slider.settings.onSliderResize.call(el, slider.active.index);
            }
        }

        /**
		 * ===================================================================================
		 * = PUBLIC FUNCTIONS
		 * ===================================================================================
		 */

        /**
		 * Performs slide transition to the specified slide
		 *
		 * @param slideIndex (int)
		 *  - the destination slide's index (zero-based)
		 *
		 * @param direction (string)
		 *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
		 */
        el.goToSlide = function(slideIndex, direction){
            // if plugin is currently in motion, ignore request
            if(slider.working || slider.active.index == slideIndex) return;
            // declare that plugin is in motion
            slider.working = true;
            // store the old index
            slider.oldIndex = slider.active.index;
            // if slideIndex is less than zero, set active index to last child (this happens during infinite loop)
            if(slideIndex < 0){
                slider.active.index = getPagerQty() - 1;
                // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
            }else if(slideIndex >= getPagerQty()){
                slider.active.index = 0;
                // set active index to requested slide
            }else{
                slider.active.index = slideIndex;
            }
            // onSlideBefore, onSlideNext, onSlidePrev callbacks
            slider.settings.onSlideBefore(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
            if(direction == 'next'){
                slider.settings.onSlideNext(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
            }else if(direction == 'prev'){
                slider.settings.onSlidePrev(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
            }
            // check if last slide
            slider.active.last = slider.active.index >= getPagerQty() - 1;
            // update the pager with active class
            if(slider.settings.pager) updatePagerActive(slider.active.index);
            // // check for direction control update
            if(slider.settings.controls) updateDirectionControls();
            // if slider is set to mode: "fade"
            if(slider.settings.mode == 'fade'){
                // if adaptiveHeight is true and next height is different from current height, animate to the new height
                if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
                    slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
                }
                // fade out the visible child and reset its z-index value
                slider.children.filter(':visible').fadeOut(slider.settings.speed).css({zIndex: 0});
                // fade in the newly requested slide
                slider.children.eq(slider.active.index).css('zIndex', slider.settings.slideZIndex+1).fadeIn(slider.settings.speed, function(){
                    $(this).css('zIndex', slider.settings.slideZIndex);
                    updateAfterSlideTransition();
                });
                // slider mode is not "fade"
            }else{
                // if adaptiveHeight is true and next height is different from current height, animate to the new height
                if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
                    slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
                }
                var moveBy = 0;
                var position = {left: 0, top: 0};
                // if carousel and not infinite loop
                if(!slider.settings.infiniteLoop && slider.carousel && slider.active.last){
                    if(slider.settings.mode == 'horizontal'){
                        // get the last child position
                        var lastChild = slider.children.eq(slider.children.length - 1);
                        position = lastChild.position();
                        // calculate the position of the last slide
                        moveBy = slider.viewport.width() - lastChild.outerWidth();
                    }else{
                        // get last showing index position
                        var lastShowingIndex = slider.children.length - slider.settings.minSlides;
                        position = slider.children.eq(lastShowingIndex).position();
                    }
                    // horizontal carousel, going previous while on first slide (infiniteLoop mode)
                }else if(slider.carousel && slider.active.last && direction == 'prev'){
                    // get the last child position
                    var eq = slider.settings.moveSlides == 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
                    var lastChild = el.children('.bx-clone').eq(eq);
                    position = lastChild.position();
                    // if infinite loop and "Next" is clicked on the last slide
                }else if(direction == 'next' && slider.active.index == 0){
                    // get the last clone position
                    position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
                    slider.active.last = false;
                    // normal non-zero requests
                }else if(slideIndex >= 0){
                    var requestEl = slideIndex * getMoveBy();
                    position = slider.children.eq(requestEl).position();
                }

                /* If the position doesn't exist
				 * (e.g. if you destroy the slider on a next click),
				 * it doesn't throw an error.
				 */
                if ("undefined" !== typeof(position)) {
                    var value = slider.settings.mode == 'horizontal' ? -(position.left - moveBy) : -position.top;
                    // plugin values to be animated
                    setPositionProperty(value, 'slide', slider.settings.speed);
                }
            }
        }

        /**
		 * Transitions to the next slide in the show
		 */
        el.goToNextSlide = function(){
            // if infiniteLoop is false and last page is showing, disregard call
            if (!slider.settings.infiniteLoop && slider.active.last) return;
            var pagerIndex = parseInt(slider.active.index) + 1;
            el.goToSlide(pagerIndex, 'next');
        }

        /**
		 * Transitions to the prev slide in the show
		 */
        el.goToPrevSlide = function(){
            // if infiniteLoop is false and last page is showing, disregard call
            if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
            var pagerIndex = parseInt(slider.active.index) - 1;
            el.goToSlide(pagerIndex, 'prev');
        }

        /**
		 * Starts the auto show
		 *
		 * @param preventControlUpdate (boolean)
		 *  - if true, auto controls state will not be updated
		 */
        el.startAuto = function(preventControlUpdate){
            // if an interval already exists, disregard call
            if(slider.interval) return;
            // create an interval
            slider.interval = setInterval(function(){
                slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
            }, slider.settings.pause);
            // if auto controls are displayed and preventControlUpdate is not true
            if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
        }

        /**
		 * Stops the auto show
		 *
		 * @param preventControlUpdate (boolean)
		 *  - if true, auto controls state will not be updated
		 */
        el.stopAuto = function(preventControlUpdate){
            // if no interval exists, disregard call
            if(!slider.interval) return;
            // clear the interval
            clearInterval(slider.interval);
            slider.interval = null;
            // if auto controls are displayed and preventControlUpdate is not true
            if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
        }

        /**
		 * Returns current slide index (zero-based)
		 */
        el.getCurrentSlide = function(){
            return slider.active.index;
        }

        /**
		 * Returns current slide element
		 */
        el.getCurrentSlideElement = function(){
            return slider.children.eq(slider.active.index);
        }

        /**
		 * Returns number of slides in show
		 */
        el.getSlideCount = function(){
            return slider.children.length;
        }

        /**
		 * Update all dynamic slider elements
		 */
        el.redrawSlider = function(){
            // resize all children in ratio to new screen size
            slider.children.add(el.find('.bx-clone')).width(getSlideWidth());
            // adjust the height
            slider.viewport.css('height', getViewportHeight());
            // update the slide position
            if(!slider.settings.ticker) setSlidePosition();
            // if active.last was true before the screen resize, we want
            // to keep it last no matter what screen size we end on
            if (slider.active.last) slider.active.index = getPagerQty() - 1;
            // if the active index (page) no longer exists due to the resize, simply set the index as last
            if (slider.active.index >= getPagerQty()) slider.active.last = true;
            // if a pager is being displayed and a custom pager is not being used, update it
            if(slider.settings.pager && !slider.settings.pagerCustom){
                populatePager();
                updatePagerActive(slider.active.index);
            }
        }

        /**
		 * Destroy the current instance of the slider (revert everything back to original state)
		 */
        el.destroySlider = function(){
            // don't do anything if slider has already been destroyed
            if(!slider.initialized) return;
            slider.initialized = false;
            $('.bx-clone', this).remove();
            slider.children.each(function() {
                $(this).data("origStyle") != undefined ? $(this).attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
            });
            $(this).data("origStyle") != undefined ? this.attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
            $(this).unwrap().unwrap();
            if(slider.controls.el) slider.controls.el.remove();
            if(slider.controls.next) slider.controls.next.remove();
            if(slider.controls.prev) slider.controls.prev.remove();
			
            /* FARFETCH UPDATE FARFETCH UPDATE FARFETCH UPDATE FARFETCH UPDATE FARFETCH UPDATE
			
			if(slider.pagerEl && slider.settings.controls) slider.pagerEl.remove();
			
		
			FARFETCH UPDATE FARFETCH UPDATE FARFETCH UPDATE FARFETCH UPDATE FARFETCH UPDATE */
			
            $('.bx-caption', this).remove();
            if(slider.controls.autoEl) slider.controls.autoEl.remove();
            clearInterval(slider.interval);
            if(slider.settings.responsive) $(window).unbind('resize', resizeWindow);
        }

        /**
		 * Reload the slider (revert all DOM changes, and re-initialize)
		 */
        el.reloadSlider = function(settings){
            if (settings != undefined) options = settings;
            el.destroySlider();
            init();
        }

        init();

        // returns the current jQuery object
        return this;
    }

})(jQuery);$(document).ready(function () {
    /**
     * FFAPI Variables BX Sliders. This array will save the BX sliders we started
     * <b><i>FFAPI.variables.jsSliderSingle = [];<br /></i></b>
     * @property FFAPI.variables.jsSliderSingle
     * @type Array
     */
	FFAPI.variables.jsSliderSingle = [];
	/**
     * FFAPI Variables BX Sliders ID's. This array will save the BX sliders ID's
     * <b><i>FFAPI.variables.jsSliderSingleId = [];<br /></i></b>
     * @property FFAPI.variables.jsSliderSingleId
     * @type Array
     */
	FFAPI.variables.jsSliderSingleId = [];
	/**
     * FFAPI Variables BX Sliders Class Name. This variable saves the class to start the single BX Slider
     * <b><i>FFAPI.variables.jsSliderSingleClass = '.js-sliderSingle';<br /></i></b>
     * @property FFAPI.variables.jsSliderSingleClass
     * @type String
     */
	FFAPI.variables.jsSliderSingleClass = $('.js-sliderSingle');
	/**
     * For each Single Slider class we execute the bsxlider start
     * @method $.each($(jsSliderSingleClass), function(index, val) {
     * @param
     */
	$.each(FFAPI.variables.jsSliderSingleClass, function(index, val) {
		/// console.log("Slider Single");
		/// Variables to get the parent and our ID
		var aux = $(this).parents('li'),
			auxId = aux.find('>a').data('slider-id');
		/// Start the Slider
		FFAPI.variables.jsSliderSingle[index] = $(this).bxSlider({
			mode: 'fade',
			controls: 'false',
			pager: $(this).find("li").length > 1
		});
		/// Save the id and index
		FFAPI.variables.jsSliderSingleId[index] = auxId;
	});
});

FFAPI.variables.product = FFAPI.variables.product || {};
FFAPI.variables.sliderNamesFinal = [];

// HTML TEMPLATES
FFAPI.variables.product.productTemplateCarousel = "/static/js/ajax/productcarousel.html";
FFAPI.variables.product.productTemplateCarouselWithCloseButton = "/static/js/ajax/productcarousel.html";

// AJAX URL
FFAPI.variables.product.recentlyViewedItemsAjaxUrl = "/common/GetRecentlyViewedCarousel";

// SELECTORS
FFAPI.variables.product.tabContainerId = "tabs";
FFAPI.variables.product.tabAnchorRecommendationsId = "tab-recommendations";
FFAPI.variables.product.tabAnchorRecentViewedId = "tab-recentViewed";
FFAPI.variables.product.tabDivRecommendationsId = "tabs-recommendations";
FFAPI.variables.product.tabDivRecentViewedId = "tabs-recentViewedItems";
FFAPI.variables.product.sliderSelector = "js-sliderProduct";
FFAPI.variables.product.tabContainer = null;

function mqCarousel(slidesCount) {

    var slides = {
        'xl': 2,
        'md': 2,
        'sm': 2,
        'xs': 3
    };
    var $tabsParent = FFAPI.variables.product.tabContainer.parent();
    var parentCol = newCol = 12;
    var regex = $tabsParent.attr('class').match(new RegExp('col([0-9]{1,})', 'i'));
    var containerWidth = $tabsParent.width() * 1.0;
    if(regex) { newCol = parseInt(regex[1]); }

    slides.xl = Math.ceil((newCol * 8) / parentCol);
    slides.md = Math.ceil(slides.xl * 0.75);
    slides.sm = Math.ceil(slides.xl * 0.5);
    // Set minimum of 2 in all formats
    for(var format in slides) { if(slides[format] < slides.xs) slides[format] = slides.xs }

    var slider,
        largeSlider = {
            slideWidth: (containerWidth / slides.xl) - 1,
            minSlides: slides.xl,
            maxSlides: slides.xl,
            moveSlides: slides.xl,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        },
        mediumSlider = {
            slideWidth: (containerWidth / slides.md) - 1,
            minSlides: slides.md,
            maxSlides: slides.md,
            moveSlides: slides.md,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        },
        smallSlider = {
            slideWidth: (containerWidth / slides.sm) - 1,
            minSlides: slides.sm,
            maxSlides: slides.sm,
            moveSlides: slides.sm,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        },
        xsmallSlider = {
            slideWidth: (containerWidth / slides.xs) - 1,
            minSlides: slides.xs,
            maxSlides: slides.xs,
            moveSlides: slides.xs,
            pager: false,
            oneToOneTouch: false,
            onSliderLoad: function (currentIndex) {
                $('.no-touch .sliderTabs-slide').rollover({ animate: true, crossfade: true });
            }
        };

    var sliderOptions = {};

    if (window.innerWidth >= 1024 + 1) {
        sliderOptions = $.extend(true, {}, largeSlider);
    }
    else if (window.innerWidth < 500) {
        sliderOptions = $.extend(true, {}, xsmallSlider);
    }
    else if (window.innerWidth < 768 + 1) {
        sliderOptions = $.extend(true, {}, smallSlider);
    }
    else if (window.innerWidth < 1024 + 1) {
        sliderOptions = $.extend(true, {}, mediumSlider);
    }

    if (slidesCount && sliderOptions.minSlides >= slidesCount) {
        sliderOptions.controls = false;
        sliderOptions.infiniteLoop = false;
    }
    
    return sliderOptions;
}

FFAPI.methods.bindBxSlider = function (tabContent) {
    var slider = tabContent.find(('.' + FFAPI.variables.product.sliderSelector));
    var sliderId = tabContent.attr('id');
    var slidesCount = slider.find('li').size();
    var sliderOptions = mqCarousel(slidesCount);
    
    FFAPI.methods.setExtraOptions(sliderOptions);
    
    FFAPI.variables.sliderNamesFinal[sliderId] = slider.bxSlider(sliderOptions);
};

FFAPI.methods.reloadBxSlider = function (tabContent) {
    var slider = tabContent.find(('.' + FFAPI.variables.product.sliderSelector));
    var sliderId = tabContent.attr('id');
    var slidesCount = slider.find('li:not(.bx-clone)').size();
    var sliderOptions = mqCarousel(slidesCount);

    FFAPI.methods.setExtraOptions(sliderOptions);

    if (FFAPI.variables.sliderNamesFinal[sliderId] != undefined && FFAPI.variables.sliderNamesFinal[sliderId].length > 0) {
        FFAPI.variables.sliderNamesFinal[sliderId].reloadSlider(sliderOptions);
    }
};

FFAPI.methods.setExtraOptions = function (sliderOptions) {
    sliderOptions.onSlidePrev = function ($slideElement, oldIndex, newIndex) {
        if (typeof (_fftrkobj) !== 'undefined') {
            _fftrkobj.parse('290');
        }
    };
    sliderOptions.onSlideNext = function ($slideElement, oldIndex, newIndex) {
        if (typeof (_fftrkobj) !== 'undefined') {
            _fftrkobj.parse('290');
        }
    };
};

// Renders a product's list into a carousel
FFAPI.methods.renderProductCarousel = function (templateUrl, dataJson, targetDiv) {
    $.get(templateUrl, function (template) {
        var template = Hogan.compile(template);
        var output = template.render(dataJson).replace(/^\s*/mg, '');

        tgDiv.empty();
        tgDiv.html(output);

        FFAPI.methods.bindBxSlider(tgDiv);
        FFAPI.methods.addBlankLinks();
    });
};

FFAPI.methods.removeRecentlyViewedItem = function (btn) {
    $(btn).closest(".sliderTabs-slide").remove();

    var divRecently = $("#" + FFAPI.variables.product.tabDivRecentViewedId);
    if (divRecently.length > 0) {
        if ($(divRecently).find("li.sliderTabs-slide").length > 0) {
            FFAPI.methods.bindBxSlider(divRecently);
        } else {
            var htmlToReplace = '<div class="baseline col12 col-md-12 col-sm-12 col-xs-12"> <h5 class="heading-regular">' + FFAPI.translations.noRecentlyViewedItems + '</h5></div>';
            divRecently.html(htmlToReplace);
        }
    }
}

// Loads recently viewed items
FFAPI.methods.loadRecentlyViewedItems = function (callback) {

    var divRecently = $("#" + FFAPI.variables.product.tabDivRecentViewedId);
    $.ajax({
        type: window.location.protocol == "https:" ? "POST" : "GET",
        //url: window.universal_variable.page.subfolder + "/common/GetRecentlyViewedCarousel",
        url: requireMainFolder + jsFolderMain + 'ajax/recent.html',
        cache: false,
        success: function (resp, textStatus, jqXHR) {
            // FFAPI.methods.renderProductCarousel(FFAPI.variables.product.productTemplateCarousel,
            //                                     resp,
            //                                     divRecently);
            divRecently.html(resp);
            FFAPI.methods.bindBxSlider(divRecently);
            FFAPI.methods.addBlankLinks();

            divRecently.data('tabsloaded', true);

            if (callback) { callback(); }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var htmlToReplace = '<div class="baseline col12 col-md-12 col-sm-12 col-xs-12"><h5 class="heading-regular">' + FFAPI.translations.noRecentlyViewedItems + '</h5></div>';
            divRecently.html(htmlToReplace);
            divRecently.data('tabsloaded', true);
        }
    });
};

// Loads recommendations from Certona
// FFAPI.methods.loadRecommendations = function (templateUrl, recommendationsJSON, targetDiv, callback) {

//     var dataObj = recommendationsJSON;
//     if (typeof (dataObj) !== "undefined" && dataObj != null
//         && typeof (dataObj.resonance) !== "undefined" && typeof (dataObj.resonance.schemes[0]) !== "undefined" && dataObj.resonance.schemes[0] != null
//         && typeof (dataObj.resonance.schemes[0].items[0]) !== "undefined" && dataObj.resonance.schemes[0].items[0] != null
//         && typeof (dataObj.resonance.schemes[0].items[0].Id) !== "undefined" && dataObj.resonance.schemes[0].items[0].Id != null) {

//         var data = dataObj.resonance.schemes[0];

//         for (var a in data.items) {
//             data.items[a].Detailurl = window.universal_variable.page.subfolder + data.items[a].Detailurl;
//         }
            
//         var tgDiv = $("#" + targetDiv);
//         FFAPI.methods.renderProductCarousel(templateUrl, data, tgDiv);
//         /*  Add Clickstream trk attributes to recommendations */
//         if (window.universal_variable && window.universal_variable.page && window.universal_variable.page.pageId === "basket") {
//             tgDiv.find('ul a').attr('trk', '138');
//         } else if (window.universal_variable && window.universal_variable.page && window.universal_variable.page.pageId === "transaction") {
//             tgDiv.find('ul a').attr('trk', '193');
//         }
//         
//         tgDiv.data('tabsloaded', true);

//         if (callback) { callback(); }
//     }
// };

/* FOR UI GITHUB BRANCH PURPOSE */
FFAPI.methods.loadRecommendations = function (callback) {

    var divRecommendations = $("#" + FFAPI.variables.product.tabDivRecommendationsId);

    $.ajax({
        type: window.location.protocol == "https:" ? "POST" : "GET",
        url: requireMainFolder + jsFolderMain + 'ajax/recommendations.html',
        cache: false,
        success: function (resp, textStatus, jqXHR) {
            divRecommendations.html(resp);
            FFAPI.methods.bindBxSlider(divRecommendations);
            FFAPI.methods.addBlankLinks();

            divRecommendations.data('tabsloaded', true);

            if (callback) { callback(); }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            divRecommendations.data('tabsloaded', true);
        }
    });
};
/* FOR UI GITHUB BRANCH PURPOSE */

// Initialize the recommendations container
FFAPI.methods.initRecommendations = function (certonaDomWaitingTime) {
    var CertonaDOMWaitingTimeInMs = certonaDomWaitingTime, CertonaTimeout, CertonaInterval;

    checkForRecommendations = function () {
        var doc = $(document),
            data = doc.data("recommendations");
        if (typeof (data) === "boolean" && data === false) {
            recommendationsOffAction();
        } else if (typeof (data) === "object") {
            clearTimeout(FFAPI.variables.CertonaInterval);
            clearTimeout(FFAPI.variables.CertonaTimeout);
            FFAPI.variables.CertonaInterval = undefined;
            FFAPI.variables.CertonaTimeout = undefined;

            FFAPI.methods.loadRecommendations(FFAPI.variables.product.productTemplateCarousel,
                                                data,
                                                FFAPI.variables.product.tabDivRecommendationsId,
                                                null);
        }
    };

    recommendationsOffAction = function () {

        // stop checking, it failed already
        clearTimeout(FFAPI.variables.CertonaInterval);
        clearTimeout(FFAPI.variables.CertonaTimeout);
        FFAPI.variables.CertonaInterval = undefined;
        FFAPI.variables.CertonaTimeout = undefined;
        // recommendations off, jump to recently viewed items tab
        $('#' + FFAPI.variables.product.tabAnchorRecommendationsId).parent().hide();
        $("#" + FFAPI.variables.product.tabAnchorRecentViewedId).trigger("click");
    };

    $(document).ready(function () {
        if (FFAPI.variables.CertonaInterval != undefined) {
            clearTimeout(FFAPI.variables.CertonaInterval);
            clearTimeout(FFAPI.variables.CertonaTimeout);
        }
        FFAPI.variables.CertonaInterval = setInterval(checkForRecommendations, 100);
        FFAPI.variables.CertonaTimeout = setTimeout(function () { recommendationsOffAction(); }, CertonaDOMWaitingTimeInMs);
    });
};

require(['essentials'], function () {
    $(document).ready(function () {
        tabContentRecent = $('#' + FFAPI.variables.product.tabDivRecentViewedId),
        tabContentRecommendations = $('#' + FFAPI.variables.product.tabDivRecommendationsId);

        // Set tab container node and jquery object
        var tabContainerNode = document.getElementById(FFAPI.variables.product.tabContainerId);
        if (tabContainerNode) {
            FFAPI.variables.product.tabContainer = $(tabContainerNode);

            // Set callback functions on tabs plugin
            var tabs = FFAPI.plugins.tabs.get(tabContainerNode);
            tabs.setCallback('show', function(event, item) {
                var $itemContent = $(item.content);
                if($itemContent.data("tabsloaded")) {
                    FFAPI.methods.reloadBxSlider($itemContent);
                }
            });

            $("body").on("click", "#" + FFAPI.variables.product.tabAnchorRecentViewedId, function (e) {
                if (tabContentRecent.data("tabsloaded") != true) {
                    FFAPI.methods.loadRecentlyViewedItems();
                }
            });

            /* FOR UI GITHUB BRANCH PURPOSE */
            $("body").on("click", "#" + FFAPI.variables.product.tabAnchorRecommendationsId, function (e) {
                if (tabContentRecommendations.data("tabsloaded") != true) {
                    FFAPI.methods.loadRecommendations();
                }
            });
            $("#" + FFAPI.variables.product.tabAnchorRecommendationsId).trigger("click");
            /* FOR UI GITHUB BRANCH PURPOSE */

            $(window).smartresize(function() {
                if(tabs.activeItem) {
                    var $itemContent = $(tabs.activeItem.content);
                    if($itemContent.data("tabsloaded")) {
                        FFAPI.methods.reloadBxSlider($itemContent);
                    }
                }
            }, FFAPI.variables.resizeWindowTime);
        }
    });
});

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
      this.options = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href = !$this.attr('href') ? $this.data('href') : $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {
    
    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };
    
    function isElementInDOM(ele) {
      while (ele = ele.parentNode) {
        if (ele == document) return true;
      }
      return false;
    };
    
    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    };
    
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();
                
                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);
                
                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    gravity = maybeCall(this.options.gravity, this.$element[0]);

                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = { top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2 };
                        break;
                    case 's':
                        tp = { top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2 };
                        break;
                    case 'e':
                        tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset };
                        break;
                    case 'w':
                        tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset };
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }
                
                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        
        is_shown: function()
        {

            var visibleTipsy = this.tip().is(':visible');
             ///console.log(visibleTipsy);
            return visibleTipsy;

        },

        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
                this.$tip.data('tipsy-pointee', this.$element[0]);
            }
            return this.$tip;
        },
        
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    $.fn.tipsy = function(options) {
        
        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) tipsy[options]();
            return this;
        }
        
        options = $.extend({}, $.fn.tipsy.defaults, options);
        
        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };
        
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };
        
        if (!options.live) this.each(function() { get(this); });
        
        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: true,
        fallback: '',
        gravity: 'n',
        html: true,
        live: false,
        offset: 0,
        opacity: 1,
        title: 'title',
        trigger: 'hover'
    };
    
    $.fn.tipsy.revalidate = function() {
      $('.tipsy').each(function() {
        var pointee = $.data(this, 'tipsy-pointee');
        if (!pointee || !isElementInDOM(pointee)) {
          $(this).remove();
        }
      });
    };
    
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
    
    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable 
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
     $.fn.tipsy.autoBounds = function(margin, prefer) {
        return function() {
            var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
                boundTop = $(document).scrollTop() + margin,
                boundLeft = $(document).scrollLeft() + margin,
                $this = $(this);

            if ($this.offset().top < boundTop) dir.ns = 'n';
            if ($this.offset().left < boundLeft) dir.ew = 'w';
            if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
            if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

            return dir.ns + (dir.ew ? dir.ew : '');
        }
    };
})(jQuery);

function tooltips()
{
  $('.no-touch .tooltips').tipsy(
  {
    gravity: function(){return $(this).data('orientation')},
    className: function(){return $(this).data('color')}
  });

$('.inputTooltips').tipsy(
  {
    trigger: 'focus',
    gravity: function(){return $(this).data('orientation')},
    className: function(){return $(this).data('color')}
  });

  var tooltipsTimer;

  $('.hoverTooltips').tipsy({
    trigger:'manual',
    gravity: function(){return $(this).data('orientation')},
    className: function(){return $(this).data('color')},
    offset: 15
  });

  $('.hoverTooltips').bind('mouseenter',function(e){
   clearTimeout(tooltipsTimer);
   $(".hoverTooltip").remove();
   $(this).tipsy('show');
  });

  $('.hoverTooltips').on('mouseleave',function(e){
    tooltipsTimer = setTimeout("$('.hoverTooltip').fadeOut();",500);//hide the link in 0.5 seconds
  });

  $('.hoverTooltip').on('mouseover',function(e){
    clearTimeout(tooltipsTimer);
  });
  $('.hoverTooltip').on('mouseout',function(e){
    tooltipsTimer = setTimeout("$('.hoverTooltip').fadeOut();",500);//hide the link in 0.5 seconds
  });

  $('.clickTooltips').tipsy({
    trigger:'manual',
    gravity: function(){return $(this).data('orientation')},
    className: function(){return $(this).data('color')},
    offset: 13
  });

  var visibleTooltip=true;
  $('.clickTooltips').bind('click',function(e){
   
    e.preventDefault();

    if(visibleTooltip==false)
    {
      $(this).tipsy('hide');
      $('.clickTooltip').fadeOut();
      visibleTooltip=true;
      return false;
    }
    else
    {
      $('.clickTooltip').fadeOut();
      $(this).tipsy('show');
      visibleTooltip=false;
      return false;
    }
  });
  
    $('body').on("click", function() {
        if(visibleTooltip==false) {
            $('.clickTooltip').fadeOut();
            visibleTooltip=true;
             return false;
        }
    });
   
}/*=====================================================
 =        ROLLOVER MENU PLUGIN V1.0.0 - 2013/08/31          =
 = Copyright Farfetch 2013
 = Dual licensed under the MIT
 (http://www.opensource.org/licenses/mit-license.php)
 = and GPL
 (http://www.opensource.org/licenses/gpl-license.php) licenses.
 V1.1.0 - added the crossfade animation
 =====================================================*/
(function ($) {
    var defaults = {
        switchImages: true,
        mouseenter: null,
        mouseleave: null,
        image: "data-img",
        image_alt: "data-img-alt",
        show: "",
        animate: false,
        crossfade: false,
        hide: ""
    };
    // Methods object
    var methods = {
        bindEvents: function (jQThis, settings, jQShow, jQHide, jQImage) {
            /// <summary>
            ///     Toggle animation when over a image
            /// </summary>
            /// <param name="jQThis" type="jQObject">
            ///     Element where it's being applied the animation (this)
            /// </param>
            /// <param name="settings" type="Object">
            ///     settings of the plugin
            /// </param>
            /// <param name="jQShow" type="jQObject">
            ///     Elements to show if not empty
            /// </param>
            /// <param name="jQHide" type="jQObject">
            ///     Elements to hide if not empty
            /// </param>
            /// <param name="jQImage" type="jQObject">
            ///     The Image element to get the source and the second source
            /// </param>
            jQThis.on("mouseenter", function (e) {
                if (jQHide != null) jQHide.hide();
                if (jQShow != null) jQShow.show();
                if (settings.switchImages) {
                    var altsrc = jQThis.find(".imageRollover").attr(settings.image_alt);
                    if (altsrc) {
                        /*CROSSFADE ANIMATION
                         IT CREATES A IMG ELEMENT
                         IF THE BROWSER SUPPORTS CSS3 ANIMATIONS
                         IT WILL ADD A CLASS ELSE
                         ANIMATES WITH JQUERY
                         */
                        if (settings.crossfade === true) {
                            jQImage.addClass('absolute');
                            if (jQImage.next(".absolute").length > 0) {
                                var newimg = jQImage.next("img");
                            }
                            else {
                                var newimg = $('<img class="absolute hide">');
                                newimg.attr('src', altsrc);
                                newimg.insertAfter(jQImage);
                            }

                            if (!Modernizr.csstransitions) {
                                newimg.fadeIn(300);
                                jQImage.fadeOut(300);
                            }
                            else {
                                jQImage.addClass('absolute').addClass('crossfade').addClass('opacity-crossfade');
                                newimg.removeClass('hide');
                            }
                            if (settings.animate === true)
                                newimg.addClass('rolloverActive');
                        }
                        else {
                            jQImage.attr("src", altsrc);
                            /*SIMPLE ANIMATION*/
                            if (settings.animate === true)
                                jQImage.removeClass('rollover').addClass('rolloverActive');
                        }
                    }
                }
                if (typeof (settings.mouseenter) === "function") {
                    settings.mouseenter(jQThis);
                }
            }).on("mouseleave", function (e) {
                if (jQHide != null) jQHide.show();
                if (jQShow != null) jQShow.hide();
                if (settings.switchImages) {
                    var src = jQThis.find(".imageRollover").attr(settings.image);
                    if (src) {
                        /*CROSSFADE*/
                        if (settings.crossfade === true) {
                            if (jQImage.next("img").length > 0) {
                                var newimg = jQImage.next(".absolute");
                            }
                            else {
                                var newimg = $('<img class="absolute hide">');
                            }
                            if (!Modernizr.csstransitions) {
                                newimg.fadeOut(300);
                                jQImage.fadeIn(300);
                            }
                            else {
                                jQImage.removeClass('opacity-crossfade ');
                            }
                        }
                        else {
                            jQImage.attr("src", src);
                            if (settings.animate === true)
                                jQImage.removeClass('rolloverActive').addClass('rollover');
                        }
                    }
                }
                if (typeof (settings.mouseleave) === "function") {
                    settings.mouseleave(jQThis);
                }
            });
        },
        init: function (options) {
            /// <summary>
            ///     Initializes Rollover objects
            /// </summary>
            /// <param name="options" type="object">
            ///     Object with initial parameters
            /// </param>
            /// <returns type="this" />
            if (this.length) {
                // extend options, set defaults for options not set
                var settings = {};
                if (options) {
                    settings = $.extend(settings, defaults, options);
                }
                var jQShow = null,
                    jQHide = null;
                //Checks if element is already a image or if it's inside a DIV
                if (this.is('img'))
                    jQImage = this;
                else
                    jQImage = this.find("img:first");
                //Check if there are plus elements to show
                if (settings.show != "") {
                    jQShow = $(settings.show, this);
                    if (!jQShow.length) {
                        jQShow = null;
                    }
                }
                //Check if there are plus elements to hide
                if (settings.hide != "") {
                    jQHide = $(settings.hide, this);
                    if (!jQHide.length) {
                        jQHide = null;
                    }
                }
                methods.bindEvents(this, settings, jQShow, jQHide, jQImage);
            }
            return this;
        }
    };
    // Method caller. Will call "init" with given parameters if no methods are called
    $.fn.rollover = function (method, args) {
        return this.each(function () {
            if (methods[method]) {
                if (args) {
                    return methods[method].apply($(this), args);
                } else {
                    return methods[method]();
                }
            } else if (typeof method === 'object' || !method) {
                return methods.init.call($(this), method);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.rollover');
            }
        });
    };
})(jQuery);

/**
*  Ajax Autocomplete for jQuery, version 1.2.7
*  (c) 2013 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*/

/*jslint  browser: true, white: true, plusplus: true */
/*global define, window, document, jQuery */

// Expose plugin as an AMD module if AMD loader is present:
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var
        utils = (function () {
            return {
                escapeRegExChars: function (value) {
                    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                },
                createNode: function (html) {
                    var div = document.createElement('div');
                    div.innerHTML = html;
                    return div.firstChild;
                }
            };
        }()),

        keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };

    function Autocomplete(el, options) {
        var noop = function () { },
            that = this,
            defaults = {
                autoSelectFirst: false,
                appendTo: 'body',
                serviceUrl: null,
                lookup: null,
                onSelect: null,
                width: 'auto',
                minChars: 1,
                maxHeight: 300,
                deferRequestBy: 0,
                params: {},
                formatResult: Autocomplete.formatResult,
                delimiter: null,
                zIndex: 9999,
                type: 'GET',
                noCache: false,
                onSearchStart: noop,
                onSearchComplete: noop,
                containerClass: 'autocomplete-suggestions',
                tabDisabled: false,
                dataType: 'text',
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    return suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1;
                },
                paramName: 'query',
                transformResult: function (response) {
                    return typeof response === 'string' ? $.parseJSON(response) : response;
                },
                categories: false,
            };

        // Shared variables:
        that.element = el;
        that.el = $(el);
        that.suggestions = [];
        that.badQueries = [];
        that.selectedIndex = -1;
        that.currentValue = that.element.value;
        that.intervalId = 0;
        that.cachedResponse = [];
        that.onChangeInterval = null;
        that.onChange = null;
        that.isLocal = false;
        that.suggestionsContainer = null;
        that.options = $.extend({}, defaults, options);
        that.classes = {
            selected: 'autocomplete-selected',
            suggestion: 'autocomplete-suggestion',
            group: 'autocomplete-group'
        };
        that.hint = null;
        that.hintValue = '';
        that.selection = null;

        // Initialize and set options:
        that.initialize();
        that.setOptions(options);
    }

    Autocomplete.utils = utils;

    $.Autocomplete = Autocomplete;

    Autocomplete.formatResult = function (suggestion, currentValue) {
        var pattern = '(' + utils.escapeRegExChars(currentValue) + ')';

        return suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
    };

    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {
            var that = this,
                suggestionSelector = '.' + that.classes.suggestion,
                selected = that.classes.selected,
                options = that.options,
                container;

            // Remove autocomplete attribute to prevent native suggestions:
            that.element.setAttribute('autocomplete', 'off');

            that.killerFn = function (e) {
                if ($(e.target).closest('.' + that.options.containerClass).length === 0) {
                    that.killSuggestions();
                    that.disableKillerFn();
                }
            };

            that.suggestionsContainer = Autocomplete.utils.createNode('<div class="' + options.containerClass + '" style="position: absolute; display: none;"></div>');

            container = $(that.suggestionsContainer);

            container.appendTo(options.appendTo);

            // Only set width if it was provided:
            if (options.width !== 'auto') {
                container.width(options.width);
            }

            // Listen for mouse over event on suggestions list:
            container.on('mouseover.autocomplete', suggestionSelector, function () {
                that.activate($(this).data('index'));
            });

            // Deselect active element when mouse leaves suggestions container:
            container.on('mouseout.autocomplete', function () {
                that.selectedIndex = -1;
                container.children('.' + selected).removeClass(selected);
            });

            // Listen for click event on suggestions list:
            container.on('click.autocomplete', suggestionSelector, function () {
                that.select($(this).data('index'));
            });

            that.fixPosition();

            that.fixPositionCapture = function () {
                if (that.visible) {
                    that.fixPosition();
                }
            };

            $(window).on('resize', that.fixPositionCapture);

            that.el.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });
            that.el.on('keyup.autocomplete', function (e) { that.onKeyUp(e); });
            that.el.on('blur.autocomplete', function () { that.onBlur(); });
            that.el.on('focus.autocomplete', function () { that.fixPosition(); });
            that.el.on('change.autocomplete', function (e) { that.onKeyUp(e); });
        },

        onBlur: function () {
            this.enableKillerFn();
        },

        setOptions: function (suppliedOptions) {
            var that = this,
                options = that.options;

            $.extend(options, suppliedOptions);

            that.isLocal = $.isArray(options.lookup);

            if (that.isLocal) {
                options.lookup = that.verifySuggestionsFormat(options.lookup);
            }

            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                'max-height': options.maxHeight + 'px',
                'width': options.width + 'px',
                'z-index': options.zIndex
            });
        },

        clearCache: function () {
            this.cachedResponse = [];
            this.badQueries = [];
        },

        clear: function () {
            this.clearCache();
            this.currentValue = '';
            this.suggestions = [];
        },

        disable: function () {
            this.disabled = true;
        },

        enable: function () {
            this.disabled = false;
        },

        fixPosition: function () {
            var that = this,
                offset;

            // Don't adjsut position if custom container has been specified:
            if (that.options.appendTo !== 'body') {
                return;
            }

            offset = that.el.offset();

            $(that.suggestionsContainer).css({
                top: (offset.top + that.el.outerHeight()) + 'px',
                left: offset.left + 'px'
            });
        },

        enableKillerFn: function () {
            var that = this;
            $(document).on('click.autocomplete', that.killerFn);
        },

        disableKillerFn: function () {
            var that = this;
            $(document).off('click.autocomplete', that.killerFn);
        },

        killSuggestions: function () {
            var that = this;
            that.stopKillSuggestions();
            that.intervalId = window.setInterval(function () {
                that.hide();
                that.stopKillSuggestions();
            }, 300);
        },

        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId);
        },

        isCursorAtEnd: function () { 
            var that = this,
                valLength = that.el.val().length,
                selectionStart = that.element.selectionStart,
                range;

            if (typeof selectionStart === 'number') {
                return selectionStart === valLength;
                 $(".header-search-noResults").hide();
            }
            if (document.selection) {
                range = document.selection.createRange();
                range.moveStart('character', -valLength);
                return valLength === range.text.length;
                 $(".header-search-noResults").hide();
            }
            return true;
        },

        onKeyPress: function (e) {
            var that = this;

            // If suggestions are hidden and user presses arrow down, display suggestions:
            if (!that.disabled && !that.visible && e.which === keys.DOWN && that.currentValue) {
                that.suggest();
                return;
            }

            if (that.disabled || !that.visible) {
                return;
            }

            switch (e.which) {
                case keys.ESC:
                    that.el.val(that.currentValue);
                    that.hide();
                    break;
                case keys.RIGHT:
                    if (that.hint && that.options.onHint && that.isCursorAtEnd()) {
                        that.selectHint();
                        break;
                    }
                    return;
                case keys.TAB:
                case keys.RETURN:
                    if (e.which === keys.TAB && that.hint) {
                        that.selectHint();
                        return;
                    }
                    if (that.selectedIndex === -1) {
                        that.hide();
                        return;
                    }
                    that.select(that.selectedIndex);
                    if (e.which === keys.TAB && that.options.tabDisabled === false) {
                        return;
                    }
                    break;
                case keys.UP:
                    that.moveUp();
                    break;
                case keys.DOWN:
                    that.moveDown();
                    break;
                default:
                    return;
            }

            // Cancel event if function did not return:
            e.stopImmediatePropagation();
            e.preventDefault();
        },

        onKeyUp: function (e) {
            var that = this;

            if (that.disabled) {
                return;
            }

            switch (e.which) {
                case keys.UP:
                case keys.DOWN:
                    return;
            }

            clearInterval(that.onChangeInterval);

            if (that.currentValue !== that.el.val()) {
                that.findBestHint();
                if (that.options.deferRequestBy > 0) {
                    // Defer lookup in case when value changes very quickly:
                    that.onChangeInterval = setInterval(function () {
                        that.onValueChange();
                    }, that.options.deferRequestBy);
                } else {
                    that.onValueChange();
                }
            }
        },

        onValueChange: function () {
            var that = this,
                q;

            if (that.selection) {
                that.selection = null;
                (that.options.onInvalidateSelection || $.noop)();
            }

            clearInterval(that.onChangeInterval);
            that.currentValue = that.el.val();

            q = that.getQuery(that.currentValue);
            that.selectedIndex = -1;

            if (q.length < that.options.minChars) {
                that.hide();
                ///farfetch update
                ///farfetch update
                ///farfetch update
                $('.js-results-container').hide();
                $(".header-search-noResults").hide();
                ///end farfetch update
                ///end farfetch update
                ///end farfetch update
            } else {
                that.getSuggestions(q);
            } 
        },

        getQuery: function (value) {
            var delimiter = this.options.delimiter,
                parts;

            if (!delimiter) {
                return $.trim(value);
            }
            parts = value.split(delimiter);
            return $.trim(parts[parts.length - 1]);
        },

        getSuggestionsLocal: function (query) {
            var that = this,
                queryLowerCase = query.toLowerCase(),
                filter = that.options.lookupFilter;

            return {
                suggestions: $.grep(that.options.lookup, function (suggestion) {
                    return filter(suggestion, query, queryLowerCase);
                })
            };
        },

        getSuggestions: function (q) {
            var response,
                that = this,
                options = that.options,
                serviceUrl = options.serviceUrl;

            response = that.isLocal ? that.getSuggestionsLocal(q) : that.cachedResponse[q];

            if (response && $.isArray(response.suggestions)) {
                that.suggestions = response.suggestions;
                that.suggest();
            } else if (!that.isBadQuery(q)) {
                options.params[options.paramName] = q;
                if (options.onSearchStart.call(that.element, options.params) === false) {
                    return;
                }
                if ($.isFunction(options.serviceUrl)) {
                    serviceUrl = options.serviceUrl.call(that.element, q);
                }
                $.ajax({
                    url: serviceUrl,
                    data: options.ignoreParams ? null : options.params,
                    type: options.type,
                    dataType: options.dataType
                }).done(function (data) {
                    that.processResponse(data, q);
                    options.onSearchComplete.call(that.element, q);
                });
            }
        },

        isBadQuery: function (q) {
            var badQueries = this.badQueries,
                i = badQueries.length;
            while (i--) {
                if (q.indexOf(badQueries[i]) === 0) {
                    return true;
                }
            }
            return false;
        },

        hide: function () {
            var that = this;
            that.visible = false;
            that.selectedIndex = -1;
            $(that.suggestionsContainer).hide();
            that.signalHint(null);
            ///farfetch updates
            ///farfetch updates
            $('.js-results-container').hide();
            ///end farfetch updates
            ///end farfetch updates
        },

        suggest: function () {
            if (this.suggestions.length === 0) {
                this.hide();
                ///farfetch updates
                ///farfetch updates
                $(".header-search-noResults").show();
                ///end farfetch updates
                ///end farfetch updates
                return;
            }

            var that = this,
                formatResult = that.options.formatResult,
                value = that.getQuery(that.currentValue),
                className = that.classes.suggestion,
                classSelected = that.classes.selected,
                classGroup = that.classes.group,
                container = $(that.suggestionsContainer),
                categories = that.options.categories,
                html = '',
                width;

                //farfetch changes
                //farfetch changes
                //farfetch changes    
                $(".header-search-noResults").hide();
                //end farfetch changes
                //end farfetch changes
                //end farfetch changes   


            // Build suggestions inner HTML:
            ///
            /// FARFETCH CHANGES
            /// FARFETCH CHANGES
            /// FARFETCH CHANGES
            /// FARFETCH CHANGES
            ///
            if ( categories )
            {

                var actual_category = "";
                $.each(that.suggestions, function (i, suggestion) {
                    if ( suggestion.category != actual_category )
                    {
                        html += '</div><div class="' + classGroup + '" ><b>' + suggestion.category + '</b>';
                        actual_category = suggestion.category;
                    }
                    html += '<div class="' + className + '" data-index="' + i + '">' + formatResult(suggestion, value) + '</div>';
                });
                html +="</div>";

                $('.js-resultsautocomplete').html(this.suggestions.length);
                $('.js-results-container').show();
            }
            ///
            /// END FARFETCH CHANGES
            /// END FARFETCH CHANGES
            /// END FARFETCH CHANGES
            /// END FARFETCH CHANGES
            ///

            else
            {
                $.each(that.suggestions, function (i, suggestion) {
                    html += '<div class="' + className + '" data-index="' + i + '">' + formatResult(suggestion, value) + '</div>';
                });

            }

            // If width is auto, adjust width before displaying suggestions,
            // because if instance was created before input had width, it will be zero.
            // Also it adjusts if input width has changed.
            // -2px to account for suggestions border.
            if (that.options.width === 'auto') {
                width = that.el.outerWidth() - 2;
                container.width(width > 0 ? width : 300);
            }

            container.html(html).show();
            that.visible = true;

            // Select first value by default:
            if (that.options.autoSelectFirst) {
                that.selectedIndex = 0;
                container.children( '.' + that.classes.suggestion ).first().addClass(classSelected);
            }

            that.findBestHint();
        },

        findBestHint: function () {
            var that = this,
                value = that.el.val().toLowerCase(),
                bestMatch = null;

            $.each(that.suggestions, function (i, suggestion) {
                var foundMatch = suggestion.value.toLowerCase().indexOf(value) === 0;
                if (foundMatch) {
                    bestMatch = suggestion;

                }
                return !foundMatch;
            });

            that.signalHint(bestMatch);
        },

        signalHint: function (suggestion) {
            var hintValue = '',
                that = this;
            if (suggestion) {
                hintValue = that.currentValue + suggestion.value.substr(that.currentValue.length);
            }
            if (that.hintValue !== hintValue) {
                that.hintValue = hintValue;
                that.hint = suggestion;
                (this.options.onHint || $.noop)(hintValue);
            }
        },

        verifySuggestionsFormat: function (suggestions) {
            // If suggestions is string array, convert them to supported format:
            if (suggestions.length && typeof suggestions[0] === 'string') {
                return $.map(suggestions, function (value) {
                    return { value: value, data: null };
                });
            }

            return suggestions;
        },

        processResponse: function (response, originalQuery) {
            var that = this,
                options = that.options,
                result = options.transformResult(response, originalQuery);

            result.suggestions = that.verifySuggestionsFormat(result.suggestions);

            // Cache results if cache is not disabled:
            if (!options.noCache) {
                that.cachedResponse[result[options.paramName]] = result;
                if (result.suggestions.length === 0) {
                    that.badQueries.push(result[options.paramName]);
                }
            }

            // Display suggestions only if returned query matches current value:
            if (originalQuery === that.getQuery(that.currentValue)) {
                that.suggestions = result.suggestions;
                that.suggest();
            }
        },

        activate: function (index) {
            var that = this,
                activeItem,
                selected = that.classes.selected,
                suggestion = that.classes.suggestion,
                container = $(that.suggestionsContainer),
                children = container.children( '.' + suggestion );
            container.children('.' + selected).removeClass(selected);

            that.selectedIndex = index;

            if (that.selectedIndex !== -1 && children.length > that.selectedIndex) {
                activeItem = children.get(that.selectedIndex);
                $(activeItem).addClass(selected);
                return activeItem;
            }

            return null;
        },

        selectHint: function () {
            var that = this,
                i = $.inArray(that.hint, that.suggestions);

            that.select(i);
        },

        select: function (i) {
            var that = this;
            that.hide();
            that.onSelect(i);
        },

        moveUp: function () {
            var that = this;

            if (that.selectedIndex === -1) {
                return;
            }

            if (that.selectedIndex === 0) {
                $(that.suggestionsContainer).children().first().removeClass(that.classes.selected);
                that.selectedIndex = -1;
                that.el.val(that.currentValue);
                that.findBestHint();
                return;
            }

            that.adjustScroll(that.selectedIndex - 1);
        },

        moveDown: function () {
            var that = this;

            if (that.selectedIndex === (that.suggestions.length - 1)) {
                return;
            }

            that.adjustScroll(that.selectedIndex + 1);
        },

        adjustScroll: function (index) {
            var that = this,
                activeItem = that.activate(index),
                offsetTop,
                upperBound,
                lowerBound,
                heightDelta = 25;

            if (!activeItem) {
                return;
            }

            offsetTop = activeItem.offsetTop;
            upperBound = $(that.suggestionsContainer).scrollTop();
            lowerBound = upperBound + that.options.maxHeight - heightDelta;

            if (offsetTop < upperBound) {
                $(that.suggestionsContainer).scrollTop(offsetTop);
            } else if (offsetTop > lowerBound) {
                $(that.suggestionsContainer).scrollTop(offsetTop - that.options.maxHeight + heightDelta);
            }

            that.el.val(that.getValue(that.suggestions[index].value));
            that.signalHint(null);
        },

        onSelect: function (index) {
            var that = this,
                onSelectCallback = that.options.onSelect,
                suggestion = that.suggestions[index];

            that.currentValue = that.getValue(suggestion.value);
            that.el.val(that.currentValue);
            that.signalHint(null);
            that.suggestions = [];
            that.selection = suggestion;

            if ($.isFunction(onSelectCallback)) {
                onSelectCallback.call(that.element, suggestion);
            }
        },

        getValue: function (value) {
            var that = this,
                delimiter = that.options.delimiter,
                currentValue,
                parts;

            if (!delimiter) {
                return value;
            }

            currentValue = that.currentValue;
            parts = currentValue.split(delimiter);

            if (parts.length === 1) {
                return value;
            }

            return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
        },

        dispose: function () {
            var that = this;
            that.el.off('.autocomplete').removeData('autocomplete');
            that.disableKillerFn();
            $(window).off('resize', that.fixPositionCapture);
            $(that.suggestionsContainer).remove();
        }
    };

    // Create chainable jQuery plugin:
    $.fn.autocomplete = function (options, args) {
        var dataKey = 'autocomplete';
        // If function invoked without argument return
        // instance of the first matched element:
        if (arguments.length === 0) {
            return this.first().data(dataKey);
        }

        return this.each(function () {
            var inputElement = $(this),
                instance = inputElement.data(dataKey);

            if (typeof options === 'string') {
                if (instance && typeof instance[options] === 'function') {
                    instance[options](args);
                }
            } else {
                // If instance already exists, destroy it:
                if (instance && instance.dispose) {
                    instance.dispose();
                }
                instance = new Autocomplete(this, options);
                inputElement.data(dataKey, instance);
            }
        });
    };
}));
/*jslint  browser: true, white: true, plusplus: true */
/*global $: true */

    // Load countries then initialize plugin:
    $.ajax({
        url: '../static/countries.txt',
        dataType: 'json'
    }).done(function (source) {

        var countriesArray = $.map(source, function (value, key) { return { value: value, data: key }; }),
            countries = $.map(source, function (value) { return value; });

        // Setup jQuery ajax mock:
        $.ajax({
            url: '../static/countries.txt',
            responseTime: 2000,
            response: function (settings) {
                var query = settings.data.query,
                    queryLowerCase = query.toLowerCase(),
                    re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi'),
                    suggestions = $.grep(countriesArray, function (country) {
                         // return country.value.toLowerCase().indexOf(queryLowerCase) === 0;
                        return re.test(country.value);
                    }),
                    response = {
                        query: query,
                        suggestions: suggestions
                    };

                this.responseText = JSON.stringify(response);
            }
        });

        // Initialize ajax autocomplete:
        $('#autocomplete-ajax').autocomplete({
            // serviceUrl: '/autosuggest/service/url',
            lookup: countriesArray,
            lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
                var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
                return re.test(suggestion.value);
            },
            onSelect: function(suggestion) {
                $('#selction-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function() {
                $('#selction-ajax').html('You selected: none');
            }
        });

        // Initialize autocomplete with local lookup:
        $('#autocomplete').autocomplete({
            lookup: countriesArray,
            onSelect: function (suggestion) {
                $('#selection').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            }
        });
        
        // Initialize autocomplete with custom appendTo:
        $('#autocomplete-custom-append').autocomplete({
            lookup: countriesArray,
            appendTo: '#suggestions-container'
        });

        // Initialize autocomplete with custom appendTo:
        $('#autocomplete-dynamic').autocomplete({
            lookup: countriesArray
        });
        
    });

    
    // Load data for groups and then initialize plugin:
    $.ajax({
        url: '../static/countries.txt',
        dataType: 'json'
    }).done(function (data) {
        var groupsArray = data;

        // Initialize autocomplete with local lookup:
        $('#autocomplete-group').autocomplete({
            minChars: 3,
            lookup: groupsArray.suggestions,
            appendTo: '.header-autocomplete-containter',
            onSelect: function (suggestion) {
                $('#selection-group').html('You selected: ' + suggestion.value + ' <b>(' + suggestion.category + ')</b>' );
            },
            onHint: function (hint) {
                $('#autocomplete-group-x').val(hint);
            },
            categories: true,
        });

    });



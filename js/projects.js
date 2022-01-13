import { _ as _asyncToGenerator, r as regenerator, s as stringTimes, C as Constants, o as onEnter$1, a as onEscape$1, b as onBlur, d as displayMessage$1 } from './module.js';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var mdHtml, scrollMap;
var defaults = {
  html: false,
  xhtmlOut: false,
  breaks: true,
  langPrefix: 'language-',
  linkify: true,
  typograher: true,
  _highlight: true,
  _view: 'html'
};

defaults.highlight = function (str, lang) {
  var esc = DOMPurify.sanitize;

  if (lang && lang !== 'auto' && hljs.getLanguage(lang)) {
    return '<pre class="hljs language-' + esc(lang.toLowerCase()) + '"><code>' + hljs.highlight(str, {
      language: lang,
      ignoreIllegals: true
    }).value + '</code></pre>';
  } else if (lang === 'auto') {
    var result = hljs.highlightAuto(str);
    /*eslint-disable no-console*/

    return '<pre class="hljs language-' + esc(result.language) + '"><code>' + result.value + '</code></pre>';
  }

  return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
};

function mdInit() {
  mdHtml = window.markdownit(defaults); //   .use(require('markdown-it-abbr'))
  //   .use(require('markdown-it-container'), 'warning')
  //   .use(require('markdown-it-deflist'))
  //   .use(require('markdown-it-emoji'))
  //   .use(require('markdown-it-footnote'))
  //   .use(require('markdown-it-ins'))
  //   .use(require('markdown-it-mark'))
  //   .use(require('markdown-it-sub'))$(".source").on("touchstart mouseover", (function() {
  //   .use(require('markdown-it-sup'));
  // Beautify output of parser for html content

  mdHtml.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n';
  }; // Replace emoji codes with images


  mdHtml.renderer.rules.emoji = function (token, idx) {
    return window.twemoji.parse(token[idx].content);
  }; //
  // Inject line numbers for sync scroll. Notes:
  //
  // - We track only headings and paragraphs on first level. That's enough.
  // - Footnotes content causes jumps. Level limit filter it automatically.


  function injectLineNumbers(tokens, idx, options, env, slf) {
    var line;

    if (tokens[idx].map && tokens[idx].level === 0) {
      line = tokens[idx].map[0];
      tokens[idx].attrJoin('class', 'line');
      tokens[idx].attrSet('data-line', String(line));
    }

    return slf.renderToken(tokens, idx, options, env, slf);
  }

  mdHtml.renderer.rules.paragraph_open = mdHtml.renderer.rules.heading_open = injectLineNumbers;
}
function setHighlightedlContent(selector, content, lang) {
  if (window.hljs) {
    $(selector).html(window.hljs.highlight(content, {
      language: lang
    }).value);
  } else {
    $(selector).text(content);
  }
}
function updateResult() {
  return _updateResult.apply(this, arguments);
}

function _updateResult() {
  _updateResult = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
    var download,
        source,
        id,
        base64,
        dirty,
        random,
        regex,
        matches,
        recursiveListReplacement,
        _loop2,
        i,
        rawHtml,
        newLineReplacement,
        _args5 = arguments;

    return regenerator.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            download = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : false;

            if (!$("#editor").length) {
              id = $(".selected");

              if (id.length) {
                base64 = cache[id[0].id].content;
                dirty = atob(base64);
                source = DOMPurify.sanitize(dirty);
              }
            } else {
              source = $("#textarea").val();
            } // Inject a random element in the source string to add data-line attributes to a list


            random = Math.random().toString();
            source = source.replaceAll("\n\n", "\n\n".concat(random, "\n\n")); // Replace \n between the katex delimiters with a space, so as not to confuse the Markdown-it parser

            regex = /\\begin\{(align\*?)\}([\s\S]*?)\\end\{align\}/gm;
            matches = _toConsumableArray(source.matchAll(regex));
            matches.forEach(function (matchObj) {
              var match = matchObj[0];
              var stripped = match.replaceAll("\n", " ");
              source = source.replace(regex, stripped);
            });
            source = source.replace(/(\\begin\{align\*?\}[\s\S]*?\\end\{align\})/gm, "$1" + stringTimes("\n", matches.length));
            matches = _toConsumableArray(source.matchAll(/\$\$([\s\S]*?)\$\$/gm));
            matches.forEach(function (matchObj) {
              var match = matchObj[0];
              var stripped = match.replaceAll("\n", " ");
              source = source.replace(match, stripped);
            });
            source = source.replace(/(\\begin\{align\*?\}[\s\S]*?\\end\{align\})/gm, "$1" + stringTimes("\n", matches.length));

            recursiveListReplacement = function recursiveListReplacement(str) {
              var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

              var listMatches = _toConsumableArray(str.matchAll(/(^\d+\.[^\t\n]*)((\n\t+(.*))+)/gm));

              if (listMatches.length == 0 && !str.match(/^[0-9](?:\.[0-9])+/gm)) {
                return str;
              } else if (step > 0 && listMatches.length == 0) return "";

              listMatches.forEach(function (match) {
                var shifted = match[2].replaceAll(/^\t{1}/gm, "");
                var replacement = "".concat(match[1]);
                replacement += recursiveListReplacement(shifted, step + 1);
                str = str.replace(match[0], replacement);
              });
              return str;
            };

            source = recursiveListReplacement(source);
            source = source.replaceAll("\\{", "\\\\{");
            source = source.replaceAll("\\}", "\\\\}");
            source = source.replaceAll("\t", stringTimes(" ", 4)); // Replace all images

            if (!(Constants.loadImages === true || download)) {
              _context5.next = 27;
              break;
            }

            matches = _toConsumableArray(source.matchAll(/!\[(.+)\]\((.+)\)/gm));
            _loop2 = /*#__PURE__*/regenerator.mark(function _loop2(i) {
              var matchObj, src, result, t;
              return regenerator.wrap(function _loop2$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      matchObj = matches[i];
                      src = matchObj[2];
                      _context4.next = 4;
                      return $.get("/api/getimage?hash_name=".concat(Constants.hash_name, "&url=").concat(src));

                    case 4:
                      result = _context4.sent;
                      result = window.location.origin + result;
                      t = 0;
                      source = source.replace(/!\[(.+)\]\((.+)\)/gm, function (match) {
                        return t++ === i ? match.replace(/!\[(.+)\]\((.+)\)/gm, "![$1](".concat(result, ")")) : match;
                      });

                    case 8:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _loop2);
            });
            i = 0;

          case 20:
            if (!(i < matches.length)) {
              _context5.next = 25;
              break;
            }

            return _context5.delegateYield(_loop2(i), "t0", 22);

          case 22:
            i++;
            _context5.next = 20;
            break;

          case 25:
            _context5.next = 28;
            break;

          case 27:
            source = source.replaceAll(/!\[(.+)\]\((.+)\)/gm, "![$1](#)");

          case 28:
            rawHtml = mdHtml.render(source);
            newLineReplacement = new RegExp("<p class=\"line\" data-line=\"(\\d+)\">".concat(random.toString().replace("\.", "\\."), "</p>"), "g");
            rawHtml = rawHtml.replaceAll(newLineReplacement, "<p class=\"line line-hidden\" data-line=\"$1\"></p>");
            $("#preview").html(rawHtml);
            renderMathInElement(document.getElementById("preview"), {
              delimiters: [{
                left: "$$",
                right: "$$",
                display: true
              }, {
                left: '$',
                right: '$',
                display: false
              }, {
                left: "\\begin{align}",
                right: "\\end{align}",
                display: true
              }],
              macros: {
                "\\nl": "\\newline"
              },
              newLineInDisplayMode: true,
              output: "html",
              throwOnError: false
            });
            scrollMap = null;

          case 34:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4);
  }));
  return _updateResult.apply(this, arguments);
}

function setOptionClass(name, val) {
  if (val) {
    $('body').addClass('opt_' + name);
  } else {
    $('body').removeClass('opt_' + name);
  }
}
function setResultView(val) {
  $('body').removeClass('result-as-html');
  $('body').removeClass('result-as-src');
  $('body').removeClass('result-as-debug');
  $('body').addClass('result-as-' + val);
  defaults._view = val;
}
$(document).ready(function () {
  var _loop = function _loop(key) {
    var val = defaults[key];

    if (key === 'highlight') {
      return "continue";
    }

    el = document.getElementById(key);

    if (!el) {
      return "continue";
    }

    $el = $(el);

    if (typeof val === "boolean") {
      $el.prop('checked', val);
      $el.on('change', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var value;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                value = Boolean($el.prop('checked'));
                setOptionClass(key, value);
                defaults[key] = value;
                mdInit();
                updateResult();

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
      setOptionClass(key, val);
    } else {
      $(el).val(val);
      $el.on('change update', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                defaults[key] = String($(el).val());
                mdInit();
                updateResult();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })));
    }
  };

  for (var key in defaults) {
    var el;
    var $el;

    var _ret = _loop(key);

    if (_ret === "continue") continue;
  }

  setResultView(defaults._view);
  mdInit();
  $("#textarea").on("keyup", function () {
    return typed = true;
  });
  $("#textarea").on('paste cut mouseup', function () {
    return updateResult();
  });

  if ($("#editor").length) {
    $("#editor").on('touchstart mouseover', function () {
      $("#preview").off("scroll");
      $("#editor").on("scroll", syncSrcScroll);
    });
    $("#preview").on('touchstart mouseover', function () {
      $("#editor").off("scroll");
      $("#preview").on("scroll", syncResultScroll);
    });
  }

  _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            updateResult();

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))();

  window.updateInterval = window.setInterval(typeUpdate, 500);
});
var typed = false;
function typeUpdate() {
  if (typed) {
    updateResult();
    typed = false;
  }
}
var lineHeight = 25;
function syncSrcScroll() {
  var target = document.getElementById("editor");
  var line = Math.floor(target.scrollTop / lineHeight);
  var scrollHeight = target.scrollTop;
  var preview = document.getElementById("preview");

  if (scrollHeight == target.scrollHeight - target.clientHeight) {
    preview.scroll({
      top: preview.scrollHeight,
      behavior: "smooth"
    });
    return;
  }

  var scrollToLine = function scrollToLine(line) {
    if (line <= 0) {
      preview.scroll({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    var offsetTarget = $("[data-line='".concat(line, "']"));

    if (!offsetTarget.length) {
      scrollToLine(line - 1);
      return;
    }

    offsetTarget = offsetTarget[0];
    var top = offsetTarget.offsetTop - target.offsetTop;
    preview.scroll({
      top: top,
      behavior: "smooth"
    });
  };

  scrollToLine(line);
}
function syncResultScroll() {
  var target = document.getElementById("preview");
  var scrollHeight = target.scrollTop;
  var editor = document.getElementById("editor");

  if (scrollHeight == target.scrollHeight - target.clientHeight) {
    editor.scroll({
      top: editor.scrollHeight,
      behavior: "smooth"
    });
    return;
  }

  var line = 0;
  var lines = [];
  var children = $("#preview [data-line]");

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var top = child.offsetTop - target.offsetTop;

    if (top <= scrollHeight) {
      line = Number(child.getAttribute("data-line"));

      if (!line && lines.length > 0) {
        line = lines[lines.length - 1];
      } else if (!line) {
        lines.push(0);
      } else {
        lines.push(line);
      }
    } else if (top > scrollHeight) {
      editor.scroll({
        top: line * lineHeight,
        behavior: "smooth"
      });
      return;
    }
  }
}

var P = /*#__PURE__*/Object.freeze({
  __proto__: null,
  mdInit: mdInit,
  setHighlightedlContent: setHighlightedlContent,
  updateResult: updateResult,
  setOptionClass: setOptionClass,
  setResultView: setResultView,
  typeUpdate: typeUpdate,
  syncSrcScroll: syncSrcScroll,
  syncResultScroll: syncResultScroll
});

/**
 * Open the markdown editor
 */

function openMarkdownEditor() {
  $("#markdown-container").toggleClass("hidden", false);
  $("#markdown-header").toggleClass("hidden", true);
  $("#settings-editor").toggleClass("hidden", true);
  var id = Constants.selected.id || -1;

  if (Constants.cache[id]) {
    loadBlob(Constants.cache[id]);
    triggerResize();
  } else {
    $.get("/api/getdocument?id=".concat(id, "&hash_name=").concat(Constants.hash_name), function (data, success) {
      Constants.cache[id] = data;
      loadBlob(data);
      triggerResize();
    });
  }
}
/**
 * Load a document in blob form and set the text in the code area
 * @param {Object} doc - The document returned from mysql database
 */

function loadBlob(doc) {
  var base64 = doc.content;

  if (!base64) {
    base64 = "";
  }

  var dirty = atob(base64);
  var clean = DOMPurify.sanitize(dirty);
  $("#textarea").val(clean);
  setLineNumbers();
  updateResult();
}
/**
 * Set the line numbers in the code editor
 */

function setLineNumbers() {
  if (!$("#editor").length) return;
  var lineHeight = 25;
  var lines = Math.ceil(document.getElementById("textarea").clientHeight / lineHeight);
  var ln = document.getElementById("line-numbers");
  ln.innerHTML = "";

  for (var i = 0; i < lines; i++) {
    ln.innerHTML += "<p>".concat(i + 1, "</p>");
  }
}
/**
 * Trigger resize function and set the line numbers
 */

function triggerResize() {
  $("textarea").trigger("input");
  setLineNumbers();
}

var E = /*#__PURE__*/Object.freeze({
  __proto__: null,
  openMarkdownEditor: openMarkdownEditor,
  loadBlob: loadBlob,
  setLineNumbers: setLineNumbers,
  triggerResize: triggerResize
});

/**
 * Render the file container in projects.php
 */

function rerenderFileContainer() {
  var container = document.getElementById("folder-container");
  scrollTop = document.getElementById("folder-container").scrollTop;
  container.innerHTML = "";
  $.get("/includes/project-xhr.php", {
    q: Constants.hash_name,
    root: Constants.root
  }, function (data, success) {
    container.insertAdjacentHTML("beforebegin", data);
    container.remove();
    foldersRendered();
  });
}
/**
 * Open all the folders that were open, if the file tree is rendered
 */

function foldersRendered() {
  if (openFolder.length == 0 || Constants.openFolders.every(function (val) {
    return Boolean(document.getElementById("nested-".concat(val)));
  })) {
    Constants.openFolders.forEach(function (f) {
      return openFolder(f, true);
    });
    document.getElementById("folder-container").scrollTo(0, scrollTop);
    bindContextmenu();
  } else {
    window.requestAnimationFrame(foldersRendered);
  }
}
var scrollTop = 0;
/**
 * Open the folder in the file tree
 * @param {Element} element 
 * @param {Event} event 
 */

function openFolder(element, event) {
  // force 
  if (event === true) {
    var _container = document.getElementById("nested-".concat(element));

    if (!_container) return;
    var el = document.getElementById(String(element));

    _container.classList.toggle("closed");

    el.classList.toggle("open");
    return;
  }

  if (event.target.classList.contains("add-icon")) {
    event.stopPropagation();
    return;
  }

  var container = document.getElementById("nested-".concat(element.id));
  container.classList.toggle("closed");

  if (element.classList.toggle("open")) {
    Constants.openFolders.push(element.id);
  } else {
    Constants.openFolders = Constants.openFolders.filter(function (val) {
      return val != element.id;
    });
  }
}
/**
 * Select a file from the file tree
 * @param {Element} element 
 */

function selectFile(element) {
  if (Constants.selected) {
    if ($("#editor").length && !$("#nested-" + activeContextMenu).length) {
      Constants.cache[Constants.selected.id]["content"] = btoa($("#textarea").val());
      save();
    }

    Constants.selected.classList.toggle("selected");
  }

  element.classList.toggle("selected");
  Constants.selected = element;

  if (!$("#nested-" + activeContextMenu).length) {
    openMarkdownEditor();
  }
}
var activeContextMenu = -1;
/**
 * Bind the context menu event to files in the file tree
 */

function bindContextmenu() {
  if (!$("#editor").length) return;
  $(".with-icon").contextmenu(function (event) {
    event.preventDefault();

    if (this.classList.contains("root-name")) {
      return;
    }

    activeContextMenu = this.id;
    $("#context-menu").css("display", "grid");
    $("#context-menu").css("left", event.clientX + "px");
    $("#context-menu").css("top", event.clientY + "px");
    selectFile(this);
    $("#context-menu-focus").focus();

    var blur = function blur(event) {
      $("#context-menu").css("display", "none");
      $(document).off("click", blur);
    };

    $(document).click(blur);
  });
}
/**
 * Rename a file
 */

function renameFile() {
  var p = $("#" + activeContextMenu).find("p")[0];
  var prev = p.innerText;
  p.innerText = "";
  p.style.paddingLeft = "10px";
  p.setAttribute("contenteditable", true);
  p.focus();

  var update = function update() {
    $.post("/api/renamedocument", {
      id: activeContextMenu,
      name: p.innerText,
      hash_name: Constants.hash_name
    }, fileChange);
    p.removeAttribute("contenteditable");
    p.style.paddingLeft = "0px";
  };

  onEnter(p, function (event) {
    event.preventDefault();
    update();
  }, true);
  onEscape(p, function (event) {
    p.removeAttribute("contenteditable");
    p.style.paddingLeft = "0px";
    p.innerText = prev;
  });
}
/**
 * Delete a file
 */

function deleteFile() {
  if ($("#nested-" + activeContextMenu).length) {
    if (window.confirm("Are you sure you want to delete this folder and its contents?")) {
      Constants.openFolders = Constants.openFolders.filter(function (f) {
        return f != activeContextMenu;
      });
      $("#" + activeContextMenu).remove();
      $("#nested-" + activeContextMenu).remove();
      $.post("/api/deletedocument", {
        id: activeContextMenu,
        hash_name: Constants.hash_name
      }, fileChange);
    }
  } else if (window.confirm("Are you sure you want to delete this file?")) {
    $("#" + activeContextMenu).remove();
    $.post("/api/deletedocument", {
      id: activeContextMenu,
      hash_name: Constants.hash_name
    }, fileChange);
  }
}

var F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rerenderFileContainer: rerenderFileContainer,
  foldersRendered: foldersRendered,
  openFolder: openFolder,
  selectFile: selectFile,
  bindContextmenu: bindContextmenu,
  renameFile: renameFile,
  deleteFile: deleteFile
});

/**
 * Adds a file or folder input to the file hierarchy
 * @param {string} type - "file" | "folder"
 * @param {Element} element - The element where the user clicked on addDocument
 */

function addDocument(type, element) {
  var getNestedBorders = function getNestedBorders() {
    var amount = element.parentElement.classList.contains("root-name") ? 0 : element.parentElement.children[0].childElementCount + 1;
    var str = "";

    for (var i = 0; i < amount; i++) {
      str += "<div class=\"nested-border\"></div>";
    }

    return str;
  };

  var folder = "<div class=\"with-icon temp\" id=\"temp\">\n    <div class=\"nested-borders\">\n        ".concat(getNestedBorders(), "\n    </div>\n    <img src=\"/assets/folder.svg\">\n    <input id=\"temp-input\" type=\"text\"/>\n    </div>");
  var file = "<div class=\"with-icon temp\" id=\"temp\">\n    <div class=\"nested-borders\">\n        ".concat(getNestedBorders(), "\n    </div>\n    <img src=\"/assets/file.svg\">\n    <input id=\"temp-input\" type=\"text\"/>\n    </div>");

  if (!Constants.openFolders.includes(element.parentElement.id) && !element.parentElement.classList.contains("root-name")) {
    Constants.openFolders.push(element.parentElement.id);
    openFolder(element.parentElement.id, true);
  }

  element.parentElement.insertAdjacentHTML("afterEnd", type == "folder" ? folder : file);
  var input = document.getElementById("temp-input");
  input.focus();
  onEnter$1(input, function (event) {
    var value = event.target.value;
    input.blur();

    if (value == "") {
      document.getElementById("temp").remove();
      return;
    } // Sent POST to add folder/file


    $.post("/api/adddocument", {
      type: type,
      name: value,
      parent: element.parentElement.id,
      add: true,
      hash_name: Constants.hash_name
    }, function (data, status) {
      if (status === "success") {
        window.fileChange();
        save();
        rerenderFileContainer();
      }
    });
  });
  onEscape$1(input, function () {
    input.blur();
    var el = document.getElementById("temp");
    if (el) el.remove();
  });
  onBlur(input, function () {
    var el = document.getElementById("temp");
    if (el) el.remove();
  });
}
/**
 * Save a document
 */

function save() {
  if (!$(".selected")[0]) {
    return;
  }

  var dirty = $("#textarea").val();
  var clean = DOMPurify.sanitize(dirty); // escape parsed

  var base64 = btoa(clean);
  var id = $(".selected")[0].id;
  Constants.cache[id]["content"] = base64;
  $.post("/api/savedocument?id=".concat(id), {
    content: base64
  });
  displayMessage$1("Saved file");
}
/**
 * Download the current file in html form with all the styles
 */

function downloadFile() {
  return _downloadFile.apply(this, arguments);
}

function _downloadFile() {
  _downloadFile = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    var html, css, markdownStyle, codeCss, katexCss, doc, data, config, downloadFile;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return updateResult(true);

          case 2:
            if (Constants.selected) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            html = $("#preview").html();
            _context.next = 7;
            return fetch("../css/markdown.css");

          case 7:
            css = _context.sent;
            _context.next = 10;
            return css.text();

          case 10:
            markdownStyle = _context.sent;
            _context.next = 13;
            return fetch("../css/atom-one-light.min.css");

          case 13:
            css = _context.sent;
            _context.next = 16;
            return css.text();

          case 16:
            codeCss = _context.sent;
            _context.next = 19;
            return fetch("https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css");

          case 19:
            css = _context.sent;
            _context.next = 22;
            return css.text();

          case 22:
            katexCss = _context.sent;
            doc = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css\" integrity=\"sha384-zTROYFVGOfTw7JV7KUu8udsvW2fx4lWOsCEDqhBreBwlHI4ioVRtmIvEThzJHGET\" crossorigin=\"anonymous\">\n    <style>".concat(markdownStyle, "</style>\n    <style>").concat(codeCss, "</style>\n    <style>").concat(katexCss, "</style>\n</head>\n<body class=\"markdown-previewer\">\n").concat(html, "\n</body>");
            _context.next = 26;
            return fetch("../config.json");

          case 26:
            data = _context.sent;
            _context.next = 29;
            return data.json();

          case 29:
            config = _context.sent;

            downloadFile = function downloadFile(blob, fileName) {
              var link = document.createElement('a'); // create a blobURI pointing to our Blob

              link.href = URL.createObjectURL(blob);
              link.download = fileName; // some browser needs the anchor to be in the doc

              document.body.append(link);
              link.click();
              link.remove(); // in case the Blob uses a lot of memory

              setTimeout(function () {
                return URL.revokeObjectURL(link.href);
              }, 7000);
            };

            $.ajax({
              url: config.server.url + "/get-pdf",
              method: 'POST',
              data: doc,
              contentType: "text/html; charset=UTF-8",
              success: function success(data) {
                var link = document.createElement('a'); // create a blobURI pointing to our Blob

                link.href = data;
                link.download = Constants.selected.innerText + ".pdf"; // some browser needs the anchor to be in the doc

                document.body.append(link);
                link.click();
                link.remove();
              },
              error: function error(req) {// console.log(req);
              }
            });

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _downloadFile.apply(this, arguments);
}

var D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addDocument: addDocument,
  save: save,
  downloadFile: downloadFile
});

$(document).ready(function () {
  bindContextmenu();
  $("textarea").on("keyup", setLineNumbers);
  $("textarea").keydown(function (e) {
    var $this, end, start;

    if (e.keyCode === 9) {
      start = this.selectionStart;
      end = this.selectionEnd;
      $this = $(this);
      $this.val($this.val().substring(0, start) + "\t" + $this.val().substring(end));
      this.selectionStart = this.selectionEnd = start + 1;
      return false;
    }
  });
  window.addEventListener("resize", triggerResize);
  window.setInterval(save, 1000 * 60 * 5); // Every 5 minutes

  $("textarea").each(function () {
    if (window.innerWidth <= 1100) return;
    this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
  }).on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
  triggerResize();
}); // Setup event listeners

$("#theme-switch").on("input", function (event) {
  if (event.target.checked) {
    setTimeout(function () {
      return document.body.setAttribute("data-theme", "dark");
    }, 250);
  } else {
    setTimeout(function () {
      return document.body.setAttribute("data-theme", "light");
    }, 250);
  }
});
$("#layout-code").on("click", function () {
  $("#markdown-container").addClass("layout-code");
  $("#markdown-container").removeClass("layout-preview");
});
$("#layout-preview").on("click", function () {
  $("#markdown-container").removeClass("layout-code");
  $("#markdown-container").addClass("layout-preview");
});
$("#layout-split").on("click", function () {
  $("#markdown-container").removeClass("layout-code");
  $("#markdown-container").removeClass("layout-preview");
});
$("#save-file").on("click", function () {
  save();
});
$("#download-file").on("click", function () {
  downloadFile();
});
$("#view-images").on("click", function () {
  $("#markdown-container").toggleClass("hidden", true);
  $("#markdown-header").toggleClass("hidden", true);
  $("#settings-editor").toggleClass("hidden", true);
  $("#image-editor").toggleClass("hidden", false);
});
$("#showImages").change(function () {
  Constants.loadImages = !Constants.loadImages;
  updateResult();
});

var I = /*#__PURE__*/Object.freeze({
  __proto__: null
});

/**
 * Setup a share link for the project
 */
function shareProject() {
  var select = document.getElementById("rights-settings");
  if (!select) return;
  var rights = select.value;
  var auth = getToken(32);
  var hash_name = window.location.pathname.replace("/projects/", "");
  $.post("/api/setshare", {
    auth: auth,
    hash_name: hash_name,
    rights: rights
  }, function (data, status) {
    if (status === "success") {
      var link = "".concat(window.location.origin).concat(window.location.pathname, "?auth=").concat(auth);
      $("#link-share").html("<b>Share this link: </b><a href=\"".concat(link, "\" target=\"_blank\">").concat(link, "</a>"));
    }
  });
}
/**
 * Remove a share link
 */

function cancelAddUser() {
  var urlSearchParams = new URLSearchParams(window.location.search);
  var auth = urlSearchParams.get("auth");
  $.post("/api/cancelshare", {
    auth: auth
  });
  window.location = "/";
}
/**
 * Remove a user from the project
 * @param {number} id 
 */

function removeUser(id) {
  $.post("/api/removeprivilege", {
    id: id,
    hash_name: hash_name
  }, function (data, status) {
    $("#rights-" + id).remove();
    hidePopup("remove", window);
  });
}
/**
 * Edit a privilege of a user on the project
 * @param {number} id 
 */

function editPrivilege(id) {
  var select = document.getElementById("rights-settings-popup");
  if (!select) return;
  var rights = select.value;
  $.post("/api/editprivilege", {
    id: id,
    hash_name: hash_name,
    rights: rights
  }, function (data, status) {
    $("#rights-" + id).children()[1].innerText = rights;
    hidePopup("edit", window);
  });
}
/**
 * Upload an image to a project
 */

function uploadImage() {
  var fd = new FormData();
  var file = $("#file-image")[0];
  if (!file.files.length) return;
  file = file.files[0];
  file.name = file.name.replaceAll("\s", "_");
  fd.append('image', file);
  $.ajax({
    url: "/api/uploadimage?hash_name=".concat(hash_name),
    type: 'POST',
    data: fd,
    contentType: false,
    processData: false,
    success: function success(response) {
      displayMessage(response.message);
      var container = document.getElementById("tbody-images");
      var html = "<tr id=\"image-".concat(response.id, "\">\n                <td>").concat(file.name, "</td>\n                <td class=\"split\" onclick=\"deleteImage(this)\"> \n                    <div class=\"split-td\">\n                        <img src=\"/assets/minus.svg\">\n                        <p>Delete image</p>\n                    </div>\n                </td>\n            </tr>");
      container.insertAdjacentHTML("beforeend", html);
      hidePopup('image', window);
    },
    error: function error(_error) {
      console.log(_error.responseText);
      displayMessage(_error.responseText, "error");
      hidePopup('image', window);
    }
  });
}

var S = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shareProject: shareProject,
  cancelAddUser: cancelAddUser,
  removeUser: removeUser,
  editPrivilege: editPrivilege,
  uploadImage: uploadImage
});

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var index = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, D), P), F), E), I), S);

export { addDocument, bindContextmenu, cancelAddUser, index as default, deleteFile, downloadFile, editPrivilege, foldersRendered, loadBlob, mdInit, openFolder, openMarkdownEditor, removeUser, renameFile, rerenderFileContainer, save, selectFile, setHighlightedlContent, setLineNumbers, setOptionClass, setResultView, shareProject, syncResultScroll, syncSrcScroll, triggerResize, typeUpdate, updateResult, uploadImage };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdHMuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hcnJheUxpa2VUb0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2FycmF5V2l0aG91dEhvbGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2l0ZXJhYmxlVG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9ub25JdGVyYWJsZVNwcmVhZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90b0NvbnN1bWFibGVBcnJheS5qcyIsIi4uL3NyYy9wcm9qZWN0cy9wYXJzZXIuanMiLCIuLi9zcmMvcHJvamVjdHMvZWRpdG9yLmpzIiwiLi4vc3JjL3Byb2plY3RzL2ZpbGUtdHJlZS5qcyIsIi4uL3NyYy9wcm9qZWN0cy9kb2N1bWVudC5qcyIsIi4uL3NyYy9wcm9qZWN0cy9pbml0LmpzIiwiLi4vc3JjL3Byb2plY3RzL3NldHRpbmdzLmpzIiwiLi4vc3JjL3Byb2plY3RzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn0iLCJpbXBvcnQgYXJyYXlMaWtlVG9BcnJheSBmcm9tIFwiLi9hcnJheUxpa2VUb0FycmF5LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KGFycik7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufSIsImltcG9ydCBhcnJheUxpa2VUb0FycmF5IGZyb20gXCIuL2FycmF5TGlrZVRvQXJyYXkuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn0iLCJpbXBvcnQgYXJyYXlXaXRob3V0SG9sZXMgZnJvbSBcIi4vYXJyYXlXaXRob3V0SG9sZXMuanNcIjtcbmltcG9ydCBpdGVyYWJsZVRvQXJyYXkgZnJvbSBcIi4vaXRlcmFibGVUb0FycmF5LmpzXCI7XG5pbXBvcnQgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgZnJvbSBcIi4vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanNcIjtcbmltcG9ydCBub25JdGVyYWJsZVNwcmVhZCBmcm9tIFwiLi9ub25JdGVyYWJsZVNwcmVhZC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59IiwiaW1wb3J0IHsgc3RyaW5nVGltZXMsIENvbnN0YW50cyB9IGZyb20gXCIuLi91dGlscy9pbmRleFwiXG5cbnZhciBtZEh0bWwsIHNjcm9sbE1hcDtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgaHRtbDogZmFsc2UsXG4gICAgeGh0bWxPdXQ6IGZhbHNlLFxuICAgIGJyZWFrczogdHJ1ZSxcbiAgICBsYW5nUHJlZml4OiAnbGFuZ3VhZ2UtJyxcbiAgICBsaW5raWZ5OiB0cnVlLFxuICAgIHR5cG9ncmFoZXI6IHRydWUsXG4gICAgX2hpZ2hsaWdodDogdHJ1ZSxcbiAgICBfdmlldzogJ2h0bWwnXG59XG5cbmRlZmF1bHRzLmhpZ2hsaWdodCA9IGZ1bmN0aW9uKHN0ciwgbGFuZykge1xuICAgIHZhciBlc2MgPSBET01QdXJpZnkuc2FuaXRpemU7XG4gICAgaWYgKGxhbmcgJiYgbGFuZyAhPT0gJ2F1dG8nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAgICByZXR1cm4gJzxwcmUgY2xhc3M9XCJobGpzIGxhbmd1YWdlLScgKyBlc2MobGFuZy50b0xvd2VyQ2FzZSgpKSArICdcIj48Y29kZT4nICtcbiAgICAgICAgICAgIGhsanMuaGlnaGxpZ2h0KHN0ciwgeyBsYW5ndWFnZTogbGFuZywgaWdub3JlSWxsZWdhbHM6IHRydWUgfSkudmFsdWUgK1xuICAgICAgICAgICAgJzwvY29kZT48L3ByZT4nO1xuXG4gICAgfSBlbHNlIGlmIChsYW5nID09PSAnYXV0bycpIHtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gaGxqcy5oaWdobGlnaHRBdXRvKHN0cik7XG5cbiAgICAgICAgLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cblxuICAgICAgICByZXR1cm4gJzxwcmUgY2xhc3M9XCJobGpzIGxhbmd1YWdlLScgKyBlc2MocmVzdWx0Lmxhbmd1YWdlKSArICdcIj48Y29kZT4nICtcbiAgICAgICAgICAgICAgICByZXN1bHQudmFsdWUgK1xuICAgICAgICAgICAgICAgICc8L2NvZGU+PC9wcmU+JztcbiAgICB9XG5cbiAgICByZXR1cm4gJzxwcmUgY2xhc3M9XCJobGpzXCI+PGNvZGU+JyArIGVzYyhzdHIpICsgJzwvY29kZT48L3ByZT4nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWRJbml0KCkge1xuICAgIG1kSHRtbCA9IHdpbmRvdy5tYXJrZG93bml0KGRlZmF1bHRzKVxuICAgIC8vICAgLnVzZShyZXF1aXJlKCdtYXJrZG93bi1pdC1hYmJyJykpXG4gICAgLy8gICAudXNlKHJlcXVpcmUoJ21hcmtkb3duLWl0LWNvbnRhaW5lcicpLCAnd2FybmluZycpXG4gICAgLy8gICAudXNlKHJlcXVpcmUoJ21hcmtkb3duLWl0LWRlZmxpc3QnKSlcbiAgICAvLyAgIC51c2UocmVxdWlyZSgnbWFya2Rvd24taXQtZW1vamknKSlcbiAgICAvLyAgIC51c2UocmVxdWlyZSgnbWFya2Rvd24taXQtZm9vdG5vdGUnKSlcbiAgICAvLyAgIC51c2UocmVxdWlyZSgnbWFya2Rvd24taXQtaW5zJykpXG4gICAgLy8gICAudXNlKHJlcXVpcmUoJ21hcmtkb3duLWl0LW1hcmsnKSlcbiAgICAvLyAgIC51c2UocmVxdWlyZSgnbWFya2Rvd24taXQtc3ViJykpJChcIi5zb3VyY2VcIikub24oXCJ0b3VjaHN0YXJ0IG1vdXNlb3ZlclwiLCAoZnVuY3Rpb24oKSB7XG4gICAgLy8gICAudXNlKHJlcXVpcmUoJ21hcmtkb3duLWl0LXN1cCcpKTtcblxuICAgIC8vIEJlYXV0aWZ5IG91dHB1dCBvZiBwYXJzZXIgZm9yIGh0bWwgY29udGVudFxuICBtZEh0bWwucmVuZGVyZXIucnVsZXMudGFibGVfb3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWRcIj5cXG4nO1xuICB9O1xuICAvLyBSZXBsYWNlIGVtb2ppIGNvZGVzIHdpdGggaW1hZ2VzXG4gIG1kSHRtbC5yZW5kZXJlci5ydWxlcy5lbW9qaSA9IGZ1bmN0aW9uICh0b2tlbiwgaWR4KSB7XG4gICAgcmV0dXJuIHdpbmRvdy50d2Vtb2ppLnBhcnNlKHRva2VuW2lkeF0uY29udGVudCk7XG4gIH07XG5cbiAgICAvL1xuICAvLyBJbmplY3QgbGluZSBudW1iZXJzIGZvciBzeW5jIHNjcm9sbC4gTm90ZXM6XG4gIC8vXG4gIC8vIC0gV2UgdHJhY2sgb25seSBoZWFkaW5ncyBhbmQgcGFyYWdyYXBocyBvbiBmaXJzdCBsZXZlbC4gVGhhdCdzIGVub3VnaC5cbiAgLy8gLSBGb290bm90ZXMgY29udGVudCBjYXVzZXMganVtcHMuIExldmVsIGxpbWl0IGZpbHRlciBpdCBhdXRvbWF0aWNhbGx5LlxuICAgIGZ1bmN0aW9uIGluamVjdExpbmVOdW1iZXJzKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNsZikge1xuICAgICAgICB2YXIgbGluZTtcbiAgICAgICAgaWYgKHRva2Vuc1tpZHhdLm1hcCAmJiB0b2tlbnNbaWR4XS5sZXZlbCA9PT0gMCkge1xuICAgICAgICAgICAgbGluZSA9IHRva2Vuc1tpZHhdLm1hcFswXTtcbiAgICAgICAgICAgIHRva2Vuc1tpZHhdLmF0dHJKb2luKCdjbGFzcycsICdsaW5lJyk7XG4gICAgICAgICAgICB0b2tlbnNbaWR4XS5hdHRyU2V0KCdkYXRhLWxpbmUnLCBTdHJpbmcobGluZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbGYucmVuZGVyVG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2xmKTtcbiAgICB9XG5cbiAgbWRIdG1sLnJlbmRlcmVyLnJ1bGVzLnBhcmFncmFwaF9vcGVuID0gbWRIdG1sLnJlbmRlcmVyLnJ1bGVzLmhlYWRpbmdfb3BlbiA9IGluamVjdExpbmVOdW1iZXJzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SGlnaGxpZ2h0ZWRsQ29udGVudChzZWxlY3RvciwgY29udGVudCwgbGFuZykge1xuICAgIGlmICh3aW5kb3cuaGxqcykge1xuICAgICAgICAkKHNlbGVjdG9yKS5odG1sKHdpbmRvdy5obGpzLmhpZ2hsaWdodChjb250ZW50LCB7IGxhbmd1YWdlOiBsYW5nIH0pLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKHNlbGVjdG9yKS50ZXh0KGNvbnRlbnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlc3VsdChkb3dubG9hZCA9IGZhbHNlKSB7XG4gICAgbGV0IHNvdXJjZTtcbiAgICBpZiAoISQoXCIjZWRpdG9yXCIpLmxlbmd0aCkge1xuICAgICAgICBsZXQgaWQgPSAkKFwiLnNlbGVjdGVkXCIpO1xuICAgICAgICBpZiAoaWQubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgYmFzZTY0ID0gY2FjaGVbaWRbMF0uaWRdLmNvbnRlbnQ7XG4gICAgICAgICAgICBsZXQgZGlydHkgPSBhdG9iKGJhc2U2NCk7XG4gICAgICAgICAgICBzb3VyY2UgPSBET01QdXJpZnkuc2FuaXRpemUoZGlydHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzb3VyY2UgPSAkKFwiI3RleHRhcmVhXCIpLnZhbCgpO1xuICAgIH1cblxuICAgIC8vIEluamVjdCBhIHJhbmRvbSBlbGVtZW50IGluIHRoZSBzb3VyY2Ugc3RyaW5nIHRvIGFkZCBkYXRhLWxpbmUgYXR0cmlidXRlcyB0byBhIGxpc3RcbiAgICBsZXQgcmFuZG9tID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygpOyAgICBcblxuICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlQWxsKFwiXFxuXFxuXCIsIGBcXG5cXG4ke3JhbmRvbX1cXG5cXG5gKTtcblxuICAgIC8vIFJlcGxhY2UgXFxuIGJldHdlZW4gdGhlIGthdGV4IGRlbGltaXRlcnMgd2l0aCBhIHNwYWNlLCBzbyBhcyBub3QgdG8gY29uZnVzZSB0aGUgTWFya2Rvd24taXQgcGFyc2VyXG4gICAgbGV0IHJlZ2V4ID0gL1xcXFxiZWdpblxceyhhbGlnblxcKj8pXFx9KC4qPylcXFxcZW5ke2FsaWdufS9nbXM7XG4gICAgbGV0IG1hdGNoZXMgPSBbLi4uc291cmNlLm1hdGNoQWxsKHJlZ2V4KV07XG4gICAgbWF0Y2hlcy5mb3JFYWNoKG1hdGNoT2JqID0+IHtcbiAgICAgICAgbGV0IG1hdGNoID0gbWF0Y2hPYmpbMF07XG4gICAgICAgIGxldCBzdHJpcHBlZCA9IG1hdGNoLnJlcGxhY2VBbGwoXCJcXG5cIiwgXCIgXCIpO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShyZWdleCwgc3RyaXBwZWQpO1xuICAgIH0pO1xuICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKC8oXFxcXGJlZ2luXFx7YWxpZ25cXCo/XFx9Lio/XFxcXGVuZHthbGlnbn0pL2dtcywgXCIkMVwiK3N0cmluZ1RpbWVzKFwiXFxuXCIsIG1hdGNoZXMubGVuZ3RoKSlcbiAgICBtYXRjaGVzID0gWy4uLnNvdXJjZS5tYXRjaEFsbCgvXFwkXFwkKC4qPylcXCRcXCQvZ21zKV07XG4gICAgbWF0Y2hlcy5mb3JFYWNoKG1hdGNoT2JqID0+IHtcbiAgICAgICAgbGV0IG1hdGNoID0gbWF0Y2hPYmpbMF07XG4gICAgICAgIGxldCBzdHJpcHBlZCA9IG1hdGNoLnJlcGxhY2VBbGwoXCJcXG5cIiwgXCIgXCIpO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShtYXRjaCwgc3RyaXBwZWQpXG4gICAgfSk7XG4gICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoLyhcXFxcYmVnaW5cXHthbGlnblxcKj9cXH0uKj9cXFxcZW5ke2FsaWdufSkvZ21zLCBcIiQxXCIrc3RyaW5nVGltZXMoXCJcXG5cIiwgbWF0Y2hlcy5sZW5ndGgpKVxuXG5cbiAgICBjb25zdCByZWN1cnNpdmVMaXN0UmVwbGFjZW1lbnQgPSAoc3RyLCBzdGVwID0gMCkgPT4ge1xuICAgICAgICBjb25zdCBsaXN0TWF0Y2hlcyA9IFsuLi5zdHIubWF0Y2hBbGwoLyheXFxkK1xcLlteXFx0XFxuXSopKChcXG5cXHQrKC4qKSkrKS9nbSldO1xuICAgICAgICBpZiAobGlzdE1hdGNoZXMubGVuZ3RoID09IDAgJiYgIXN0ci5tYXRjaCgvXlxcZCg/OlxcLlxcZCkrL2dtcykpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RlcCA+IDAgJiYgbGlzdE1hdGNoZXMubGVuZ3RoID09IDApIHJldHVybiBcIlwiO1xuICAgICAgICBsaXN0TWF0Y2hlcy5mb3JFYWNoKG1hdGNoID0+IHtcbiAgICAgICAgICAgIGxldCBzaGlmdGVkID0gbWF0Y2hbMl0ucmVwbGFjZUFsbCgvXlxcdHsxfS9nbSwgXCJcIik7XG4gICAgICAgICAgICBsZXQgcmVwbGFjZW1lbnQgPSBgJHttYXRjaFsxXX1gO1xuICAgICAgICAgICAgcmVwbGFjZW1lbnQgKz0gcmVjdXJzaXZlTGlzdFJlcGxhY2VtZW50KHNoaWZ0ZWQsIHN0ZXArMSk7XG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShtYXRjaFswXSwgcmVwbGFjZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgc291cmNlID0gcmVjdXJzaXZlTGlzdFJlcGxhY2VtZW50KHNvdXJjZSk7XG5cbiAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZUFsbChcIlxcXFx7XCIsIFwiXFxcXFxcXFx7XCIpO1xuICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlQWxsKFwiXFxcXH1cIiwgXCJcXFxcXFxcXH1cIik7XG4gICAgc291cmNlID0gc291cmNlLnJlcGxhY2VBbGwoXCJcXHRcIiwgc3RyaW5nVGltZXMoXCIgXCIsIDQpKTtcbiAgICAvLyBSZXBsYWNlIGFsbCBpbWFnZXNcbiAgICBpZiAoQ29uc3RhbnRzLmxvYWRJbWFnZXMgPT09IHRydWUgfHwgZG93bmxvYWQpIHtcbiAgICAgICAgbWF0Y2hlcyA9IFsuLi5zb3VyY2UubWF0Y2hBbGwoLyFcXFsoLispXFxdXFwoKC4rKVxcKS9nbSldO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBtYXRjaE9iaiA9IG1hdGNoZXNbaV07XG4gICAgICAgICAgICBsZXQgc3JjID0gbWF0Y2hPYmpbMl07XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgJC5nZXQoYC9hcGkvZ2V0aW1hZ2U/aGFzaF9uYW1lPSR7Q29uc3RhbnRzLmhhc2hfbmFtZX0mdXJsPSR7c3JjfWApO1xuICAgICAgICAgICAgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHJlc3VsdDtcbiAgICAgICAgICAgIGxldCB0ID0gMDtcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKC8hXFxbKC4rKVxcXVxcKCguKylcXCkvZ20sIChtYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodCsrID09PSBpKSA/IG1hdGNoLnJlcGxhY2UoLyFcXFsoLispXFxdXFwoKC4rKVxcKS9nbSwgYCFbJDFdKCR7cmVzdWx0fSlgKSA6IG1hdGNoO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlQWxsKC8hXFxbKC4rKVxcXVxcKCguKylcXCkvZ20sIGAhWyQxXSgjKWApO1xuICAgIH1cblxuICAgIGxldCByYXdIdG1sID0gbWRIdG1sLnJlbmRlcihzb3VyY2UpO1xuXG4gICAgbGV0IG5ld0xpbmVSZXBsYWNlbWVudCA9IG5ldyBSZWdFeHAoYDxwIGNsYXNzPVwibGluZVwiIGRhdGEtbGluZT1cIihcXFxcZCspXCI+JHtyYW5kb20udG9TdHJpbmcoKS5yZXBsYWNlKFwiXFwuXCIsIFwiXFxcXC5cIil9PC9wPmAsIFwiZ1wiKTtcbiAgICByYXdIdG1sID0gcmF3SHRtbC5yZXBsYWNlQWxsKG5ld0xpbmVSZXBsYWNlbWVudCwgYDxwIGNsYXNzPVwibGluZSBsaW5lLWhpZGRlblwiIGRhdGEtbGluZT1cIiQxXCI+PC9wPmApO1xuXG4gICAgJChcIiNwcmV2aWV3XCIpLmh0bWwocmF3SHRtbCk7XG4gICAgcmVuZGVyTWF0aEluRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZpZXdcIiksIHtcbiAgICAgICAgZGVsaW1pdGVyczogW1xuICAgICAgICAgICAge2xlZnQ6IFwiJCRcIiwgcmlnaHQ6IFwiJCRcIiwgZGlzcGxheTogdHJ1ZX0sXG4gICAgICAgICAgICB7IGxlZnQ6ICckJywgcmlnaHQ6ICckJywgZGlzcGxheTogZmFsc2UgfSxcbiAgICAgICAgICAgIHtsZWZ0OiBcIlxcXFxiZWdpbnthbGlnbn1cIiwgcmlnaHQ6IFwiXFxcXGVuZHthbGlnbn1cIiwgZGlzcGxheTogdHJ1ZX0sXG4gICAgICAgIF0sXG4gICAgICAgIG1hY3Jvczoge1xuICAgICAgICAgICAgXCJcXFxcbmxcIjogXCJcXFxcbmV3bGluZVwiXG4gICAgICAgIH0sXG4gICAgICAgIG5ld0xpbmVJbkRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgICBvdXRwdXQ6IFwiaHRtbFwiLFxuICAgICAgICB0aHJvd09uRXJyb3I6IGZhbHNlXG4gICAgfSlcbiAgICBzY3JvbGxNYXAgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0T3B0aW9uQ2xhc3MobmFtZSwgdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ29wdF8nICsgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdvcHRfJyArIG5hbWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFJlc3VsdFZpZXcodmFsKSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyZXN1bHQtYXMtaHRtbCcpO1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncmVzdWx0LWFzLXNyYycpO1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncmVzdWx0LWFzLWRlYnVnJyk7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdyZXN1bHQtYXMtJyArIHZhbCk7XG4gICAgZGVmYXVsdHMuX3ZpZXcgPSB2YWw7XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICAgIGlmIChrZXkgPT09ICdoaWdobGlnaHQnKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KTtcblxuICAgICAgICBpZiAoIWVsKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAkZWwucHJvcCgnY2hlY2tlZCcsIHZhbCk7XG4gICAgICAgICRlbC5vbignY2hhbmdlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gQm9vbGVhbigkZWwucHJvcCgnY2hlY2tlZCcpKTtcbiAgICAgICAgICAgIHNldE9wdGlvbkNsYXNzKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgZGVmYXVsdHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgbWRJbml0KCk7XG4gICAgICAgICAgICB1cGRhdGVSZXN1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNldE9wdGlvbkNsYXNzKGtleSwgdmFsKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAkKGVsKS52YWwodmFsKTtcbiAgICAgICAgJGVsLm9uKCdjaGFuZ2UgdXBkYXRlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmYXVsdHNba2V5XSA9IFN0cmluZygkKGVsKS52YWwoKSk7XG4gICAgICAgICAgICBtZEluaXQoKTtcbiAgICAgICAgICAgIHVwZGF0ZVJlc3VsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgc2V0UmVzdWx0VmlldyhkZWZhdWx0cy5fdmlldyk7XG5cbiAgICBtZEluaXQoKTtcblxuICAgICQoXCIjdGV4dGFyZWFcIikub24oXCJrZXl1cFwiLCAoKSA9PiB0eXBlZCA9IHRydWUpO1xuICAgICQoXCIjdGV4dGFyZWFcIikub24oJ3Bhc3RlIGN1dCBtb3VzZXVwJywgKCkgPT4gdXBkYXRlUmVzdWx0KCkpO1xuICAgIGlmICgkKFwiI2VkaXRvclwiKS5sZW5ndGgpIHtcbiAgICAgICAgJChcIiNlZGl0b3JcIikub24oJ3RvdWNoc3RhcnQgbW91c2VvdmVyJywgKCkgPT4ge1xuICAgICAgICAgICAgJChcIiNwcmV2aWV3XCIpLm9mZihcInNjcm9sbFwiKTtcbiAgICAgICAgICAgICQoXCIjZWRpdG9yXCIpLm9uKFwic2Nyb2xsXCIsIHN5bmNTcmNTY3JvbGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIiNwcmV2aWV3XCIpLm9uKCd0b3VjaHN0YXJ0IG1vdXNlb3ZlcicsICgpID0+IHtcbiAgICAgICAgICAgICQoXCIjZWRpdG9yXCIpLm9mZihcInNjcm9sbFwiKTtcbiAgICAgICAgICAgICQoXCIjcHJldmlld1wiKS5vbihcInNjcm9sbFwiLCBzeW5jUmVzdWx0U2Nyb2xsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHVwZGF0ZVJlc3VsdCgpO1xuICAgIH0pKCk7XG5cbiAgICB3aW5kb3cudXBkYXRlSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodHlwZVVwZGF0ZSwgNTAwKTtcbn0pO1xuXG52YXIgdHlwZWQgPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiB0eXBlVXBkYXRlKCkge1xuICAgIGlmICh0eXBlZCkge1xuICAgICAgICB1cGRhdGVSZXN1bHQoKTtcbiAgICAgICAgdHlwZWQgPSBmYWxzZTtcbiAgICB9XG59XG5cblxuY29uc3QgbGluZUhlaWdodCA9IDI1O1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNTcmNTY3JvbGwoKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JcIik7XG4gICAgY29uc3QgbGluZSA9IE1hdGguZmxvb3IodGFyZ2V0LnNjcm9sbFRvcCAvIGxpbmVIZWlnaHQpO1xuXG4gICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gdGFyZ2V0LnNjcm9sbFRvcDtcbiAgICBjb25zdCBwcmV2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpO1xuICAgIGlmIChzY3JvbGxIZWlnaHQgPT0gKHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQuY2xpZW50SGVpZ2h0KSkge1xuICAgICAgICBwcmV2aWV3LnNjcm9sbCh7dG9wOiBwcmV2aWV3LnNjcm9sbEhlaWdodCwgYmVoYXZpb3I6IFwic21vb3RoXCJ9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBzY3JvbGxUb0xpbmUgPSAobGluZSkgPT4ge1xuICAgICAgICBpZiAobGluZSA8PSAwKSB7XG4gICAgICAgICAgICBwcmV2aWV3LnNjcm9sbCh7dG9wOiAwLCBiZWhhdmlvcjogXCJzbW9vdGhcIn0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvZmZzZXRUYXJnZXQgPSAkKGBbZGF0YS1saW5lPScke2xpbmV9J11gKTtcbiAgICAgICAgaWYgKCFvZmZzZXRUYXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBzY3JvbGxUb0xpbmUobGluZSAtIDEpO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgb2Zmc2V0VGFyZ2V0ID0gb2Zmc2V0VGFyZ2V0WzBdO1xuICAgICAgICBsZXQgdG9wID0gb2Zmc2V0VGFyZ2V0Lm9mZnNldFRvcCAtIHRhcmdldC5vZmZzZXRUb3A7XG4gICAgICAgIHByZXZpZXcuc2Nyb2xsKHt0b3AsIGJlaGF2aW9yOiBcInNtb290aFwifSk7XG4gICAgfVxuICAgIHNjcm9sbFRvTGluZShsaW5lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bmNSZXN1bHRTY3JvbGwoKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpO1xuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRhcmdldC5zY3JvbGxUb3A7XG4gICAgY29uc3QgZWRpdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JcIik7XG4gICAgaWYgKHNjcm9sbEhlaWdodCA9PSAodGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5jbGllbnRIZWlnaHQpKSB7XG4gICAgICAgIGVkaXRvci5zY3JvbGwoe3RvcDogZWRpdG9yLnNjcm9sbEhlaWdodCwgYmVoYXZpb3I6IFwic21vb3RoXCJ9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbGluZSA9IDA7XG4gICAgbGV0IGxpbmVzID0gW107XG4gICAgbGV0IGNoaWxkcmVuID0gJChcIiNwcmV2aWV3IFtkYXRhLWxpbmVdXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgbGV0IHRvcCA9IGNoaWxkLm9mZnNldFRvcCAtIHRhcmdldC5vZmZzZXRUb3A7XG4gICAgICAgIFxuICAgICAgICBpZiAodG9wIDw9IHNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgbGluZSA9IE51bWJlcihjaGlsZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWxpbmVcIikpO1xuICAgICAgICAgICAgaWYgKCFsaW5lICYmIGxpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsaW5lID0gbGluZXNbbGluZXMubGVuZ3RoLTFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWxpbmUpIHtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0b3AgPiBzY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICAgIGVkaXRvci5zY3JvbGwoe3RvcDogbGluZSpsaW5lSGVpZ2h0LCBiZWhhdmlvcjogXCJzbW9vdGhcIn0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIlxuaW1wb3J0IHsgdXBkYXRlUmVzdWx0IH0gZnJvbSBcIi4vcGFyc2VyXCJcblxuLyoqXG4gKiBPcGVuIHRoZSBtYXJrZG93biBlZGl0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9wZW5NYXJrZG93bkVkaXRvcigpIHtcbiAgICAkKFwiI21hcmtkb3duLWNvbnRhaW5lclwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCBmYWxzZSk7XG4gICAgJChcIiNtYXJrZG93bi1oZWFkZXJcIikudG9nZ2xlQ2xhc3MoXCJoaWRkZW5cIiwgdHJ1ZSk7XG4gICAgJChcIiNzZXR0aW5ncy1lZGl0b3JcIikudG9nZ2xlQ2xhc3MoXCJoaWRkZW5cIiwgdHJ1ZSk7XG4gICAgY29uc3QgaWQgPSBDb25zdGFudHMuc2VsZWN0ZWQuaWQgfHwgLTE7XG4gICAgaWYgKENvbnN0YW50cy5jYWNoZVtpZF0pIHtcbiAgICAgICAgbG9hZEJsb2IoQ29uc3RhbnRzLmNhY2hlW2lkXSk7XG4gICAgICAgIHRyaWdnZXJSZXNpemUoKTtcbiAgICB9XG4gICAgZWxzZSB7ICBcbiAgICAgICAgJC5nZXQoYC9hcGkvZ2V0ZG9jdW1lbnQ/aWQ9JHtpZH0maGFzaF9uYW1lPSR7Q29uc3RhbnRzLmhhc2hfbmFtZX1gLCBmdW5jdGlvbihkYXRhLCBzdWNjZXNzKSB7XG4gICAgICAgICAgICBDb25zdGFudHMuY2FjaGVbaWRdID0gZGF0YTtcbiAgICAgICAgICAgIGxvYWRCbG9iKGRhdGEpO1xuICAgICAgICAgICAgdHJpZ2dlclJlc2l6ZSgpO1xuICAgICAgICB9KTtcbiAgICB9ICAgXG59XG5cbi8qKlxuICogTG9hZCBhIGRvY3VtZW50IGluIGJsb2IgZm9ybSBhbmQgc2V0IHRoZSB0ZXh0IGluIHRoZSBjb2RlIGFyZWFcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgLSBUaGUgZG9jdW1lbnQgcmV0dXJuZWQgZnJvbSBteXNxbCBkYXRhYmFzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEJsb2IoZG9jKSB7XG4gICAgbGV0IGJhc2U2NCA9IGRvYy5jb250ZW50O1xuICAgIGlmICghYmFzZTY0KSB7XG4gICAgICAgIGJhc2U2NCA9IFwiXCI7XG4gICAgfVxuICAgIGxldCBkaXJ0eSA9IGF0b2IoYmFzZTY0KTtcbiAgICBjb25zdCBjbGVhbiA9IERPTVB1cmlmeS5zYW5pdGl6ZShkaXJ0eSk7XG4gICAgJChcIiN0ZXh0YXJlYVwiKS52YWwoY2xlYW4pO1xuICAgIHNldExpbmVOdW1iZXJzKCk7XG4gICAgdXBkYXRlUmVzdWx0KCk7XG59XG5cbi8qKlxuICogU2V0IHRoZSBsaW5lIG51bWJlcnMgaW4gdGhlIGNvZGUgZWRpdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRMaW5lTnVtYmVycygpIHtcbiAgICBpZiAoISQoXCIjZWRpdG9yXCIpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGxldCBsaW5lSGVpZ2h0ID0gMjU7XG4gICAgbGV0IGxpbmVzID0gTWF0aC5jZWlsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV4dGFyZWFcIikuY2xpZW50SGVpZ2h0IC8gbGluZUhlaWdodCk7XG4gICAgbGV0IGxuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaW5lLW51bWJlcnNcIik7XG4gICAgbG4uaW5uZXJIVE1MID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzOyBpKyspIHtcbiAgICAgICAgbG4uaW5uZXJIVE1MICs9IGA8cD4ke2krMX08L3A+YDtcbiAgICB9XG59XG5cbi8qKlxuICogVHJpZ2dlciByZXNpemUgZnVuY3Rpb24gYW5kIHNldCB0aGUgbGluZSBudW1iZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyUmVzaXplKCkge1xuICAgICQoXCJ0ZXh0YXJlYVwiKS50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgc2V0TGluZU51bWJlcnMoKTtcbn1cbiIsImltcG9ydCB7IG9wZW5NYXJrZG93bkVkaXRvciB9IGZyb20gXCIuL2VkaXRvclwiXG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIlxuaW1wb3J0IHsgc2F2ZSB9IGZyb20gXCIuL2RvY3VtZW50XCJcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGZpbGUgY29udGFpbmVyIGluIHByb2plY3RzLnBocFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVyZW5kZXJGaWxlQ29udGFpbmVyKCkge1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvbGRlci1jb250YWluZXJcIik7XG4gICAgc2Nyb2xsVG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb2xkZXItY29udGFpbmVyXCIpLnNjcm9sbFRvcDtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAkLmdldChcIi9pbmNsdWRlcy9wcm9qZWN0LXhoci5waHBcIiwge1xuICAgICAgICBxOiBDb25zdGFudHMuaGFzaF9uYW1lLFxuICAgICAgICByb290OiBDb25zdGFudHMucm9vdFxuICAgIH0sIChkYXRhLCBzdWNjZXNzKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKTtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgICBmb2xkZXJzUmVuZGVyZWQoKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBPcGVuIGFsbCB0aGUgZm9sZGVycyB0aGF0IHdlcmUgb3BlbiwgaWYgdGhlIGZpbGUgdHJlZSBpcyByZW5kZXJlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9sZGVyc1JlbmRlcmVkKCkge1xuICAgIGlmIChvcGVuRm9sZGVyLmxlbmd0aCA9PSAwIHx8IENvbnN0YW50cy5vcGVuRm9sZGVycy5ldmVyeSh2YWwgPT4gQm9vbGVhbihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbmVzdGVkLSR7dmFsfWApKSkpIHtcbiAgICAgICAgQ29uc3RhbnRzLm9wZW5Gb2xkZXJzLmZvckVhY2goZiA9PiBvcGVuRm9sZGVyKGYsIHRydWUpKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb2xkZXItY29udGFpbmVyXCIpLnNjcm9sbFRvKDAsIHNjcm9sbFRvcCk7XG4gICAgICAgIGJpbmRDb250ZXh0bWVudSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmb2xkZXJzUmVuZGVyZWQpO1xuICAgIH1cbn1cblxudmFyIHNjcm9sbFRvcCA9IDA7XG4vKipcbiAqIE9wZW4gdGhlIGZvbGRlciBpbiB0aGUgZmlsZSB0cmVlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudCBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Gb2xkZXIoZWxlbWVudCwgZXZlbnQpIHtcbiAgICAvLyBmb3JjZSBcbiAgICBpZiAoZXZlbnQgPT09IHRydWUpIHtcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBuZXN0ZWQtJHtlbGVtZW50fWApO1xuICAgICAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcoZWxlbWVudCkpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZShcImNsb3NlZFwiKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShcIm9wZW5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhZGQtaWNvblwiKSkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbmVzdGVkLSR7ZWxlbWVudC5pZH1gKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZShcImNsb3NlZFwiKTtcbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiKSkge1xuICAgICAgICBDb25zdGFudHMub3BlbkZvbGRlcnMucHVzaChlbGVtZW50LmlkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIENvbnN0YW50cy5vcGVuRm9sZGVycyA9IENvbnN0YW50cy5vcGVuRm9sZGVycy5maWx0ZXIodmFsID0+IHZhbCAhPSBlbGVtZW50LmlkKTtcbiAgICB9XG59XG5cbi8qKlxuICogU2VsZWN0IGEgZmlsZSBmcm9tIHRoZSBmaWxlIHRyZWVcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEZpbGUoZWxlbWVudCkge1xuICAgIGlmIChDb25zdGFudHMuc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKCQoXCIjZWRpdG9yXCIpLmxlbmd0aCAmJiAhJChcIiNuZXN0ZWQtXCIrYWN0aXZlQ29udGV4dE1lbnUpLmxlbmd0aCkge1xuICAgICAgICAgICAgQ29uc3RhbnRzLmNhY2hlW0NvbnN0YW50cy5zZWxlY3RlZC5pZF1bXCJjb250ZW50XCJdID0gYnRvYSgkKFwiI3RleHRhcmVhXCIpLnZhbCgpKTtcbiAgICAgICAgICAgIHNhdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBDb25zdGFudHMuc2VsZWN0ZWQuY2xhc3NMaXN0LnRvZ2dsZShcInNlbGVjdGVkXCIpO1xuICAgIH1cbiAgICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJzZWxlY3RlZFwiKTtcbiAgICBDb25zdGFudHMuc2VsZWN0ZWQgPSBlbGVtZW50O1xuICAgIGlmICghJChcIiNuZXN0ZWQtXCIrYWN0aXZlQ29udGV4dE1lbnUpLmxlbmd0aCkge1xuICAgICAgICBvcGVuTWFya2Rvd25FZGl0b3IoKTtcbiAgICB9XG59XG5cbmxldCBhY3RpdmVDb250ZXh0TWVudSA9IC0xO1xuLyoqXG4gKiBCaW5kIHRoZSBjb250ZXh0IG1lbnUgZXZlbnQgdG8gZmlsZXMgaW4gdGhlIGZpbGUgdHJlZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZENvbnRleHRtZW51KCkge1xuICAgIGlmICghJChcIiNlZGl0b3JcIikubGVuZ3RoKSByZXR1cm47XG4gICAgJChcIi53aXRoLWljb25cIikuY29udGV4dG1lbnUoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKFwicm9vdC1uYW1lXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYWN0aXZlQ29udGV4dE1lbnUgPSB0aGlzLmlkO1xuICAgICAgICAkKFwiI2NvbnRleHQtbWVudVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiZ3JpZFwiKTtcbiAgICAgICAgJChcIiNjb250ZXh0LW1lbnVcIikuY3NzKFwibGVmdFwiLCBldmVudC5jbGllbnRYK1wicHhcIik7XG4gICAgICAgICQoXCIjY29udGV4dC1tZW51XCIpLmNzcyhcInRvcFwiLCBldmVudC5jbGllbnRZK1wicHhcIik7XG4gICAgICAgIHNlbGVjdEZpbGUodGhpcyk7XG4gICAgICAgICQoXCIjY29udGV4dC1tZW51LWZvY3VzXCIpLmZvY3VzKCk7XG4gICAgICAgIGNvbnN0IGJsdXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICQoXCIjY29udGV4dC1tZW51XCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgYmx1cik7XG4gICAgICAgIH1cbiAgICAgICAgJChkb2N1bWVudCkuY2xpY2soYmx1cik7XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmVuYW1lIGEgZmlsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuYW1lRmlsZSgpIHtcbiAgICBsZXQgcCA9ICQoXCIjXCIrYWN0aXZlQ29udGV4dE1lbnUpLmZpbmQoXCJwXCIpWzBdO1xuICAgIGNvbnN0IHByZXYgPSBwLmlubmVyVGV4dDtcbiAgICBwLmlubmVyVGV4dCA9IFwiXCI7XG4gICAgcC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMTBweFwiO1xuICAgIHAuc2V0QXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIsIHRydWUpO1xuICAgIHAuZm9jdXMoKTtcbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgICQucG9zdChgL2FwaS9yZW5hbWVkb2N1bWVudGAsIHtpZDogYWN0aXZlQ29udGV4dE1lbnUsIG5hbWU6IHAuaW5uZXJUZXh0LCBoYXNoX25hbWU6IENvbnN0YW50cy5oYXNoX25hbWV9LCBmaWxlQ2hhbmdlKTtcbiAgICAgICAgcC5yZW1vdmVBdHRyaWJ1dGUoXCJjb250ZW50ZWRpdGFibGVcIik7XG4gICAgICAgIHAuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjBweFwiO1xuICAgIH1cbiAgICBvbkVudGVyKHAsIChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB1cGRhdGUoKTtcbiAgICB9LCB0cnVlKTtcbiAgICBvbkVzY2FwZShwLCAoZXZlbnQpID0+IHtcbiAgICAgICAgcC5yZW1vdmVBdHRyaWJ1dGUoXCJjb250ZW50ZWRpdGFibGVcIik7XG4gICAgICAgIHAuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjBweFwiO1xuICAgICAgICBwLmlubmVyVGV4dCA9IHByZXY7XG4gICAgfSlcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBmaWxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVGaWxlKCkge1xuICAgIGlmICgkKFwiI25lc3RlZC1cIithY3RpdmVDb250ZXh0TWVudSkubGVuZ3RoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBmb2xkZXIgYW5kIGl0cyBjb250ZW50cz9cIikpIHtcbiAgICAgICAgICAgIENvbnN0YW50cy5vcGVuRm9sZGVycyA9IENvbnN0YW50cy5vcGVuRm9sZGVycy5maWx0ZXIoZiA9PiBmICE9IGFjdGl2ZUNvbnRleHRNZW51KVxuICAgICAgICAgICAgJChcIiNcIithY3RpdmVDb250ZXh0TWVudSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAkKFwiI25lc3RlZC1cIithY3RpdmVDb250ZXh0TWVudSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAkLnBvc3QoYC9hcGkvZGVsZXRlZG9jdW1lbnRgLCB7aWQ6IGFjdGl2ZUNvbnRleHRNZW51LCBoYXNoX25hbWU6IENvbnN0YW50cy5oYXNoX25hbWV9LCBmaWxlQ2hhbmdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh3aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBmaWxlP1wiKSkge1xuICAgICAgICAkKFwiI1wiK2FjdGl2ZUNvbnRleHRNZW51KS5yZW1vdmUoKTtcbiAgICAgICAgJC5wb3N0KGAvYXBpL2RlbGV0ZWRvY3VtZW50YCwge2lkOiBhY3RpdmVDb250ZXh0TWVudSwgaGFzaF9uYW1lOiBDb25zdGFudHMuaGFzaF9uYW1lfSwgZmlsZUNoYW5nZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgb25FbnRlciwgb25Fc2NhcGUsIG9uQmx1ciwgZGlzcGxheU1lc3NhZ2UsIENvbnN0YW50cyB9IGZyb20gXCIuLi91dGlscy9pbmRleFwiXG5pbXBvcnQgeyB1cGRhdGVSZXN1bHQgfSBmcm9tIFwiLi9wYXJzZXJcIlxuaW1wb3J0IHsgb3BlbkZvbGRlciwgcmVyZW5kZXJGaWxlQ29udGFpbmVyIH0gZnJvbSBcIi4vZmlsZS10cmVlXCJcblxuXG4vKipcbiAqIEFkZHMgYSBmaWxlIG9yIGZvbGRlciBpbnB1dCB0byB0aGUgZmlsZSBoaWVyYXJjaHlcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gXCJmaWxlXCIgfCBcImZvbGRlclwiXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCB3aGVyZSB0aGUgdXNlciBjbGlja2VkIG9uIGFkZERvY3VtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGREb2N1bWVudCh0eXBlLCBlbGVtZW50KSB7XG4gICAgY29uc3QgZ2V0TmVzdGVkQm9yZGVycyA9ICgpID0+IHtcbiAgICAgICAgbGV0IGFtb3VudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJyb290LW5hbWVcIikgPyAwIDogZWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkRWxlbWVudENvdW50ICsgMTtcbiAgICAgICAgbGV0IHN0ciA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcbiAgICAgICAgICAgIHN0ciArPSBgPGRpdiBjbGFzcz1cIm5lc3RlZC1ib3JkZXJcIj48L2Rpdj5gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIGNvbnN0IGZvbGRlciA9IGA8ZGl2IGNsYXNzPVwid2l0aC1pY29uIHRlbXBcIiBpZD1cInRlbXBcIj5cbiAgICA8ZGl2IGNsYXNzPVwibmVzdGVkLWJvcmRlcnNcIj5cbiAgICAgICAgJHtnZXROZXN0ZWRCb3JkZXJzKCl9XG4gICAgPC9kaXY+XG4gICAgPGltZyBzcmM9XCIvYXNzZXRzL2ZvbGRlci5zdmdcIj5cbiAgICA8aW5wdXQgaWQ9XCJ0ZW1wLWlucHV0XCIgdHlwZT1cInRleHRcIi8+XG4gICAgPC9kaXY+YDtcbiAgICBjb25zdCBmaWxlID0gYDxkaXYgY2xhc3M9XCJ3aXRoLWljb24gdGVtcFwiIGlkPVwidGVtcFwiPlxuICAgIDxkaXYgY2xhc3M9XCJuZXN0ZWQtYm9yZGVyc1wiPlxuICAgICAgICAke2dldE5lc3RlZEJvcmRlcnMoKX1cbiAgICA8L2Rpdj5cbiAgICA8aW1nIHNyYz1cIi9hc3NldHMvZmlsZS5zdmdcIj5cbiAgICA8aW5wdXQgaWQ9XCJ0ZW1wLWlucHV0XCIgdHlwZT1cInRleHRcIi8+XG4gICAgPC9kaXY+YDtcbiAgICBpZiAoIUNvbnN0YW50cy5vcGVuRm9sZGVycy5pbmNsdWRlcyhlbGVtZW50LnBhcmVudEVsZW1lbnQuaWQpICYmICFlbGVtZW50LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicm9vdC1uYW1lXCIpKSAge1xuICAgICAgICBDb25zdGFudHMub3BlbkZvbGRlcnMucHVzaChlbGVtZW50LnBhcmVudEVsZW1lbnQuaWQpXG4gICAgICAgIG9wZW5Gb2xkZXIoZWxlbWVudC5wYXJlbnRFbGVtZW50LmlkLCB0cnVlKVxuICAgIH1cbiAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJFbmRcIiwgdHlwZSA9PSBcImZvbGRlclwiID8gZm9sZGVyIDogZmlsZSk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wLWlucHV0XCIpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgb25FbnRlcihpbnB1dCwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgaW5wdXQuYmx1cigpO1xuICAgICAgICBpZiAodmFsdWUgPT0gXCJcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNlbnQgUE9TVCB0byBhZGQgZm9sZGVyL2ZpbGVcbiAgICAgICAgJC5wb3N0KGAvYXBpL2FkZGRvY3VtZW50YCwge1xuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIG5hbWU6IHZhbHVlLFxuICAgICAgICAgICAgcGFyZW50OiBlbGVtZW50LnBhcmVudEVsZW1lbnQuaWQsXG4gICAgICAgICAgICBhZGQ6IHRydWUsXG4gICAgICAgICAgICBoYXNoX25hbWU6IENvbnN0YW50cy5oYXNoX25hbWVcbiAgICAgICAgfSwgKGRhdGEsIHN0YXR1cykgPT4ge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZmlsZUNoYW5nZSgpO1xuICAgICAgICAgICAgICAgIHNhdmUoKTtcbiAgICAgICAgICAgICAgICByZXJlbmRlckZpbGVDb250YWluZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KTtcbiAgICBvbkVzY2FwZShpbnB1dCwgKCkgPT4ge1xuICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVtcFwiKTtcbiAgICAgICAgaWYgKGVsKSBlbC5yZW1vdmUoKTtcbiAgICB9KVxuICAgIG9uQmx1cihpbnB1dCwgKCkgPT4ge1xuICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlbXBcIik7XG4gICAgICAgIGlmIChlbCkgZWwucmVtb3ZlKCk7XG4gICAgfSlcbn1cblxuXG4vKipcbiAqIFNhdmUgYSBkb2N1bWVudFxuICovXG4gZXhwb3J0IGZ1bmN0aW9uIHNhdmUoKSB7XG4gICAgaWYgKCEkKFwiLnNlbGVjdGVkXCIpWzBdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGRpcnR5ID0gJChcIiN0ZXh0YXJlYVwiKS52YWwoKTtcbiAgICBjb25zdCBjbGVhbiA9IERPTVB1cmlmeS5zYW5pdGl6ZShkaXJ0eSk7XG4gICAgLy8gZXNjYXBlIHBhcnNlZFxuICAgIGxldCBiYXNlNjQgPSBidG9hKGNsZWFuKTtcbiAgICBjb25zdCBpZCA9ICQoXCIuc2VsZWN0ZWRcIilbMF0uaWQ7XG4gICAgQ29uc3RhbnRzLmNhY2hlW2lkXVtcImNvbnRlbnRcIl0gPSBiYXNlNjQ7XG4gICAgJC5wb3N0KGAvYXBpL3NhdmVkb2N1bWVudD9pZD0ke2lkfWAsIHtjb250ZW50OiBiYXNlNjR9KTtcbiAgICBkaXNwbGF5TWVzc2FnZShcIlNhdmVkIGZpbGVcIik7XG59XG5cblxuLyoqXG4gKiBEb3dubG9hZCB0aGUgY3VycmVudCBmaWxlIGluIGh0bWwgZm9ybSB3aXRoIGFsbCB0aGUgc3R5bGVzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb3dubG9hZEZpbGUoKSB7XG5cbiAgICBhd2FpdCB1cGRhdGVSZXN1bHQodHJ1ZSk7XG5cbiAgICBpZiAoIUNvbnN0YW50cy5zZWxlY3RlZCkgcmV0dXJuO1xuICAgIGNvbnN0IGh0bWwgPSAkKFwiI3ByZXZpZXdcIikuaHRtbCgpO1xuICAgIGxldCBjc3MgPSBhd2FpdCBmZXRjaChcIi4uL2Nzcy9tYXJrZG93bi5jc3NcIik7XG4gICAgY29uc3QgbWFya2Rvd25TdHlsZSA9IGF3YWl0IGNzcy50ZXh0KCk7XG4gICAgY3NzID0gYXdhaXQgZmV0Y2goXCIuLi9jc3MvYXRvbS1vbmUtbGlnaHQubWluLmNzc1wiKTtcbiAgICBjb25zdCBjb2RlQ3NzID0gYXdhaXQgY3NzLnRleHQoKTtcbiAgICBjc3MgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0va2F0ZXhAMC4xMy4xOC9kaXN0L2thdGV4Lm1pbi5jc3NcIik7XG4gICAgY29uc3Qga2F0ZXhDc3MgPSBhd2FpdCBjc3MudGV4dCgpO1xuICAgIGNvbnN0IGRvYyA9IGBcbjwhRE9DVFlQRSBodG1sPlxuPGh0bWwgbGFuZz1cImVuXCI+XG48aGVhZD5cbiAgICA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIj5cbiAgICA8bWV0YSBodHRwLWVxdWl2PVwiWC1VQS1Db21wYXRpYmxlXCIgY29udGVudD1cIklFPWVkZ2VcIj5cbiAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiPlxuICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9rYXRleEAwLjEzLjE4L2Rpc3Qva2F0ZXgubWluLmNzc1wiIGludGVncml0eT1cInNoYTM4NC16VFJPWUZWR09mVHc3SlY3S1V1OHVkc3ZXMmZ4NGxXT3NDRURxaEJyZUJ3bEhJNGlvVlJ0bUl2RVRoekpIR0VUXCIgY3Jvc3NvcmlnaW49XCJhbm9ueW1vdXNcIj5cbiAgICA8c3R5bGU+JHttYXJrZG93blN0eWxlfTwvc3R5bGU+XG4gICAgPHN0eWxlPiR7Y29kZUNzc308L3N0eWxlPlxuICAgIDxzdHlsZT4ke2thdGV4Q3NzfTwvc3R5bGU+XG48L2hlYWQ+XG48Ym9keSBjbGFzcz1cIm1hcmtkb3duLXByZXZpZXdlclwiPlxuJHtodG1sfVxuPC9ib2R5PmA7XG5cbiAgICBsZXQgZGF0YSA9IGF3YWl0IGZldGNoKFwiLi4vY29uZmlnLmpzb25cIik7XG4gICAgY29uc3QgY29uZmlnID0gYXdhaXQgZGF0YS5qc29uKCk7XG5cbiAgICBjb25zdCBkb3dubG9hZEZpbGUgPSAoYmxvYiwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gY3JlYXRlIGEgYmxvYlVSSSBwb2ludGluZyB0byBvdXIgQmxvYlxuICAgICAgICBsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gICAgICAgIC8vIHNvbWUgYnJvd3NlciBuZWVkcyB0aGUgYW5jaG9yIHRvIGJlIGluIHRoZSBkb2NcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQobGluayk7XG4gICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgbGluay5yZW1vdmUoKTtcbiAgICAgICAgLy8gaW4gY2FzZSB0aGUgQmxvYiB1c2VzIGEgbG90IG9mIG1lbW9yeVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwobGluay5ocmVmKSwgNzAwMCk7XG4gICAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBjb25maWcuc2VydmVyLnVybCtcIi9nZXQtcGRmXCIsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBkYXRhOiBkb2MsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcInRleHQvaHRtbDsgY2hhcnNldD1VVEYtOFwiLFxuICAgICAgICBzdWNjZXNzIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGEgYmxvYlVSSSBwb2ludGluZyB0byBvdXIgQmxvYlxuICAgICAgICAgICAgbGluay5ocmVmID0gZGF0YTtcbiAgICAgICAgICAgIGxpbmsuZG93bmxvYWQgPSBDb25zdGFudHMuc2VsZWN0ZWQuaW5uZXJUZXh0ICsgXCIucGRmXCI7XG4gICAgICAgICAgICAvLyBzb21lIGJyb3dzZXIgbmVlZHMgdGhlIGFuY2hvciB0byBiZSBpbiB0aGUgZG9jXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChsaW5rKTtcbiAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgICAgIGxpbmsucmVtb3ZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yIChyZXEpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgICAgIH1cbiAgICB9KVxufSIsImltcG9ydCB7IGJpbmRDb250ZXh0bWVudSB9IGZyb20gJy4vZmlsZS10cmVlJ1xuaW1wb3J0IHsgdHJpZ2dlclJlc2l6ZSwgc2V0TGluZU51bWJlcnMgfSBmcm9tICcuL2VkaXRvcidcbmltcG9ydCB7IHNhdmUsIGRvd25sb2FkRmlsZSB9IGZyb20gJy4vZG9jdW1lbnQnXG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tIFwiLi4vdXRpbHMvaW5kZXguanNcIlxuaW1wb3J0IHsgdXBkYXRlUmVzdWx0ICB9IGZyb20gXCIuL3BhcnNlclwiXG5cblxuXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gICAgYmluZENvbnRleHRtZW51KCk7XG4gICAkKFwidGV4dGFyZWFcIikub24oXCJrZXl1cFwiLCBzZXRMaW5lTnVtYmVycyk7XG4gICAkKFwidGV4dGFyZWFcIikua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkdGhpcywgZW5kLCBzdGFydDtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gOSkge1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgZW5kID0gdGhpcy5zZWxlY3Rpb25FbmQ7XG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGhpcy52YWwoJHRoaXMudmFsKCkuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIFwiXFx0XCIgKyAkdGhpcy52YWwoKS5zdWJzdHJpbmcoZW5kKSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblN0YXJ0ID0gdGhpcy5zZWxlY3Rpb25FbmQgPSBzdGFydCArIDE7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0cmlnZ2VyUmVzaXplKTtcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoc2F2ZSwgMTAwMCAqIDYwICogNSk7IC8vIEV2ZXJ5IDUgbWludXRlc1xuICAgICQoXCJ0ZXh0YXJlYVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IDExMDApIHJldHVybjtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImhlaWdodDpcIiArICh0aGlzLnNjcm9sbEhlaWdodCkgKyBcInB4O292ZXJmbG93LXk6aGlkZGVuO1wiKTtcbiAgICB9KS5vbihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgdGhpcy5zdHlsZS5oZWlnaHQgPSAodGhpcy5zY3JvbGxIZWlnaHQpICsgXCJweFwiO1xuICAgIH0pO1xuICAgIHRyaWdnZXJSZXNpemUoKTtcbn0pO1xuXG4vLyBTZXR1cCBldmVudCBsaXN0ZW5lcnNcbiQoXCIjdGhlbWUtc3dpdGNoXCIpLm9uKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiZGFya1wiKSwgMjUwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwibGlnaHRcIiksIDI1MCk7XG4gICAgfVxufSlcblxuJChcIiNsYXlvdXQtY29kZVwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAkKFwiI21hcmtkb3duLWNvbnRhaW5lclwiKS5hZGRDbGFzcyhcImxheW91dC1jb2RlXCIpO1xuICAgICQoXCIjbWFya2Rvd24tY29udGFpbmVyXCIpLnJlbW92ZUNsYXNzKFwibGF5b3V0LXByZXZpZXdcIik7XG59KTtcbiQoXCIjbGF5b3V0LXByZXZpZXdcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgJChcIiNtYXJrZG93bi1jb250YWluZXJcIikucmVtb3ZlQ2xhc3MoXCJsYXlvdXQtY29kZVwiKTtcbiAgICAkKFwiI21hcmtkb3duLWNvbnRhaW5lclwiKS5hZGRDbGFzcyhcImxheW91dC1wcmV2aWV3XCIpO1xufSk7XG4kKFwiI2xheW91dC1zcGxpdFwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAkKFwiI21hcmtkb3duLWNvbnRhaW5lclwiKS5yZW1vdmVDbGFzcyhcImxheW91dC1jb2RlXCIpO1xuICAgICQoXCIjbWFya2Rvd24tY29udGFpbmVyXCIpLnJlbW92ZUNsYXNzKFwibGF5b3V0LXByZXZpZXdcIik7XG59KTtcbiQoXCIjc2F2ZS1maWxlXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHNhdmUoKTtcbn0pO1xuJChcIiNkb3dubG9hZC1maWxlXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGRvd25sb2FkRmlsZSgpO1xufSk7XG4kKFwiI3ZpZXctaW1hZ2VzXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICQoXCIjbWFya2Rvd24tY29udGFpbmVyXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgICQoXCIjbWFya2Rvd24taGVhZGVyXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgICQoXCIjc2V0dGluZ3MtZWRpdG9yXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgICQoXCIjaW1hZ2UtZWRpdG9yXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIGZhbHNlKTtcbn0pO1xuJChcIiNzaG93SW1hZ2VzXCIpLmNoYW5nZSgoKSA9PiB7XG4gICAgQ29uc3RhbnRzLmxvYWRJbWFnZXMgPSAhQ29uc3RhbnRzLmxvYWRJbWFnZXM7XG4gICAgdXBkYXRlUmVzdWx0KCk7XG59KTtcbiIsIlxuXG5cbi8qKlxuICogU2V0dXAgYSBzaGFyZSBsaW5rIGZvciB0aGUgcHJvamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hhcmVQcm9qZWN0KCkge1xuICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0cy1zZXR0aW5nc1wiKTtcbiAgICBpZiAoIXNlbGVjdCkgcmV0dXJuO1xuICAgIGxldCByaWdodHMgPSBzZWxlY3QudmFsdWU7XG4gICAgbGV0IGF1dGggPSBnZXRUb2tlbigzMik7XG4gICAgbGV0IGhhc2hfbmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKFwiL3Byb2plY3RzL1wiLCBcIlwiKTtcbiAgICAkLnBvc3QoYC9hcGkvc2V0c2hhcmVgLCB7IGF1dGgsIGhhc2hfbmFtZSwgcmlnaHRzIH0sIChkYXRhLCBzdGF0dXMpID0+IHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAgIGxldCBsaW5rID0gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX0/YXV0aD0ke2F1dGh9YDtcbiAgICAgICAgICAgICQoXCIjbGluay1zaGFyZVwiKS5odG1sKGA8Yj5TaGFyZSB0aGlzIGxpbms6IDwvYj48YSBocmVmPVwiJHtsaW5rfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bGlua308L2E+YCk7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIHNoYXJlIGxpbmtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbmNlbEFkZFVzZXIoKSB7XG4gICAgY29uc3QgdXJsU2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICBjb25zdCBhdXRoID0gdXJsU2VhcmNoUGFyYW1zLmdldChcImF1dGhcIik7XG4gICAgJC5wb3N0KFwiL2FwaS9jYW5jZWxzaGFyZVwiLCB7YXV0aH0pO1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9IFwiL1wiO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIHVzZXIgZnJvbSB0aGUgcHJvamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IGlkIFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVXNlcihpZCkge1xuICAgICQucG9zdChgL2FwaS9yZW1vdmVwcml2aWxlZ2VgLCB7aWQsIGhhc2hfbmFtZX0sIChkYXRhLCBzdGF0dXMpID0+IHtcbiAgICAgICAgJChcIiNyaWdodHMtXCIraWQpLnJlbW92ZSgpO1xuICAgICAgICBoaWRlUG9wdXAoXCJyZW1vdmVcIiwgd2luZG93KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBFZGl0IGEgcHJpdmlsZWdlIG9mIGEgdXNlciBvbiB0aGUgcHJvamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IGlkIFxuICovXG5leHBvcnQgZnVuY3Rpb24gZWRpdFByaXZpbGVnZShpZCkge1xuICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0cy1zZXR0aW5ncy1wb3B1cFwiKTtcbiAgICBpZiAoIXNlbGVjdCkgcmV0dXJuO1xuICAgIGxldCByaWdodHMgPSBzZWxlY3QudmFsdWU7XG4gICAgJC5wb3N0KGAvYXBpL2VkaXRwcml2aWxlZ2VgLCB7aWQsIGhhc2hfbmFtZSwgcmlnaHRzfSwgKGRhdGEsIHN0YXR1cykgPT4ge1xuICAgICAgICAkKFwiI3JpZ2h0cy1cIitpZCkuY2hpbGRyZW4oKVsxXS5pbm5lclRleHQgPSByaWdodHM7XG4gICAgICAgIGhpZGVQb3B1cChcImVkaXRcIiwgd2luZG93KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBVcGxvYWQgYW4gaW1hZ2UgdG8gYSBwcm9qZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRJbWFnZSgpIHtcbiAgICBsZXQgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBsZXQgZmlsZSA9ICQoXCIjZmlsZS1pbWFnZVwiKVswXVxuICAgIGlmICghZmlsZS5maWxlcy5sZW5ndGgpIHJldHVybjtcbiAgICBmaWxlID0gZmlsZS5maWxlc1swXTtcbiAgICBmaWxlLm5hbWUgPSBmaWxlLm5hbWUucmVwbGFjZUFsbChcIlxcc1wiLCBcIl9cIik7XG4gICAgZmQuYXBwZW5kKCdpbWFnZScsIGZpbGUpO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYC9hcGkvdXBsb2FkaW1hZ2U/aGFzaF9uYW1lPSR7aGFzaF9uYW1lfWAsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogZmQsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzIChyZXNwb25zZSkge1xuICAgICAgICAgICAgZGlzcGxheU1lc3NhZ2UocmVzcG9uc2UubWVzc2FnZSk7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0Ym9keS1pbWFnZXNcIik7XG4gICAgICAgICAgICBsZXQgaHRtbCA9IGA8dHIgaWQ9XCJpbWFnZS0ke3Jlc3BvbnNlLmlkfVwiPlxuICAgICAgICAgICAgICAgIDx0ZD4ke2ZpbGUubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInNwbGl0XCIgb25jbGljaz1cImRlbGV0ZUltYWdlKHRoaXMpXCI+IFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BsaXQtdGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2Fzc2V0cy9taW51cy5zdmdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPkRlbGV0ZSBpbWFnZTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDwvdHI+YFxuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBodG1sKTtcbiAgICAgICAgICAgIGhpZGVQb3B1cCgnaW1hZ2UnLCB3aW5kb3cpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvciAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICAgIGRpc3BsYXlNZXNzYWdlKGVycm9yLnJlc3BvbnNlVGV4dCwgXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGhpZGVQb3B1cCgnaW1hZ2UnLCB3aW5kb3cpO1xuICAgICAgICB9XG4gICAgfSlcbn0iLCJpbXBvcnQgKiBhcyBEIGZyb20gXCIuL2RvY3VtZW50XCJcbmltcG9ydCAqIGFzIFAgZnJvbSBcIi4vcGFyc2VyXCJcbmltcG9ydCAqIGFzIEYgZnJvbSBcIi4vZmlsZS10cmVlXCJcbmltcG9ydCAqIGFzIEUgZnJvbSBcIi4vZWRpdG9yXCJcbmltcG9ydCAqIGFzIEkgZnJvbVwiLi9pbml0XCJcbmltcG9ydCAqIGFzIFMgZnJvbSBcIi4vc2V0dGluZ3NcIlxuZXhwb3J0ICogZnJvbSBcIi4vZG9jdW1lbnRcIlxuZXhwb3J0ICogZnJvbSBcIi4vcGFyc2VyXCJcbmV4cG9ydCAqIGZyb20gXCIuL2ZpbGUtdHJlZVwiXG5leHBvcnQgKiBmcm9tIFwiLi9lZGl0b3JcIlxuZXhwb3J0ICogZnJvbVwiLi9pbml0XCJcbmV4cG9ydCAqIGZyb20gXCIuL3NldHRpbmdzXCJcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC4uLkQsXG4gICAgLi4uUCxcbiAgICAuLi5GLFxuICAgIC4uLkUsXG4gICAgLi4uSSxcbiAgICAuLi5TXG59Il0sIm5hbWVzIjpbImFycmF5TGlrZVRvQXJyYXkiLCJhcnJheVdpdGhvdXRIb2xlcyIsIml0ZXJhYmxlVG9BcnJheSIsInVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5Iiwibm9uSXRlcmFibGVTcHJlYWQiLCJtZEh0bWwiLCJzY3JvbGxNYXAiLCJkZWZhdWx0cyIsImh0bWwiLCJ4aHRtbE91dCIsImJyZWFrcyIsImxhbmdQcmVmaXgiLCJsaW5raWZ5IiwidHlwb2dyYWhlciIsIl9oaWdobGlnaHQiLCJfdmlldyIsImhpZ2hsaWdodCIsInN0ciIsImxhbmciLCJlc2MiLCJET01QdXJpZnkiLCJzYW5pdGl6ZSIsImhsanMiLCJnZXRMYW5ndWFnZSIsInRvTG93ZXJDYXNlIiwibGFuZ3VhZ2UiLCJpZ25vcmVJbGxlZ2FscyIsInZhbHVlIiwicmVzdWx0IiwiaGlnaGxpZ2h0QXV0byIsIm1kSW5pdCIsIndpbmRvdyIsIm1hcmtkb3duaXQiLCJyZW5kZXJlciIsInJ1bGVzIiwidGFibGVfb3BlbiIsImVtb2ppIiwidG9rZW4iLCJpZHgiLCJ0d2Vtb2ppIiwicGFyc2UiLCJjb250ZW50IiwiaW5qZWN0TGluZU51bWJlcnMiLCJ0b2tlbnMiLCJvcHRpb25zIiwiZW52Iiwic2xmIiwibGluZSIsIm1hcCIsImxldmVsIiwiYXR0ckpvaW4iLCJhdHRyU2V0IiwiU3RyaW5nIiwicmVuZGVyVG9rZW4iLCJwYXJhZ3JhcGhfb3BlbiIsImhlYWRpbmdfb3BlbiIsInNldEhpZ2hsaWdodGVkbENvbnRlbnQiLCJzZWxlY3RvciIsIiQiLCJ0ZXh0IiwidXBkYXRlUmVzdWx0IiwiZG93bmxvYWQiLCJsZW5ndGgiLCJpZCIsImJhc2U2NCIsImNhY2hlIiwiZGlydHkiLCJhdG9iIiwic291cmNlIiwidmFsIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwicmVwbGFjZUFsbCIsInJlZ2V4IiwibWF0Y2hlcyIsIm1hdGNoQWxsIiwiZm9yRWFjaCIsIm1hdGNoT2JqIiwibWF0Y2giLCJzdHJpcHBlZCIsInJlcGxhY2UiLCJzdHJpbmdUaW1lcyIsInJlY3Vyc2l2ZUxpc3RSZXBsYWNlbWVudCIsInN0ZXAiLCJsaXN0TWF0Y2hlcyIsInNoaWZ0ZWQiLCJyZXBsYWNlbWVudCIsIkNvbnN0YW50cyIsImxvYWRJbWFnZXMiLCJpIiwic3JjIiwiZ2V0IiwiaGFzaF9uYW1lIiwibG9jYXRpb24iLCJvcmlnaW4iLCJ0IiwicmF3SHRtbCIsInJlbmRlciIsIm5ld0xpbmVSZXBsYWNlbWVudCIsIlJlZ0V4cCIsInJlbmRlck1hdGhJbkVsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZGVsaW1pdGVycyIsImxlZnQiLCJyaWdodCIsImRpc3BsYXkiLCJtYWNyb3MiLCJuZXdMaW5lSW5EaXNwbGF5TW9kZSIsIm91dHB1dCIsInRocm93T25FcnJvciIsInNldE9wdGlvbkNsYXNzIiwibmFtZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJzZXRSZXN1bHRWaWV3IiwicmVhZHkiLCJrZXkiLCJlbCIsIiRlbCIsInByb3AiLCJvbiIsIkJvb2xlYW4iLCJ0eXBlZCIsIm9mZiIsInN5bmNTcmNTY3JvbGwiLCJzeW5jUmVzdWx0U2Nyb2xsIiwidXBkYXRlSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInR5cGVVcGRhdGUiLCJsaW5lSGVpZ2h0IiwidGFyZ2V0IiwiZmxvb3IiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJwcmV2aWV3IiwiY2xpZW50SGVpZ2h0Iiwic2Nyb2xsIiwidG9wIiwiYmVoYXZpb3IiLCJzY3JvbGxUb0xpbmUiLCJvZmZzZXRUYXJnZXQiLCJvZmZzZXRUb3AiLCJlZGl0b3IiLCJsaW5lcyIsImNoaWxkcmVuIiwiY2hpbGQiLCJOdW1iZXIiLCJnZXRBdHRyaWJ1dGUiLCJwdXNoIiwib3Blbk1hcmtkb3duRWRpdG9yIiwidG9nZ2xlQ2xhc3MiLCJzZWxlY3RlZCIsImxvYWRCbG9iIiwidHJpZ2dlclJlc2l6ZSIsImRhdGEiLCJzdWNjZXNzIiwiZG9jIiwiY2xlYW4iLCJzZXRMaW5lTnVtYmVycyIsImNlaWwiLCJsbiIsImlubmVySFRNTCIsInRyaWdnZXIiLCJyZXJlbmRlckZpbGVDb250YWluZXIiLCJjb250YWluZXIiLCJxIiwicm9vdCIsImluc2VydEFkamFjZW50SFRNTCIsInJlbW92ZSIsImZvbGRlcnNSZW5kZXJlZCIsIm9wZW5Gb2xkZXIiLCJvcGVuRm9sZGVycyIsImV2ZXJ5IiwiZiIsInNjcm9sbFRvIiwiYmluZENvbnRleHRtZW51IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZWxlbWVudCIsImV2ZW50IiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwiY29udGFpbnMiLCJzdG9wUHJvcGFnYXRpb24iLCJmaWx0ZXIiLCJzZWxlY3RGaWxlIiwiYWN0aXZlQ29udGV4dE1lbnUiLCJidG9hIiwic2F2ZSIsImNvbnRleHRtZW51IiwicHJldmVudERlZmF1bHQiLCJjc3MiLCJjbGllbnRYIiwiY2xpZW50WSIsImZvY3VzIiwiYmx1ciIsImNsaWNrIiwicmVuYW1lRmlsZSIsInAiLCJmaW5kIiwicHJldiIsImlubmVyVGV4dCIsInN0eWxlIiwicGFkZGluZ0xlZnQiLCJzZXRBdHRyaWJ1dGUiLCJ1cGRhdGUiLCJwb3N0IiwiZmlsZUNoYW5nZSIsInJlbW92ZUF0dHJpYnV0ZSIsIm9uRW50ZXIiLCJvbkVzY2FwZSIsImRlbGV0ZUZpbGUiLCJjb25maXJtIiwiYWRkRG9jdW1lbnQiLCJ0eXBlIiwiZ2V0TmVzdGVkQm9yZGVycyIsImFtb3VudCIsInBhcmVudEVsZW1lbnQiLCJjaGlsZEVsZW1lbnRDb3VudCIsImZvbGRlciIsImZpbGUiLCJpbmNsdWRlcyIsImlucHV0IiwicGFyZW50IiwiYWRkIiwic3RhdHVzIiwib25CbHVyIiwiZGlzcGxheU1lc3NhZ2UiLCJkb3dubG9hZEZpbGUiLCJmZXRjaCIsIm1hcmtkb3duU3R5bGUiLCJjb2RlQ3NzIiwia2F0ZXhDc3MiLCJqc29uIiwiY29uZmlnIiwiYmxvYiIsImZpbGVOYW1lIiwibGluayIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwiYm9keSIsImFwcGVuZCIsInNldFRpbWVvdXQiLCJyZXZva2VPYmplY3RVUkwiLCJhamF4IiwidXJsIiwic2VydmVyIiwibWV0aG9kIiwiY29udGVudFR5cGUiLCJlcnJvciIsInJlcSIsImtleWRvd24iLCJlIiwiJHRoaXMiLCJlbmQiLCJzdGFydCIsImtleUNvZGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkVuZCIsInN1YnN0cmluZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlYWNoIiwiaW5uZXJXaWR0aCIsImhlaWdodCIsImNoZWNrZWQiLCJjaGFuZ2UiLCJzaGFyZVByb2plY3QiLCJzZWxlY3QiLCJyaWdodHMiLCJhdXRoIiwiZ2V0VG9rZW4iLCJwYXRobmFtZSIsImNhbmNlbEFkZFVzZXIiLCJ1cmxTZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJyZW1vdmVVc2VyIiwiaGlkZVBvcHVwIiwiZWRpdFByaXZpbGVnZSIsInVwbG9hZEltYWdlIiwiZmQiLCJGb3JtRGF0YSIsImZpbGVzIiwicHJvY2Vzc0RhdGEiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwicmVzcG9uc2VUZXh0IiwiRCIsIlAiLCJGIiwiRSIsIkkiLCJTIl0sIm1hcHBpbmdzIjoiOztBQUFlLFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3pELEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO0FBQ2xCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ3BDLE1BQU0sS0FBSyxFQUFFLEtBQUs7QUFDbEIsTUFBTSxVQUFVLEVBQUUsSUFBSTtBQUN0QixNQUFNLFlBQVksRUFBRSxJQUFJO0FBQ3hCLE1BQU0sUUFBUSxFQUFFLElBQUk7QUFDcEIsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHLE1BQU07QUFDVCxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDckIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEdBQUcsQ0FBQztBQUNiOztBQ2JlLFNBQVMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUNwRCxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcs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

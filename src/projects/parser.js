import { stringTimes, Constants } from "../utils/index"

var mdHtml, scrollMap;

const defaults = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    typograher: true,
    _highlight: true,
    _view: 'html'
}

defaults.highlight = function(str, lang) {
    var esc = DOMPurify.sanitize;
    if (lang && lang !== 'auto' && hljs.getLanguage(lang)) {
    return '<pre class="hljs language-' + esc(lang.toLowerCase()) + '"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';

    } else if (lang === 'auto') {

        var result = hljs.highlightAuto(str);

        /*eslint-disable no-console*/

        return '<pre class="hljs language-' + esc(result.language) + '"><code>' +
                result.value +
                '</code></pre>';
    }

    return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
}

export function mdInit() {
    mdHtml = window.markdownit(defaults)
    //   .use(require('markdown-it-abbr'))
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
  };
  // Replace emoji codes with images
  mdHtml.renderer.rules.emoji = function (token, idx) {
    return window.twemoji.parse(token[idx].content);
  };

    //
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

export function setHighlightedlContent(selector, content, lang) {
    if (window.hljs) {
        $(selector).html(window.hljs.highlight(content, { language: lang }).value);
    } else {
        $(selector).text(content);
    }
}

export async function updateResult(download = false) {
    let source;
    if (!$("#editor").length) {
        let id = $(".selected");
        if (id.length) {
            let base64 = cache[id[0].id].content;
            let dirty = atob(base64);
            source = DOMPurify.sanitize(dirty);
        }
    }
    else {
        source = $("#textarea").val();
    }

    // Inject a random element in the source string to add data-line attributes to a list
    let random = Math.random().toString();    

    source = source.replaceAll("\n\n", `\n\n${random}\n\n`);

    // Replace \n between the katex delimiters with a space, so as not to confuse the Markdown-it parser
    let regex = /\\begin\{(align\*?)\}(.*?)\\end{align}/gms;
    let matches = [...source.matchAll(regex)];
    matches.forEach(matchObj => {
        let match = matchObj[0];
        let stripped = match.replaceAll("\n", " ");
        source = source.replace(regex, stripped);
    });
    source = source.replace(/(\\begin\{align\*?\}.*?\\end{align})/gms, "$1"+stringTimes("\n", matches.length))
    matches = [...source.matchAll(/\$\$(.*?)\$\$/gms)];
    matches.forEach(matchObj => {
        let match = matchObj[0];
        let stripped = match.replaceAll("\n", " ");
        source = source.replace(match, stripped)
    });
    source = source.replace(/(\\begin\{align\*?\}.*?\\end{align})/gms, "$1"+stringTimes("\n", matches.length))


    const recursiveListReplacement = (str, step = 0) => {
        const listMatches = [...str.matchAll(/(^\d+\.[^\t\n]*)((\n\t+(.*))+)/gm)];
        if (listMatches.length == 0 && !str.match(/^\d(?:\.\d)+/gms)) {
            return str;
        }
        else if (step > 0 && listMatches.length == 0) return "";
        listMatches.forEach(match => {
            let shifted = match[2].replaceAll(/^\t{1}/gm, "");
            let replacement = `${match[1]}`;
            replacement += recursiveListReplacement(shifted, step+1);
            str = str.replace(match[0], replacement);
        });
        return str;
    }
    source = recursiveListReplacement(source);

    source = source.replaceAll("\\{", "\\\\{");
    source = source.replaceAll("\\}", "\\\\}");
    source = source.replaceAll("\t", stringTimes(" ", 4));
    // Replace all images
    if (Constants.loadImages === true || download) {
        matches = [...source.matchAll(/!\[(.+)\]\((.+)\)/gm)];
        for (let i = 0; i < matches.length; i++) {
            let matchObj = matches[i];
            let src = matchObj[2];
            let result = await $.get(`/api/getimage?hash_name=${Constants.hash_name}&url=${src}`);
            result = window.location.origin + result;
            let t = 0;
            source = source.replace(/!\[(.+)\]\((.+)\)/gm, (match) => {
                return (t++ === i) ? match.replace(/!\[(.+)\]\((.+)\)/gm, `![$1](${result})`) : match;
            });
        }
    }
    else {
        source = source.replaceAll(/!\[(.+)\]\((.+)\)/gm, `![$1](#)`);
    }

    let rawHtml = mdHtml.render(source);

    let newLineReplacement = new RegExp(`<p class="line" data-line="(\\d+)">${random.toString().replace("\.", "\\.")}</p>`, "g");
    rawHtml = rawHtml.replaceAll(newLineReplacement, `<p class="line line-hidden" data-line="$1"></p>`);

    $("#preview").html(rawHtml);
    renderMathInElement(document.getElementById("preview"), {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            { left: '$', right: '$', display: false },
            {left: "\\begin{align}", right: "\\end{align}", display: true},
        ],
        macros: {
            "\\nl": "\\newline"
        },
        newLineInDisplayMode: true,
        output: "html",
        throwOnError: false
    })
    scrollMap = null;
}

export function setOptionClass(name, val) {
    if (val) {
        $('body').addClass('opt_' + name);
    } else {
        $('body').removeClass('opt_' + name);
    }
}

export function setResultView(val) {
    $('body').removeClass('result-as-html');
    $('body').removeClass('result-as-src');
    $('body').removeClass('result-as-debug');
    $('body').addClass('result-as-' + val);
    defaults._view = val;
}

$(document).ready(function() {
    for (const key in defaults) {
        const val = defaults[key];
        if (key === 'highlight') { continue; }

        var el = document.getElementById(key);

        if (!el) { continue; }

        var $el = $(el);

        if (typeof val === "boolean") {
        $el.prop('checked', val);
        $el.on('change', async function () {
            var value = Boolean($el.prop('checked'));
            setOptionClass(key, value);
            defaults[key] = value;
            mdInit();
            updateResult();
        });
        setOptionClass(key, val);

        } else {
        $(el).val(val);
        $el.on('change update', async function () {
            defaults[key] = String($(el).val());
            mdInit();
            updateResult();
        });
        }
    }


    setResultView(defaults._view);

    mdInit();

    $("#textarea").on("keyup", () => typed = true);
    $("#textarea").on('paste cut mouseup', () => updateResult());
    if ($("#editor").length) {
        $("#editor").on('touchstart mouseover', () => {
            $("#preview").off("scroll");
            $("#editor").on("scroll", syncSrcScroll);
        });
        $("#preview").on('touchstart mouseover', () => {
            $("#editor").off("scroll");
            $("#preview").on("scroll", syncResultScroll);
        });
    }
    (async () => {
        updateResult();
    })();

    window.updateInterval = window.setInterval(typeUpdate, 500);
});

var typed = false;
export function typeUpdate() {
    if (typed) {
        updateResult();
        typed = false;
    }
}


const lineHeight = 25;
export function syncSrcScroll() {
    const target = document.getElementById("editor");
    const line = Math.floor(target.scrollTop / lineHeight);

    const scrollHeight = target.scrollTop;
    const preview = document.getElementById("preview");
    if (scrollHeight == (target.scrollHeight - target.clientHeight)) {
        preview.scroll({top: preview.scrollHeight, behavior: "smooth"});
        return;
    }
    
    const scrollToLine = (line) => {
        if (line <= 0) {
            preview.scroll({top: 0, behavior: "smooth"});
            return;
        }
        let offsetTarget = $(`[data-line='${line}']`);
        if (!offsetTarget.length) {
            scrollToLine(line - 1);
            return
        }
        offsetTarget = offsetTarget[0];
        let top = offsetTarget.offsetTop - target.offsetTop;
        preview.scroll({top, behavior: "smooth"});
    }
    scrollToLine(line);
}

export function syncResultScroll() {
    const target = document.getElementById("preview");
    const scrollHeight = target.scrollTop;
    const editor = document.getElementById("editor");
    if (scrollHeight == (target.scrollHeight - target.clientHeight)) {
        editor.scroll({top: editor.scrollHeight, behavior: "smooth"});
        return;
    }
    let line = 0;
    let lines = [];
    let children = $("#preview [data-line]");
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        let top = child.offsetTop - target.offsetTop;
        
        if (top <= scrollHeight) {
            line = Number(child.getAttribute("data-line"));
            if (!line && lines.length > 0) {
                line = lines[lines.length-1];
            }
            else if (!line) {
                lines.push(0);
            }
            else {
                lines.push(line);
            }
        }
        else if (top > scrollHeight) {
            editor.scroll({top: line*lineHeight, behavior: "smooth"});
            return;
        }
    }
}


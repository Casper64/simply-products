import katex from 'katex';
import DOMPurify from 'dompurify';
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { checklist, target_blank_rule } from './markdown-extensions';

//#region  Katex
var findEndOfMath = function findEndOfMath(delimiter: string, text: string, startIndex: number) {
    // Adapted from
    // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
    var index = startIndex;
    var braceLevel = 0;
    var delimLength = delimiter.length;

    while (index < text.length) {
        var character = text[index];

        if (braceLevel <= 0 && text.slice(index, index + delimLength) === delimiter) {
            return index;
        } else if (character === "\\") {
            index++;
        } else if (character === "{") {
            braceLevel++;
        } else if (character === "}") {
            braceLevel--;
        }

        index++;
    }

    return -1;
};

var escapeRegex = function escapeRegex(string: string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

var amsRegex = /^\\begin{/;

var splitAtDelimiters = function splitAtDelimiters(text: string, delimiters: any) {
    var index;
    var data = [];
    var regexLeft = new RegExp("(" + delimiters.map((x: any) => escapeRegex(x.left)).join("|") + ")");

    while (true) {
        index = text.search(regexLeft);

        if (index === -1) {
            break;
        }

        if (index > 0) {
            data.push({
                type: "text",
                data: text.slice(0, index)
            });
            text = text.slice(index); // now text starts with delimiter
        } // ... so this always succeeds:


        var i = delimiters.findIndex((delim: any) => text.startsWith(delim.left));
        index = findEndOfMath(delimiters[i].right, text, delimiters[i].left.length);

        if (index === -1) {
            break;
        }

        var rawData = text.slice(0, index + delimiters[i].right.length);
        var math = amsRegex.test(rawData) ? rawData : text.slice(delimiters[i].left.length, index);
        data.push({
            type: "math",
            data: math,
            rawData,
            display: delimiters[i].display
        });
        text = text.slice(index + delimiters[i].right.length);
    }

    if (text !== "") {
        data.push({
            type: "text",
            data: text
        });
    }

    return data;
};

/* eslint no-console:0 */
/* Note: optionsCopy is mutated by this method. If it is ever exposed in the
 * API, we should copy it before mutating.
 */

var renderMathInText = function renderMathInText(text: any, optionsCopy: any) {
    var data = splitAtDelimiters(text, optionsCopy.delimiters);

    if (data.length === 1 && data[0].type === 'text') {
        // There is no formula in the text.
        // Let's return null which means there is no need to replace
        // the current text node with a new one.
        return null;
    }

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
        if (data[i].type === "text") {
            fragment.appendChild(document.createTextNode(data[i].data));
        } else {
            var span = document.createElement("span");
            var math = data[i].data; // Override any display mode defined in the settings with that
            // defined by the text itself

            optionsCopy.displayMode = data[i].display;

            try {
                if (optionsCopy.preProcess) {
                    math = optionsCopy.preProcess(math);
                }

                katex.render(math, span, optionsCopy);
            } catch (e) {
                if (!(e instanceof katex.ParseError)) {
                    throw e;
                }

                optionsCopy.errorCallback("KaTeX auto-render: Failed to parse `" + data[i].data + "` with ", e);
                //@ts-ignore
                fragment.appendChild(document.createTextNode(data[i].rawData));
                continue;
            }

            fragment.appendChild(span);
        }
    }

    return fragment;
};

var renderElem = function renderElem(elem: any, optionsCopy: any) {
    for (var i = 0; i < elem.childNodes.length; i++) {
        var childNode = elem.childNodes[i];

        if (childNode.nodeType === 3) {
            // Text node
            var frag = renderMathInText(childNode.textContent, optionsCopy);

            if (frag) {
                i += frag.childNodes.length - 1;
                elem.replaceChild(frag, childNode);
            }
        } else if (childNode.nodeType === 1) {
            (function () {
                // Element node
                var className = ' ' + childNode.className + ' ';
                var shouldRender = optionsCopy.ignoredTags.indexOf(childNode.nodeName.toLowerCase()) === -1 && optionsCopy.ignoredClasses.every((x: any) => className.indexOf(' ' + x + ' ') === -1);

                if (shouldRender) {
                    renderElem(childNode, optionsCopy);
                }
            })();
        } // Otherwise, it's something else, and ignore it.

    }
};

export function renderMathInElement(elem: any, options: any) {
    if (!elem) {
        throw new Error("No element provided to render");
    }

    var optionsCopy: any = {}; // Object.assign(optionsCopy, option)

    for (var option in options) {
        if (options.hasOwnProperty(option)) {
            //@ts-ignore
            optionsCopy[option] = options[option];
        }
    } // default options


    optionsCopy.delimiters = optionsCopy.delimiters || [{
        left: "$$",
        right: "$$",
        display: true
    }, {
        left: "\\(",
        right: "\\)",
        display: false
    }, // LaTeX uses $…$, but it ruins the display of normal `$` in text:
    // {left: "$", right: "$", display: false},
    // $ must come after $$
    // Render AMS environments even if outside $$…$$ delimiters.
    {
        left: "\\begin{equation}",
        right: "\\end{equation}",
        display: true
    }, {
        left: "\\begin{align}",
        right: "\\end{align}",
        display: true
    }, {
        left: "\\begin{alignat}",
        right: "\\end{alignat}",
        display: true
    }, {
        left: "\\begin{gather}",
        right: "\\end{gather}",
        display: true
    }, {
        left: "\\begin{CD}",
        right: "\\end{CD}",
        display: true
    }, {
        left: "\\[",
        right: "\\]",
        display: true
    }];
    optionsCopy.ignoredTags = optionsCopy.ignoredTags || ["script", "noscript", "style", "textarea", "pre", "code", "option"];
    optionsCopy.ignoredClasses = optionsCopy.ignoredClasses || [];
    optionsCopy.errorCallback = optionsCopy.errorCallback || console.error; // Enable sharing of global macros defined via `\gdef` between different
    // math elements within a single call to `renderMathInElement`.

    optionsCopy.macros = optionsCopy.macros || {};
    renderElem(elem, optionsCopy);
};
//#endregion
var mdHtml: MarkdownIt;

var defaults = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    typograher: true,
    _highlight: true,
    _view: 'html',
    highlight: new Function()
};

defaults.highlight = function (str: string, lang: string) {
    var esc = DOMPurify.sanitize;
    if (lang && lang !== 'auto' && hljs.getLanguage(lang)) {
        return '<pre class="hljs language-' + esc(lang.toLowerCase()) + '"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';

    } else if (lang === 'auto') {

        var result = hljs.highlightAuto(str);

        return '<pre class="hljs language-' + esc(result.language!) + '"><code>' +
            result.value +
            '</code></pre>';
    }

    return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
};


function stringTimes(str: string, count: number) {
    var result = "";

    for (var i = 0; i < count; i++) {
        result += str;
    }

    return result;
};

export function mdInit() {
    //@ts-ignore
    mdHtml = new MarkdownIt(defaults);
    mdHtml.use(target_blank_rule);
    mdHtml.use(checklist)

    // Beautify output of parser for html content
    mdHtml.renderer.rules.table_open = function () {
        return '<table class="table table-striped">\n';
    };
    // Replace emoji codes with images
    // mdHtml.renderer.rules.emoji = function (token, idx) {
    //     return window.twemoji.parse(token[idx].content);
    // };

    //
    // Inject line numbers for sync scroll. Notes:
    //
    // - We track only headings and paragraphs on first level. That's enough.
    // - Footnotes content causes jumps. Level limit filter it automatically.
    function injectLineNumbers(tokens: any, idx: any, options: any, env: any, slf: any) {
        var line;
        if (tokens[idx].map) {
            line = tokens[idx].map[0];
            tokens[idx].attrJoin('class', 'line');
            tokens[idx].attrSet('data-line', String(line));
        }
        return slf.renderToken(tokens, idx, options, env, slf);
    }

    mdHtml.renderer.rules.paragraph_open = mdHtml.renderer.rules.heading_open = injectLineNumbers;
};

export function updateResult(source: string) {
     // Inject a random element in the source string to add data-line attributes to a list
    let random = Math.random().toString();    

    //@ts-ignore
    // source = source.replaceAll("\n\n", `\n\n${random}\n\n`);
    // Replace \n between the katex delimiters with a space, so as not to confuse the Markdown-it parser
    let regex = /\\begin\{(align\*?)\}(.*?)\\end{align}/gms;
    //@ts-ignore
    let matches = [...source.matchAll(regex)];
    matches.forEach(matchObj => {
        let match = matchObj[0];
    //@ts-ignore
        let stripped = match.replaceAll("\n", "\\newline ");
        source = source.replace(regex, stripped);
    });
    source = source.replace(/(\\begin\{align\*?\}.*?\\end{align})/gms, "$1"+stringTimes("\n", matches.length))
    //@ts-ignore
    matches = [...source.matchAll(/\$\$(.*?)\$\$/gms)];
    matches.forEach(matchObj => {
        let match = matchObj[0];
    //@ts-ignore
        let stripped = match.replaceAll("\n", "\\newline ");
        source = source.replace(match, stripped)
    });
    source = source.replace(/(\\begin\{align\*?\}.*?\\end{align})/gms, "$1"+stringTimes("\n", matches.length));

    
    const recursiveListReplacement = (str: string, step = 0) => {
    //@ts-ignore
        const listMatches = [...str.matchAll(/(^\d+\.[^\t\n]*)((\n\t+(.*))+)/gm)];
        if (listMatches.length == 0 && !str.match(/^\d(?:\.\d)+/gms)) {
            return str;
        }
        else if (step > 0 && listMatches.length == 0) return "";
        listMatches.forEach(match => {
    //@ts-ignore
            let shifted = match[2].replaceAll(/^\t{1}/gm, "");
            let replacement = `${match[1]}`;
            replacement += recursiveListReplacement(shifted, step+1);
            str = str.replace(match[0], replacement);
        });
        return str;
    }
    // source = recursiveListReplacement(source);

    //@ts-ignore
    source = source.replaceAll("\\{", "\\\\{");
    //@ts-ignore
    source = source.replaceAll("\\}", "\\\\}");
    //@ts-ignore
    source = source.replaceAll("\t", stringTimes(" ", 4));

    // Replace all images
    // if (Constants.loadImages === true || download) {
    //     matches = [...source.matchAll(/!\[(.+)\]\((.+)\)/gm)];
    //     for (let i = 0; i < matches.length; i++) {
    //         let matchObj = matches[i];
    //         let src = matchObj[2];
    //         let result = await $.get(`/api/getimage?hash_name=${Constants.hash_name}&url=${src}`);
    //         result = window.location.origin + result;
    //         let t = 0;
    //         source = source.replace(/!\[(.+)\]\((.+)\)/gm, (match) => {
    //             return (t++ === i) ? match.replace(/!\[(.+)\]\((.+)\)/gm, `![$1](${result})`) : match;
    //         });
    //     }
    // }
    // else {
    //     source = source.replaceAll(/!\[(.+)\]\((.+)\)/gm, `![$1](#)`);
    // }
    let rawHtml = mdHtml.render(source);

    // let newLineReplacement = new RegExp(`<p class="line" data-line="(\\d+)">${random.toString().replace("\.", "\\.")}</p>`, "g");
    //@ts-ignore
    // rawHtml = rawHtml.replaceAll(newLineReplacement, `<p class="line line-hidden" data-line="$1"></p>`);
    //@ts-ignore
    rawHtml = rawHtml.replaceAll(random, "")
    return rawHtml
    
}
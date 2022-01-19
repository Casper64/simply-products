import DOMPurify from 'dompurify';
import MarkdownIt from "markdown-it";
import { checklist, target_blank_rule } from './markdown-extensions';

var mdHtml: MarkdownIt;

var defaults = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    typograher: true,
    _view: 'html',
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
import MarkdownIt from "markdown-it";
import { RuleBlock } from "markdown-it/lib/parser_block";
import { RenderRule } from "markdown-it/lib/renderer";
import StateBlock from "markdown-it/lib/rules_block/state_block";
import Token from "markdown-it/lib/token";

export interface RenderRuleRecord {
    checklist_block_open: RenderRule;
    checklist_block_close: RenderRule;
}

const checklist_block_open: RenderRule = (_tokens, _idx, _options, _env, _self) => {
    return `<section class="checklist">`
}

const checklist_block_close: RenderRule = (_tokens, _idx, _options, _env, _self) => {
    return `</section>`
}

const checklist_open: RenderRule = (tokens, idx, _options, _env, _self) => {
    const token = tokens[idx];
    return `<div class="checkbox-container">
        <input type="checkbox" ${token.meta.checked ? ' checked' : ''}/>`
}

const checklist_close: RenderRule = (_tokens, _idx, _options, _env, _self) => {
    return `</div>`
}

function is_checklist(state: StateBlock, startLine: number) {
    var ch,
        start = state.bMarks[startLine] + state.tShift[startLine],
        pos = start,
        max = state.eMarks[startLine];

    // Checklist marker should have at least 4 chars (- [])
    if (pos + 3 >= max) return -1;

    ch = state.src.charCodeAt(pos++);
    if (ch != 0x2d /* - */) return -1;
    ch = state.src.charCodeAt(pos++);
    if (ch != 0x20 /* 'space' */) return -1;
    ch = state.src.charCodeAt(pos++);
    if (ch != 0x5b /* [ */) return -1;


    for (; ;) {
        // EOL -> fail
        if (pos >= max) return -1;
        // max length should be 5 (- [x])
        if (pos >= start + 5) return -1;

        ch = state.src.charCodeAt(pos++);

        if (ch == 0x78 /* x */) continue
        if (ch == 0x20 /* 'space' */) continue

        if (ch == 0x5d /* ] */) {
            // Found valid marker
            break
        }

        return -1;
    }

    return pos;
}

export function checklist(md: MarkdownIt): void {
    const rules = {
        checklist_block_open,
        checklist_block_close,
        checklist_open,
        checklist_close
    }

    md.renderer.rules = { ...md.renderer.rules, ...rules }

    const checklist_def: RuleBlock = (state, startLine, endLine, silent) => {
        var posAfterMarker: number, checked = false, token: Token,
            nextLine: number, pos: number, max: number, offset: number, ch: number,
            terminatorRules: RuleBlock[]

        if (state.sCount[startLine] - state.blkIndent >= 4) return false;

        // limit conditions when list can interrupt
        // a paragraph (validation mode only)
        if (silent && state.parentType === 'paragraph') {
            // Next list item should still terminate previous list item;
            //
            // This code can fail if plugins use blkIndent as well as lists,
            // but I hope the spec gets fixed long before that happens.
            //
            if (state.tShift[startLine] >= state.blkIndent) {
                return false
            }
        }

        // detect checklist block
        if ((posAfterMarker = is_checklist(state, startLine)) < 0) return false;
        // start = state.bMarks[startLine] + state.tShift[startLine];
        // checked = markPos - start > 2;

        token = state.push('checklist_block_open', '', 1);
        // console.log(start, markPos, checked, token)

        token.map = [startLine, 0];

        //
        // Iterate list items
        //
        nextLine = startLine;
        terminatorRules = state.md.block.ruler.getRules('checklist_def');

        while (nextLine < endLine) {
            pos = posAfterMarker;
            max = state.eMarks[nextLine];
            offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

            // Handle tabs and spaces prefixed in the line
            while (pos < max) {
                ch = state.src.charCodeAt(pos);
                if (ch === 0x09) {
                    offset += 4 - (offset + state.bsCount[nextLine]) % 4;
                } else if (ch === 0x20) {
                    offset++;
                } else {
                    break;
                }

                pos++;
            }

            token = new state.Token('checklist_open', '', 1);
            // endx at - [x]
            //              ^
            //            ^     =  pos - 2
            checked = state.src.charCodeAt(posAfterMarker - 2) === 0x78;
            token.meta = { checked };
            state.tokens.push(token);

            token = new state.Token('paragraph_open', 'p', 1);
            token.block = true;
            token.map = [nextLine, 0];
            state.tokens.push(token);

            token = new state.Token('inline', '', 0);
            token.children = [];
            token.content = state.src.slice(pos, max);
            state.tokens.push(token);

            token = new state.Token('paragraph_close', 'p', -1);
            token.block = true;
            state.tokens.push(token);

            token = state.push('checklist_close', '', -1);

            state.line += 1;



            nextLine = startLine = state.line;
            // itemLines[1] = nextLine;

            if (nextLine >= endLine) { break; }
            //
            // Try to check if list is terminated or continued.
            //
            if (state.sCount[nextLine] < state.blkIndent) { break; }


            // if it's indented more than 3 spaces, it should be a code block
            if (state.sCount[startLine] - state.blkIndent >= 4) { break; }


            // fail if terminating block found
            let terminate = false;
            for (let i = 0, l = terminatorRules.length; i < l; i++) {
                if (terminatorRules[i](state, nextLine, endLine, true)) {
                    terminate = true;
                    break;
                }
            }
            if (terminate) { break; }

            // detect checklist block
            if ((posAfterMarker = is_checklist(state, startLine)) < 0) break;
        }

        token = state.push('checklist_block_close', '', -1);
        return true;
    }

    md.block.ruler.before('list', 'checklist_def', checklist_def, { alt: ['list', 'paragraph'] });
}

export function target_blank_rule(md: MarkdownIt): void {
    var defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, _env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // If you are sure other plugins can't add `target` - drop check below
        var aIndex = tokens[idx].attrIndex('target');

        if (aIndex < 0) {
            tokens[idx].attrPush(['target', '_blank']); // add new attribute
        } else {
            tokens[idx].attrs![aIndex][1] = '_blank';    // replace value of existing attr
        }

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };
}
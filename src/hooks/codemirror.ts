import { useEffect, useState, useRef } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { history, historyKeymap } from "@codemirror/history";
import { indentOnInput, LanguageSupport, ParseContext } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import {indentWithTab} from "@codemirror/commands"
import {
  defaultHighlightStyle,
  HighlightStyle,
  tags,
} from "@codemirror/highlight";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import type React from "react";




const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: "1.6em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading2,
    fontSize: "1.4em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading3,
    fontSize: "1.2em",
    fontWeight: "bold",
  },
]);


interface Props {
  initialDoc: string;
  onChange?: (state: EditorState) => void;
}

const useCodeMirror = <T extends Element>(
  props: Props
): [React.MutableRefObject<T | null>, EditorView?] => {
  const refContainer = useRef<T>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const { onChange } = props;

  /**
   * Create a new editor view and state and return it.
   * @returns {Promise<EditorState>}
   */
  const createState = async () => {
    const index = languages.findIndex(lang => lang.alias.includes("latex"));
    //@ts-ignore
    languages[index].alias.push("math")

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
          extensions: []
        }),
        oneDark,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state);
          }
        }),
      ],
    });
    return startState
  }
  // Create a new editor state when the component is mounted.
  useEffect(() => {
    if (!refContainer.current) return;

    createState()
      .then(startState => {
        const view = new EditorView({
          state: startState,
          parent: refContainer.current!,
        });
        
        setEditorView(view);
      })
  }, [refContainer]);
  // Update state when a new document is selected
  useEffect(() => {
    createState()
      .then(startState => {
        editorView?.setState(startState);
      });
  }, [props.initialDoc]);

  return [refContainer, editorView];
};

export default useCodeMirror;

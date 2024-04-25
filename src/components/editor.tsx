"use client";

import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { Provider } from "@lexical/yjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";

const theme = {
  heading: {
    h1: "mb-2 font-heading text-2xl font-bold",
  },
  layoutContainer: "PlaygroundEditorTheme__layoutContainer",
  layoutItem: "PlaygroundEditorTheme__layoutItem",
};

function onError(error: Error): void {
  console.error(error);
}

const WEBSOCKET_ENDPOINT = "ws://localhost:2345";
const WEBSOCKET_SLUG = "playground";

function useCollab() {
  // Don't attempt to initialize collab in SSR
  const [collab, setCollab] = useState(false);
  useEffect(() => setCollab(true), []);
  return collab;
}

export default function Editor() {
  const collab = useCollab();

  const initialConfig = {
    editorState: null,
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode],
  };

  const queryParams = useSearchParams();
  const WEBSOCKET_ID = queryParams.get("collabId") || "0";

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border-2 rounded p-2 border-slate-500">
        {collab && (
          <CollaborationPlugin
            id="main"
            providerFactory={(id, yjsDocMap) => {
              let doc = yjsDocMap.get(id);

              if (doc === undefined) {
                doc = new Doc();
                yjsDocMap.set(id, doc);
              } else {
                doc.load();
              }

              console.log(
                "Connecting to",
                WEBSOCKET_ENDPOINT +
                  "/" +
                  WEBSOCKET_SLUG +
                  "/" +
                  WEBSOCKET_ID +
                  "/" +
                  id
              );

              // @ts-expect-error
              return new WebsocketProvider(
                WEBSOCKET_ENDPOINT,
                WEBSOCKET_SLUG + "/" + WEBSOCKET_ID + "/" + id,
                doc,
                {
                  connect: false,
                }
              ) as Provider;
            }}
            shouldBootstrap={true}
          />
        )}
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}

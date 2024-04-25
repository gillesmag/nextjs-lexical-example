import { Suspense } from "react";
import Editor from "@/components/editor";

export default function Home() {
  return (
    <main className="container mx-auto mt-4">
      <Suspense>
        <Editor />
      </Suspense>
    </main>
  );
}

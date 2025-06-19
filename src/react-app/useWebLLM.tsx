import {
  CreateWebWorkerMLCEngine,
  InitProgressReport,
  WebWorkerMLCEngine,
} from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";

// For list of available models, see:
// https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
// export async function runWorker() {
//   const messages = [{ role: "user", content: "How does WebLLM use workers?" }];
//   const reply = await engine.chat.completions.create({ messages });
//   return reply.choices[0].message.content!;
// }

// https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
export function useWebLLM(
  modelId: string = "Hermes-3-Llama-3.1-8B-q4f16_1-MLC"
) {
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null);
  const [progress, setProgress] = useState<InitProgressReport | null>(null);

  useEffect(() => {
    const webLLMWorker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    CreateWebWorkerMLCEngine(webLLMWorker, modelId, {
      initProgressCallback: setProgress,
    }).then(setEngine);
    return () => {
      engine?.unload();
      webLLMWorker.terminate();
    };
  }, []);

  return { engine, progress };
}

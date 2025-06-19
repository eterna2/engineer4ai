// src/App.tsx

import { Fragment, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";

import { useWebLLM } from "./useWebLLM";
import { ChatCompletion } from "@mlc-ai/web-llm";
import Button from "@mui/material/Button";
import Home from "./Home";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

export default function App() {
  return (
    <Fragment>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        sx={{
          py: 2,
          height: "calc(100vh - 64px)",
        }}
      >
        <Home />
      </Container>
    </Fragment>
  );
}

function Home2() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [response, setResponse] = useState<ChatCompletion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { engine, progress } = useWebLLM();
  const onClickChat = async () => {
    if (!engine) return;
    const messages = [
      { role: "user", content: "How does WebLLM use workers?" },
    ];
    setIsLoading(true);
    engine.chat.completions
      .create({ messages })
      .then(setResponse)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  const chatHint = engine
    ? "Click to run the WebLLM worker and get a response."
    : progress?.text || "Loading WebLLM engine...";

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://hono.dev/" target="_blank">
          <img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
        </a>
        <a href="https://workers.cloudflare.com/" target="_blank">
          <img
            src={cloudflareLogo}
            className="logo cloudflare"
            alt="Cloudflare logo"
          />
        </a>
      </div>
      <h1>Vite + React + Hono + Cloudflare</h1>
      <div className="card">
        <button
          onClick={() => setCount((count) => count + 1)}
          aria-label="increment"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetch("/api/")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>worker/index.ts</code> to change the name
        </p>
      </div>
      <div className="card">
        <Button
          disabled={!engine || isLoading}
          onClick={onClickChat}
          aria-label="get response from worker"
        >
          Webworker: {isLoading ? "waiting for response ..." : chatHint}
        </Button>
      </div>

      <div style={{ maxWidth: "70vw" }}>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {response?.choices[0].message.content}
        </pre>
        <p>{error}</p>
      </div>

      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
}

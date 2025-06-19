import { ChatCompletion } from "@mlc-ai/web-llm";
import { Fragment, useState } from "react";
import { useWebLLM } from "./useWebLLM";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export type ChatMessage =
  | { choices: { message: { role: string; content: string } }[] }
  | ChatCompletion;

export interface ChatProps {
  modelId?: string;
  onResponse: (response: ChatMessage) => void;
}
export default function Chat({ modelId, onResponse }: ChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const { engine, progress } = useWebLLM(modelId);
  const onClick = async () => {
    if (!engine) return;
    const messages: { role: "user" | "assistant"; content: string }[] = [
      { role: "user", content: content }
    ];
    setIsLoading(true);
    onResponse({ choices: [{ message: { role: "user", content: content } }] });
    setContent("");
    engine.chat.completions
      .create({ messages })
      .then((reply) => {
        onResponse(reply);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Fragment>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={!engine}
      >
        <CircularProgress color="inherit" sx={{ mx: 2 }} />
        <small>{progress ? progress.text : "Loading WebLLM engine..."}</small>
      </Backdrop>

      <TextField
        id="chat-input"
        label={
          <Typography variant="h6" sx={{ mb: 2 }}>
            <EngineeringIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            Engineer4ai
          </Typography>
        }
        error={!!error}
        helperText={error ? String(error) : ""}
        placeholder="Type your question here..."
        multiline
        fullWidth
        rows={3}
        maxRows={10}
        variant="standard"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Tooltip title="Click to see loading">
        <IconButton
          onClick={onClick}
          loading={isLoading}
          disabled={!engine || isLoading || content.trim().length === 0}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
}

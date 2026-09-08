import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  readonly value: string;
}

export function CopyButton({ value }: CopyButtonProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return <button className="icon-button" type="button" onClick={() => void copy()} aria-label="Copy code">{copied ? <Check size={16} /> : <Copy size={16} />}</button>;
}

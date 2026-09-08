import { ArrowRight, Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { documentationCatalog } from "../../content/docs/catalog";

interface CommandMenuProps { readonly open: boolean; readonly onOpen: () => void; readonly onClose: () => void; }

export function CommandMenu({ open, onOpen, onClose }: CommandMenuProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const labelId = useId();
  const reduceMotion = useReducedMotion();
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return documentationCatalog.filter((entry) => !needle || `${entry.title} ${entry.description} ${entry.slug}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); if (open) input.current?.focus(); else onOpen(); }
      if (event.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onOpen, open]);
  useEffect(() => { if (open) window.setTimeout(() => input.current?.focus(), 0); }, [open]);
  function close(): void { setQuery(""); setActiveIndex(0); onClose(); }
  function select(index: number): void { const item = results[index]; if (!item) return; navigate(item.slug); close(); }
  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((value) => Math.min(value + 1, Math.max(results.length - 1, 0))); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((value) => Math.max(value - 1, 0)); }
    if (event.key === "Enter") { event.preventDefault(); select(activeIndex); }
  }
  return <AnimatePresence>{open && <motion.div className="command-overlay" role="presentation" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} onMouseDown={close}>
    <motion.section className="command-menu" role="dialog" aria-modal="true" aria-labelledby={labelId} initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
      <div className="command-input"><Search size={19} /><label id={labelId} className="sr-only">Search Crossa documentation</label><input ref={input} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={handleInputKeyDown} placeholder="Search documentation…" /><button className="icon-button" type="button" onClick={close} aria-label="Close search"><X size={17} /></button></div>
      <div className="command-results">{results.length ? results.map((entry, index) => <button key={entry.slug} type="button" className={index === activeIndex ? "is-active" : ""} onMouseEnter={() => setActiveIndex(index)} onClick={() => select(index)}><span><small>{entry.section}</small><strong>{entry.title}</strong><em>{entry.description}</em></span><ArrowRight size={16} /></button>) : <p>No local documentation matches that search.</p>}</div>
      <div className="command-hint"><span>↑ ↓ to move</span><span>Enter to open</span><span>Esc to close</span></div>
    </motion.section>
  </motion.div>}</AnimatePresence>;
}

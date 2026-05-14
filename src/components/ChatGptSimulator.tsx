'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Plus, Mic, Copy, Share2, AudioLines } from 'lucide-react';

export type ChatGptSimulatorProps = {
  /** User prompt: typed into the pill bar, then shown in the right-aligned bubble */
  promptText: string;
  /** Assistant reply streamed character-by-character (`**bold**`, newlines, `- ` bullets) */
  answerText: string;
  /** Heading above the input (first screen) */
  headingText?: string;
  /** Placeholder in the pill input */
  inputPlaceholder?: string;
  /** Delay between each character while typing the prompt in the bar */
  promptCharDelayMs?: number;
  /** Delay between each character while streaming the answer */
  answerCharDelayMs?: number;
  /** Pause after the prompt is “sent” before the answer starts streaming */
  promptSubmitDelayMs?: number;
  /** Start on mount; if false, call `ref.current.replay()` */
  autoPlay?: boolean;
  className?: string;
};

export type ChatGptSimulatorHandle = {
  replay: () => void;
};

/** Renders `**bold**` segments and plain text (handles incomplete trailing `**`). */
function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length > 0) {
    const open = rest.indexOf('**');
    if (open === -1) {
      nodes.push(<span key={key++}>{rest}</span>);
      break;
    }
    if (open > 0) {
      nodes.push(<span key={key++}>{rest.slice(0, open)}</span>);
    }
    rest = rest.slice(open + 2);
    const close = rest.indexOf('**');
    if (close === -1) {
      nodes.push(<span key={key++}>{`**${rest}`}</span>);
      break;
    }
    nodes.push(
      <strong key={key++} className="font-semibold text-neutral-900">
        {rest.slice(0, close)}
      </strong>
    );
    rest = rest.slice(close + 2);
  }
  return nodes;
}

function AssistantMessageBody({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-neutral-800">
      {lines.map((line, i) => {
        const trimmed = line.trimStart();
        if (trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-neutral-400 select-none">•</span>
              <div className="min-w-0 flex-1">{renderInlineMarkdown(trimmed.slice(2))}</div>
            </div>
          );
        }
        if (line.trim() === '') {
          return <div key={i} className="h-1" />;
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

const ChatGptSimulator = forwardRef<ChatGptSimulatorHandle, ChatGptSimulatorProps>(
  function ChatGptSimulator(
    {
      promptText,
      answerText,
      headingText = 'What are you working on?',
      inputPlaceholder = 'Ask anything',
      promptCharDelayMs = 42,
      answerCharDelayMs = 12,
      promptSubmitDelayMs = 450,
      autoPlay = true,
      className = '',
    },
    ref
  ) {
    const [phase, setPhase] = useState<
      'idle' | 'typingPrompt' | 'transition' | 'streaming' | 'done'
    >('idle');
    const [inputDisplay, setInputDisplay] = useState('');
    const [streamedAnswer, setStreamedAnswer] = useState('');
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = useCallback(() => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }, []);

    const schedule = useCallback((fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timersRef.current = timersRef.current.filter((t) => t !== id);
        fn();
      }, ms);
      timersRef.current.push(id);
    }, []);

    const runSimulation = useCallback(() => {
      clearTimers();
      setPhase('idle');
      setInputDisplay('');
      setStreamedAnswer('');

      const prompt = promptText ?? '';
      const answer = answerText ?? '';

      if (!prompt && !answer) {
        setPhase('done');
        return;
      }

      const beginAnswerStream = () => {
        setPhase('streaming');
        setInputDisplay('');
        let ai = 0;
        const streamNext = () => {
          if (ai >= answer.length) {
            setStreamedAnswer(answer);
            setPhase('done');
            return;
          }
          ai += 1;
          setStreamedAnswer(answer.slice(0, ai));
          schedule(streamNext, answerCharDelayMs);
        };
        streamNext();
      };

      if (!prompt.length) {
        setPhase('transition');
        setInputDisplay('');
        schedule(beginAnswerStream, promptSubmitDelayMs);
        return;
      }

      setPhase('typingPrompt');
      let pi = 0;
      const typeNextPromptChar = () => {
        if (pi >= prompt.length) {
          setPhase('transition');
          setInputDisplay('');
          schedule(beginAnswerStream, promptSubmitDelayMs);
          return;
        }
        pi += 1;
        setInputDisplay(prompt.slice(0, pi));
        schedule(typeNextPromptChar, promptCharDelayMs);
      };

      schedule(typeNextPromptChar, promptCharDelayMs);
    }, [
      answerCharDelayMs,
      answerText,
      clearTimers,
      promptCharDelayMs,
      promptSubmitDelayMs,
      promptText,
      schedule,
    ]);

    const runRef = useRef(runSimulation);
    runRef.current = runSimulation;

    useImperativeHandle(
      ref,
      () => ({
        replay: () => runRef.current(),
      }),
      []
    );

    useEffect(() => {
      if (!autoPlay) return;
      runRef.current();
      return clearTimers;
    }, [
      autoPlay,
      promptText,
      answerText,
      promptCharDelayMs,
      answerCharDelayMs,
      promptSubmitDelayMs,
      clearTimers,
    ]);

    const showTranscript =
      phase === 'transition' || phase === 'streaming' || phase === 'done';
    const showUserBubble =
      (phase === 'streaming' || phase === 'done' || phase === 'transition') &&
      Boolean(promptText?.trim());
    const showAssistant = phase === 'streaming' || phase === 'done';

    const pillInput = useMemo(
      () => (
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="flex items-start gap-3 rounded-3xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              className="shrink-0 p-1 mt-0.5 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Add"
            >
              <Plus className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <div className="flex-1 min-w-0 min-h-[24px] text-left py-0.5">
              {inputDisplay ? (
                <span className="text-[15px] text-neutral-900 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                  {inputDisplay}
                  {phase === 'typingPrompt' && (
                    <span
                      className="inline-block w-px h-4 bg-neutral-900 ml-0.5 align-middle animate-pulse"
                      aria-hidden
                    />
                  )}
                </span>
              ) : (
                <span className="text-[15px] text-neutral-400 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                  {inputPlaceholder}
                  {phase === 'typingPrompt' && (
                    <span
                      className="inline-block w-px h-4 bg-neutral-900 ml-0.5 align-middle animate-pulse"
                      aria-hidden
                    />
                  )}
                </span>
              )}
            </div>
            <button
              type="button"
              className="shrink-0 p-1.5 mt-0.5 text-neutral-500 hover:text-neutral-800 rounded-full"
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="shrink-0 flex items-center gap-1.5 self-start mt-0.5 rounded-full bg-[#F0F0F0] hover:bg-neutral-200/90 px-3 py-1.5 text-[13px] font-medium text-neutral-900 border border-neutral-200/80"
            >
              <AudioLines className="w-4 h-4 text-neutral-700" strokeWidth={2} />
              Voice
            </button>
          </div>
        </div>
      ),
      [inputDisplay, inputPlaceholder, phase]
    );

    return (
      <div
        className={`flex flex-col bg-white text-neutral-900 rounded-xl overflow-hidden border border-neutral-100 ${className}`}
        style={{ minHeight: 420 }}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {!showTranscript ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
              <h1 className="text-2xl sm:text-3xl font-medium text-center text-neutral-900 mb-10 tracking-tight">
                {headingText}
              </h1>
              {pillInput}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-8">
                {showUserBubble && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%]">
                      <div
                        className="rounded-[22px] px-4 py-2.5 text-[15px] leading-snug text-neutral-900"
                        style={{ backgroundColor: '#F3F3F3' }}
                      >
                        {promptText}
                      </div>
                      <div className="flex justify-end mt-1 pr-1">
                        <button
                          type="button"
                          className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                          aria-label="Copy message"
                        >
                          <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showAssistant && (
                  <div className="flex justify-start">
                    <div className="max-w-full sm:max-w-[90%] pr-4">
                      <AssistantMessageBody text={streamedAnswer} />
                      {phase === 'done' && streamedAnswer.length > 0 && (
                        <div className="flex gap-2 mt-4 text-neutral-400">
                          <button
                            type="button"
                            className="p-1 hover:text-neutral-600 rounded"
                            aria-label="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="p-1 hover:text-neutral-600 rounded"
                            aria-label="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-neutral-100 bg-white px-4 sm:px-6 py-4">
                {pillInput}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ChatGptSimulator;

"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

function MarkdownRendererComponent({ content }: MarkdownRendererProps) {
  return (
    <div className="w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 className="mt-6 mb-3 text-[1.05rem] font-semibold tracking-tight text-gray-900 first:mt-0 dark:text-white" {...props} />
          ),
          h2: (props) => (
            <h2 className="mt-5 mb-2 text-[0.95rem] font-semibold tracking-tight text-gray-900 first:mt-0 dark:text-white" {...props} />
          ),
          h3: (props) => (
            <h3 className="mt-4 mb-1.5 text-[0.9rem] font-semibold text-gray-900 first:mt-0 dark:text-white" {...props} />
          ),
          p: (props) => (
            <p className="mb-3 text-[14px] leading-7 text-gray-700 last:mb-0 dark:text-gray-100/92" {...props} />
          ),
          ul: (props) => (
            <ul className="mb-3 list-outside list-disc space-y-1 pl-5 marker:text-gray-400 dark:marker:text-white/35" {...props} />
          ),
          ol: (props) => (
            <ol className="mb-3 list-outside list-decimal space-y-1 pl-5 marker:text-gray-500 dark:marker:text-white/35" {...props} />
          ),
          li: (props) => (
            <li className="text-[14px] leading-7 text-gray-700 dark:text-gray-100/90 [&>ol]:mt-1 [&>ul]:mt-1" {...props} />
          ),
          strong: (props) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
          em: (props) => <em className="italic text-gray-600 dark:text-gray-200/90" {...props} />,
          code: ({ className, ...props }) =>
            className ? (
              <code className={className} {...props} />
            ) : (
              <code
                className="rounded-md border border-black/[0.06] bg-black/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-slate-200"
                {...props}
              />
            ),
          pre: (props) => (
            <pre
              className="mb-4 overflow-x-auto rounded-2xl border border-black/[0.06] bg-[#f6f5f2] p-4 text-[12px] leading-6 text-slate-800 dark:border-white/[0.08] dark:bg-[#16171c] dark:text-slate-100 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-4 rounded-r-2xl border-l-[3px] border-slate-300 bg-slate-50 px-4 py-3 text-[14px] italic text-slate-600 dark:border-white/[0.18] dark:bg-white/[0.04] dark:text-white/72"
              {...props}
            />
          ),
          hr: (props) => <hr className="my-5 border-black/[0.08] dark:border-white/[0.08]" {...props} />,
          table: (props) => (
            <div className="my-4 w-full overflow-x-auto rounded-2xl border border-black/[0.06] bg-[#faf9f6] dark:border-white/[0.08] dark:bg-white/[0.03]">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-black/[0.03] dark:bg-white/[0.04]" {...props} />,
          tbody: (props) => <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.08]" {...props} />,
          tr: (props) => <tr className="align-top" {...props} />,
          th: (props) => (
            <th
              className="px-4 py-2.5 text-left font-manrope text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="px-4 py-3 text-[13px] leading-6 text-slate-700 tabular-nums dark:text-slate-100/90"
              {...props}
            />
          ),
          a: (props) => (
            <a
              className="text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownRenderer = memo(MarkdownRendererComponent);

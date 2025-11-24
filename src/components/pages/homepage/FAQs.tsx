import { useEffect, useRef, useState } from "react";
import { faqs } from "../../../data/faqs.ts";
import {ROUTES} from "../../../util/constants.util.ts";

const FAQs = () => {
  type FAQItemProps = {
    index: number;
    question: string;
    answer: string;
    open: boolean;
    onToggle: () => void;
    isLast: boolean;
  };

  const FAQItem = ({
    index,
    question,
    answer,
    open,
    onToggle,
    isLast,
  }: FAQItemProps) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Compute the target height for smooth transition
    const [maxH, setMaxH] = useState<string>("0px");
    useEffect(() => {
      const el = panelRef.current;
      if (!el) return;

      // Measure content height
      const next = open ? `${el.scrollHeight}px` : "0px";
      setMaxH(next);

      // If content inside changes while open, re-measure
      if (open) {
        const ro = new ResizeObserver(() => {
          setMaxH(`${el.scrollHeight}px`);
        });
        ro.observe(el);
        return () => ro.disconnect();
      }
    }, [open, question, answer]);

    return (
      <div id={ROUTES.IN_PAGE_ROUTES.FAQ}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`faq-panel-${index}`}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 py-8 text-left"
        >
          <span
            className={[
              "text-base md:text-lg leading-7 text-[#03034D]",
              open ? "font-bold" : "font-medium",
              "transition-[font-weight,color] duration-200",
            ].join(" ")}
          >
            {question}
          </span>

          <span
            className="relative shrink-0 w-5 h-5 cursor-pointer"
            aria-hidden="true"
          >
            {open ? (
              // minus icon
              <svg
                width="14"
                height="2"
                viewBox="0 0 14 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1H12.31"
                  stroke="#03034D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              // plus icon
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.66669 0.666504V12.6665"
                  stroke="#A0A3BD"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.666687 6.6665H12.6667"
                  stroke="#A0A3BD"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>

        <div
          id={`faq-panel-${index}`}
          role="region"
          aria-hidden={!open}
          // Smooth height + opacity transition
          style={{
            maxHeight: maxH,
          }}
          className={[
            "overflow-hidden",
            "transition-[max-height,opacity] duration-300 ease-out",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <div ref={panelRef}>
            <p className="pr-10 pb-6 md:pb-8 text-sm md:text-lg text-[#454745]">
              {answer}
            </p>
          </div>
        </div>

        {!isLast && <hr className="border-t border-[#F1F2F9] pt-6" />}
      </div>
    );
  };

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (value: number) =>
    setOpenIndex(openIndex === value ? null : value);

  return (
    <main className="bg-[#FAFAFA] my-[112px] w-full md:w-[90%] 2xl:max-w-7xl mx-auto px-4 py-16 lg:py-24 rounded-3xl">
      <h1 className="text-[#0E0F0C] font-medium text-5xl text-center">
        Frequently Asked Questions
      </h1>

      {/* FAQs */}
      <section className="mt-8 max-w-3xl mx-auto bg-white p-8 lg:p-20 rounded-3xl shadow">
        {faqs.map((item, index) => (
          <FAQItem
            key={index}
            index={index}
            question={item.question}
            answer={item.answer}
            open={openIndex === index}
            onToggle={() => toggle(index)}
            isLast={index === faqs.length - 1}
          />
        ))}
      </section>
    </main>
  );
};

export default FAQs;

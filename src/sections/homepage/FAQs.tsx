import { useState } from "react";
import { faqs } from "../../data/faqs";

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
  }: FAQItemProps) => (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-8 text-left"
      >
        <span className="text-base md:text-lg font-medium text-[#03034D] leading-7">
          {question}
        </span>
        <span
          className="relative shrink-0 w-5 h-5 cursor-pointer"
          aria-hidden="true"
        >
          {open ? (
            /* minus icon */
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : (
            /* plus icon */
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
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M0.666687 6.6665H12.6667"
                stroke="#A0A3BD"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )}
        </span>
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        className={
          open
            ? "overflow-hidden transition-[max-height,opacity] duration-300 max-h-auto opacity-100"
            : "overflow-hidden transition-[max-height,opacity] duration-300 max-h-0 opacity-0"
        }
      >
        <p className="pr-10 pb-6 md:pb-8 text-sm md:text-lg text-[#454745]">
          {answer}
        </p>
      </div>
      {!isLast && <hr className="border-t border-[#F1F2F9] pt-6" />}
    </div>
  );

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

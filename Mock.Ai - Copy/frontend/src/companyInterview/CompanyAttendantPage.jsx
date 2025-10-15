import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../components/ui/use-outside-click.jsx";
import useConversation from "../stateManage/useConversation.js";
import InterviewFeedback from "../components/interviewFeedback.jsx";

export function AttandantPage() {
  const [active, setActive] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const ref = useRef(null);
  const id = useId();
  const reportData = useConversation((state) => state.reportData);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
        setShowFeedback(false);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => {
    setActive(null);
    setShowFeedback(false);
  });

  const cards = reportData.map((candidate) => ({
    name: candidate.participant?.name,
    username: candidate.participant?.username,
    email: candidate.participant?.email,
    score: candidate.totalScore,
    fullScore: Array.isArray(candidate.questions) ? candidate.questions.length * 10 : 0,
    src: candidate.participant?.profilePicURL,
    ctaText: "View Result",
    content: candidate.overAllReview || "No summary provided.",
    fullData: candidate,
  }));

  return (
    <>
      {showFeedback && active?.fullData ? (
        <InterviewFeedback data={active.fullData} onBack={() => setShowFeedback(false)}/>
      ) : (
        <div className="min-h-screen w-screen overflow-x-hidden dark-mystic-bg">
          <h1 className="text-center text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text py-10 mt-[2rem]">
            Interview Results Overview
          </h1>

          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 h-full w-full z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {active && (
              <div className="fixed inset-0 grid place-items-center z-[100]">
                <motion.button
                  key={`button-${active.name}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                  onClick={() => {
                    setActive(null);
                    setShowFeedback(false);
                  }}
                >
                  <CloseIcon />
                </motion.button>

                <motion.div
                  layoutId={`card-${active.name}-${id}`}
                  ref={ref}
                  className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                >
                  <motion.div layoutId={`image-${active.name}-${id}`} className="flex justify-center py-6">
                    <img
                      width={120}
                      height={120}
                      src={active.src}
                      alt={active.name}
                      className="rounded-full object-cover h-32 w-32 border-4 border-white shadow-md"
                    />
                  </motion.div>

                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 gap-4">
                      <div>
                        <motion.h3
                          layoutId={`title-${active.name}-${id}`}
                          className="font-bold text-neutral-700 dark:text-neutral-200"
                        >
                          {active.name}
                        </motion.h3>
                        <motion.p
                          layoutId={`description-${active.email}-${id}`}
                          className="text-neutral-600 dark:text-neutral-400"
                        >
                          {active.email}
                        </motion.p>
                        <p className="text-sm text-gray-500">Username: {active.username}</p>
                        <p className="text-sm font-semibold text-green-600">Score: {active.score}/{active.fullScore}</p>
                      </div>

                      <motion.button
                        layoutId={`button-${active.name}-${id}`}
                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                        onClick={() => setShowFeedback(true)}
                      >
                        {active.ctaText}
                      </motion.button>
                    </div>

                    <div className="pt-4 relative px-4">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                      >
                        {active.content}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <ul className="max-w-2xl mx-auto w-full flex flex-col gap-4">
            {cards.map((card) => (
              <motion.div
                layoutId={`card-${card.name}-${id}`}
                key={`card-${card.name}-${id}`}
                onClick={() => setActive(card)}
                className="p-4 pr-8 flex flex-row items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                <motion.div layoutId={`image-${card.name}-${id}`} className="flex justify-center">
                  <img
                    width={56}
                    height={56}
                    src={card.src}
                    alt={card.name}
                    className="h-14 w-14 rounded-full object-cover object-top"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <motion.h3
                    layoutId={`title-${card.name}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    {card.name}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.email}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400"
                  >
                    {card.email}
                  </motion.p>
                  <p className="text-sm font-semibold text-green-600">Score: {card.score}/{card.fullScore}</p>
                </div>
                <motion.button
                  layoutId={`button-${card.name}-${id}`}
                  className="mt-2 ml-auto px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black"
                >
                  {card.ctaText}
                </motion.button>
              </motion.div>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

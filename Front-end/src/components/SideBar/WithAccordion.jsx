import React, { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import ListSkelecton from "./ListSkelecton";
import { useChatStore } from "../../store/useChatStore.js";

// import FriendUi from './FriendUi';
// import GlobalUi from './GlobalUi.jsx';
import OtherUi from './OtherUi.jsx';
const FriendUi = React.lazy(() => import('./FriendUi'));
const GlobalUi = React.lazy(() => import('./GlobalUi'));

function WithAccordion() {
  const [openIndex, setOpenIndex] = useState(0); // Default open "Friend List"

  const handleToggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const listData = [
    {
      title: 'Friend ',
      component: <FriendUi />,
    },
    {
      title: 'Global User',
      component: <GlobalUi />,
    },
    // {
    //   title: 'Other User',
    //   component: <OtherUi />,
    // },
  ];


  return (
    <div>
      {listData.map((list, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`border-b border-gray-200 dark:border-gray-700 ${isOpen ? "bg-gray-100 dark:bg-gray-800" : ""}`}>
            <button
              onClick={() => handleToggle(index)}
              style={{ padding: "6px 16px" }}
              className={`flex opacity-42 ${isOpen ? "border-gray-200 dark:border-gray-200" : ""} hover:cursor-pointer overflow-auto justify-between border-b-0 flex-row-reverse items-center w-full  text-left hover:bg-transparent focus:outline-none  transition-colors duration-200`}
            >
              <span className="mr-2 text-xl font-mono">
                {isOpen ? '−' : '+'}
              </span>
              <span className="font-medium text-sm">{list.title}</span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden px-8 py-2 bg-transparent"
                >
                  <Suspense fallback={<ListSkelecton />}>
                    {list.component}
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  )
}

export default WithAccordion;
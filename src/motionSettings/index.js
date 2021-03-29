const headerAnimation = {
  initial: { y: 5, opacity: 0, transition: { duration: 0.4 } },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  exit: { y: 5, opacity: 0, transition: { duration: 0.4 } },
};

const paginationAnimation = {
  initial: { x: 15, opacity: 0, transition: { duration: 0.8 } },
  animate: { x: 0, opacity: 1, transition: { duration: 0.8 } },
  exit: { y: 15, opacity: 0, transition: { duration: 0.8 } },
};

const tableRowAnimation = {
  initial: { x: 10, opacity: 0, transition: { duration: 0.8 } },
  animate: { x: 0, opacity: 1, transition: { duration: 0.8 } },
  exit: { x: -10, opacity: 0, transition: { duration: 0.8 } },
};

const devicePageAnimation = {
  initial: { opacity: 0, transition: { duration: 2 } },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 1 } },
};

const devicePageHeaderAnimation = {
  initial: { x: -10, opacity: 0, transition: { duration: 0.7 } },
  animate: { x: 0, opacity: 1, transition: { duration: 0.7 } },
  exit: { y: -10, opacity: 0, transition: { duration: 0.7 } },
};

const backdropAnimation = {
  initial: { opacity: 0, transition: { duration: 0.4 } },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

const modalAnimation = {
  initial: { y: 20, x: 20, opacity: 0, transition: { duration: 0.3 } },
  animate: { y: 0, x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: -20, x: -20, opacity: 0, transition: { duration: 0.3 } },
};

module.exports = {
  tableRowAnimation,
  paginationAnimation,
  headerAnimation,
  devicePageAnimation,
  devicePageHeaderAnimation,
  modalAnimation,
  backdropAnimation,
};

export default {
  getResponse: () => 'What do people yell at their dogs?',
  processAnswer: (state, answer) => {
    // TODO: check answer against valid responses
    if (answer === 'sit') {
      return {
        controller: 'welcome',
      };
    }
    return state;
  },
};

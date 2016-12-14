export default {
  getResponse: () => 'Welcome to Family Feud. Are you ready to play?',
  processAnswer: (state, answer) => {
    if (answer === 'yes') {
      return {
        controller: 'faceOff',
      };
    }
    return state;
  },
};

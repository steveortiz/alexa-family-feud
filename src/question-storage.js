import roundQuestions from "./round-questions";
export const CARD_TITLE = "ROUND_ONE";
export function getWelcomeRoundQuestion (){
  return roundQuestions[0].question;
}

export function getRoundQuestions () {
  return roundQuestions;
}

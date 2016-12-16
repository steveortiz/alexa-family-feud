import './setup';
import faceOff from '../src/face-off-controller';
import * as questionBank from '../src/question-bank';
import questionMap from '../src/questions.json';

const TEST_QUESTION = 'This is a test question';
const ANSWERS = [
  { answer: 'one', points: 25 },
  { answer: 'two', points: 20 },
  { answer: 'three', points: 15 },
  { answer: 'four', points: 15 },
  { answer: 'five', points: 10 },
];
const CORRECT_1_ANSWER = 'one';
const CORRECT_1_VALUE = 25;
const CORRECT_2_ANSWER = 'two';
const CORRECT_2_VALUE = 20;
const CORRECT_3_ANSWER = 'three';
const CORRECT_3_VALUE = 15;
const CORRECT_4_ANSWER = 'four';
const CORRECT_4_VALUE = 15;
const NUMBER_OF_CORRECT_ANSWERS = 5;

const INCORRECT_1_ANSWER = 'alpha';
const INCORRECT_2_ANSWER = 'bravo';

describe('face-off-spec', () => {
  let getRandomQuestionStub;
  before(() => {
    questionMap[TEST_QUESTION] = ANSWERS;
  });
  after(() => {
    delete questionMap[TEST_QUESTION];
  });
  beforeEach(() => {
    getRandomQuestionStub = sinon.stub(questionBank, 'getRandomQuestion');
    getRandomQuestionStub.returns(TEST_QUESTION);
  });
  afterEach(() => {
    getRandomQuestionStub.restore();
  });
  it('should ask the current team a question for the first time', () => {
    const state = faceOff.init();
    faceOff.getResponse(state).should.equal(`team one, ${TEST_QUESTION}`);
    faceOff.getResponse(Object.assign({}, state, { currentTeam: 0 })).should.equal(`team one, ${TEST_QUESTION}`);
    faceOff.getResponse(Object.assign({}, state, { currentTeam: 1 })).should.equal(`team two, ${TEST_QUESTION}`);
  });
  it('should alert the user with success if they answer correctly', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, CORRECT_2_ANSWER);
    const remainingAnswers = NUMBER_OF_CORRECT_ANSWERS - 1;
    state.correctlyAnswered.should.deep.equal([CORRECT_2_ANSWER]);
    state.remainingAnswers.should.equal(remainingAnswers);
    faceOff.getResponse(state).should.equal(`Yay. ${CORRECT_2_ANSWER} is worth ${CORRECT_2_VALUE} points. There are ${remainingAnswers} answers remaining.`);
  });
  it('should alert the user with invalid answer alert on invalid answer', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, INCORRECT_2_ANSWER);
    const remainingAnswers = NUMBER_OF_CORRECT_ANSWERS;
    state.correctlyAnswered.should.deep.equal([]);
    state.remainingAnswers.should.equal(remainingAnswers);
    faceOff.getResponse(state).should.equal(`Boo. ${INCORRECT_2_ANSWER} is incorrect. team two, ${TEST_QUESTION}`);
  });
  it('should go immediately to normal play if the first team answers the top score', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, CORRECT_1_ANSWER);
    state.correctlyAnswered.should.deep.equal([CORRECT_1_ANSWER]);
    state.controller.should.equal('familyRound');
    state.flash.should.equal(`Yay. ${CORRECT_1_ANSWER} is worth ${CORRECT_1_VALUE} points. That is the top answer.`);
  });
  it('should take team with higher value answer to the family round', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, CORRECT_2_ANSWER);
    state = faceOff.processAnswer(state, CORRECT_1_ANSWER);
    state.correctlyAnswered.should.deep.equal([CORRECT_2_ANSWER, CORRECT_1_ANSWER]);
    state.controller.should.equal('familyRound');
    state.faceOffWinner.should.equal(1);
    state.flash.should.equal(`Yay. ${CORRECT_1_ANSWER} is worth ${CORRECT_1_VALUE} points. team two wins the face off.`);
  });
  it('if the first team to answer gets a correct answer and the second team does not, the first team should win the faceoff', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, CORRECT_2_ANSWER);
    state = faceOff.processAnswer(state, INCORRECT_2_ANSWER);
    state.correctlyAnswered.should.deep.equal([CORRECT_2_ANSWER]);
    state.controller.should.equal('familyRound');
    state.faceOffWinner.should.equal(0);
    state.flash.should.equal(`Boo. ${INCORRECT_2_ANSWER} is incorrect. team one wins the face off.`);
  });
  it('if the second team to answer gets a correct answer and the first team does not, the second team should win the faceoff', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, INCORRECT_2_ANSWER);
    state = faceOff.processAnswer(state, CORRECT_2_ANSWER);
    state.correctlyAnswered.should.deep.equal([CORRECT_2_ANSWER]);
    state.controller.should.equal('familyRound');
    state.faceOffWinner.should.equal(1);
    state.flash.should.equal(`Yay. ${CORRECT_2_ANSWER} is worth ${CORRECT_2_VALUE} points. team two wins the face off.`);
  });
  it('if neither team answers correctly, it goes back to the first team to try again and if they answer it goes to the family round', () => {
    let state = faceOff.init({ controller: 'faceOff' });
    state = faceOff.processAnswer(state, INCORRECT_2_ANSWER);
    state = faceOff.processAnswer(state, INCORRECT_1_ANSWER);
    state.correctlyAnswered.should.deep.equal([]);
    state.controller.should.equal('faceOff');
    state.currentTeam.should.equal(0);
    faceOff.getResponse(state).should.equal(`Boo. ${INCORRECT_1_ANSWER} is incorrect. team one, ${TEST_QUESTION}`);
    state = faceOff.processAnswer(state, CORRECT_2_ANSWER);
    state.controller.should.equal('familyRound');
    state.flash.should.equal(`Yay. ${CORRECT_2_ANSWER} is worth ${CORRECT_2_VALUE} points. team one wins the face off.`);
  });
  it('if both teams have valid answers, the team with the higher points gets to go into family round', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, CORRECT_2_ANSWER);
    state = faceOff.processAnswer(state, CORRECT_3_ANSWER);
    state.correctlyAnswered.should.deep.equal([CORRECT_2_ANSWER, CORRECT_3_ANSWER]);
    state.controller.should.equal('familyRound');
    state.faceOffWinner.should.equal(0);
    state.flash.should.equal(`Yay. ${CORRECT_3_ANSWER} is worth ${CORRECT_3_VALUE} points. However, team one wins the face off.`);
  });
  it('if both teams have valid answers, worth the same points, the first team gets to go into family round', () => {
    let state = faceOff.init();
    state = faceOff.processAnswer(state, CORRECT_3_ANSWER);
    state = faceOff.processAnswer(state, CORRECT_4_ANSWER);
    state.correctlyAnswered.should.deep.equal([CORRECT_3_ANSWER, CORRECT_4_ANSWER]);
    state.controller.should.equal('familyRound');
    state.faceOffWinner.should.equal(0);
    state.flash.should.equal(`Yay. ${CORRECT_4_ANSWER} is worth ${CORRECT_4_VALUE} points. However, team one wins the face off.`);
  });
});

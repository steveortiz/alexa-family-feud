import './setup';
import familyRound from '../src/family-round-controller';
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
const CORRECT_2_ANSWER = 'two';
const CORRECT_2_VALUE = 20;
const NUMBER_OF_CORRECT_ANSWERS = 5;

const INCORRECT_1_ANSWER = 'alpha';
const INCORRECT_2_ANSWER = 'bravo';
const INCORRECT_3_ANSWER = 'charlie';

const startingState = () => familyRound.init({
  controller: 'familyRound',
  faceOffWinner: 0,
  question: TEST_QUESTION,
  correctlyAnswered: [CORRECT_1_ANSWER],
});

describe('family-round-spec', () => {
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
  it('should repeat the question for the winning team', () => {
    const state = startingState();
    familyRound.getResponse(state).should.equal(`team one, ${TEST_QUESTION}`);
  });
  it('should alert success if team answered with correct response', () => {
    let state = startingState();
    state = familyRound.processAnswer(state, CORRECT_2_ANSWER);
    familyRound.getResponse(state).should.equal(`${CORRECT_2_ANSWER} is correct. It is worth ${CORRECT_2_VALUE} points. team one, You have 0 strikes and ${NUMBER_OF_CORRECT_ANSWERS - 2} remaining answers. ${TEST_QUESTION}`);
  });
  it('should alert incorrect and add a strike on an incorrect response', () => {
    let state = startingState();
    state = familyRound.processAnswer(state, INCORRECT_1_ANSWER);
    familyRound.getResponse(state).should.equal(`${INCORRECT_1_ANSWER} is incorrect. team one, You have 1 strike and ${NUMBER_OF_CORRECT_ANSWERS - 1} remaining answers. ${TEST_QUESTION}`);
  });
  it('should tell the family they won and start a new question if they cleared the board', () => {
    let state = startingState();
    ANSWERS.forEach((answer) => {
      state = familyRound.processAnswer(state, answer.answer);
    });
    state.controller.should.equal('faceOff');
    state.flash.should.equal('Congratulations! You cleared the board. Time to begin the next round. The starting team for the face-off alternates, so'); // TODO: and won xx points
  });
  it('should tell the family they struck out if they give 3 wrong answers', () => {
    let state = startingState();
    [INCORRECT_1_ANSWER, INCORRECT_2_ANSWER, INCORRECT_3_ANSWER].forEach((answer) => {
      state = familyRound.processAnswer(state, answer.answer);
    });
    state.controller.should.equal('steal');
    state.flash.should.equal('Sorry. Your team has three strikes.');
  });
});

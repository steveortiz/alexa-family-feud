import _ from 'lodash';
import welcome from './welcome-controller';
import faceOff from './face-off-controller';
import rules from './rules-controller';
import familyRound from './family-round-controller';
import steal from './steal-controller';
import gameOver from './game-over-controller';

const controllerMap = {
  welcome,
  faceOff,
  rules,
  familyRound,
  steal,
  gameOver,
};

export default class GameController {
  constructor() {
    this.state = {};
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
  }
  getController() {
    const controllerName = _.get(this.state, 'controller', 'welcome');
    return controllerMap[controllerName];
  }
  processAnswer(answer) {
    this.state = this.getController().processAnswer(this.state, answer);
    return this.getController().getResponse(this.state);
  }
}

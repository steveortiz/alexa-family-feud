import _ from 'lodash';
import welcome from './welcome-controller';
import rules from './rules-controller';
import coinFlip from './coin-flip-controller';
import faceOff from './face-off-controller';
import familyRound from './family-round-controller';
import steal from './steal-controller';
import gameOver from './game-over-controller';

const controllerMap = {
  welcome,
  rules,
  coinFlip,
  faceOff,
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
    this.state.flash = null;
    const processingController = this.getController();
    this.state = processingController.processAnswer(this.state, answer);
    const respondingController = this.getController();
    if (respondingController !== processingController && respondingController.init) {
      this.state = respondingController.init(this.state);
    }
    const response = respondingController.getResponse(this.state);
    return this.state.flash ? `${this.state.flash} ${response}` : response;
  }
}

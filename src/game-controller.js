import _ from 'lodash';
import welcome from './welcome-controller';
import faceOff from './face-off-controller';

const controllerMap = {
  welcome,
  faceOff,
};

export default class GameController {
  constructor() {
    this.state = {
      controller: 'welcome',
    };
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

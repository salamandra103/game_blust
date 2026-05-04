import { _decorator, Component, Node, Input, director, game } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
  @property(Node) private startButton: Node = null;
  @property(Node) private exitButton: Node = null;

  protected onLoad(): void {
    this.startButton.on(Input.EventType.MOUSE_UP, this.startGame, this);
    this.exitButton.on(Input.EventType.MOUSE_UP, this.exitGame, this);
  }

  public startGame() {
    director.loadScene("Game");
  }

  public exitGame() {
    this.unscheduleAllCallbacks();
    game.end()
    director.end()
  }
}

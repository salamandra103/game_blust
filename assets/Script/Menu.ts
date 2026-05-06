import { _decorator, Component, Node, Input, director, game, ProgressBar, Director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
  @property(Node) private startButton: Node = null;
  @property(Node) private exitButton: Node = null;

  @property(ProgressBar) private loadingProgressBar: ProgressBar = null;
  @property(Node) private progressWindow: Node = null;

  constructor() {
    super();
    this.onProgress = this.onProgress.bind(this)
  }

  protected onLoad(): void {
    this.startButton.on(Input.EventType.TOUCH_END, this.startGame, this);
    this.exitButton.on(Input.EventType.TOUCH_END, this.exitGame, this);
  }

  public startGame() {
    this.progressWindow.active = true;
    director.preloadScene("Game", this.onProgress, () => {
      director.loadScene('Game')
    });
  }

  private onProgress: Director.OnLoadSceneProgress = (completedCount, totalCount, item) => {
    this.loadingProgressBar.progress = completedCount / totalCount
  }

  public exitGame() {
    this.unscheduleAllCallbacks();
    game.end()
    director.end()
  }
}
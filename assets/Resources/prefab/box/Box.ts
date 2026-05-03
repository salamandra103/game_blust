import { _decorator, Component, Sprite, SpriteFrame, UITransform, Input, director, Animation, animation, Vec2, AnimationState, AnimationClip } from "cc";
import { Game, type GameBoard, type GameBoardTile, colorMap } from "../../../Script/Game";

import { BoxAnimation } from "./BoxAnimation";

import { getCopyArrayByVerticalBoundary, getDenormalizedIndex, getNormalizedIndex, getSiblingItem, type IndexInMatrix } from '../../../Script/utils/helpers'

const { ccclass } = _decorator;


@ccclass("Box")
export class Box extends Component {
  public uiTransport: UITransform = null;
  public boxAnimation: Animation = null;

  private originIndex: IndexInMatrix = [0, 0];
  private gameBoardSize: number = null;
  private game: Game = null;

  public init(game: Game): void {
    this.game = game;
    this.gameBoardSize = game.gameBoard[0].length;
    this.uiTransport = this.node.getComponent(UITransform);
  }

  protected onLoad(): void {
    this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

    const boxAnimation = this.node.getComponent(BoxAnimation);
    const { track: scaleAnimationTrack, clip: scaleAnimationClip } = boxAnimation.createBaseAnimation("scaleAnimation", animation.VectorTrack, {
      duration: 1,
      keys: [[0.0, 0.5, 1.0]],
      wrapMode: 2,
    });
    const { track: destroyAnimationTrack, clip: destroyAnimationClip } = boxAnimation.createBaseAnimation("destroyAnimation", animation.VectorTrack, {
      duration: 0.5,
      keys: [[0.0, 0.2, 0.3, 0.4, 0.5]],
      wrapMode: 0,
    });
    const scaleClip = boxAnimation.createVectorAnimation(scaleAnimationTrack, scaleAnimationClip, [
      new Vec2(1.0, 1.0),
      new Vec2(1.05, 1.05),
      new Vec2(1.0, 1.0),
    ], 'scale');

    const destoryClip = boxAnimation.createVectorAnimation(destroyAnimationTrack, destroyAnimationClip, [
      new Vec2(1.0, 1.0),
      new Vec2(1.1, 1.1),
      new Vec2(0.6, 0.6),
      new Vec2(0.3, 0.3),
      new Vec2(0, 0),
    ], 'scale');
    boxAnimation.addAnimationClip(scaleClip);
    boxAnimation.addAnimationClip(destoryClip);

    this.boxAnimation = boxAnimation.getAnimation();
  }

  protected update(deltaTime: number) { }

  protected onDestroy(): void {
  }

  public setSpriteFrame(spriteFrame: SpriteFrame): void {
    this.node.getComponent(Sprite).spriteFrame = spriteFrame;
  }

  public setContentSize(width: number, height: number) {
    this.node.getComponent(UITransform).setContentSize(width, height);
  }

  public setIndex2DMatrix(originIndex: IndexInMatrix) {
    this.originIndex = originIndex;
  }

  public setPosition(x: number, y: number) {
    const oldPosition = this.node.getPosition().toVec2()
    const boxAnimation = this.node.getComponent(BoxAnimation)
    const boxAnimationComponent = boxAnimation.getAnimation();

    const { track: moveAnimationTrack, clip: moveAnimationClip } = boxAnimation.createBaseAnimation("moveAnimation", animation.VectorTrack, {
      duration: 0.1,
      keys: [[0.0, 0.1]],
      wrapMode: 0,
    });

    const moveClip = boxAnimation.createVectorAnimation(moveAnimationTrack, moveAnimationClip, [
      oldPosition,
      new Vec2(x, y),
    ], 'position');

    boxAnimation.addAnimationClip(moveClip);
    boxAnimationComponent.play("moveAnimation")
    boxAnimationComponent.once(Animation.EventType.FINISHED,
      (type, state) => {
        boxAnimation.removeAnimationClip(moveAnimationClip)
        this.node.setPosition(x, y);
      },
      this)

  }

  public async onMouseUp() {
    console.log("MouseUp box");
    console.log("Position: " + this.node.position);
    console.log("Id: " + this.node.uuid);
    console.log("Origin Index: " + this.originIndex);
    console.log("Color: " + colorMap[this.game.gameBoard[this.originIndex[0]][this.originIndex[1]][3]]);

    const startIndex = this.game.gameBoard.length > this.gameBoardSize ? this.game.gameBoard.length - this.gameBoardSize : 0;

    /**
     *Создание упрощенной копии массива с границами текущего поля
     */
    const copyBoard = getCopyArrayByVerticalBoundary(this.game.gameBoard, startIndex, (item) => {
      if (item) {
        return item[3];
      }
    });

    const destroyedTile = getSiblingItem(copyBoard, getNormalizedIndex(this.originIndex, this.gameBoardSize));
    if (destroyedTile === null) {
      console.log("Нет соседей");
      return;
    }

    const removePromise: Promise<any>[] = [];
    /**
     * Поиск удаляемого тайтла по копии
     */
    for (let i = 0; i < destroyedTile.length; i++) {
      for (let j = 0; j < destroyedTile[i].length; j++) {
        if (copyBoard[i][j] === null) {
          const boxDenormalizedIndex = getDenormalizedIndex([i, j], this.gameBoardSize); // Индексы тайтла в оригинальном игровок поле
          const _this = this;
          this.game.gameBoard[boxDenormalizedIndex[0]][boxDenormalizedIndex[1]][0].getComponent(Animation).play("destroyAnimation");

          removePromise.push(
            new Promise<void>((resolve, reject) => {
              this.boxAnimation.on(
                Animation.EventType.FINISHED,
                (type, state) => {
                  _this.onDestroyAnimationFinished(type, state, () => {
                    _this.deleteNode(boxDenormalizedIndex);
                    resolve();
                  });
                },
                this,
              );
            }),
          );
        }
      }
    }
    director.getScene().getChildByName("Canvas").getComponent(Game).calculateScore(removePromise.length)

    await Promise.all(removePromise)
    director.getScene().getChildByName("Canvas").getComponent(Game).shuffleGameBoard();
  }

  private onDestroyAnimationFinished(type: Animation.EventType, state: AnimationState, callback: () => void) {
    callback();
  }

  private deleteNode([rIndex, cIndex]: IndexInMatrix) {
    this.game.gameBoard[rIndex][cIndex][0].destroy();
    this.game.gameBoard[rIndex][cIndex][4] = false;
  }
}

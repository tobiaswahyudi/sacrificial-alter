class AnimationManager {
    constructor(game, state) {
        this.game = game;
        this.state = state;
        this.animations = [];
    }

    push(anim) {
        this.animations.push(anim);
    }

    remove(anim) {

    }

    get inputBlockedByAnimation(){
        return this.animations.some((a) => a.blocksInput)
    }

    handleInput(keyCode) {
        this.animations.forEach((a) => {
            if (a.needsInput) a.handleInput(keyCode);
        });
    }

    get needsRerender() {
        return this.animations.length > 0;
    }

    get length() {
        return this.animations.length;
    }

    tick() {
        if(this.state) {
            this.animations.sort((a,b) => a.layer - b.layer);
            const absAnim = this.animations.filter(x => x.absoluteSize);
            const relAnim = this.animations.filter(x => !x.absoluteSize);

            const scale = DEFAULT_SIZE / this.state.size;

            absAnim.forEach((anim) => anim.tick(this.game));

            this.game.ctx.save();
            this.game.ctx.translate(BOARD_PADDING, BOARD_PADDING);
            this.game.ctx.scale(scale, scale);
            this.game.ctx.translate(-HALF_SQUARE_SIZE, -HALF_SQUARE_SIZE);

            relAnim.forEach((anim) => anim.tick(this.game));

            this.game.ctx.restore();
        } else {
            this.animations.forEach((anim) => anim.tick(this.game));
        }

        this.animations = this.animations.filter((anim) => !anim.finished);
    }
}
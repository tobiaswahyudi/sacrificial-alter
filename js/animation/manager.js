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
            this.animations.forEach((anim) => anim.tick(this.game));
        } else {
            this.animations.forEach((anim) => anim.tick(this.game));
        }

        this.animations = this.animations.filter((anim) => !anim.finished);
    }
}
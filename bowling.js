var TOTAL_PINS = 10;
var INITIAL_TRIES = 2;
var TOTAL_FRAMES = 10;

exports.Game = function () {
    this.triesLeft = INITIAL_TRIES;
    this.pastFrames = [];
    this.currentFrame = [];
    this.currentFrameHits = 0;
    this.hasOldStrike = false;
    this.hasLastStrike = false;
    this.hasSpare = false;
    this.totalScore = 0;
};

exports.Game.prototype = {
    score: function () {
        return this.totalScore;
    },

    roll: function (pins) {
        if (!this.hasLastStrike && !this.hasOldStrike && !this.hasSpare && this.pastFrames.length >= TOTAL_FRAMES) {
            throw new Error("Game over");
        }
        if (pins < 0 || pins > TOTAL_PINS) {
            throw new RangeError("Must roll between 0 and " + TOTAL_PINS + " pins");
        }
        if (this.currentFrameHits + pins > TOTAL_PINS) {
            throw new RangeError("Can't hit more than " + TOTAL_PINS + " in a frame");
        }
        this.updateFrame(pins);
        this.updateScore(pins);

        if (this.triesLeft === 0 || pins === TOTAL_PINS) {
            if (this.pastFrames.length < TOTAL_FRAMES) {
                if (pins == TOTAL_PINS) {
                    this.hasLastStrike = true;
                } else if (this.currentFrameHits == TOTAL_PINS) {
                    this.hasSpare = true;
                }
            }
            this.nextFrame();
        }
    },

    nextFrame: function () {
        this.pastFrames.push(this.currentFrame);
        this.currentFrame = [];
        this.currentFrameHits = 0;
        this.triesLeft = INITIAL_TRIES;
    },


    updateFrame: function (pins) {
        this.currentFrame.push(pins);
        this.currentFrameHits += pins;
        this.triesLeft--;
    },


    updateScore: function (pins) {
        if (this.hasSpare) {
            this.totalScore += pins;
            this.hasSpare = false;
        }

        if (this.hasOldStrike) {
            this.totalScore += pins;
            this.hasOldStrike = false;
        }

        if (this.hasLastStrike) {
            this.totalScore += pins;
            this.hasLastStrike = false;
            this.hasOldStrike = true;
        }

        if (this.pastFrames.length < TOTAL_FRAMES) {
            this.totalScore += pins;
        }
    }
};

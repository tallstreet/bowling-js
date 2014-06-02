var vows = require('vows'),
    assert = require('assert');

var bowling = require('./bowling');

var Game   = bowling.Game;

vows.describe('Bowling').addBatch({
    'Game': {
        topic: new(Game),

        'should have a starting score of 0': function (game) {
            assert.equal (game.score(), 0);
        }
    },


    'If in 2 tries, the bowler fails to knock down all the pins': {
        topic: new(Game),

        'their score is the sum of the number of pins they\'ve knocked \
         down in the 2 attempts': function (game) {
            game.roll(4);
            game.roll(4);
            assert.equal (game.score(), 8);
        }
    },

    'If in 2 tries, the bowler knocks down all the pins': {
        topic: new(Game),

        'it is a spare The scoring of a spare is the sum of the number\
         of pins knocked down plus the number of pins knocked down in \
         the next bowl.': function (game) {
            game.roll(4);
            game.roll(6);
            game.roll(5);
            assert.equal (game.score(), 20);
        }
    },

    'If in 2 tries, the bowler knocks down all the pins, only one spare': {
        topic: new(Game),

        'only the next try gets double points.': function (game) {
            game.roll(4);
            game.roll(6);
            game.roll(5);
            game.roll(5);
            game.roll(2);
            assert.equal (game.score(), 29);
        }
    }, 

    'If in one try, the bowler knocks down all the pins, it is a strike': {
        topic: new(Game),

        'The scoring of a strike is the sum of the number of pins\
         knocked down plus the number of pins knocked down in the \
         next two bowls': function (game) {
            game.roll(10);
            game.roll(5);
            game.roll(4);
            assert.equal (game.score(), 28);
        }
    }, 

    'Number of pins hit per roll': {
        topic: new(Game),

        'should not be less than 0': function (game) {
            assert.throws(function () { game.roll(-1); }, RangeError);
        }, 

        "should not be > 10": function (game) {
            assert.throws(function () { game.roll(11); }, RangeError);
        }
    }, 

    'There are 10 pins in a try': {
        topic: new(Game),

        'should not be greater than 10 within the same try': function (game) {
            game.roll(5);
            assert.throws(function () { game.roll(6); }, RangeError);
            game.roll(5);
            game.roll(5);
            assert.throws(function () { game.roll(6); }, RangeError);
        }
    }, 


    'There are 10 frames in a match': {
        topic: new(Game),

        'should stop scoring after the 10th frame': function (game) {
            for (i = 0; i < 18; i++) {
                game.roll(3);
            }
            assert.doesNotThrow(function () { game.roll(3); }, Error);
            assert.doesNotThrow(function () { game.roll(3); }, Error);
            assert.throws(function () { game.roll(3); }, Error);
        }
    }, 

    'If one has a strike for every roll': {
        topic: new(Game),

        'should score them 300': function (game) {
            for (i = 0; i < 12; i++) {
                game.roll(10);
            }
            assert.equal (game.score(), 300);
        }
    }, 

    'If one has a strike for every roll except the last': {
        topic: new(Game),

        'should calculate the score correctly': function (game) {
            for (i = 0; i < 10; i++) {
                game.roll(10);
            }
            game.roll(5);
            game.roll(3);
            assert.equal (game.score(), 283);
        }
    }, 

    'In the last frame, if the bowler bowls a spare, they get another bowl': {
        topic: new(Game),

        'The score of this frame is the sum of the three bowls.': function (game) {
            for (i = 0; i < 18; i++) {
                game.roll(0);
            }
            game.roll(7);
            game.roll(3);
            assert.doesNotThrow(function () { game.roll(3); }, Error);
            assert.equal (game.score(), 13);
        }
    }, 


    'In the last frame, if the bowler bowls a strike, they get another 2 bowls': {
        topic: new(Game),

        'The score of this frame is the sum of the three bowls': function (game) {
            for (i = 0; i < 18; i++) {
                game.roll(0);
            }
            game.roll(10);
            game.roll(3);
            game.roll(3);
            assert.equal (game.score(), 16);
        }, 

        'The score of this frame is the sum of the three bowls': function (game) {
            for (i = 0; i < 18; i++) {
                game.roll(0);
            }
            game.roll(10);
            game.roll(10);
            game.roll(10);
            assert.equal (game.score(), 30);
        }
    }, 


    'If all spares': {
        topic: new(Game),

        'should have the correct score.': function (game) {
            for (i = 0; i < 10; i++) {
                game.roll(3);
                game.roll(7);
            }
            game.roll(10);
            assert.equal (game.score(), 137);
        }
    }, 


    'If no spares or strikes': {
        topic: new(Game),

        'should have the correct score.': function (game) {
            game.roll(3);
            game.roll(1);
            game.roll(2);
            game.roll(0);
            game.roll(3);
            game.roll(5);
            game.roll(3);
            game.roll(6);
            game.roll(4);
            game.roll(0);
            game.roll(0);
            game.roll(5);
            game.roll(7);
            game.roll(0);
            game.roll(8);
            game.roll(1);
            game.roll(2);
            game.roll(0);
            assert.equal (game.score(), 50);
        }
    }
}).export(module); // Export the Suite

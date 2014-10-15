var vows = require('vows');
var assert = require('assert');
var Compatibility = require('../../lib/utils/compatibility');

vows.describe(Compatibility)
  .addBatch({
    'as an empty hash': {
      topic: new Compatibility({}).toOptions(),
      'gets default options': function(options) {
        assert.isFalse(options.properties.iePrefixHack);
        assert.isFalse(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isTrue(options.properties.merging);
        assert.isTrue(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /\-(moz|ms|o|webkit)\-/);
      }
    },
    'not given': {
      topic: new Compatibility().toOptions(),
      'gets default options': function(options) {
        assert.isFalse(options.properties.iePrefixHack);
        assert.isFalse(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isTrue(options.properties.merging);
        assert.isTrue(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /\-(moz|ms|o|webkit)\-/);
      }
    },
    'as a populated hash': {
      topic: new Compatibility({ units: { rem: false }, properties: { prefix: true } }).toOptions(),
      'gets merged options': function(options) {
        assert.isFalse(options.properties.iePrefixHack);
        assert.isFalse(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isTrue(options.properties.merging);
        assert.isFalse(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /\-(moz|ms|o|webkit)\-/);
      }
    }
  })
  .addBatch({
    'as an ie8 template': {
      topic: new Compatibility('ie8').toOptions(),
      'gets template options': function(options) {
        assert.isTrue(options.properties.iePrefixHack);
        assert.isTrue(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isFalse(options.properties.merging);
        assert.isFalse(options.units.rem);
        assert.isFalse(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /(\-moz\-|\-ms\-|\-o\-|\-webkit\-|:root|:nth|:first\-of|:last|:only|:empty|:target|:checked|::selection|:enabled|:disabled|:not)/);
      }
    },
    'as an ie7 template': {
      topic: new Compatibility('ie7').toOptions(),
      'gets template options': function(options) {
        assert.isTrue(options.properties.iePrefixHack);
        assert.isTrue(options.properties.ieSuffixHack);
        assert.isTrue(options.selectors.ie7Hack);
        assert.isFalse(options.properties.merging);
        assert.isFalse(options.units.rem);
        assert.isFalse(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /(\-moz\-|\-ms\-|\-o\-|\-webkit\-|:focus|:before|:after|:root|:nth|:first\-of|:last|:only|:empty|:target|:checked|::selection|:enabled|:disabled|:not)/);
      }
    },
    'as an unknown template': {
      topic: new Compatibility('').toOptions(),
      'gets default options': function(options) {
        assert.isFalse(options.properties.iePrefixHack);
        assert.isFalse(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isTrue(options.properties.merging);
        assert.isTrue(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /\-(moz|ms|o|webkit)\-/);
      }
    }
  })
  .addBatch({
    'as a complex string value with group': {
      topic: new Compatibility('ie8,-properties.iePrefixHack,+colors.opacity').toOptions(),
      'gets calculated options': function(options) {
        assert.isFalse(options.properties.iePrefixHack);
        assert.isTrue(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isFalse(options.properties.merging);
        assert.isFalse(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /(\-moz\-|\-ms\-|\-o\-|\-webkit\-|:root|:nth|:first\-of|:last|:only|:empty|:target|:checked|::selection|:enabled|:disabled|:not)/);
      }
    },
    'as a single string value without group': {
      topic: new Compatibility('+properties.iePrefixHack').toOptions(),
      'gets calculated options': function(options) {
        assert.isTrue(options.properties.iePrefixHack);
        assert.isFalse(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isTrue(options.properties.merging);
        assert.isTrue(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /\-(moz|ms|o|webkit)\-/);
      }
    },
    'as a complex string value without group': {
      topic: new Compatibility('+properties.iePrefixHack,-units.rem').toOptions(),
      'gets calculated options': function(options) {
        assert.isTrue(options.properties.iePrefixHack);
        assert.isFalse(options.properties.ieSuffixHack);
        assert.isFalse(options.selectors.ie7Hack);
        assert.isTrue(options.properties.merging);
        assert.isFalse(options.units.rem);
        assert.isTrue(options.colors.opacity);
        assert.deepEqual(options.selectors.special, /\-(moz|ms|o|webkit)\-/);
      }
    }
  })
  .export(module);

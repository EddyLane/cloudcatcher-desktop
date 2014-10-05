System.register((void 0), [], function() {
  "use strict";
  var Test = function Test(options) {
    this.model = options.model;
    this.template = options.template;
  };
  ($traceurRuntime.createClass)(Test, {
    fuck: function() {
      return 'ruas';
    },
    shit: function() {
      return 'yo';
    },
    render: function() {
      return _.template(this.template, this.model.toObject());
    }
  }, {});
  return {};
});

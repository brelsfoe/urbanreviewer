this["JST"] = this["JST"] || {};

this["JST"]["handlebars_templates/filters.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section id=\"filters\">\n    <h2>filters</h2>\n    <section>\n        <h3>plan status</h3>\n        <div>\n            <input type=\"checkbox\" id=\"plan-status-active\" />\n            <label for=\"plan-status-active\">active</label>\n        </div>\n        <div>\n            <input type=\"checkbox\" id=\"plan-status-expired\" />\n            <label for=\"plan-status-expired\">expired</label>\n        </div>\n    </section>\n    <section>\n        <h3>NYC mayors</h3>\n        <select>\n            <option>Test</option>\n        </select>\n    </section>\n    <section>\n        <h3>last updated year</h3>\n        <select>\n            <option>Test</option>\n        </select>\n    </section>\n</section>\n\n<section id=\"highlights\">\n    <h2>highlight lots</h2>\n    <section>\n        <h3>disposition</h3>\n        <div>\n            <input type=\"checkbox\" id=\"lot-disposition-open-space\" />\n            <label for=\"lot-disposition-open-space\">open space</label>\n        </div>\n        <div>\n            <input type=\"checkbox\" id=\"lot-disposition-residential\" />\n            <label for=\"lot-disposition-residential\">residential</label>\n        </div>\n        <div>\n            <input type=\"checkbox\" id=\"lot-disposition-commercial\" />\n            <label for=\"lot-disposition-commercial\">commercial</label>\n        </div>\n    </section>\n</section>\n";
  });

this["JST"]["handlebars_templates/lots.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <li class=\"lot\">\n            <h3>";
  if (helper = helpers.borough) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.borough); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " block ";
  if (helper = helpers.block) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.block); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", lot ";
  if (helper = helpers.lot) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lot); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n        </li>\n    ";
  return buffer;
  }

  buffer += "<ul>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.rows), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });

this["JST"]["handlebars_templates/plan.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button class=\"panel-toggle\">\n    <span class=\"icon-bar\"></span>\n    <span class=\"icon-bar\"></span>\n    <span class=\"icon-bar\"></span>\n</button>\n<h1>";
  if (helper = helpers.plan_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plan_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n<div class=\"borough\">";
  if (helper = helpers.borough) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.borough); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n<div><span class=\"lot-count\"></span> lots</div>\n<div id=\"plan-details\"></div>\n<section id=\"lots\">\n    <h2>lots</h2>\n    <div id=\"lots-content\"></div>\n</section>\n";
  return buffer;
  });
// SKELETON
define([
  "jquery",
  "backbone",

  // Import and compile a HBS template.
  // For real application, remove this import (and the real file) and replace
  // with imports for your Backbone components needed to bootstrap the full
  // application. Likely this means a collection and router.
  "hbs!app/templates/hello",

  // Polyfill JSON for old browsers.
  "json2"
], function (
  $,
  Backbone,
  helloTmpl
) {
  "use strict";

  // --------------------------------------------------------------------------
  // Backbone.js Components.
  // --------------------------------------------------------------------------
  // Let's write a very simple Backbone model, and bind that with a template
  // to a view.

  // Backbone.js Model
  //
  // The model contains the data. Typically this is sync'ed with remote or
  // local storage.
  var HelloModel = Backbone.Model.extend({
    defaults: {
      message: "I am the default message"
    }
  });

  // Backbone.js View
  //
  // The view binds model (or collection) data to a Handlebars template and
  // attaches that to the page HTML. It also controls other behaviors.
  var HelloView = Backbone.View.extend({

    // HTML element to attach to.
    el: ".hello",

    // Model data to use (unless one is passed to constructor).
    model: new HelloModel(),

    // Template to bind data to.
    template: helloTmpl,

    // Function to actually bind all of the above together.
    render: function () {
      // Get model JSON data,
      // Add to template and render,
      // Replace existing element HTML!
      this.$el.html(this.template(this.model.toJSON()));

      // `render` should always return `this` by convention.
      return this;
    }
  });

  // --------------------------------------------------------------------------
  // Adjustments **just** for this demo page.
  // --------------------------------------------------------------------------
  // Hide the existing Notes HTML content for our skeleton application.
  // This hide can be removed later, once you are using the HTML content
  // in `index.html`.
  $(".notes-html").hide();

  // Dynamically add our element for the Backbone.js view
  // (Usually done in actual HTML).
  $("<div class='hello' />").appendTo($("body"));

  // --------------------------------------------------------------------------
  // Application Bootstrap
  // --------------------------------------------------------------------------
  // Actually wire up and kick everything off!
  //
  // **Note**: The `app.js` file is usually just comprised of **imports**
  // of the individual Backbone.js components above and the below function
  // on page load.
  $(function () {
    // Now instantiate our view and render!
    var helloView = new HelloView();
    // Update the model data. Without, renders `defaults.message`.
    helloView.model.set("message", "Hello World!");
    helloView.render();
  });
});

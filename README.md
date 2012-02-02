= Imperavi for Rails 3.1+

What is Imperavi? Imperavi is an open-source, lightweight and really pretty-looking wysiwyg editor written with JQuery. Look at the demo page: http://imperavi.com/redactor/examples/ (sorry for Russian). Like it?

I created this mountable engine with Imperavi so now you can easely integrate this editor into your app.

== Installation

Put this into your Gemfile:

    gem 'imperavi-rails'

Then mount the engine in routes.rb:

    mount ImperaviRails::Engine => "/imperavi"

And you're done!

== Usage

Add this helpers into the your view that contains a form:

    <%= include_imperavi_stylesheet %>
    <%= include_imperavi_javascript %>
    <%= imperavi :page_article %>

In this example `page_article` is an id of textarea field.

You may want the text on your page to be styled the same way as it looks in the editor. To do this, add the following styles into your `application.css.scss` (provided that the text on the page is enclosed with `article` tag):

    @import "imperavi-rails/imperavi/imperavi-base";

    body {
      width: 700px;
      margin: 0 auto;

      article {
        overflow: hidden;
        @include imperavi-base;

        p, div {
          border: 0;
        }

        p {
          padding: 0;
          margin: 0 0 1.5em 0;
        }
      }

      form {
        textarea {
          width: 700px;
          height: 600px;
        }
      }
    }

For details look at the Dummy app sources: https://github.com/tanraya/imperavi-rails/tree/master/spec/dummy
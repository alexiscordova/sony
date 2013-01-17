# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {
  environments: {
    debug:{
      srcPath: 'html/'
      outPath: '../build/debug'
      documentsPaths:['pages']
      plugins:
        jade:
          jadeOptions:
            pretty: true
    },
    mbuilder:{
      srcPath:'html/'
      documentsPaths: ['generated']
      outPath: '../build/debug/'
    },
    deploy:{
      srcPath:'html/'
      documentsPaths: ['pages']
      outPath: '../build/deploy/'
    },
    docs:{
      layoutsPaths:['']
      srcPath:'html/'
      documentsPaths: ['docs']
      outPath: '../docs/'
    }
    
  }
  templateData:{
    site:{
      title:'Sony Global'
    }
    plusify:(string) -> output = string.replace(/\[\+\]/g , '<span class="iconContainer-plus"><i class="icon-ui-plus-bold"></i></span>');
    data:(path) ->  output = JSON.parse( require('fs').readFileSync(require('path').normalize(docpad.config.rootPath + '/html/data/' + path), 'utf8') );
    polyfills: ->   output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/libs/polyfill/')).join('^').replace(/.svn|.git|.DS_store|thumbs.db/g ,'').split('^');
    require: ->     output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/bundle/require/')).join('^').replace(/.svn|.git|.DS_store|thumbs.db/g ,'').split('^');
    secondary: ->   output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/bundle/secondary/')).join('^').replace(/.svn|.git|.DS_store|thumbs.db/g ,'').split('^');
    defer: ->       output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/bundle/defer/')).join('^').replace(/.svn|.git|.DS_store|thumbs.db/g ,'').split('^');
    modulescss: ->  output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/css/scss/modules/')).join('^').replace(/.svn|.git|.DS_store|thumbs.db/g ,'').split('^');
    modulepages: -> output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/html/pages/')).join('^').replace(/.svn|.git|.DS_store|thumbs.db/g ,'').split('^');
    title:(name) -> t = docpad.database.findOne({id:'pages/'+name}); output = if t then t.attributes.title else '';
    desc:(name) ->  d = docpad.database.findOne({id:'pages/'+name}); output = if d then d.attributes.description else '';
  }
  

  
  plugins:{
    partials:{
       partialsPath:'partials'
    }
    handlebars:{
      helpers:{
        partial:(content, options) -> output = @partial(content, options),
        isEnv:(context, options) -> output = if (context in @getEnvironment()) then options.fn(this) else options.inverse(this),
        json:(context, options) -> output = JSON.stringify(context)
      }
    }    
  }
}
module.exports = docpadConfig
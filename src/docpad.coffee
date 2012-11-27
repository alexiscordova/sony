# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {
  environments: {
    debug:{
      layoutsPaths: ['data', '../js/', '../css/']
      srcPath:'html/'
      documentsPaths: ['pages']
      outPath: '../build/debug/'
    },
    deploy:{
      layoutsPaths: ['data', '../js/', '../css/']
      srcPath:'html/'
      documentsPaths: ['pages']
      outPath: '../build/deploy/'
    },
    docs:{
      layoutsPaths: ['pages/']
      srcPath:'html/'
      documentsPaths: ['docs']
      outPath: '../docs/'
    }
    
  }
  templateData:{
    site:{
      title:'Sony Global'
    }
    data:(path) ->  output =  JSON.parse ( docpad.database.findOne({id:path}).attributes.source)
    polyfills: ->   output = docpad.getFilesAtPath(require('path').normalize(docpad.config.rootPath + '/js/libs/polyfill/')).pluck('filename')
    require: ->     output = docpad.getFilesAtPath(require('path').normalize(docpad.config.rootPath + '/js/bundle/require/')).pluck('filename')
    secondary: ->   output = docpad.getFilesAtPath(require('path').normalize(docpad.config.rootPath + '/js/bundle/secondary/')).pluck('filename')
    defer: ->       output = docpad.getFilesAtPath(require('path').normalize(docpad.config.rootPath + '/js/bundle/defer/')).pluck('filename')
    modulescss: ->  output = docpad.getFilesAtPath(require('path').normalize(docpad.config.rootPath + '/css/scss/modules/')).pluck('filename')
    modulepages: -> output = docpad.getFilesAtPath(require('path').normalize(docpad.config.rootPath + '/html/pages/')).pluck('filename')
    title:(name) -> output = docpad.database.findOne({id:name}).attributes.title
    desc:(name) ->  output = docpad.database.findOne({id:name}).attributes.description
  }
  
  plugins:{
    partials:{
       partialsPath:''
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
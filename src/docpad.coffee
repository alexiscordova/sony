# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {
  environments: {
    debug:{
      layoutsPaths: ['data', '../js/']
      srcPath:'html/'
      documentsPaths: ['pages']
      outPath: '../build/debug/'
    },
    deploy:{
      layoutsPaths: ['data', '../js/']
      srcPath:'html/'
      documentsPaths: ['pages']
      outPath: '../build/deploy/'
    },
    docs:{
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
    polyfills: ->   output = docpad.getFilesAtPath(docpad.config.rootPath + '/js/libs/polyfill/').pluck('filename')
    require: ->     output = docpad.getFilesAtPath(docpad.config.rootPath + '/js/bundle/require/').pluck('filename')
    secondary: ->   output = docpad.getFilesAtPath(docpad.config.rootPath + '/js/bundle/secondary/').pluck('filename')
    defer: ->       output = docpad.getFilesAtPath(docpad.config.rootPath + '/js/bundle/defer/').pluck('filename')
  }
  
  plugins:{
    partials:{
       partialsPath:''
    }
    handlebars:{
      helpers:{
        partial:(content, options) -> output = @partial(content, options),
        isEnv:(context, options) -> output = if (context in @getEnvironment()) then options.fn(this) else options.inverse(this)
      }
    }    
  }
}
module.exports = docpadConfig
# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {
  environments: {
    debug:{
      srcPath:'html'
      documentsPaths: ['pages']
      outPath: '../build/debug/'
    },
    deploy:{
      srcPath:'html'
      documentsPaths: ['pages']
      outPath: '../build/deploy/'
    },
    docs:{
      srcPath:'html'
      documentsPaths: ['docs']
      outPath: '../docs/'
    }
    
  }
  templateData:{
    site:{
      title:'Sony Global'
    }
    gf:(path) -> output = '1'; console.log(docpad.database.findOne({id:path}) )
    
    
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
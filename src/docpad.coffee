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
            pretty: false
    },
    mbuilder:{
      srcPath:'html/'
      documentsPaths: ['generated']
      outPath: '../build/debug/'
      plugins:
        jade:
          jadeOptions:
            pretty: false
    },
    deploy:{
      srcPath:'html/'
      documentsPaths: ['pages','generated']
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
    plusify:(string) -> output = string.replace(/\[\+\]/g , '<i class="fonticon-30-plus"></i>');
    data:(path) ->      output = JSON.parse( require('fs').readFileSync(require('path').normalize(docpad.config.rootPath + '/html/data/' + path), 'utf8') );
    polyfills: ->       output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/libs/polyfill/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    polyfillsie7: ->    output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/libs/polyfill-lte-ie7/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    plugins: ->         output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/bundle/plugins/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    secondary: ->       output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/bundle/secondary/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    defer: ->           output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/js/bundle/defer/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    modulescss: ->      output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/css/scss/modules/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    modulepages: ->     output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/html/pages/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    doccopages: ->      output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/../docs/docco/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    generatedpages: ->  output = require('fs').readdirSync(require('path').normalize(docpad.config.rootPath + '/html/generated/')).join(' ').replace(/.svn|.git|.DS_Store|thumbs.db/g ,'').replace(/\s{2,}/g ,' ').trim().split(' ');
    title:(name,env) -> t = docpad.database.findOne({id:env+'/'+name}); output = if t then t.attributes.title else '';
    desc:(name,env) ->  d = docpad.database.findOne({id:env+'/'+name}); output = if d then d.attributes.description else '';
  }
  plugins:{
    partials:{
       partialsPath:'partials'
    }
  }
}
module.exports = docpadConfig
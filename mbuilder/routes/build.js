exports.generatePage = function(req, res) {

  var terminal = require( 'child_process' ).spawn( 'bash' );
  var config = require( '../config.js' );
  var moduleList = "";

  /* PATCH : test if the first element contains more than 1 character
   *         Correction for a bug when there is only one element, it
   *         is seen as a STRING.
   */
  if ( req.body['module'][0].length <= 1 ) {
    moduleLength = 1;

  } else {
    moduleLength = req.body['module'].length;
  }

  for ( var i = 0; i < moduleLength; i++ ) {

    var pageFileName, moduleFileName, moduleDataFileName, selectedTemplate;

    pageFileTitle = req.body['fileTitle'] || 'No Titled';
    pageFileDescriptiion = req.body['fileDescription'].replace( "\n", " " ) || 'No Description';
    pageFileName = req.body['fileName'].replace(/ +/g, '-') || 'unnamed';
    selectedTemplate = req.body['select-template'] || 'page-builder-normal-nav';

    if ( moduleLength == 1 ) {
      moduleFileName = req.body['module'] || null;
      moduleDataFileName = req.body['moduleData'] || null;
      moduleDataFileName = moduleDataFileName.split('/');
      moduleDataFileName = moduleDataFileName[1];
    } else {
      moduleFileName = req.body['module'][i] || null;
      moduleDataFileName = req.body['moduleData'][i] || null;
      moduleDataFileName = moduleDataFileName.split('/');
      moduleDataFileName = moduleDataFileName[1];
    }

    moduleList = moduleList + '\r          +partial("' + moduleFileName + '/html/' + moduleFileName + '.jade", "packages/modules/' + moduleFileName + '/demo/data/'+ moduleDataFileName + '")\r';
    //+partial("gallery-g2-g3/html/gallery-g2-g3.jade", "packages/modules/gallery-g2-g3/demo/data/default.json")
    
  };

  var f = pageFileName + "-pagebuild";
  console.log('selectedTemplate : ' + selectedTemplate + ' index : ' + selectedTemplate.indexOf( 'page-builder-no-nav' ));
  if ( selectedTemplate.indexOf( '-no-nav' ) != -1 ) {
    f = pageFileName + "-demo";
  }

  var t = pageFileTitle;
  var desc = pageFileDescriptiion;
  var p = '../src/packages/pages/' + f + ".html.jade";
  var d = String( fs.readFileSync( selectedTemplate + '.jade' ) );
  d = d.replace( /{{{{t}}}}/g, t );
  d = d.replace( /{{{{d}}}}/g, desc );
  d = d.replace( /{{{{b}}}}/g, moduleList );

  fs.writeFile( p, d, 'utf8', function(err) {
    if ( err ) {
      throw err;
    }

    console.log( 'Sending stdin to terminal' );
    terminal.stdin.write( 'cd ../src;  grunt pages' );
    terminal.stdin.end( );
  } )


  terminal.stdout.on( 'data', function(data) {
    console.log( 'stdout: ' + data );
  } );

  terminal.on( 'exit', function(code) {
    console.log( 'child process exited with code ' + code );
    if ( code == 0 ) {
      res.send( config.localbase + f + '.html' );
    } else {
      res.send( "false" );
    }

  } );

}
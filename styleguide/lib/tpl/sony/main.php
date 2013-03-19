<?php
/**
 * DokuWiki Default Template 2012
 *
 * @link     http://dokuwiki.org/template
 * @author   Anika Henke <anika@selfthinker.org>
 * @author   Clarence Lee <clarencedglee@gmail.com>
 * @license  GPL 2 (http://www.gnu.org/licenses/gpl.html)
 */

if (!defined('DOKU_INC')) die(); /* must be run from within DokuWiki */

$hasSidebar = page_findnearest($conf['sidebar']);
$showSidebar = $hasSidebar && ($ACT=='show');
?><!DOCTYPE html>

<!--[if lt IE 8 ]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en" dir="<?php echo $lang['direction'] ?>"> <!--<![endif]-->
<head>

  <meta charset="utf-8">
  <title><?php tpl_pagetitle() ?> [<?php echo strip_tags($conf['title']) ?>]</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="author" content="">




  <!-- FONTS --> 
    <!--[if lt IE 9]>
    <link rel="stylesheet" href="lib/tpl/sony/fonts/icons-eot.css">
    <![endif]-->

    <!--[if (gte IE 9)|!(IE)]><!-->
    <script type="text/javascript">
      // Android needs ttf icon-fonts, everybody else is good with woff.
      var fontIconType = navigator.userAgent.toLowerCase().match(/android|vita|playstation/g) !== null ? "ttf" : "woff";
      document.write(unescape("%3Clink rel='stylesheet' href='lib/tpl/sony/fonts/b64-icons-"+fontIconType+".css'%3E"));
    </script>
    <!--<![endif]-->

    <!-- FONTS.COM -->
    <script type="text/javascript" src="http://fast.fonts.com/jsapi/8fbb71aa-d686-4248-9f02-d25e0012fe0a.js"></script>

  <!-- END FONTS --> 




  <?php tpl_metaheaders() ?>
  <?php echo tpl_favicon(array('favicon', 'mobile')) ?>
  <?php tpl_includeFile('meta.html') ?>
</head>

<body>
  <div id="dokuwiki__site"><div id="dokuwiki__top" class="dokuwiki site mode_<?php echo $ACT ?> <?php echo ($showSidebar) ? 'showSidebar' : ''; ?> <?php echo ($hasSidebar) ? 'hasSidebar' : ''; ?>">

    <?php include('tpl_header.php') ?>

    <div class="wrapper group">

      <?php if($showSidebar): ?>
        <!-- ********** ASIDE ********** -->
        <div id="dokuwiki__aside"><div class="pad include group">
          <h3 class="toggle"><?php echo $lang['sidebar'] ?></h3>
          <div class="content">
            <?php tpl_flush() ?>
            <?php tpl_includeFile('sidebarheader.html') ?>
            <?php tpl_include_page($conf['sidebar'], 1, 1) ?>
            <?php tpl_includeFile('sidebarfooter.html') ?>
          </div>
        </div></div><!-- /aside -->
      <?php endif; ?>

      <!-- ********** CONTENT ********** -->
      <div id="dokuwiki__content"><div class="pad group">

        <div class="pageId"><span><?php echo hsc($ID) ?></span></div>

        <div class="page group">
          <?php tpl_flush() ?>
          <?php tpl_includeFile('pageheader.html') ?>
          <!-- wikipage start -->
          <?php tpl_content() ?>
          <!-- wikipage stop -->
          <?php tpl_includeFile('pagefooter.html') ?>
        </div>
        <?php if ($conf['useacl'] && $_SERVER['REMOTE_USER']): ?>
          <div class="docInfo"><?php tpl_pageinfo() ?></div>
        <?php endif; ?>

        <?php tpl_flush() ?>
      </div></div><!-- /content -->

      <hr class="a11y" />

      <!-- PAGE ACTIONS -->
      
      <?php if ($conf['useacl'] && $_SERVER['REMOTE_USER']): ?>   
        <div id="dokuwiki__pagetools">
          <h3 class="a11y"><?php echo $lang['page_tools']; ?></h3>
          <div class="tools">
            <ul>
              <?php
                tpl_action('edit',      1, 'li', 0, '<span>', '</span>');
                tpl_action('revert',    1, 'li', 0, '<span>', '</span>');
                tpl_action('revisions', 1, 'li', 0, '<span>', '</span>');
                tpl_action('backlink',  1, 'li', 0, '<span>', '</span>');
                tpl_action('subscribe', 1, 'li', 0, '<span>', '</span>');
                tpl_action('top',       1, 'li', 0, '<span>', '</span>');
              ?>
            </ul>
          </div>
        </div>

      <?php endif ?>

    </div><!-- /wrapper -->

    <?php include('tpl_footer.php') ?>
  </div></div><!-- /site -->

  <div class="no"><?php tpl_indexerWebBug() /* provide DokuWiki housekeeping, required in all templates */ ?></div>
  <div id="screen__mode" class="no"></div><?php /* helper to detect CSS media query in script.js */ ?>
  <!--[if ( lte IE 7 | IE 8 ) ]></div><![endif]-->
</body>
</html>

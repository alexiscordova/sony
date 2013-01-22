<!DOCTYPE html>
<!--[if lt IE8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs-head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs-nav.html'}}

			<!--==================================================
			 Subhead
			================================================== -->
			<header class="jumbotron subhead" id="overview">
			  <div class="container">
			    <h1>Base CSS</h1>
			    <p class="p1">Fundamental HTML element styles</p>
			  </div>
			</header>
			  <div class="container">
			    <div class="grid">
			      <div class="span9">
			        <section id="typography">
			
			          {{! Headings }}
			          <div class="bs-docs-example bs-docs-example-headings">
				            
			            <div class="big-bottom-margin">
			              <div>
			                <p class="title-docs">SST-Roman</p>
			                <h5 class="SST-Roman">The quick brown fox jumps over the lazy dog</h5>
			              </div>
			              <div>
			                <p class="title-docs">SST-Roman-Italic</p>
			                <h5 class="SST-Italic">The quick brown fox jumps over the lazy dog</h5>
			              </div>

			              <div>
			                <p class="title-docs">SST-Light</p>
			                <h5 class="SST-Light">The quick brown fox jumps over the lazy dog</h5>
			              </div>
			              <div>
			                <p class="title-docs">SST-Light-Italic</p>
			                <h5 class="SST-Light-Italic">The quick brown fox jumps over the lazy dog</h5>
			              </div>

			              <div>
			                <p class="title-docs">SST-Medium</p>
			                <h5 class="SST-Medium">The quick brown fox jumps over the lazy dog</h5>
			              </div>				            
			              <div>
			                <p class="title-docs">SST-Medium-Italic</p>
			                <h5 class="SST-Medium-Italic">The quick brown fox jumps over the lazy dog</h5>
			              </div>

			              <div>
			                <p class="title-docs">SST-Bold</p>
			                <h5 class="SST-Bold">The quick brown fox jumps over the lazy dog</h5>
			              </div>	
			              <div>
			                <p class="title-docs">SST-Bold-Italic</p>
			                <h5 class="SST-Bold-Italic">The quick brown fox jumps over the lazy dog</h5>
			              </div>	
			            </div>			   

			            
			            <!-- 
			            <div class="big-bottom-margin">
			              <div>
			                <p class="title-docs">SST-Roman-ttf</p>
			                <h5 class="SST-Roman-ttf">! # $ % &amp; ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ / ] ^ _ `
  a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ ¡ ¢ £ ¤ ¥ ¦ § ¨ © ª « ¬ ® ¯ ° ± ² ³ ´ µ ¶ · ¸ ¹ º » ¼ ½ ¾ ¿ À Á Â Ã Ä Å Æ Ç 
  È É Ê Ë Ì Í Î Ï Ð Ñ Ò Ó Ô Õ Ö × Ø Ù Ú Û Ü Ý
  Þ ß à á â ã ä å æ ç è é ê ë ì í î ï ð ñ ò ó ô õ ö ÷ ø ù ú û ü ý þ ÿ Ā ā Ă ă Ą ą Ć ć Ĉ ĉ Ċ ċ Č č Ď ď Đ đ Ē ē Ĕ ĕ Ė ė Ę ę Ě ě Ĝ ĝ Ğ ğ Ġ ġ
  Ģ ģ Ĥ ĥ Ħ ħ Ĩ ĩ Ī ī Ĭ ĭ Į į İ ı Ĳ ĳ Ĵ ĵ Ķ ķ ĸ Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł Ń ń Ņ ņ Ň ň ŉ Ŋ ŋ Ō ō Ŏ ŏ Ő ő Œ œ Ŕ ŕ Ŗ ŗ Ř ř Ś ś Ŝ ŝ Ş ş Š š Ţ ţ Ť ť
  Ŧ ŧ Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ų ų Ŵ ŵ Ŷ ŷ Ÿ Ź ź Ż ż Ž ž ƒ Ș ș Ț ț ȷ ˆ ˇ ˉ ˘ ˙ ˚ ˛ ˜ ˝ Δ Ω μ π Ẁ ẁ Ẃ ẃ Ẅ ẅ Ỳ ỳ – — ‘ ’ ‚ “ ” „ † ‡ • … ‰ ‹ › ⁄
  ⁰ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ € ℅  ™ Ω ℮ ∂ ∆ ∏ ∑ − ∕ ∙ √ ∞ ∫ ≈ ≠ ≤ ≥ ◊    ﬀ ﬁ ﬂ ﬃ ﬄ  </h5>
			              </div>
			              <div>
			                <p class="title-docs">SST-Roman-otf</p>
			                <h5 class="SST-Roman-otf">! # $ % &amp; ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ / ] ^ _ `
  a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ ¡ ¢ £ ¤ ¥ ¦ § ¨ © ª « ¬ ® ¯ ° ± ² ³ ´ µ ¶ · ¸ ¹ º » ¼ ½ ¾ ¿ À Á Â Ã Ä Å Æ Ç 
  È É Ê Ë Ì Í Î Ï Ð Ñ Ò Ó Ô Õ Ö × Ø Ù Ú Û Ü Ý
  Þ ß à á â ã ä å æ ç è é ê ë ì í î ï ð ñ ò ó ô õ ö ÷ ø ù ú û ü ý þ ÿ Ā ā Ă ă Ą ą Ć ć Ĉ ĉ Ċ ċ Č č Ď ď Đ đ Ē ē Ĕ ĕ Ė ė Ę ę Ě ě Ĝ ĝ Ğ ğ Ġ ġ
  Ģ ģ Ĥ ĥ Ħ ħ Ĩ ĩ Ī ī Ĭ ĭ Į į İ ı Ĳ ĳ Ĵ ĵ Ķ ķ ĸ Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł Ń ń Ņ ņ Ň ň ŉ Ŋ ŋ Ō ō Ŏ ŏ Ő ő Œ œ Ŕ ŕ Ŗ ŗ Ř ř Ś ś Ŝ ŝ Ş ş Š š Ţ ţ Ť ť
  Ŧ ŧ Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ų ų Ŵ ŵ Ŷ ŷ Ÿ Ź ź Ż ż Ž ž ƒ Ș ș Ț ț ȷ ˆ ˇ ˉ ˘ ˙ ˚ ˛ ˜ ˝ Δ Ω μ π Ẁ ẁ Ẃ ẃ Ẅ ẅ Ỳ ỳ – — ‘ ’ ‚ “ ” „ † ‡ • … ‰ ‹ › ⁄
  ⁰ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ € ℅  ™ Ω ℮ ∂ ∆ ∏ ∑ − ∕ ∙ √ ∞ ∫ ≈ ≠ ≤ ≥ ◊    ﬀ ﬁ ﬂ ﬃ ﬄ  </h5>
			              </div>
			              <div>
			                <p class="title-docs">SST-Roman-woff</p>
			                <h5 class="SST-Roman-woff">! # $ % &amp; ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ / ] ^ _ `
  a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ ¡ ¢ £ ¤ ¥ ¦ § ¨ © ª « ¬ ® ¯ ° ± ² ³ ´ µ ¶ · ¸ ¹ º » ¼ ½ ¾ ¿ À Á Â Ã Ä Å Æ Ç 
  È É Ê Ë Ì Í Î Ï Ð Ñ Ò Ó Ô Õ Ö × Ø Ù Ú Û Ü Ý
  Þ ß à á â ã ä å æ ç è é ê ë ì í î ï ð ñ ò ó ô õ ö ÷ ø ù ú û ü ý þ ÿ Ā ā Ă ă Ą ą Ć ć Ĉ ĉ Ċ ċ Č č Ď ď Đ đ Ē ē Ĕ ĕ Ė ė Ę ę Ě ě Ĝ ĝ Ğ ğ Ġ ġ
  Ģ ģ Ĥ ĥ Ħ ħ Ĩ ĩ Ī ī Ĭ ĭ Į į İ ı Ĳ ĳ Ĵ ĵ Ķ ķ ĸ Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł Ń ń Ņ ņ Ň ň ŉ Ŋ ŋ Ō ō Ŏ ŏ Ő ő Œ œ Ŕ ŕ Ŗ ŗ Ř ř Ś ś Ŝ ŝ Ş ş Š š Ţ ţ Ť ť
  Ŧ ŧ Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ų ų Ŵ ŵ Ŷ ŷ Ÿ Ź ź Ż ż Ž ž ƒ Ș ș Ț ț ȷ ˆ ˇ ˉ ˘ ˙ ˚ ˛ ˜ ˝ Δ Ω μ π Ẁ ẁ Ẃ ẃ Ẅ ẅ Ỳ ỳ – — ‘ ’ ‚ “ ” „ † ‡ • … ‰ ‹ › ⁄
  ⁰ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ € ℅  ™ Ω ℮ ∂ ∆ ∏ ∑ − ∕ ∙ √ ∞ ∫ ≈ ≠ ≤ ≥ ◊    ﬀ ﬁ ﬂ ﬃ ﬄ  </h5>
			              </div>
			              <div>
			            </div>
			          --> 




			          </div>
							</section>
			      </div>
			    </div>
			  </div>
		{{partial 'includes/docs-foot.html'}}
	</body>
</html>

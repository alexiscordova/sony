/*global $, jQuery, brightcove*/
;(function($) {
    $.fn.activateBrightcove = function(options) {
        'use strict';
        
        this.addClass("video-inactive");

        return this.click(function(e) {
            e.preventDefault();
            var $targetPlaceholder, videoProp, activePlayer, videoIdMissing, imgMissingVideoID, autoStart, cssVideoPadding, containerClass;

            $(".video-container").each(function() {
                $(this).find(".vbc-container, .video-missing-poster").remove();
                $(this).find(".video-poster").removeClass("visuallyhidden");
            });

            $targetPlaceholder = this.getAttribute("data-target");
            $targetPlaceholder = document.getElementById($targetPlaceholder);

            /* Need to replace single quote by a double quote (single quote use because of Jade template)*/
            videoProp = $targetPlaceholder.getAttribute("data-media").replace(/'/g,'"');
            videoProp = $.parseJSON(videoProp || '{}');

            if (!videoProp.videoWidth || !videoProp.videoHeight) {
                $.extend(videoProp, {
                    "videoWidth" : "480",
                    "videoHeight" : "270"
                })
            };

            autoStart = (videoProp.autoStart) || true;
            imgMissingVideoID = (videoProp.imgMissingVideoID) ? videoProp.imgMissingVideoID : "img/modules/brightcovevideo/poster-missing-video.png";
            imgMissingVideoID = '<img src="' + imgMissingVideoID + '" class="video-poster video-missing-poster" alt="video unavailable" >';

            videoIdMissing = (!videoProp.videoID) ? true : false;

            containerClass = videoProp.containerClass || "";

            if (videoIdMissing !== true) {
                cssVideoPadding = (parseInt(videoProp.videoHeight, 10) / parseInt(videoProp.videoWidth, 10)) * 100 + "%";

                activePlayer =
                /* @formatter:off */
                                '<div class="vbc-container ' + containerClass + '" style="padding-bottom:' + cssVideoPadding + ';">' + 
                                '   <div class="videoWrapper">' +
                                '       <object id="myExperience' + videoProp.videoID + '" class="BrightcoveExperience">' +
                                '           <param name="includeAPI" value="true" />' +
                                '           <param name="htmlFallback" value="false" />' +
                                '           <param name="bgcolor" value="#000000" />' +
                                '           <param name="dynamicStreaming" value="true" />' +
                                '           <param name="width" value="' + videoProp.videoWidth + '" />' +
                                '           <param name="height" value="' + videoProp.videoHeight + '" />' +
                                '           <param name="playerID" value="' + videoProp.playerID + '" />' +
                                '           <param name="playerKey" value="' + videoProp.playerKey + '" />' +
                                '           <param name="templateLoadHandler" value="myTemplateLoaded" />' +
                                '           <param name="isVid" value="true" />' +
                                '           <param name="isUI" value="true" />' +
                                '           <param name="dynamicStreaming" value="true" />' +
                                '           <param name="autoStart" value="' + autoStart + '" />' +
                                '           <param name="includeAPI" value="true" />' +
                                '           <param name="@videoPlayer" value="ref:' + videoProp.videoID + '" />' +
                                '       </object>' +
                                '   </div>' +
                                '</div>';
                                /* @formatter:on */

                $($targetPlaceholder).find("img").before(activePlayer).addClass("visuallyhidden");
                brightcove.createExperiences();
            } else {
                $($targetPlaceholder).find("img").before(imgMissingVideoID).addClass("visuallyhidden");
            }

            $(this).toggleClass("video-active video-inactive");
        });
    };
})(jQuery);

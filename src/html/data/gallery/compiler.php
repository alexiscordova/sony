<?php

$INPUT = 'gets_compiled.json';
$OUTPUT = 'default.json';
$ARRAY_NAME = 'list';
$ARRAY_KEY = 'path';

// Pretty print some JSON 
function json_format($json) { 
    $tab = "  "; 
    $new_json = ""; 
    $indent_level = 0; 
    $in_string = false; 

    $json_obj = json_decode($json); 

    if($json_obj === false) 
        return false; 

    $json = json_encode($json_obj); 
    $len = strlen($json); 

    for($c = 0; $c < $len; $c++) 
    { 
        $char = $json[$c]; 
        switch($char) 
        { 
            case '{': 
            case '[': 
                if(!$in_string) 
                { 
                    $new_json .= $char . "\n" . str_repeat($tab, $indent_level+1); 
                    $indent_level++; 
                } 
                else 
                { 
                    $new_json .= $char; 
                } 
                break; 
            case '}': 
            case ']': 
                if(!$in_string) 
                { 
                    $indent_level--; 
                    $new_json .= "\n" . str_repeat($tab, $indent_level) . $char; 
                } 
                else 
                { 
                    $new_json .= $char; 
                } 
                break; 
            case ',': 
                if(!$in_string) 
                { 
                    $new_json .= ",\n" . str_repeat($tab, $indent_level); 
                } 
                else 
                { 
                    $new_json .= $char; 
                } 
                break; 
            case ':': 
                if(!$in_string) 
                { 
                    $new_json .= ": "; 
                } 
                else 
                { 
                    $new_json .= $char; 
                } 
                break; 
            case '"': 
                if($c > 0 && $json[$c-1] != '\\') 
                { 
                    $in_string = !$in_string; 
                } 
            default: 
                $new_json .= $char; 
                break;                    
        } 
    } 

    return $new_json; 
} 

if ( isset($_GET['go']) ) {
    echo 'working...<br/>';

    $json = json_decode( file_get_contents($INPUT) );

    foreach ($json as $dataKey => &$dataValue) {
        if ( is_array($dataValue) ) {
            // foreach ($dataValue as $galleryKey => $galleryValue) {
            //     // echo $galleryKey . ': ' . print_r($galleryValue, true) . '<br />';
            //     // if ( is_object($galleryValue) ) {
            //         foreach ($galleryValue as $itemKey => $itemValue) {
            //             // echo $itemKey . ':';
            //             // echo $itemValue . '<br>';
            //             if ( $itemKey === 'list' && is_array($itemValue) ) {
            //                 foreach ($itemValue as $galleryItemKey => $galleryItemValue) {
            //                     echo $galleryItemKey . ':';
            //                     echo '<pre>' . print_r($galleryItemValue, true) . '</pre>';
            //                     if ( $galleryItemKey === $ARRAY_KEY ) {
            //                         $itemJson = json_decode( file_get_contents($OUTPUT) );
            //                         echo '<pre>' . print_r($itemJson, true) . '</pre>';
            //                     }
            //                 }
            //             }
            //         }
            //     // }
            // }
        } else if ( is_object($dataValue) ) {
            foreach ($dataValue as $itemKey => &$itemValue) {
                if ( $itemKey === $ARRAY_NAME && is_array($itemValue) ) {
                    foreach ($itemValue as &$galleryItemValue) {
                        $new = null;
                        foreach ($galleryItemValue as $theKey => $theValue) {
                            if ( $theKey === $ARRAY_KEY ) {
                                $itemJson = json_decode( file_get_contents($theValue) );
                                $new = $itemJson;
                                break;
                            }
                        }
                        if ( !is_null($new) ) {
                            $galleryItemValue = $new;
                        }
                    }
                }
            }
        }
    }


    // echo '<pre style="background:#ccc;color:#222;font-family:Menlo;font-size:12px;">' . print_r($json, true) . '</pre>';
    $pretty = json_format( json_encode($json) );
    file_put_contents( $OUTPUT, $pretty );

    echo 'done.<br />';
}
?>

<form action="<?php $_SERVER['PHP_SELF']; ?>" method="get">
    <input type="submit" value="go" name="go" />
</form>
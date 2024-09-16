import React, { useEffect } from 'react';

function MultiplexGoogleAd() {
    useEffect(() => {
        // Load the Google AdSense script
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722537590677945";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);

        // Push the ad once the script is loaded
        script.onload = () => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        };

        return () => {
            document.body.removeChild(script); // Clean up the script when the component unmounts
        };
    }, []);

    return (
        <ins className="adsbygoogle"
            style={{ display: "block",width:"inherit",height:"200px" }}
            data-ad-client="ca-pub-5722537590677945"
            data-ad-slot="4156608792"
            data-matched-content-ui-type="image_stacked"
            data-matched-content-rows-num="1"
            data-matched-content-columns-num="2"
            data-ad-format="autorelaxed"
            data-full-width-responsive="true"></ins>
    );
}

export default MultiplexGoogleAd;

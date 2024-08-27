import React, { useEffect } from 'react';

function HorizontalGoogleAd() {
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
            style={{ display: "block" }}
            data-ad-client="ca-pub-5722537590677945"
            data-ad-slot="8806300248"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    );
}

export default HorizontalGoogleAd;

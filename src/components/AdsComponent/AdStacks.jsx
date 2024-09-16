import React, { useEffect } from 'react';

function StacksGoogleAd() {
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
        <ins class="adsbygoogle"
            style={{ display: "block" }}
            data-ad-format="fluid"
            data-ad-layout-key="-6o+eh+1e-3p+3p"
            data-ad-client="ca-pub-5722537590677945"
            data-ad-slot="3535143332"></ins>
    );
}

export default StacksGoogleAd;

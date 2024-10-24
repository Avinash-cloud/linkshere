"use client";

import { use } from 'react';
import CryptoJS from 'crypto-js';
import { useState, useEffect } from 'react';

export default function Page({ params }) {
    // Unwrap params with use() as required by the latest Next.js version
    const unwrappedParams = use(params);
    const [decryptedCode, setDecryptedCode] = useState('');

    const { product } = unwrappedParams;
    const urldata = decodeURIComponent(product);

    // Secret key used for encryption and decryption
    const secretKey = 'your-secret-key'; 

    useEffect(() => {
        if (urldata) {
            try {
                // Decrypt the code from the URL
                const bytes = CryptoJS.AES.decrypt(decodeURIComponent(urldata), secretKey);
                const originalCode = bytes.toString(CryptoJS.enc.Utf8);
                setDecryptedCode(originalCode);
            } catch (error) {
                console.error('Failed to decrypt:', error);
            }
        }
    }, [urldata]);

    return (
        <div>
            <h1>Product Price</h1>
            {decryptedCode ? (
                <p>The Price is: {5000-decryptedCode}</p>
            ) : (
                <p>he Price is: 5000</p>
            )}
        </div>
    );
}

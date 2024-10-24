
"use client"
import { useState } from 'react';
import CryptoJS from 'crypto-js';
export default function user() {

    const userData = {
        name: "John Doe",
        age: 30,
        email: "johndoe@example.com",
        member: true,
        code: 1234
    }

    

    const [loading, setLoading] = useState(false);
    const secretKey = 'your-secret-key'; // Use


    const handleCopyLink = async () => {
        setLoading(true);
        try {
            // Encrypt the userData.code using AES
            const encryptedCode = CryptoJS.AES.encrypt(userData.code.toString(), secretKey).toString();
            const linkToCopy = `http://localhost:3000/product/${encodeURIComponent(encryptedCode)}`; // Create the link

            // Check if the clipboard API is supported
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(linkToCopy); // Copy the encrypted link to clipboard
                alert("Encrypted link copied to clipboard!");
            } else {
                // Fallback if Clipboard API is not available
                alert("Clipboard API is not supported in your browser.");
            }
        } catch (error) {
            console.error('Failed to copy: ', error);
            alert("Failed to copy the link.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        setLoading(true);
        try {
            // Encrypt the userData.code using AES
            const encryptedCode = CryptoJS.AES.encrypt(userData.code.toString(), secretKey).toString();
            const linkToShare = `http://localhost:3000/product/${encodeURIComponent(encryptedCode)}`; // Create the link

            if (navigator.share) {
                // Use Web Share API if available
                await navigator.share({
                    title: 'Check out this product!',
                    text: 'Here’s a product you might like:',
                    url: linkToShare,
                });
                alert("Link shared successfully!");
            } else {
                // Fallback if Web Share API is not supported
                alert("Sharing is not supported on this device.");
            }
        } catch (error) {
            console.error('Failed to share: ', error);
            alert("Failed to share the link.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1>User Profile</h1>
            <p>Welcome, {userData.name}!</p>
            <p>Your age is {userData.age}.</p>
            <p>You are {userData.member ? "a member" : "not a member"}.</p>
            <div>
            {userData.member && (
                <div>
                    <button
                        className="bg-gray-500 p-2 text-white mr-2"
                        onClick={handleCopyLink}
                        disabled={loading} // Disable the button while processing
                    >
                        {loading ? 'Processing...' : 'Copy Link'}
                    </button>

                    <button
                        className="bg-blue-500 p-2 text-white"
                        onClick={handleShare}
                        disabled={loading} // Disable the button while processing
                    >
                        {loading ? 'Processing...' : 'Share'}
                    </button>
                </div>
            )}
        </div>


        </div>
    )
}
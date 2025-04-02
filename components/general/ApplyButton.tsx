"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Import from your UI library

export default function ApplyButton({ jobId }: { jobId: string }) {
    const [isApplying, setIsApplying] = useState(false);
    const [message, setMessage] = useState("");

    const handleApply = async () => {
        setIsApplying(true);
        setMessage("");

        const res = await fetch("/api/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
        });

        if (res.ok) {
            setMessage("Application submitted successfully!");
        } else {
            setMessage("Already Submitted");
        }

        setIsApplying(false);
    };

    return (
        <div className="mt-4">
            <Button 
                onClick={handleApply} 
                disabled={isApplying} 
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium transition"
            >
                {isApplying ? "Applying..." : "Apply Now"}
            </Button>
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
        </div>
    );
}

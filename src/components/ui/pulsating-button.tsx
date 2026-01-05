"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    pulseColor?: string;
    duration?: string;
}

export function PulsatingButton({
    className,
    children,
    pulseColor = "#dc2626",
    duration = "1.5s",
    ...props
}: PulsatingButtonProps) {
    return (
        <button
            className={cn(
                "relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-red-600 rounded-xl cursor-pointer",
                "hover:bg-red-700 transition-colors duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
            style={
                {
                    "--pulse-color": pulseColor,
                    "--duration": duration,
                } as React.CSSProperties
            }
            {...props}
        >
            <div className="relative z-10">{children}</div>
            <div className="absolute inset-0 rounded-xl animate-pulse-ring" />
        </button>
    );
}

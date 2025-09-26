"use client";
import "./piwo.css";
import { useEffect, useRef } from "react";

export default function Piwo({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<number>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const circles = Array.from(svg.querySelectorAll("g#bubbles circle"));
        const bubbles = circles.map((circle) => ({
            el: circle,
            startY: 270 - Math.random() * 0.15 * 30,
            // minY: 80 + Math.random() * 30,
            minY: 80,
            speed: 0.1 + Math.random() * 0.15,
            opacity: 0,
            fadeIn: true,
            delayCounter: 30, // Add this
            delayFrames: 60 + Math.floor(Math.random() * 60), // Random delay after fade-in
        }));

        function animateBubbles() {
            bubbles.forEach((bubble) => {
                let cy = parseFloat(bubble.el.getAttribute("cy") || "290");
                let opacity = bubble.opacity;

                if (bubble.fadeIn) {
                    opacity += 0.04; // Fade-in speed (transition time)
                    if (opacity >= 1) {
                        opacity = 1;
                        bubble.fadeIn = false;
                        bubble.delayCounter = 0; // Reset delay
                    }
                    bubble.el.setAttribute("opacity", opacity.toString());
                    bubble.opacity = opacity;
                } else if (bubble.delayCounter < bubble.delayFrames) {
                    bubble.delayCounter++;
                } else {
                    cy -= bubble.speed;
                    if (cy < bubble.minY) {
                        cy = bubble.startY;
                        bubble.opacity = 0;
                        bubble.fadeIn = true;
                        bubble.el.setAttribute("opacity", "0");
                        bubble.delayCounter = 0;
                        bubble.delayFrames =
                            15 + Math.floor(Math.random() * 20);
                    }
                    bubble.el.setAttribute("cy", cy.toString());
                }
            });
            animationRef.current = requestAnimationFrame(animateBubbles);
        }

        // Initialize all bubbles at bottom and invisible
        bubbles.forEach((bubble) => {
            bubble.el.setAttribute("cy", bubble.startY.toString());
            bubble.el.setAttribute("opacity", "0");
        });

        animateBubbles();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);
    return (
        <svg
            version="1.1"
            width={width}
            height={height}
            viewBox="-30 -2 304 304"
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            ref={svgRef}
        >
            {/* Inline styles or move to CSS file for better support */}
            <g id="glass">
                <defs>
                    <mask id="cutout-handle">
                        <rect
                            width="70"
                            x="180"
                            y="60"
                            height="150"
                            rx="20"
                            ry="20"
                            fill="white"
                        />
                        <rect
                            width="60"
                            x="180"
                            y="70"
                            height="130"
                            rx="10"
                            ry="10"
                            fill="black"
                        />
                        <rect
                            width="20"
                            x="180"
                            y="60"
                            height="150"
                            fill="black"
                        />
                    </mask>
                    <mask id="cutout-glass">
                        <rect
                            width="70"
                            x="180"
                            y="60"
                            height="150"
                            rx="20"
                            ry="20"
                            fill="white"
                        />
                        <rect
                            width="20"
                            x="180"
                            y="60"
                            height="150"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    className="shadow"
                    width="70"
                    x="180"
                    y="60"
                    height="150"
                    opacity="0.7"
                    fill="#fff"
                    rx="20"
                    ry="20"
                    mask="url(#cutout-handle)"
                />
                <rect
                    className="shadow"
                    width="70"
                    x="180"
                    y="60"
                    height="150"
                    rx="20"
                    ry="20"
                    fill="none"
                    stroke="black"
                    strokeWidth="4"
                    mask="url(#cutout-glass)"
                />
                <rect
                    className="shadow"
                    width="60"
                    x="180"
                    y="70"
                    height="130"
                    rx="10"
                    ry="10"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    mask="url(#cutout-glass)"
                />
                <rect
                    className="shadow"
                    width="200"
                    x="0"
                    y="0"
                    height="300"
                    opacity="0.7"
                    fill="#fff"
                    rx="15"
                    ry="20"
                />
                <rect
                    width="180"
                    height="290"
                    x="10"
                    y="1"
                    fill="#eeba00"
                    rx="10"
                    ry="15"
                />
                <rect
                    width="170"
                    height="290"
                    x="10"
                    y="1"
                    fill="#ffc800"
                    rx="10"
                    ry="15"
                />
                <rect
                    width="150"
                    height="290"
                    x="10"
                    y="1"
                    fill="#ffd22e"
                    rx="10"
                    ry="15"
                />
            </g>
            <g id="bubbles">
                <circle cx="130" cy="130" r="10" fill="#ffe586" />
                <circle cx="120" cy="190" r="15" fill="#ffe586" />
                <circle cx="70" cy="220" r="12" fill="#ffe586" />
                <circle cx="60" cy="160" r="14" fill="#ffe586" />
                <circle cx="90" cy="260" r="8" fill="#ffe586" />
                <circle cx="85" cy="100" r="9" fill="#ffe586" />
            </g>
            <rect width="180" height="80" x="10" y="1" fill="#dedede" />
            <rect width="170" height="80" x="10" y="1" fill="#eeeeee" />
            <rect
                width="150"
                height="80"
                x="10"
                y="1"
                fill="#ffffff"
                opacity="0.8"
            />
            <rect
                width="200"
                x="0"
                y="0"
                height="300"
                opacity="1"
                fill="none"
                rx="15"
                ry="20"
                stroke="black"
                strokeWidth="2"
            />
        </svg>
    );
}

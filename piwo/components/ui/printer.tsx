"use client";

import { PrinterIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { ComponentProps } from "react";
import { VariantProps } from "class-variance-authority";

interface PrintButtonProps {
    targetId: string;
    label?: string;
    widthIn?: number;
}

const PORTAL_ID = "print-portal";
const STYLE_ID = "print-portal-style";
const PAGE_STYLE_ID = "print-page-size-style";

function ensurePortal() {
    let portal = document.getElementById(PORTAL_ID);
    if (!portal) {
        portal = document.createElement("div");
        portal.id = PORTAL_ID;
        document.body.appendChild(portal);
    }

    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            #${PORTAL_ID} {
                display: none;
            }
            @media print {
                body > *:not(#${PORTAL_ID}) {
                    display: none !important;
                }
                #${PORTAL_ID} {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    return portal as HTMLElement;
}

function setSinglePageSize(portal: HTMLElement, widthIn: number) {
    let pageStyle = document.getElementById(
        PAGE_STYLE_ID,
    ) as HTMLStyleElement | null;
    if (!pageStyle) {
        pageStyle = document.createElement("style");
        pageStyle.id = PAGE_STYLE_ID;
        document.head.appendChild(pageStyle);
    }

    const widthPx = widthIn * 96;

    // Temporarily force the portal to actually render, off-screen,
    // so scrollHeight reflects real layout instead of 0 (display:none = no layout box).
    const prevCssText = portal.style.cssText;
    portal.style.cssText = `
        display: block;
        visibility: hidden;
        position: fixed;
        left: -99999px;
        top: 0;
        width: ${widthPx}px;
    `;

    // Force reflow before reading scrollHeight
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    portal.offsetHeight;

    const heightPx = portal.scrollHeight;
    const heightIn = heightPx / 96 + 0.5;

    // Restore so the print media query is back in control of display/visibility
    portal.style.cssText = prevCssText;

    pageStyle.textContent = `
        @media print {
            @page {
                size: ${widthIn + 0.4}in ${heightIn}in;
            }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
            }
            #${PORTAL_ID} {
                margin: 0.2in !important;
                width: ${widthIn}in !important;
            }
        }
    `;
}

export default function Printer({
    targetId,
    label = "PDF",
    widthIn = 8.5,
    className,
    variant = "outline",
    size = "icon",
    ...props
}: PrintButtonProps &
    ComponentProps<"button"> &
    VariantProps<typeof buttonVariants>) {
    const handlePrint = () => {
        const source = document.getElementById(targetId);
        if (!source) return;

        const portal = ensurePortal();

        const clone = source.cloneNode(true) as HTMLElement;
        clone.removeAttribute("id");
        portal.replaceChildren(clone);

        // measure the clone once it's actually in the DOM (portal is display:none
        // outside print, but scrollHeight still works since content isn't unmounted)
        requestAnimationFrame(() => {
            setSinglePageSize(portal, widthIn);
            window.print();
        });

        const cleanup = () => {
            portal.replaceChildren();
            window.removeEventListener("afterprint", cleanup);
        };
        window.addEventListener("afterprint", cleanup);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    onClick={handlePrint}
                    className={className}
                    variant={variant}
                    size={size}
                    {...props}
                >
                    <PrinterIcon />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

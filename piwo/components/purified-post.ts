import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const ALLOWED_CONTENT = {
    ALLOWED_TAGS: ["p", "h1", "h2", "h3", "ul", "ol", "li", "a", "img"],
    ALLOWED_ATTR: ["href", "src", "alt", "title"],
};
export function purifiedPost({
    content,
}: {
    content: string | undefined | null;
}) {
    if (!content) {
        return "";
    }
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window);
    const sanitizedContent = DOMPurify.sanitize(content, ALLOWED_CONTENT);
    return sanitizedContent;
}

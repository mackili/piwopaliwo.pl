import { TextDocument } from "./types";

export default function TextDocumentRenderer({
    textDocument,
    showAuthor = false,
    showTitle = false,
}: {
    textDocument: TextDocument;
    showAuthor?: boolean;
    showTitle?: boolean;
}) {
    return (
        <>
            {showTitle === true && <header>{textDocument?.title}</header>}
            {showAuthor === true && <h2>{textDocument.author}</h2>}
            {textDocument?.sections
                ?.sort((a, b) => a.order - b.order)
                .map((section, index) => (
                    <section.type
                        className={section.className || ""}
                        key={index}
                    >
                        {section.type !== "image"
                            ? section.data.text?.map((span, spanIndex) => (
                                  <span key={spanIndex}>{span.text}</span>
                              ))
                            : ""}
                    </section.type>
                ))}
        </>
    );
}

import { View, StyleSheet, ScrollView } from "react-native";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Table,
  TBody,
  TD,
  THead,
  TR,
  A,
  Strong,
  EM,
  Div,
  Code,
  UL,
  LI,
  BlockQuote,
  Pre,
  BR,
  HR,
} from "@expo/html-elements";

interface GrammarHtmlRenderProps {
  content: string;
  style?: any;
}

export function GrammarHtmlRender({ content, style }: GrammarHtmlRenderProps) {
  console.log("GrammarHtmlRender received content:", content);

  const parseHtml = (html: string) => {
    if (!html) {
      console.log("No content to parse");
      return null;
    }

    // Remove any whitespace at the start and end
    html = html.trim();
    console.log("Trimmed content:", html);

    const elements: JSX.Element[] = [];
    let remainingContent = html;

    // Parse content until no more elements are found
    while (remainingContent) {
      // Handle headings
      if (remainingContent.startsWith("<h2>")) {
        console.log("Found h2 element");
        const h2Match = remainingContent.match(/<h2>(.*?)<\/h2>/s);
        if (h2Match) {
          console.log("Found h2 content:", h2Match[1]);
          elements.push(
            <H2 key={`h2-${elements.length}`} style={styles.h2}>
              {h2Match[1].trim()}
            </H2>,
          );
          remainingContent = remainingContent.slice(h2Match[0].length).trim();
          continue;
        }
      }

      // Handle tables
      if (remainingContent.startsWith("<table>")) {
        console.log("Found table element");
        const tableMatch = remainingContent.match(/<table>(.*?)<\/table>/s);
        if (tableMatch) {
          const tableContent = tableMatch[1].trim();

          // Extract thead
          const theadMatch = tableContent.match(/<thead>(.*?)<\/thead>/s);
          const theadContent = theadMatch ? theadMatch[1].trim() : "";

          // Extract tbody
          const tbodyMatch = tableContent.match(/<tbody>(.*?)<\/tbody>/s);
          const tbodyContent = tbodyMatch ? tbodyMatch[1].trim() : "";

          // Parse rows
          const parseRows = (content: string) => {
            const rows = content.match(/<tr>(.*?)<\/tr>/gs) || [];
            return rows.map((row, rowIndex) => {
              const cells = row.match(/<td>(.*?)<\/td>/gs) || [];
              return (
                <TR key={`row-${rowIndex}`}>
                  {cells.map((cell, cellIndex) => {
                    const cellContent = cell.replace(/<\/?td>/g, "").trim();
                    return (
                      <TD
                        key={`cell-${rowIndex}-${cellIndex}`}
                        style={styles.td}
                      >
                        {cellContent}
                      </TD>
                    );
                  })}
                </TR>
              );
            });
          };

          elements.push(
            <Table key={`table-${elements.length}`} style={styles.table}>
              {theadContent && <THead>{parseRows(theadContent)}</THead>}
              {tbodyContent && <TBody>{parseRows(tbodyContent)}</TBody>}
            </Table>,
          );
          remainingContent = remainingContent
            .slice(tableMatch[0].length)
            .trim();
          continue;
        }
      }

      // If no special elements found at the start, treat as plain text
      const nextTagIndex = remainingContent.indexOf("<");
      if (nextTagIndex === -1) {
        // No more tags, render remaining content as text
        if (remainingContent.trim()) {
          elements.push(
            <P key={`text-${elements.length}`} style={styles.p}>
              {remainingContent.trim()}
            </P>,
          );
        }
        break;
      }

      // If there's text before the next tag, render it
      if (nextTagIndex > 0) {
        elements.push(
          <P key={`text-${elements.length}`} style={styles.p}>
            {remainingContent.slice(0, nextTagIndex).trim()}
          </P>,
        );
      }
      remainingContent = remainingContent.slice(nextTagIndex);
    }

    return elements;
  };

  const renderedContent = parseHtml(content);
  console.log("Rendered content:", renderedContent);

  if (!renderedContent) {
    console.log("No content to render");
    return null;
  }

  return <View style={styles.contentContainer}>{renderedContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  table: {
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  td: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 16,
  },
  ul: {
    marginBottom: 16,
    paddingLeft: 20,
  },
  li: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 8,
  },
  em: {
    fontStyle: "italic",
    color: "#666",
  },
  strong: {
    fontWeight: "bold",
  },
  code: {
    fontFamily: "monospace",
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 4,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#ddd",
    paddingLeft: 16,
    marginLeft: 0,
    marginBottom: 16,
    color: "#666",
  },
  pre: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  hr: {
    marginVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  div: {
    marginBottom: 16,
  },
});

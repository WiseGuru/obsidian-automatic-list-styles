import { Plugin, MarkdownPostProcessor } from "obsidian";

export default class AutoListStylesPlugin extends Plugin {
  async onload() {
    console.log("AutoListStylesPlugin loaded"); // Log when the plugin is loaded

    this.registerMarkdownPostProcessor((el, ctx) => {
      // Process each ordered list (<ol>) in the document
      el.querySelectorAll("ol").forEach((list) => {
        console.log("Processing ordered list: ", list); // Log the current ordered list being processed
        const firstText = getFirstTextNode(list.querySelector("li"));
        if (firstText && firstText.textContent) {
          const indentLevel = getIndentLevel(list);
          console.log("Indent level for ordered list: ", indentLevel); // Log the indent level for ordered list
          const listStyleType = getListStyleType(indentLevel);
          list.style.listStyleType = listStyleType;
          firstText.textContent = firstText.textContent.trim(); // Trim the first text node's content
        }
      });

      // Use a Set to keep track of processed unordered lists to avoid duplicates
      const processedLists = new Set<HTMLElement>();

      // Process each unordered list (<ul>) in the document
      const ulElements = el.querySelectorAll("ul");
      ulElements.forEach((list, index) => {
        if (processedLists.has(list)) return; // Skip already processed lists
        processedLists.add(list); // Mark this list as processed

        const indentLevel = getIndentLevel(list);
        const listStyleType = getUnorderedListStyleType(indentLevel);
        if (list.className.includes("has-list-bullet")) {
          list.className = list.className.replace("has-list-bullet", "").trim(); // Clean up class name if necessary
        }
        list.style.listStyleType = listStyleType; // Apply the calculated list style
      });
    });
  }
}

// Returns the first text node within a given node, or null if none is found
function getFirstTextNode(node: Node): ChildNode | null {
  console.log("getFirstTextNode called with node: ", node); // Log function call
  if (node == null) return null;

  for (let i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
      return node.childNodes[i];
    } else if (node.childNodes[i].hasChildNodes()) {
      const childText = getFirstTextNode(node.childNodes[i]);
      if (childText) return childText;
    }
  }
  return null;
}

// Calculates the indent level of a list by counting its parent OL/UL elements
function getIndentLevel(list: HTMLElement): number {
  let indentLevel = 0;
  let parent = list.parentElement;
  while (parent) {
    if (parent.tagName === "OL" || parent.tagName === "UL") {
      indentLevel++; // Increment indent level for each OL/UL parent
    }
    parent = parent.parentElement;
  }
  console.log("Calculated indent level for list: ", indentLevel); // Log the final calculated indent level
  return indentLevel;
}

// Determines the style of an ordered list based on its indent level
function getListStyleType(indentLevel: number): string {
  console.log("getListStyleType called with indentLevel: ", indentLevel); // Log function call
  const defaultStyles = [
    "decimal",
    "lower-alpha",
    "lower-roman",
    "upper-alpha",
    "upper-roman",
    "decimal-leading-zero"
  ];
  const defaultStyleIndex = indentLevel % defaultStyles.length;
  return defaultStyles[defaultStyleIndex]; // Return the style corresponding to the indent level
}

// Determines the style of an unordered list based on its indent level
function getUnorderedListStyleType(indentLevel: number): string {
  const unorderedListStyles = [
    "disc",
    "square",
    "circle"
  ];
  const styleIndex = indentLevel % unorderedListStyles.length;
  return unorderedListStyles[styleIndex]; // Return the style corresponding to the indent level
}
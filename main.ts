import { Plugin, MarkdownPostProcessor } from "obsidian";

export default class AutoListStylesPlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((el) => {
      el.querySelectorAll("ol").forEach((list) => {
        const firstLi = list.querySelector("li");
        if (firstLi) {  // Ensure firstLi is not null before proceeding
          const firstText = getFirstTextNode(firstLi);
          if (firstText && firstText.textContent) {
            const indentLevel = getIndentLevel(list);
            const listStyleType = getListStyleType(indentLevel);
            list.style.listStyleType = listStyleType;
            firstText.textContent = firstText.textContent.trim();
          }
        }
      });
    });
  }
}


// Retreive the first text node within a given DOM node.
function getFirstTextNode(node: Node): ChildNode | null {
  if (node == null)
    return null;

  for (let i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
      return node.childNodes[i];
    } else if (node.childNodes[i].hasChildNodes()) {
      const childText = getFirstTextNode(node.childNodes[i]);
      if (childText) {
        return childText;
      }
    }
  }
  return null;
}

// Determines the indent level of the current list by counting the number of ancestor 'ol' elements
function getIndentLevel(list: HTMLElement): number {
  let indentLevel = 0;
  let parent = list.parentElement;
  while (parent) {
    if (parent.tagName === "OL") {
      indentLevel++;
    }
    parent = parent.parentElement;
  }
  return indentLevel;
}

// iterate through the following list of styles, cycling back to the top after reaching the bottom.
// additional list styles can be found at https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type
function getListStyleType(indentLevel: number): string {
  const defaultStyles = [
    "decimal",
    "lower-alpha",
    "lower-roman",
    "upper-alpha",
    "upper-roman",
    "decimal-leading-zero",
    "disc",
    "circle",
    "square"
  ];
  const defaultStyleIndex = indentLevel % defaultStyles.length;
  return defaultStyles[defaultStyleIndex];
}


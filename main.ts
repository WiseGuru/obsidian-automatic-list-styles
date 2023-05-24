import { Plugin, MarkdownPostProcessor } from "obsidian";

export default class AutoListStylesPlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((el) => {
      el.querySelectorAll("ol").forEach((list) => {
        const firstText = getFirstTextNode(list.querySelector("li"));
        if (firstText && firstText.textContent) {
          const indentLevel = getIndentLevel(list);
          const listStyleType = getListStyleType(indentLevel);
          list.style.listStyleType = listStyleType;
          firstText.textContent = firstText.textContent.trim();
        }
      });
    });
  }
  
}
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

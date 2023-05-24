var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoListStylesPlugin
});
module.exports = __toCommonJS(main_exports);

var import_obsidian = require("obsidian");

var AutoListStylesPlugin = class extends import_obsidian.Plugin {
  onload() {
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
};

function getFirstTextNode(node) {
  if (node == null)
    return null;

  for (let i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].nodeType == Node.TEXT_NODE) {
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

function getIndentLevel(list) {
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

function getListStyleType(indentLevel) {
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

module.exports = AutoListStylesPlugin;

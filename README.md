# React Text Editor (v0.0.1)

A lightweight, customizable, line-based text editor for React — built completely from scratch without using `contentEditable`.  
Designed for developers who want full control over rendering, cursor behavior, and text operations.

## 🚀 Why This Editor?

- Pure HTML + React implementation  
- Custom rendering logic  
- Developer-controlled cursor management  
- Line-based architecture  
- Simple undo/redo system  
- Extendable for future code-editor capabilities  

## ✨ Current Features (v0.0.1)

- Line-by-line rendering  
- Custom decorator/highlighter for each line  
- Basic text updating  
- Exposed line APIs  
- Simple structure for building advanced editors  

## 📦 Installation

```sh
npm install react-text-editor
```

or:

```sh
yarn add react-text-editor
```

## 🧩 Basic Usage Example

```tsx
import React from "react";
import NewTextfeild from "react-text-editor";

export default function App() {
  return (
    <NewTextfeild
      initialData={["Hello world", "This is my editor"]}
      onchangeDecorator={(text, index, extra) => {
        return <span>{text}</span>;
      }}
    />
  );
}
```

## 🔧 API (v0.0.1)

### Props

| Prop | Type | Description |
|------|------|-------------|
| `initialData` | `string[]` | Initial lines |
| `onchangeDecorator` | `(text, index, extra) => ReactNode` | Line rendering hook |
| `ref` | Editor ref | Exposes editor methods |

### Methods

| Method | Description |
|--------|-------------|
| `getAllLines()` | Returns all text lines |
| `setLine(index, text)` | Set text of a line |
| `undo()` | Undo last action |
| `redo()` | Redo operation |
| `focusLine(index)` | Scroll to line |

## 🛣️ Roadmap

- Selection support  
- Advanced cursor control  
- Syntax highlighting presets  
- Theme system  
- Tabs & indentation  
- Copy/paste logic  
- Plugin support  
- Full editor builder  

## 🤝 Contributing

Open to contributions, suggestions, and improvements.

## 📄 License

MIT License.

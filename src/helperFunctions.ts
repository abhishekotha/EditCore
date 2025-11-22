import React from "react";
import * as Types from "./types";

export const findingCurserLocation = ({
    data,
    currentPosition,
    arraowDirection,
  }: {
    data: number[];
    currentPosition: number;
    arraowDirection: "ArrowDown" | "ArrowUp";
  }) => {
    let lineIndex = 0;
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      sum += data[i];
      if (currentPosition < sum) {
        lineIndex = i;
        break;
      }
    }

    if (arraowDirection === "ArrowUp") {
      if (lineIndex === 0) return -1;
      const prevLineLength = data[lineIndex - 1];
      const offsetInCurrentLine = currentPosition - (sum - data[lineIndex]);
      return Math.min(prevLineLength, offsetInCurrentLine + (sum - data[lineIndex - 1] - data[lineIndex]));
    }

    if (arraowDirection === "ArrowDown") {
      if (lineIndex >= data.length - 1) return -1;
      const nextLineLength = data[lineIndex + 1];
      const offsetInCurrentLine = currentPosition - (sum - data[lineIndex]);
      return Math.min(nextLineLength + sum, sum + offsetInCurrentLine);
    }

    return -1;
};

export const handleCharacterInput = ({ key, curserPoints, data }: Types.HandleCharacterInputParams): Types.OperationsReturnType => {
  const newPoints = { ...curserPoints };
  const updated = [...data];
  
  updated[newPoints.y] =
    updated[newPoints.y].slice(0, newPoints.x) +
    key +
    updated[newPoints.y].slice(newPoints.x);

  return {
    updatedData: updated,
    action: "INPUT",
    curserPoints: newPoints,
    endpoints : {
      y: newPoints.y,
      x: newPoints.x + key.length,
    },
    changedText : key
  };
};

export const handleEnter = ({data , curserPoints} : Types.HandleEnterInputParams) : Types.OperationsReturnType => {
  let newPoints = curserPoints;
  const updated = [...data];
  const firstHalf = updated[newPoints.y].slice(0, newPoints.x);
  const secoundHalf = updated[newPoints.y].slice(newPoints.x);
  updated[newPoints.y] = firstHalf;
  updated.splice(newPoints.y + 1, 0, secoundHalf);

  return {updatedData : updated ,  action : "ENTER" , curserPoints : newPoints, endpoints : { y: newPoints.y + 1, x: 0 } , changedText : "\n"};

};

export const handleBackspace = ({ data, curserPoints , removeLength = 1 }: Types.HandleBackSpaceInputParams): Types.OperationsReturnType => {
  let newPoints = curserPoints;
  const updated = [...data];
  let removedData = "";

  if (newPoints.x > 0) {
    removedData = updated[newPoints.y][newPoints.x - 1];
    updated[newPoints.y] =
      updated[newPoints.y].slice(0, newPoints.x - removeLength) +
      updated[newPoints.y].slice(newPoints.x);
    newPoints = { y: newPoints.y, x: Math.max(0, newPoints.x - removeLength) };
  } else if (newPoints.x === 0 && newPoints.y > 0) {
    const balanceString = updated[newPoints.y];
    const curserLength = updated[newPoints.y - 1].length;
    updated[newPoints.y - 1] = updated[newPoints.y - 1] + balanceString;
    updated.splice(newPoints.y, 1);
    newPoints = { y: newPoints.y - 1, x: curserLength };
    removedData = "\n";
  }

  return {
    action: "BACKSPACE",
    curserPoints: curserPoints,
    updatedData: updated,
    changedText : removedData,
    endpoints : newPoints
  };
};

export const handleRemoveText = ({ selection, divRef, data}: Types.HandleBackSpaceRemoveInputParams): Types.OperationsReturnType | null => {
  if (!divRef) return null;

  const range = selection.getRangeAt(0);
  const { startContainer, endContainer, startOffset, endOffset } = range;

  const children = Array.from(divRef.childNodes);
  const startLineIndex = children.findIndex((child) => child.contains(startContainer));
  const endLineIndex = children.findIndex((child) => child.contains(endContainer));
  if (startLineIndex === -1 || endLineIndex === -1) return null;

  const updatedData = [...data];

  let actualStartIndex = 0;
  let count = 0;
  children[startLineIndex].childNodes.forEach((item) => {
    if (item.contains(startContainer)) actualStartIndex = count + startOffset;
    count += item.textContent?.length || 0;
  });

  let actualEndIndex = 0;
  count = 0;
  children[endLineIndex].childNodes.forEach((item) => {
    if (item.contains(endContainer)) actualEndIndex = count + endOffset;
    count += item.textContent?.length || 0;
  });

  const removedText =
    startLineIndex === endLineIndex
      ? data[startLineIndex].slice(actualStartIndex, actualEndIndex)
      : data[startLineIndex].slice(actualStartIndex) +
        "\n" +
        data.slice(startLineIndex + 1, endLineIndex).join("\n") +
        (startLineIndex + 1 < endLineIndex ? "\n" : "") +
        data[endLineIndex].slice(0, actualEndIndex);


  updatedData[startLineIndex] =
    updatedData[startLineIndex].slice(0, actualStartIndex) +
    updatedData[endLineIndex].slice(actualEndIndex);

  if (endLineIndex > startLineIndex) {
    updatedData.splice(startLineIndex + 1, endLineIndex - startLineIndex);
  }

  selection.removeAllRanges();
  console.log(actualStartIndex , startLineIndex , "----" , actualEndIndex ,endLineIndex );

  return {
    updatedData,
    action: "REMOVE",
    curserPoints: { x: actualEndIndex , y: endLineIndex  },
    changedText : removedText,
    endpoints :  {x : actualStartIndex  , y : startLineIndex },
  };
};

export const handelTabOperation = ({ data , curserPoints } : Types.HandletabInputOperationParams) : Types.OperationsReturnType  =>{
    let newPoints = curserPoints;
    const tabSpaces = "    ";
    const updated = [...data];
    const currentLine = updated[newPoints.y];
    updated[newPoints.y] =
      currentLine.slice(0, newPoints.x) +
      tabSpaces +
      currentLine.slice(newPoints.x);

    return {action : 'TAB' , changedText : "    " ,curserPoints : curserPoints , endpoints :  {x: newPoints.x + tabSpaces.length, y: newPoints.y,} , updatedData : updated}

}

export const handleRemoveByCoordinates = ({ data, start, end }: Types.HandleRemoveByCoordinatesInputParams ): Types.OperationsReturnType  => {
  const updatedData = [...data];
  let removedData = "";

  if (start.y === end.y) {
    removedData = updatedData[start.y].slice(start.x, end.x);
    updatedData[start.y] =
      updatedData[start.y].slice(0, start.x) +
      updatedData[start.y].slice(end.x);
  } else {
    removedData = updatedData[start.y].slice(start.x) + "\n";
    for (let i = start.y + 1; i < end.y; i++) {
      removedData += updatedData[i] + "\n";
    }

    removedData += updatedData[end.y].slice(0, end.x);

    updatedData[start.y] =
      updatedData[start.y].slice(0, start.x) +
      updatedData[end.y].slice(end.x);

    updatedData.splice(start.y + 1, end.y - start.y);
  }

  return {
    updatedData,
    action: "REMOVE",
    curserPoints:  end,
    changedText : removedData,
    endpoints : { x: start.x, y: start.y } ,
  };
};

export const handlePasteText = ( { text , curserPoints , data } : Types.HandlePasteOperationParams ): Types.OperationsReturnType | null => {

  const list = text.split(/\r?\n/);
  const updated = [...data];
  const currentLine = updated[curserPoints.y];
  const beforeCursor = currentLine.slice(0, curserPoints.x);
  const afterCursor = currentLine.slice(curserPoints.x);

  const firstLine = beforeCursor + list[0];
  const lastLine = list[list.length - 1] + afterCursor;
  const middleLines = list.slice(1, -1);

  updated[curserPoints.y] = firstLine;
  if (list.length > 1) {
    updated.splice(curserPoints.y + 1, 0, ...middleLines, lastLine);
  } else {
    updated[curserPoints.y] = firstLine + afterCursor; 
  }

  const finalCursor = {
    x: list.length === 1 ? updated[curserPoints.y].length  : list[list.length - 1].length,
    y: curserPoints.y + list.length - 1
  };

  return {
    updatedData: updated,
    action: "PASTE",
    curserPoints: curserPoints,
    endpoints : finalCursor,
    changedText : text
  };
};

export const handleUndoAction = ({undoAction , data } : Types.HandleUndoActionparams) : Types.OperationsReturnType | null =>{

  const lastAction = undoAction;
  let result = null;
  if(lastAction.action === "INPUT"){
    result = handleBackspace({curserPoints : lastAction.endpoints , data });
  }
  else if(lastAction.action === "ENTER"){
    result = handleBackspace({curserPoints : lastAction.endpoints , data });
  }
  else if(lastAction.action === "BACKSPACE"){
    if(lastAction.inputData === "\n"){
      result = handleEnter({data : data , curserPoints : lastAction.endpoints});
    }
    else{
      result = handleCharacterInput({data : data , curserPoints : lastAction.endpoints , key : lastAction.inputData});
    }
  }
  else if(lastAction.action === "TAB"){
    result = handleBackspace({curserPoints : lastAction.endpoints , data , removeLength : 4});
  }
  else if(lastAction.action === "PASTE"){
    result = handleRemoveByCoordinates({data : data , start : lastAction.startPoints , end : lastAction.endpoints});
  }
  else if(lastAction.action === "REMOVE"){
    console.log("before",lastAction);
    result = handlePasteText({data : data , curserPoints : lastAction.endpoints , text : lastAction.inputData});
    console.log("after " , result);
  }


  return result;
}

export const handleRndoAction = ({redoAction , data } : Types.HandleRndoActionparams) : Types.OperationsReturnType | null =>{

  const lastAction = redoAction;
  let result = null;
  if(lastAction.action === "INPUT"){
    result = handleCharacterInput({curserPoints : lastAction.startPoints , data : data , key : lastAction.inputData});
  }
  else if(lastAction.action === "ENTER"){
    result = handleEnter({curserPoints : lastAction.startPoints , data});
  }
  else if(lastAction.action === "BACKSPACE"){
    result = handleBackspace({data , curserPoints : lastAction.startPoints});
  }
  else if(lastAction.action === "TAB"){
    result = handelTabOperation({data , curserPoints : lastAction.startPoints});
  }
  else if(lastAction.action === "PASTE"){
    result = handlePasteText({curserPoints : lastAction.endpoints , data : data , text : lastAction.inputData });
  }
  else if(lastAction.action === "REMOVE"){
    console.log("-----------",lastAction);
    result = handleRemoveByCoordinates({data : data , start : lastAction.endpoints , end : lastAction.startPoints});
    console.log(result);
  }

  return result;
}

export const setCursorInline = (
  divRef: React.RefObject<HTMLDivElement | null>,
  curserPoints: { x: number; y: number },
): void => {
  const div = divRef.current;
  if (!div) return;

  const selection = window.getSelection();
  const range = document.createRange();
  const lineElement = div.childNodes[curserPoints.y];
  if (!lineElement || lineElement.nodeType !== Node.ELEMENT_NODE) return;

  if (lineElement.childNodes.length === 0) {
    lineElement.appendChild(document.createTextNode(""));
  }

  let temp = 0;
  let textNode: ChildNode | null = null;
  let offset = 0;

  Array.from(lineElement.childNodes).some((item) => {
    const textLength = item.textContent?.length || 0;
    temp += textLength;
    if (temp >= curserPoints.x) {
      textNode = item.firstChild || item;
      offset = curserPoints.x - (temp - textLength);
      offset = Math.max(0, Math.min(offset, textNode.textContent?.length || 0));
      return true;
    }
    return false;
  });

  if (!textNode) {
    textNode = lineElement.firstChild;
    offset = Math.min(curserPoints.x, textNode?.textContent?.length || 0);
  }

  if (!textNode) return;

  range.setStart(textNode, offset);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
};

export const getSelectionCoordinates = ({divRef} : {divRef : HTMLDivElement | null}) => {
  const selection = window.getSelection();
  const div = divRef;

  if (selection && div) {
    const allDivChildren = Array.from(div.childNodes);
    const range = selection.getRangeAt(0);
    const parentNode = range.startContainer.parentNode;
    const index = allDivChildren.findIndex((child) => child.contains(parentNode));
    const allNodeChildren = allDivChildren[index].childNodes;

    let startPoint = 0;
    const startnode = range.startContainer;

    for (let i = 0; i < allNodeChildren.length; i++) {
      const temp = allNodeChildren[i];
      if (temp.contains(startnode)) {
        startPoint += range.startOffset;
        break;
      } else {
        startPoint += temp.textContent?.length || 0;
      }
    }

    return { x: startPoint, y: index };
  }

  return {x : 0 , y : 0};
}

import React, { useEffect, useMemo, useRef, useState , forwardRef , useImperativeHandle } from "react";
import {
  handleCharacterInput,
  handleEnter,
  handleBackspace,
  handleRemoveText,
  handelTabOperation,
  setCursorInline,
  handlePasteText,
  getSelectionCoordinates,
  OperationsReturnType,
  handleUndoAction,
  handleRndoAction
} from "./helperFunctions";
import NewTextfeildEachLine ,  { NewTextfeildEachLineRef }  from "./NewTextfeildEachLine";

interface NewTextfeildProps{
  renderLine : (value : string , index : number , decorValue : string) => React.ReactNode | null;
  onChange : (data : ActionReport)  => {updatedData : string[] , updatedPoints :  {x : number , y : number} ,   };
  otherData : string[];
}

export type undoActionsListprops = {
  action : "PASTE" | "REMOVE" | "INPUT" | "ENTER" | "BACKSPACE" | "TAB" | "NULL";
  startPoints: { x: number; y: number };
  endpoints : {x: number; y: number};
  inputData : string;
}

export interface ActionReport {
  action: "PASTE" | "REMOVE" | "INPUT" | "ENTER" | "BACKSPACE" | "TAB" | "NULL";
  startPoints: { x: number; y: number };
  endpoints : {x: number; y: number};
  data : string[];
  inputData : string;
}

export interface NewTextfeildRefProps{
  fetchData : () => string[];
}

const NewTextfeild = forwardRef<NewTextfeildRefProps , NewTextfeildProps>(({renderLine , onChange , otherData}, ref) => {
  const [data, setData] = useState<string[]>([""]);
  const divRef = useRef<HTMLDivElement>(null);
  const [curserPoints, setCurserPoints] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const curserClickCount = useRef(0);
  const curserClickCountTimeOutRef = useRef<NodeJS.Timeout | null>(null);
  const shiftStatus = useRef<boolean>(false);
  const references = useRef<Array<NewTextfeildEachLineRef>>([]);
  const undoActionsList = useRef<undoActionsListprops[]>([]);
  const redoActionList = useRef<undoActionsListprops[]>([]);

  useImperativeHandle(ref , () =>({
    fetchData : () =>{
      return data;
    }
  }))

  useEffect(() => {
    const currentRef = references.current[curserPoints.y];
    if (currentRef) {
      currentRef.setOtherdata(otherData[curserPoints.y]);
      currentRef.setLinedata(data[curserPoints.y]);
    }
    setTimeout(() =>{
      setCursorInline(divRef, curserPoints);
    }, 0);
  }, [data]);

  const lineRender = useMemo(() => {
    return (
      <>
        {data.map((item, index) => (
          <NewTextfeildEachLine
            key={index}
            onchange={renderLine}
            ref={el => {
              if (el) {
                references.current[index] = el;
              }
            }}
            initialData={item}
            index={index}
          />
        ))}
      </>
    );
  }, [data.length]);

  useEffect(() => {
    const handleMouseDown = () => {
      curserClickCount.current += 1;

      if (curserClickCountTimeOutRef.current) {
        clearTimeout(curserClickCountTimeOutRef.current);
      }

      curserClickCountTimeOutRef.current = setTimeout(() => {
        curserClickCount.current = 0;
      }, 500);
    };

    const handleMouseUp = (e : MouseEvent) => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const target = e.target as HTMLElement;
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const offset = range.startOffset;
        
        const div = divRef.current;
        if (!div) return;
        const allDivChildren = Array.from(div?.childNodes);
        const index = allDivChildren.findIndex((child) => child.contains(target));
        if(index === -1) return ;
        const allTargetDivChild = target.closest("p")?.childNodes;
        let position = 0;
        if(allTargetDivChild){
          for(let i = 0; i < allTargetDivChild.length ;i++ ){
            const currentNode = allTargetDivChild[i];
            if(currentNode.contains(node)){
              position = position + offset;
              break;
            }
            else{
              position = position + (currentNode.textContent?.length || 0);
            }
          }
        }
        if (curserClickCount.current === 1) {
          setCurserPoints({ x: position, y: Math.max(index , 0) });
        }

      }, 0);
    };

    const div = divRef.current;
    div?.addEventListener("mousedown", handleMouseDown);
    div?.addEventListener("mouseup", handleMouseUp);

    return () => {
      div?.removeEventListener("mousedown", handleMouseDown);
      div?.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleKeyDownEvent = (e: React.KeyboardEvent) => {

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      setCurserPoints({ x: -1, y: -1 });
      return;
    }

    e.preventDefault();
    const key = e.key;
    shiftStatus.current = e.shiftKey;
    let newPoints = curserPoints;
    if (newPoints.x === -1 || newPoints.y === -1) {
      newPoints = getSelectionCoordinates({ divRef: divRef.current });
    }

    const applyResult = (result?: OperationsReturnType | null , inputdata ?: string , notStoreUndo? : boolean) => {
      if (result) {
        let updatedData = result.updatedData;
        let updatedPoints = result.endpoints;
        if (onChange) {
          const override = onChange({
            action: result.action,
            data: updatedData,
            startPoints: newPoints,
            endpoints: updatedPoints,
            inputData : result.changedText
          });

          if (override) {
            updatedData = override.updatedData;
            updatedPoints = override.updatedPoints;
          }
        }
        if(!notStoreUndo){
          redoActionList.current = [];
          undoActionsList.current.push({action : result.action , endpoints : updatedPoints, inputData : inputdata || result.changedText || "" , startPoints : result.curserPoints});
        }
        setData(updatedData);
        if(result.action === "PASTE"){
          setTimeout(() =>{
            setCurserPoints(updatedPoints);
          },5);
        }
        else{
          setCurserPoints(updatedPoints);
        }
      }
    };

    if(e.ctrlKey && key === "z"){
      const actionData = undoActionsList.current.pop();
      if(actionData){
        applyResult(handleUndoAction({data : data , undoAction : actionData}) , actionData.inputData  , true);
        redoActionList.current.push(actionData);
      }
      return ;
    }
    if(e.ctrlKey && key === "y"){
      const actionData = redoActionList.current.pop();
      if(actionData){
        applyResult(handleRndoAction({data : data , redoAction : actionData}) , actionData.inputData , true);
        undoActionsList.current.push(actionData);
      }
      return ;
    }
    // Ctrl+A → select all
    if (e.ctrlKey && key === "a") {
      const selection = window.getSelection();
      const range = document.createRange();
      const div = divRef.current;
      if (!div) return;

      const children = Array.from(div.childNodes);
      if (children.length === 0) return;

      const firstChild = children[0];
      const lastChild = children[children.length - 1];

      const startNode = firstChild.firstChild || firstChild;
      const endNode = lastChild.lastChild || lastChild;

      range.setStart(startNode, 0);
      range.setEnd(endNode, endNode.textContent?.length || 0);

      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }
    // Ctrl+C → copy
    if (e.ctrlKey && key === "c") {
      const selection = window.getSelection();
      const selectedText = selection?.toString();
      if (selectedText) {
        const normalized = selectedText.replace(/\n\s*\n/g, "\n");
        navigator.clipboard.writeText(normalized);
      }
      return;
    }
    // Ctrl+V → paste
    if (e.ctrlKey && key === "v") {
      e.preventDefault();
      navigator.clipboard.readText()
        .then((text) => {
          const result = handlePasteText({
            text,
            curserPoints: newPoints,
            data,
          });
          console.log("paste result",result);
          applyResult(result , text);
        })
        .catch((err) => console.error("Failed to read clipboard:", err));
      return;
    }
    // Ctrl+X → cut
    if (e.ctrlKey && key === "x") {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        navigator.clipboard.writeText(selection.toString());
        const result = handleRemoveText({
          selection,
          divRef: divRef.current,
          data,
        });
        applyResult(result);
      }
      return;
    }

    // Normal keys
    if (key.length === 1) {
      applyResult(handleCharacterInput({ key, curserPoints: newPoints, data }) , key);
    } else if (key === "Enter") {
      applyResult(handleEnter({ data, curserPoints: newPoints }));
    } else if (key === "Backspace") {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        console.log("this is is the one ");
        applyResult(handleRemoveText({ selection, divRef: divRef.current, data }));
      } else {
        applyResult(handleBackspace({ data, curserPoints: newPoints }));
      }
    } else if (key === "Tab") {
      applyResult(handelTabOperation({ data, curserPoints }) , "    ");
    }
  };

  const handleKeyUpEvent = (e : React.KeyboardEvent) =>{
    shiftStatus.current = e.shiftKey;
  }

  return (
    <div>
      <div style={{ resize: 'both', overflow: 'hidden', border: '1px solid white', borderRadius: 10 }}>
        <div
          ref={divRef}
          contentEditable
          spellCheck={false}
          suppressContentEditableWarning
          style={{
            width: "100%",
            height: "100%",
            padding: 10,
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            color: "white",
            fontFamily: "Times New Roman",
            fontSize: "16px",
          }}
          className="temp"
          onKeyDown={handleKeyDownEvent}
          onKeyUp={handleKeyUpEvent}
        >
          {lineRender}
        </div>
      </div>
    </div>
  );
});

export default NewTextfeild;
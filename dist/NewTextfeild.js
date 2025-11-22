import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { handleCharacterInput, handleEnter, handleBackspace, handleRemoveText, handelTabOperation, setCursorInline, handlePasteText, getSelectionCoordinates, handleUndoAction, handleRndoAction } from "./helperFunctions";
import NewTextfeildEachLine from "./NewTextfeildEachLine";
const NewTextfeild = forwardRef(({ renderLine, onChange, otherData }, ref) => {
    const [data, setData] = useState([""]);
    const divRef = useRef(null);
    const [curserPoints, setCurserPoints] = useState({ x: 0, y: 0 });
    const curserClickCount = useRef(0);
    const curserClickCountTimeOutRef = useRef(null);
    const shiftStatus = useRef(false);
    const references = useRef([]);
    const undoActionsList = useRef([]);
    const redoActionList = useRef([]);
    useImperativeHandle(ref, () => ({
        fetchData: () => {
            return data;
        }
    }));
    useEffect(() => {
        const currentRef = references.current[curserPoints.y];
        if (currentRef) {
            currentRef.setOtherdata(otherData[curserPoints.y]);
            currentRef.setLinedata(data[curserPoints.y]);
        }
        setTimeout(() => {
            setCursorInline(divRef, curserPoints);
        }, 0);
    }, [data]);
    const lineRender = useMemo(() => {
        return (_jsx(_Fragment, { children: data.map((item, index) => (_jsx(NewTextfeildEachLine, { onchange: renderLine, ref: el => {
                    if (el) {
                        references.current[index] = el;
                    }
                }, initialData: item, index: index }, index))) }));
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
        const handleMouseUp = (e) => {
            setTimeout(() => {
                var _a, _b;
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0)
                    return;
                const target = e.target;
                const range = selection.getRangeAt(0);
                const node = range.startContainer;
                const offset = range.startOffset;
                const div = divRef.current;
                if (!div)
                    return;
                const allDivChildren = Array.from(div === null || div === void 0 ? void 0 : div.childNodes);
                const index = allDivChildren.findIndex((child) => child.contains(target));
                if (index === -1)
                    return;
                const allTargetDivChild = (_a = target.closest("p")) === null || _a === void 0 ? void 0 : _a.childNodes;
                let position = 0;
                if (allTargetDivChild) {
                    for (let i = 0; i < allTargetDivChild.length; i++) {
                        const currentNode = allTargetDivChild[i];
                        if (currentNode.contains(node)) {
                            position = position + offset;
                            break;
                        }
                        else {
                            position = position + (((_b = currentNode.textContent) === null || _b === void 0 ? void 0 : _b.length) || 0);
                        }
                    }
                }
                if (curserClickCount.current === 1) {
                    setCurserPoints({ x: position, y: Math.max(index, 0) });
                }
            }, 0);
        };
        const div = divRef.current;
        div === null || div === void 0 ? void 0 : div.addEventListener("mousedown", handleMouseDown);
        div === null || div === void 0 ? void 0 : div.addEventListener("mouseup", handleMouseUp);
        return () => {
            div === null || div === void 0 ? void 0 : div.removeEventListener("mousedown", handleMouseDown);
            div === null || div === void 0 ? void 0 : div.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    const handleKeyDownEvent = (e) => {
        var _a;
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
        const applyResult = (result, inputdata, notStoreUndo) => {
            if (result) {
                let updatedData = result.updatedData;
                let updatedPoints = result.endpoints;
                if (onChange) {
                    const override = onChange({
                        action: result.action,
                        data: updatedData,
                        startPoints: newPoints,
                        endpoints: updatedPoints,
                        inputData: result.changedText
                    });
                    if (override) {
                        updatedData = override.updatedData;
                        updatedPoints = override.updatedPoints;
                    }
                }
                if (!notStoreUndo) {
                    redoActionList.current = [];
                    undoActionsList.current.push({ action: result.action, endpoints: updatedPoints, inputData: inputdata || result.changedText || "", startPoints: result.curserPoints });
                }
                setData(updatedData);
                if (result.action === "PASTE") {
                    setTimeout(() => {
                        setCurserPoints(updatedPoints);
                    }, 5);
                }
                else {
                    setCurserPoints(updatedPoints);
                }
            }
        };
        if (e.ctrlKey && key === "z") {
            const actionData = undoActionsList.current.pop();
            if (actionData) {
                applyResult(handleUndoAction({ data: data, undoAction: actionData }), actionData.inputData, true);
                redoActionList.current.push(actionData);
            }
            return;
        }
        if (e.ctrlKey && key === "y") {
            const actionData = redoActionList.current.pop();
            if (actionData) {
                applyResult(handleRndoAction({ data: data, redoAction: actionData }), actionData.inputData, true);
                undoActionsList.current.push(actionData);
            }
            return;
        }
        // Ctrl+A → select all
        if (e.ctrlKey && key === "a") {
            const selection = window.getSelection();
            const range = document.createRange();
            const div = divRef.current;
            if (!div)
                return;
            const children = Array.from(div.childNodes);
            if (children.length === 0)
                return;
            const firstChild = children[0];
            const lastChild = children[children.length - 1];
            const startNode = firstChild.firstChild || firstChild;
            const endNode = lastChild.lastChild || lastChild;
            range.setStart(startNode, 0);
            range.setEnd(endNode, ((_a = endNode.textContent) === null || _a === void 0 ? void 0 : _a.length) || 0);
            selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
            selection === null || selection === void 0 ? void 0 : selection.addRange(range);
            return;
        }
        // Ctrl+C → copy
        if (e.ctrlKey && key === "c") {
            const selection = window.getSelection();
            const selectedText = selection === null || selection === void 0 ? void 0 : selection.toString();
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
                console.log("paste result", result);
                applyResult(result, text);
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
            applyResult(handleCharacterInput({ key, curserPoints: newPoints, data }), key);
        }
        else if (key === "Enter") {
            applyResult(handleEnter({ data, curserPoints: newPoints }));
        }
        else if (key === "Backspace") {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                console.log("this is is the one ");
                applyResult(handleRemoveText({ selection, divRef: divRef.current, data }));
            }
            else {
                applyResult(handleBackspace({ data, curserPoints: newPoints }));
            }
        }
        else if (key === "Tab") {
            applyResult(handelTabOperation({ data, curserPoints }), "    ");
        }
    };
    const handleKeyUpEvent = (e) => {
        shiftStatus.current = e.shiftKey;
    };
    return (_jsx("div", { children: _jsx("div", { style: { resize: 'both', overflow: 'hidden', border: '1px solid white', borderRadius: 10 }, children: _jsx("div", { ref: divRef, contentEditable: true, spellCheck: false, suppressContentEditableWarning: true, style: {
                    width: "100%",
                    height: "100%",
                    padding: 10,
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    color: "white",
                    fontFamily: "Times New Roman",
                    fontSize: "16px",
                }, className: "temp", onKeyDown: handleKeyDownEvent, onKeyUp: handleKeyUpEvent, children: lineRender }) }) }));
});
export default NewTextfeild;

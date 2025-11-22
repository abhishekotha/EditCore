import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import NewTextfeild from './NewTextfeild';
const TextAreaReact = () => {
    const buttons = { "bold": 1, "Italic": 2, "underline": 4 };
    const [decoraterValue, setDecoraterValue] = useState(0);
    const [decorations, setDecorations] = useState([""]);
    const textareaRef = useRef(null);
    useEffect(() => {
        console.log(decorations);
    }, [decorations]);
    const onChange = (data) => {
        const updated = [...decorations];
        const action = data.action;
        if (action === "INPUT" || action === "PASTE" || action === "TAB" || action === "ENTER") {
            let index = 0;
            let allInputData = data.inputData.split("\n");
            console.log(allInputData, data);
            for (let i = data.startPoints.y; i <= data.endpoints.y; i++) {
                if (i === data.startPoints.y) {
                    let length = allInputData[0].length;
                    updated[i] =
                        (updated[i] || "").slice(0, data.startPoints.x) +
                            String(decoraterValue).repeat(length) +
                            (updated[i] || "").slice(data.startPoints.x);
                }
                else if (i === data.endpoints.y && allInputData.length > 1) {
                    let length = allInputData.slice(-1)[0].length;
                    updated[i] =
                        String(decoraterValue).repeat(length) + (updated[i] || "");
                }
                else {
                    updated[i] = String(decoraterValue).repeat(allInputData[index].length);
                }
                index = index + 1;
            }
        }
        else if (action === "BACKSPACE" || action === "REMOVE") {
            let allInputData = data.inputData.split("\n");
            for (let i = data.startPoints.y; i <= data.endpoints.y; i++) {
                if (i === data.endpoints.y) {
                    updated[i] = (updated[i] || "").slice(0, data.endpoints.x) + (updated[i] || "").slice(data.endpoints.x + allInputData[0].length);
                }
                else if (i === data.startPoints.y && allInputData.length > 1) {
                    updated[i] = (updated[i] || "").slice(data.startPoints.x + allInputData.slice(-1)[0].length);
                }
                else {
                    updated.splice(i, 1);
                }
            }
        }
        setDecorations(updated);
        return { updatedData: data.data, updatedPoints: data.endpoints };
    };
    const renderLine = (item, index, decorValue) => {
        const output = [];
        let i = 0;
        const array = (decorValue === null || decorValue === void 0 ? void 0 : decorValue.split("").map(Number)) || [];
        while (i < item.length) {
            const styleValue = array[i] || 0;
            let j = i;
            while (j < item.length && array[j] === styleValue) {
                j++;
            }
            const segment = item.slice(i, j);
            if (styleValue === 0) {
                output.push(_jsx(React.Fragment, { children: segment }, i));
            }
            else {
                const classList = [];
                if ((styleValue & 1) !== 0)
                    classList.push("bold");
                if ((styleValue & 2) !== 0)
                    classList.push("italic");
                if ((styleValue & 4) !== 0)
                    classList.push("underline");
                output.push(_jsx("span", { className: classList.join(" "), children: segment }, i));
            }
            i = j;
        }
        return _jsx(_Fragment, { children: output });
    };
    return (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("h3", { style: { width: '90%', marginBottom: '10px' }, children: "Text Decorations" }), _jsx("br", {}), Object.entries(buttons).map(([label, value]) => {
                        const isActive = (decoraterValue & value) !== 0;
                        return (_jsx("button", { style: {
                                backgroundColor: isActive ? '#4caf50' : '#fff',
                                color: isActive ? '#fff' : '#333',
                                border: '1px solid #ccc',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }, onClick: () => setDecoraterValue(prev => prev ^ value), children: label }, label));
                    })] }), _jsx("br", {}), _jsx(NewTextfeild, { ref: textareaRef, renderLine: renderLine, onChange: onChange, otherData: decorations }), ";"] }));
};
export default TextAreaReact;

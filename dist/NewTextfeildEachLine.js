import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef, useState, useEffect, } from "react";
const NewTextfeildEachLine = forwardRef(({ index, initialData, onchange }, ref) => {
    const pRef = useRef(null);
    const [data, setData] = useState(initialData);
    const [otherData, setOtherData] = useState("");
    useEffect(() => {
        setData(initialData);
    }, [initialData]);
    useImperativeHandle(ref, () => ({
        setLinedata: (item) => {
            setData(item);
        },
        focus: () => {
            var _a;
            (_a = pRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "center" });
        },
        refVal: () => {
            return pRef.current;
        },
        setOtherdata: (item) => {
            setOtherData(item);
        }
    }));
    const highlighter = (text) => {
        if (onchange) {
            return onchange(text, index, otherData);
        }
        return _jsx(_Fragment, { children: text || "" });
    };
    return (_jsx("p", { ref: pRef, style: {
            minHeight: 20,
            width: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
        }, children: highlighter(data) }));
});
export default NewTextfeildEachLine;

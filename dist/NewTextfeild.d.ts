import React from "react";
interface NewTextfeildProps {
    renderLine: (value: string, index: number, decorValue: string) => React.ReactNode | null;
    onChange: (data: ActionReport) => {
        updatedData: string[];
        updatedPoints: {
            x: number;
            y: number;
        };
    };
    otherData: string[];
}
export type undoActionsListprops = {
    action: "PASTE" | "REMOVE" | "INPUT" | "ENTER" | "BACKSPACE" | "TAB" | "NULL";
    startPoints: {
        x: number;
        y: number;
    };
    endpoints: {
        x: number;
        y: number;
    };
    inputData: string;
};
export interface ActionReport {
    action: "PASTE" | "REMOVE" | "INPUT" | "ENTER" | "BACKSPACE" | "TAB" | "NULL";
    startPoints: {
        x: number;
        y: number;
    };
    endpoints: {
        x: number;
        y: number;
    };
    data: string[];
    inputData: string;
}
export interface NewTextfeildRefProps {
    fetchData: () => string[];
}
declare const NewTextfeild: React.ForwardRefExoticComponent<NewTextfeildProps & React.RefAttributes<NewTextfeildRefProps>>;
export default NewTextfeild;
//# sourceMappingURL=NewTextfeild.d.ts.map
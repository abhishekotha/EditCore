import React from "react";
type Props = {
    index: number;
    initialData: string;
    onchange: (data: string, index: number, decorValue: string) => React.ReactNode | null;
};
export type NewTextfeildEachLineRef = {
    setLinedata: (item: string) => void;
    focus: () => void;
    refVal: () => HTMLParagraphElement | null;
    setOtherdata: (item: string) => void;
};
declare const NewTextfeildEachLine: React.ForwardRefExoticComponent<Props & React.RefAttributes<NewTextfeildEachLineRef>>;
export default NewTextfeildEachLine;
//# sourceMappingURL=NewTextfeildEachLine.d.ts.map
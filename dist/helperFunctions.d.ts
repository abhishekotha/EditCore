import React from "react";
import * as Types from "./types";
export declare const findingCurserLocation: ({ data, currentPosition, arraowDirection, }: {
    data: number[];
    currentPosition: number;
    arraowDirection: "ArrowDown" | "ArrowUp";
}) => number;
export declare const handleCharacterInput: ({ key, curserPoints, data }: Types.HandleCharacterInputParams) => Types.OperationsReturnType;
export declare const handleEnter: ({ data, curserPoints }: Types.HandleEnterInputParams) => Types.OperationsReturnType;
export declare const handleBackspace: ({ data, curserPoints, removeLength }: Types.HandleBackSpaceInputParams) => Types.OperationsReturnType;
export declare const handleRemoveText: ({ selection, divRef, data }: Types.HandleBackSpaceRemoveInputParams) => Types.OperationsReturnType | null;
export declare const handelTabOperation: ({ data, curserPoints }: Types.HandletabInputOperationParams) => Types.OperationsReturnType;
export declare const handleRemoveByCoordinates: ({ data, start, end }: Types.HandleRemoveByCoordinatesInputParams) => Types.OperationsReturnType;
export declare const handlePasteText: ({ text, curserPoints, data }: Types.HandlePasteOperationParams) => Types.OperationsReturnType | null;
export declare const handleUndoAction: ({ undoAction, data }: Types.HandleUndoActionparams) => Types.OperationsReturnType | null;
export declare const handleRndoAction: ({ redoAction, data }: Types.HandleRndoActionparams) => Types.OperationsReturnType | null;
export declare const setCursorInline: (divRef: React.RefObject<HTMLDivElement | null>, curserPoints: {
    x: number;
    y: number;
}) => void;
export declare const getSelectionCoordinates: ({ divRef }: {
    divRef: HTMLDivElement | null;
}) => {
    x: number;
    y: number;
};
//# sourceMappingURL=helperFunctions.d.ts.map
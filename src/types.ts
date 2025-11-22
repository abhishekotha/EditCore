import { undoActionsListprops } from "./NewTextfeild";

export type OperationsReturnType = {
  updatedData :  string[];
  action : "PASTE" | "REMOVE" | "INPUT" | "ENTER" | "BACKSPACE" | "TAB" | "NULL";
  curserPoints : {x : number , y : number};
  changedText : string;
  endpoints : {x : number , y : number};
}

type CursorPosition = {
  x: number;
  y: number;
};

export type HandleCharacterInputParams = {
  key: string;
  curserPoints: CursorPosition;
  data: string[];
};

export type HandleEnterInputParams = {
  data : string[];
  curserPoints : CursorPosition;
}

export type HandleBackSpaceInputParams = {
  data : string[];
  curserPoints : CursorPosition;
  removeLength? : number;
}

export type HandleBackSpaceRemoveInputParams = {
  selection: Selection;
  divRef: HTMLDivElement | null;
  data: string[];
}

export type HandletabInputOperationParams = {
  data : string[];
  curserPoints : CursorPosition;
}

export type HandlePasteOperationParams = {
  text: string;
  curserPoints: { x: number; y: number };
  data: string[];
}

export type HandleUndoActionparams = {
  undoAction :  undoActionsListprops;
  data : string[];
}

export type HandleRndoActionparams = {
  redoAction :  undoActionsListprops;
  data : string[];
}

export interface HandleRemoveByCoordinatesInputParams {
  data: string[];
  start: CursorPosition;
  end: CursorPosition;
}
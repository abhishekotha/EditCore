import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";

type Props = {
  index: number;
  initialData: string;
  onchange : (data : string , index : number , decorValue : string)  => React.ReactNode | null;
};

export type NewTextfeildEachLineRef = {
  setLinedata: (item: string) => void;
  focus: () => void;
  refVal: () => HTMLParagraphElement | null;
  setOtherdata : (item : string) => void;
};

const NewTextfeildEachLine = forwardRef<NewTextfeildEachLineRef, Props>(
  ({ index, initialData , onchange }, ref) => {
    const pRef = useRef<HTMLParagraphElement>(null);
    const [data, setData] = useState<string>(initialData);
    const [otherData , setOtherData] = useState<string>("");

    useEffect(() => {
      setData(initialData);
    }, [initialData]);

    useImperativeHandle(ref, () => ({
      setLinedata: (item: string) => {
        setData(item);
      },
      focus: () => {
        pRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      refVal: () => {
        return pRef.current;
      },
      setOtherdata : (item) =>{
        setOtherData(item);
      }
    }));

    const highlighter = (text: string) => {
      if(onchange){
        return onchange(text , index , otherData);
      }
      return <>{text || ""}</>;
    };

    return (
      <p
        ref={pRef}
        style={{
          minHeight: 20,
          width: "100%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {highlighter(data)}
      </p>
    );
  }
);

export default NewTextfeildEachLine;

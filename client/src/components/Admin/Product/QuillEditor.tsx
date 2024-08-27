"use client";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import React, {forwardRef, memo, RefObject, useEffect, useMemo, useRef} from "react";
import ReactQuill, {ReactQuillProps} from 'react-quill';

interface EditorProps {
    name: string;
    quillRef: any;
}

interface ReactQuillComponentProps {
    forwardedRef: RefObject<ReactQuill> & ReactQuillProps;
    placeholder: string;
    theme: string;
    formats: Array<string>;
    modules: object;
    style?: any;
}

//memo를 안하면 계속 re-rendering 함
const QuillEditor =  memo(({name,quillRef}: EditorProps) => {

    const modules =  {
        toolbar: [
            [{header: "1"}, {header: "2"}],
            ["bold", "italic", "underline"],
            [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
            [{color: []}, {background: []}],
            ["link"],
            ["clean"],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    };


    const formats = ["header", "bold", "italic", "underline", "list", "bullet", "indent", "background", "color", "link", "clean"];


    const ReactQuillComponent = dynamic(
        async () => {
            const {default: RQ} = await import('react-quill');

            const Component = ({forwardedRef, ...props}: ReactQuillComponentProps) => (
                <RQ ref={forwardedRef} {...props} />
            );

            Component.displayName = 'ReactQuillComponent';
            return Component;
        },
        {
            ssr: false,
            loading: () => <p>불러오는 중입니다.</p>,
        }
    );

    return (
        <ReactQuillComponent  forwardedRef={quillRef}  placeholder="내용을 입력해주세요." theme="snow" modules={modules} formats={formats}  />
    );

});

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;

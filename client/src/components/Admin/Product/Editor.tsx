"use client";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

interface EditorProps {
    name: string;
    value: string;
    onChange: any;
}

const Editor = ({name, value, onChange} : EditorProps) => {


    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            [{ color: [] }, { background: [] }],
            ["link"],
            ["clean"],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    };

    const formats = ["header", "bold", "italic", "underline", "list", "bullet", "indent", "background", "color", "link", "clean"];


    const QuillWrapper = dynamic(() => import('react-quill'), {
        ssr: false,
        loading: () => <p>불러오는 중입니다.</p>,
    })

    return <QuillWrapper value={value} onChange={onChange} theme={"snow"} modules={modules} formats={formats} />;


};
export default Editor
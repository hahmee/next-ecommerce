"use client";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const Editor = () => {
    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    }

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ]
    const QuillWrapper = dynamic(() => import('react-quill'), {
        ssr: false,
        loading: () => <p>불러오는 중입니다.</p>,
    })

    return <QuillWrapper modules={modules} formats={formats} theme="snow" placeholder={"설명을 입력해주세요."} id="descrption" />;

};
export default Editor
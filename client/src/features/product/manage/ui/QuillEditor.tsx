'use client';

import 'react-quill/dist/quill.snow.css';

import dynamic from 'next/dynamic';
import React, { RefObject } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';

interface EditorProps {
  quillRef: RefObject<ReactQuill>;
  originalData: string | undefined;
}

interface ReactQuillComponentProps {
  forwardedRef: RefObject<ReactQuill> & ReactQuillProps;
  placeholder: string;
  theme: string;
  formats: Array<string>;
  modules: object;
  style?: any;
  defaultValue: string;
}

// QuillEditor를 memo로 감싸서 리렌더링 방지
export const QuillEditor = React.memo(({ quillRef, originalData }: EditorProps) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'indent',
    'background',
    'color',
    'link',
    'clean',
  ];

  const ReactQuillComponent = dynamic(
    async () => {
      const { default: RQ } = await import('react-quill');

      const Component = ({ forwardedRef, ...props }: ReactQuillComponentProps) => {
        return <RQ ref={forwardedRef} {...props} data-testid="quill-editor" />;
      };

      Component.displayName = 'ReactQuillComponent';
      return Component;
    },
    {
      ssr: false,
      loading: () => <p>불러오는 중입니다.</p>,
    },
  );

  return (
    <ReactQuillComponent
      forwardedRef={quillRef}
      placeholder="내용을 입력해주세요."
      theme="snow"
      modules={modules}
      formats={formats}
      defaultValue={originalData || ''}
    />
  );
});

// Memo 적용 시 displayName 설정
QuillEditor.displayName = 'QuillEditor';


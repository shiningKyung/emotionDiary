import React, { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryItem = ({ 
    author, 
    content,
    created_date,
    emotion,
    id,
}) => {

    const {onRemove, onEdit} = useContext(DiaryDispatchContext)

    // 수정버튼 눌렀을때 상태 핸들링
    const [isEdit, setIsEdit] = useState(false);
    const toggleIsEdit = () => setIsEdit(!isEdit);

    // 수정폼 작성내용 핸들링
    const [localContent, setLocalContent] = useState(content);
    const localContentInput = useRef();

    const handleRemove = () => {
        if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
            onRemove(id);
        }
    };

    // 수정취소시 내용 초기화
    const handleQuitEdit = () => {
        setIsEdit(false);
        setLocalContent(content);
    };

    // 수정완료 버튼클릭시 이벤트처리 함수
    const handleEdit = () => {
        if (localContent.length < 5) {
            localContentInput.current.focus();
            return;
        }

        //onEdit(id, localContent);
        if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
            onEdit(id, localContent);
            toggleIsEdit();
        }
    };

    return (
        <div className="DiaryItem">
            <div className="info">
                <span>
                    제목 : {author} | 감정점수 : {emotion}
                </span>
                <br />
                <span className="date">
                    {new Date(created_date).toLocaleString()}
                </span>
            </div>
            <div className="content">
                {/* 수정클릭시 본문 */}
                {isEdit ? (
                        <>
                            <textarea
                                ref={localContentInput}
                                value={localContent}
                                onChange={(e) => setLocalContent(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            {content}
                        </>
                    )
                }
            </div>
            {/* 수정클릭시 버튼 */}
            {isEdit ? (
                    <>
                        <botton onClick={handleQuitEdit}>취소</botton>
                        <botton onClick={handleEdit}>완료</botton>
                    </>
                ) : (
                    <>
                        <botton onClick={handleRemove}>삭제</botton>
                        <botton onClick={toggleIsEdit}>수정</botton>
                    </>
                )
            }
        </div>
    );
};

export default React.memo(DiaryItem);
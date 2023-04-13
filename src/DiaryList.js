import DiaryItem from "./DiaryItem";

const DiaryList = ({ diaryList, onRemove, onEdit }) => {
    return (
        <div className="DiaryList">
            <h2>일기 리스트</h2>
            <h4>{diaryList.length}개의 일기가 있습니다.</h4>
            <div>
                {diaryList.map((it) => (
                    // <div key={it.id}>
                    //     <div>제목: {it.author}</div>
                    //     <div>본문: {it.content}</div>
                    //     <div>감정: {it.emotion}</div>
                    //     <div>작성시간(ms): {it.created_date}</div>
                    // </div>
                    <DiaryItem key={it.id} {...it} onRemove={onRemove} onEdit={onEdit} />
                ))}
            </div>
        </div>    
    );
}

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;
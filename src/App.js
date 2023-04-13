import { useEffect, useRef, useState, useMemo } from "react";
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

// https://jsonplaceholder.typicode.com/comments

function App() {
  // 일기목록 배열 State
  const [data, setData] = useState([]);
  // 일기 게시물아이디
  const dataId = useRef(0);

  // api 겟데이터
  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());
    console.log(res);

    const initData = res.slice(0,20).map((it) => {
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random() * 5)+1,
        created_date : new Date().getTime(),
        id : dataId.current++
      }
    })

    setData(initData);
  };

  // 마운트시점에 api 호출
  useEffect(() => {
    getData();
  },[])

  // setData함수를 포함한, 일기배열에 새로운 데이터를 추가해줄 함수
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };

  // setData함수를 포함한, 일기배열에 특정 아이템 제외할 함수
  const onRemove = (targetId) => {
    console.log(`${targetId}가 삭제되었습니다`);
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  // 이벤트받고 데이터를 내려보내줄
  // 본문수정 데이터 업데이트 함수
  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) => 
        it.id === targetId ? {...it, content: newContent} : it
      )
    );
  };

  // 데이터분석
  const getDiaryAnalysis = useMemo(() => {
    console.log("일기분석 시작");

    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {goodCount, badCount, goodRatio};
  }, [data.length]);

  const{goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체일기 : {data.length}</div>
      <div>기분좋은 일기 갯수 : {goodCount}</div>
      <div>기분나쁜 일기 갯수 : {badCount}</div>
      <div>기분좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
};

export default App;

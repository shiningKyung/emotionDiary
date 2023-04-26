import React, { useCallback, useEffect, useRef, useMemo, useReducer } from "react";
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      }
      return [newItem, ...state];
    }
    case 'REMOVE': {
      return state.filter((it)=>it.id !== action.targetId);
    }
    case 'EDIT': {
      return state.map((it) => 
        it.id === action.targetId? 
        {...it, content:action.newContent} : it
      );
    }
    default :
      return state;
  }
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const App = () => {
  const [data, dispatch] = useReducer(reducer, [])
  
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
    });

    dispatch({type:"INIT", data:initData})
  };

  // 마운트시점에 api 호출
  useEffect(() => {
    getData();
  },[])

  // setData함수를 포함한, 일기배열에 새로운 데이터를 추가해줄 함수
  const onCreate = useCallback(
    (author, content, emotion) => {
      dispatch({type:'CREATE', data:{author, content, emotion, id:dataId.current}})
      dataId.current += 1;
    },
    []
  );

  // setData함수를 포함한, 일기배열에 특정 아이템 제외할 함수
  const onRemove = useCallback((targetId) => {
    dispatch({type:"REMOVE", targetId})
  }, []);

  // 이벤트받고 데이터를 내려보내줄 본문수정 데이터 업데이트 함수
  const onEdit = useCallback((targetId, newContent) => {
    dispatch({type:"EDIT", targetId, newContent})
  }, []);

  const memoizedDisaptches = useMemo(() => {
    return {onCreate, onRemove, onEdit}
  },[])

  // 데이터분석
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {goodCount, badCount, goodRatio};
  }, [data.length]);

  const{goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDisaptches}>
        <div className="App">
          <DiaryEditor />
          <div>전체일기 : {data.length}</div>
          <div>기분좋은 일기 갯수 : {goodCount}</div>
          <div>기분나쁜 일기 갯수 : {badCount}</div>
          <div>기분좋은 일기 비율 : {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;

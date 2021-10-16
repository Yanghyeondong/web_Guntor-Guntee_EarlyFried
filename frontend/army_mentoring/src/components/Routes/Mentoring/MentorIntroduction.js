import React, { useState, useEffect } from 'react';
import { Link} from "react-router-dom";
import "./MentorIntroduction.scss";
import soldier from "../img/soldier.png";
import reactimg from "./react.png";
import tomcatimg from "./tomcat.png";
import Subnavbar from '../Subnavbar';
import axios from 'axios';

function MentorInfo() {
  // location.search
  const location = window.location.pathname.split('/');
  const id = location[3];
  // console.log(id);

  let [mentorInfo, setMentorInfo] = useState({});

// api 통신 안될 때 쓸 data
  const mentor =
  {
    username: "김00",
    nickname: "열혈 멘토",
    email: "guntor@email.com",
    profileimage: soldier,
    experience_point: 25,
    description : "한줄 소개"
  };

   useEffect(()=>{
      axios({
        method : 'GET',
        url : `https://guntor-guntee-data-server.herokuapp.com/user/${id}`,
        // headers : { Authorization : 'Token 905e125ab3ee40e3a74f6915c9dd3f540b987dc6'}
        // headers : { Authorization : 'Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'}
        headers : { Authorization : 'Token c6812396a7a62208735940a3b20386fd94535c54'}    
    })
    .then((res)=>{
        const Info = res.data;
        console.log('this is info!!');
        console.log(Info);
        setMentorInfo(Info);
    })
  },[]);

  return (
    <div className="MentorInfo" id="MentorInfos">
      <h2 className="OneLineIntro">{mentorInfo.description ? mentorInfo.description : mentor.description}</h2>
      <div className="MentorProfile">
        <b className="blank"></b>
        <div className="mentor-img">
          <img className="mentor-pic" src={ mentorInfo.profileimage ? mentorInfo.profileimage : soldier} alt="멘토사진"></img>
          <div className="username">{mentorInfo.username ? mentorInfo.username : mentor.username }</div>
        </div>
        <div className="updown"></div>
        <b className="blank"></b>
        <div className="Summary">
          <h3 className="CareerTitle">간단한 이력</h3>
          <ul ClassName="CareerList" type="none">
            <li>이력1</li>
            <li>이력2</li>
            <li>이력3</li>
          </ul>
        </div>
        <b className="blank"></b>
        <b className="blank"></b>
        <b className="blank"></b>
        <b className="blank"></b>
        <b className="blank"></b>
        
        <Link to={`/profile/${id}`}>
          <button className="GoMentorProf">멘토 프로필로 이동</button>
        </Link>
      </div>
    </div>
  );
}

function Project() {

  const location = window.location.pathname.split('/');
  const id = location[3];

  let [CardInfo, setCardInfo] = useState({
  });

  let [specCardList, setSpecCardList] = useState([]);

  const specCardInfo = () =>{ 
    axios({
    method : 'GET',
    url : CardInfo.portfolio[0],
    // headers : { Authorization : 'Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'}
    headers : { Authorization : 'Token c6812396a7a62208735940a3b20386fd94535c54'}
   })
    .then((res)=>{
    // const info={
    //   response.data.username,

    // };
    // setCardInfo(res.data);
    console.log('mentoringInfo!!!');
    console.log(res);
    setSpecCardList(res.data.specification_cards);
    console.log('mentoringInfo!!!');
    
    
    // id = res.data.id;
    // email = res.data.email;
    // console.log(id);
    // console.log(email);
    // console.log(description);
    // console.log('This is work!');
    })
  }

  useEffect(()=>{
    axios({
      method : 'GET',
      url : `https://guntor-guntee-data-server.herokuapp.com/user/${id}`,
      // headers : { Authorization : 'Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'}
      headers : { Authorization : 'Token c6812396a7a62208735940a3b20386fd94535c54'}
    })
    .then((res)=>{
      // const info={
      //   response.data.username,

      // };
      setCardInfo(res.data);
      console.log('this is CardInfo!!!');
      console.log(CardInfo);
      console.log(res);
      console.log('this is CardInfo!!!');
      
      
      // id = res.data.id;
      // email = res.data.email;
      // console.log(id);
      // console.log(email);
      // console.log(description);
      // console.log('This is work!');
    })

    if(CardInfo.portfolio){
        console.log('portfolio!!');
        return specCardInfo();
      }

  },[]);


  // if(CardInfo.portfolio && i){
  //   console.log('portfolio!!');
  //   return specCardInfo();
  // }

  console.log('thus');
  console.log(specCardList);
  console.log('thus');

  const project = [
    {
      id: 1,
      title: "React OpenSource Project",
      text: "저는 React 프로젝트에 참여해서 이런 걸 만들었습니다.",
      image: reactimg
    },
    {
      id: 2,
      title: "Tomcat OpenSource Project",
      text: "저는 Tomcat 프로젝트에 참여해서 이런 걸 만들었습니다.",
      image: tomcatimg
    }
  ];

  const projects = project.map((project) => (
    <div key={project.id} className="Card">
      <img src={project.image} alt={project.title} />
      <h2>{project.title}</h2>
      <div className="Cardtext">{project.text}</div>
    </div>
  ));

  const specification_cardLists = specCardList.map((specCardList) => (
    <div key = {specCardList[0]} className="Card">
      <img src={specCardList.image} alt={specCardList.title} />
      <h2>{specCardList.title}</h2>
      <div className="Cardtext">{specCardList.description}</div>
    </div>
  ));

  return (
    <div className="Project" id="Projects">
      <div className="CardList"> {specCardList ? specification_cardLists : projects}</div>
    </div>
  );
}

function Certificate() {
  const names = [
    { id: 1, text: "정보처리기사" },
    { id: 2, text: "리눅스마스터" },
    { id: 3, text: "etc" }
  ];

  const nameList = names.map((name) => <li key={name.id}>{name.text}</li>);


  return (
    <div className="Certificate" id="Certificates">
      <ul className="CertList">
        <b>자격증 목록</b>
        {nameList}
      </ul>
    </div>
  );
}

function MentoringInfo() {

  const location = window.location.pathname.split('/');
  const id = location[3];

  const mentorings = [
    {
      id: 1,
      title: "#1. 멘토링 제목",
      text:
        "저는 이런 멘토링 주제를 가지고 있고 이런식으로 과제를 던져주고 이런식으로 멘토링 할 예정입니다. 이런 능력을 기르고 싶은 분은 연락주세요"
    },
    {
      id: 2,
      title: "#2. 멘토링 제목",
      text:
        "저는 이런 멘토링 주제를 가지고 있고 이런식으로 과제를 던져주고 이런식으로 멘토링 할 예정입니다. 이런 능력을 기르고 싶은 분은 연락주세요"
    }
  ];

  let [mentoringInfo, setMentoringInfo] = useState({});
  let mentoringInfos = [];


  useEffect(()=>{
    axios({
      method : 'GET',
      url : `https://guntor-guntee-data-server.herokuapp.com/user/${id}`,
      // headers : { Authorization : 'Token 905e125ab3ee40e3a74f6915c9dd3f540b987dc6'}
      // headers : { Authorization : 'Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'}
      headers : { Authorization : 'Token c6812396a7a62208735940a3b20386fd94535c54'}    
  })
  .then((res)=>{
      const Info = res.data.opened_mentoring;
      setMentoringInfo(Info);
  })
  },[]);

// let mentoringInfos = [];

  for ( let i = 0; i < mentoringInfo.length; i++) {
    axios({
      method : 'GET',
      url : mentoringInfo[i],
      // headers : { Authorization : 'Token 905e125ab3ee40e3a74f6915c9dd3f540b987dc6'}
      // headers : { Authorization : 'Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'}
      headers : { Authorization : 'Token c6812396a7a62208735940a3b20386fd94535c54'}    
  })
    .then((res)=>{
      // const Info = res.data.opened_mentoring;
      console.log('this is mentroing info by by !!');
      console.log(res);
      // mentoringInfos[i].title = res.data.title;
      // mentoringInfos[i].thumbnail = res.data.thumbnail;
      // mentoringInfos[i].description = res.data.description;
      mentoringInfos.push({id: i,
        title: res.data.title, 
        thumbnail: res.data.thumbnail, 
        description: res.data.description
      });
    });
  }


  const mentoringLists = mentorings.map((mentoring) => (
    <div className="Mentoring" key={mentoring.id} id="Mentorings">
      <h4 className="MentoringTitle" key={mentoring.id}>
        {mentoring.title}
      </h4>
      <p className="MentoringText" key={mentoring.id}>
        {mentoring.text}
      </p>
    </div>
  ));

  const mentoringInfoLists = mentoringInfos.map((mentoringInfos) => (
    <div className="Mentoring" key={mentoringInfos.id} id="Mentoringinfor">
      <h4 className="MentoringTitle" key={mentoringInfos.id}>
        {mentoringInfos.title} 
      </h4>
      <p className="MentoringText" key={mentoringInfos.id} >
        {mentoringInfos.description}
      </p>
    </div>
  ));

  // console.log('this is mentoring!!!!!!!!!!!');
  // console.log('this is mentoring');
  // console.log(mentoringInfos);
  // console.log(mentoringInfoLists);
  // console.log('this is mentoring');
  // console.log('this is mentoring!!!!!!!!!!');


  // console.log(mentoringLists, '!!!!!!!!!!!!!!!!!!!!!!!');
  return <div className="MentoringInfo" id="MentoringInfos">
    {/*mentoringInfos ? mentoringInfoLists : */ mentoringLists}
    </div>;
}

function MentoringReview() {

//sample
  const reviews = [
    {
      id: "육군 일병 김00",
      title: "#1. 프로그래밍 멘토링 후기",
      text: "초보자도 쉽게 할 수 있습니다!"
    },
    {
      id: "해군 상병 이00",
      title: "#2. 운동 멘토링 후기",
      text: "지금까지 이런 멘토링은 없었다! 이것은 멘토링인가 PT인가."
    }
    // {
    //   id: "공군 병장 박00",
    //   title: "#3. 진로 멘토링 후기",
    //   text: "지금까지 이런 멘토링은 없었다! 이것은 멘토링인가 PT인가."
    // }
  ];

  const recievedReview = [
    {
    },

]

  const reviewList = reviews.map((review) => (
    <div className="Review" key={review.id}>
      <h4 className="ReviewTitle" key={review.id}>
        {review.title}
      </h4>
      <p className="ReviewText" key={review.id}>
        {review.text}
      </p>
      <div className="Id">-{review.id}-</div>
    </div>
  ));

  return <div className="ReviewInfo" id="MentoringReviews">{reviewList}</div>;
}


function MentorIntroduction() {

  const menu = 
    [
        {id:'MentorInfos', desc:'멘토소개'},
        {id:'Projects', desc:'보유 능력 카드'},
        {id:'Certificates', desc:'자격증'},
        {id:'MentoringInfos', desc:'멘토링소개'},
        {id:'MentoringReviews', desc: '멘토링 후기'}
    ];

    useEffect(()=>{
      window.scroll({
          top:0,
          left:0,
          behavior:'instant'
      })}, []
    );


  return (
    <div>
        <Subnavbar menu={menu}></Subnavbar>
        <div className="MentorIntro">
          <MentorInfo id="MentorInfos"/>
          <div className="Empty"></div>
          <Project id="Projects"/>
          <Certificate id="Certificates"/>
          <MentoringInfo id='MentoringInfos'/>
          <MentoringReview id=' MentoringReviews'/>
        </div>
    </div>
  );
}

export default MentorIntroduction;

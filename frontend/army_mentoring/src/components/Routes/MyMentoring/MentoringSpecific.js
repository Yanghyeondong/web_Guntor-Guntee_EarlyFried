import React, { useContext, useEffect, useState } from 'react';
import { _loadMentoring, _loadUser } from '../../../backend/profile';
import { UserContext } from '../../../context/Context';
import './MentoringSpecific.scss';
import { Link } from 'react-router-dom';
import { Input } from 'reactstrap';
import { _addAssignment, _deleteAssignment, _loadAssignment } from '../../../backend/mentoring';
import DatePicker from "react-datepicker";

function MentoringSpecificMento({match, history}){
    const mentoring_id = match.params.id;
    const [user, setUser] = useContext(UserContext);
    const [mentoring, setMentoring] = useState({
        title : '',
        tags : [],
        assignments : []
    });
    const [mentor, setMentor] = useState({});
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentContent, setAssignmentContent] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [endDate, setEndDate] = useState(new Date());
    const [editAssignmentTitle, setEditAssignmentTitle] = useState([]);
    const [editAssignmentContent, setEditAssignmentContent] = useState([]);
    const [editAssignmentDeadline, setEditAssignmentDeadline] = useState([]);
    
    const getId = (url)=>{
        const t = url.split('/');
        return t[4];
    }

    const getMentorId = ()=>{
        if(Object.keys(mentor).length == 0)
            return -1;
        return getId(mentor.url);
    }
    
    const getPortfolioId = ()=>{
        let url = mentoring.portfolio;
        if(url == undefined)
            return -1;
        return getId(url);
    }

    let isMe = false;

    useEffect(()=>{
        window.scroll({
            top:0,
            left:0,
            behavior:'instant'
        })}, []
    );

    useEffect(()=>{
        load();
    }, []);

    const load = ()=>{
        _loadMentoring(mentoring_id)
        .then(res=>{
            setMentoring(res.data);
            let mentor_id = getId(res.data.mentor);
            isMe = (mentor_id == getId(user.url)) ? true : false;
            const c = document.getElementById('add-assignment-container');
            c.className = isMe ? 'add-assignment-container' : 'add-assignment-container h';
            _loadUser(mentor_id)
            .then(res=>{
                setMentor(res.data);
            })
            .catch(err=>{
                console.log(err.response);
            })

            Promise.all(
                res.data.assignments.map((a)=>{
                    let aid = getId(a);
                    return _loadAssignment(aid)
                            .then(res=>{
                                return res.data
                            })
                            .catch(err=>{
                                console.log(err.response);
                            })
                })
            )
            .then(res=>{
                setAssignments(res);
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const showAddAssignment = ()=>{
        const a = document.getElementById('add-assignment');
        a.className = 'add-assignment';
    }

    const hideAddAssignment = ()=>{
        const a = document.getElementById('add-assignment');
        a.className = 'add-assignment h';
        const t = document.getElementById('assignment-title');
        const c = document.getElementById('assignment-content');
        t.value = '';
        c.value = '';
        setAssignmentTitle('');
        setAssignmentContent('');
    }

    const addAssignment = ()=>{
        _addAssignment(assignmentTitle, assignmentContent, mentoring_id, endDate)
        .then(res=>{
            load();
            hideAddAssignment();
        })
        .catch(err=>{
            console.log(err.response);
        })
    }

    const deleteAssignment = (assignment_id)=>{
        _deleteAssignment(assignmentTitle, assignmentContent, mentoring_id, endDate, assignment_id)
        .then(res=>{
            load();
            hideAddAssignment();
        })
        .catch(err=>{
            console.log(err.response);
        })
    }

    const showEditAssignment = (assignment_id)=>{
        const a = document.getElementById('edit-assignment'+assignment_id);
        a.className = 'edit-assignment';
        const b = document.getElementById('assignment'+assignment_id);
        b.className = 'edit-assignment';
    }

    const editAssignment = (assignment_id)=>{

    }

    return (
        <div className='specific-mentor-body'>
            <div className="title-container" id="">
                <div>
                    <img alt="mentor profile"></img>
                    <Link to={`/profile/${getMentorId()}`}>멘토 : {mentor.username}</Link><br />
                    <Link to={`/profile/${getMentorId()}/portfolio/${getPortfolioId()}`}>포트폴리오 보러 가기</Link>
                </div>
                <div>
                    <h2>{'제목 : ' + mentoring.title}</h2>
                    <div className="during">기간 : {mentoring.start_date}~{mentoring.end_date}</div>
                </div>
                <div className='tags'>
                    <div className='tag-box'>
                    {
                        mentoring.tags.map((t)=>{
                            return (<div className='tag'>{'#'+t.name}</div>)
                        })
                    }
                    </div>
                </div>
            </div>
            <div className='buttons'>
                <Link to={`${match.url}/chat`} className='chat-button'>채팅방으로 이동</Link>
            </div>
            <div className='content-container'>

                <div className="assignments" id="">
                    <h2>과제 목록</h2>
                    <ul>
                        {
                            assignments.map((a)=>{
                                let aid = getId(a.url);
                                return (
                                <div>
                                    <div id={'assignment'+aid} className='assignment'>
                                        <div>
                                            제목 : {a.title}
                                            </div>
                                        <div>
                                            내용 : {a.content}
                                        </div>
                                        <div>
                                            기한 : {a.deadline}
                                        </div>
                                        <div onClick={()=>{editAssignment(aid)}}>
                                            관리
                                        </div>
                                        <div onClick={()=>{deleteAssignment(aid)}}>
                                            삭제
                                        </div>
                                    </div>
                                    <div id={'edit-assignment'+aid} className='assignment h'>
                                        <div>
                                            제목 : <Input id={'edit-assignment-title'+aid}></Input>
                                            </div>
                                        <div>
                                            제목 : <Input id={'edit-assignment-content'+aid}></Input>
                                        </div>
                                        <div>
                                            기한 : <DatePicker id='assignment-deadline' />
                                        </div>
                                        <div>
                                            수정
                                        </div>
                                        <div>
                                            취소
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }
                    </ul>
                    <div id='add-assignment-container' className='add-assignment-container h'>
                        <div onClick={showAddAssignment}>과제 추가</div>
                        <div id='add-assignment' className='add-assignment h'>
                            제목 : <Input id='assignment-title' onChange={(e)=>{setAssignmentTitle(e.target.value)}}></Input>
                            내용 : <Input id='assignment-content' onChange={(e)=>{setAssignmentContent(e.target.value)}}></Input>
                            기한 : <DatePicker id='assignment-deadline' selected={endDate} onChange={(date)=>{setEndDate(date)}} />
                            <div className='assignment-buttons'>
                                <div onClick={addAssignment}>추가</div>
                                <div onClick={hideAddAssignment}>취소</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section" id="plan">
                    <h2>메모</h2>
                    {mentoring.memo}
                </div>
            </div>
        </div>
    )

}

export default MentoringSpecificMento;
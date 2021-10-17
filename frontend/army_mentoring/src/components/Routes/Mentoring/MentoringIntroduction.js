import React, { useState, useEffect, useContext } from 'react';
import './MentoringIntroduction.scss';
import {UserContext} from '../../../context/Context';
import Subnavbar from '../Subnavbar';
import { _loadMentoring, _loadAssignment, _loadMentoringReviewList, _updateMentoring } from '../../../backend/mentoring';
import { _loadUser } from '../../../backend/profile';
import { Link } from 'react-router-dom';

function MentoringIntroduction({match, history}){

    const mentoring_id = match.params.id;
    const [user, setUser] = useContext(UserContext);
    const menu = 
    [
        {id:'home', desc:'홈'},
        {id:'mentorintro', desc:'멘토 소개'},
        {id:'assignmentintro', desc:'과제 소개'},
        {id:'plan', desc:'세부 일정'},
        {id:'review', desc:'후기'}
    ]

    const getId = (url)=>{
        const t = url.split('/');
        return t[4];
    }

    const getMentorId = (url)=>{
        if(url == undefined)
            return -1;
        return getId(url);
    }

    useEffect(()=>{
        window.scroll({
            top:0,
            left:0,
            behavior:'instant'
        })}, []
    );

    const [mentoring, setMentoring] = useState({
        tags : [],
        assignments : []
    });
    const [mentor, setMentor] = useState({});
    const [assignments, setAssignments] = useState([]);
    const [mentoringReviews, setMentoringReviews] = useState([]);
    const load = ()=>{
        _loadMentoring(mentoring_id)
        .then(res=>{
            setMentoring(res.data);

            Promise.all(
                res.data.assignments.map((a)=>{
                    return _loadAssignment(getId(a))
                            .then(res=>{
                                return res.data;
                            })
                            .catch(err=>{
                                console.log(err.response);
                            })
                })
            )
            .then(res=>{
                setAssignments(res);
            })
            .catch(err=>{console.log(err.response)})

            _loadMentoringReviewList()
            .then(r=>{
                const filtered_array = r.data.filter((review)=>{return getId(review.mentor) == getId(res.data.mentor)})
                Promise.all( 
                    filtered_array.map((el)=>{
                        return _loadUser(getId(el.mentee))
                                .then(res=>{
                                    return { mentee : res.data, review: el }
                                })
                    })
                )
                .then(res=>{
                    setMentoringReviews(res);
                    console.log(res);
                })
            })
            .catch(err=>{console.log(err.response)})

            let mentor_id = getId(res.data.mentor);
            _loadUser(mentor_id)
            .then(res=>{
                setMentor(res.data);
            })
            .catch(err=>{console.log(err.response)})
        })
        .catch(err=>{console.log(err.response)})
    }
    useEffect(()=>{
        load();
    }, []);

    const joinMentoring = () =>{
        console.log(mentoring);
        const c = Object.assign({}, mentoring);
        c.mentees.push(user.url);
        console.log(c);
        _updateMentoring(c, mentoring_id)
        .then(res=>{
            console.log(res);
        })
        .catch(err=>{console.log(err.response)})
    }

    return (
        <div className='mentoring-introduction-body'>           
            
            <div className="header">
                <div className='header-mentor'>
                    <div className='mentor-thumbnail'></div>
                    <Link to={`/profile/${getMentorId(mentor.url)}`} className='mentor-name'>{mentor.username}</Link>
                    <Link to={`/profile/${getMentorId(mentor.url)}/portfolio`} className='mentor-portfolio'>포트폴리오 보러 가기</Link>
                </div>
                <div className='header-content'>
                    <div className='header-title'>
                        <div className='header-title-title'>{mentoring.title}</div>
                        <div className='header-title-during'>{mentoring.start_date}~{mentoring.end_date}</div>
                    </div>
                    <div className='header-tags'>
                        {
                            mentoring.tags.map((t)=>{
                                return (<div className='tag'>{'#'+t.name}</div>)
                            })
                        }
                    </div>
                </div>
            </div>

            <div className='join-button-container'>
                <div className='join-button-edge'>
                    <div onClick={joinMentoring} className='join-button'>멘토링 참여하기</div>
                </div>
            </div>

            <div className='content'>
                <div className="mentoring-introduction">
                    <div className='section-title'>멘토링 소개</div>
                    <div className='desc-content'>
                        <div className='quote f'>''</div>
                        <div className='introduction-description'>{mentoring.description}</div>
                        <div className='quote l'>''</div>
                    </div>
                </div>

                <div className="assignments">
                    <div className='section-title'>과제 소개</div>
                    <div className='assignment-box'>
                        {
                            assignments.map((a)=>{
                                return (<div className='assignment'>
                                            <div className='assignment-title'>제목 : {a.title}</div>
                                            <div className='assignment-content'>내용 : {a.content}</div>
                                            <div className='assignment-side'>기한 : {a.deadline.substring(0,10)}</div>
                                        </div>)
                            })
                        }
                    </div>
                </div>

                <div className="mentoring-reviews">
                    <div className='section-title'>후기</div>
                    <div className='review-box'>
                        {
                            mentoringReviews.map((r)=>{
                                return (<div className='review'> 
                                            <div className='review-creator'>작성자 : {r.mentee.username}</div>
                                            <div className='review-content'>내용 : {r.review.content}</div>
                                            <div className='review-side'>작성일 : {r.review.created_at.substring(0,10)}</div> 
                                        </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MentoringIntroduction;
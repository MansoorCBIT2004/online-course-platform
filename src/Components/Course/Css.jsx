import React, { useEffect } from 'react'
import Coursecart from './Coursecart'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { MDBBtn } from 'mdb-react-ui-kit'

export default function Css() {
    const { user, isAuthenticated } = useAuth0();
    const [progress, setProgress] = React.useState(null);
    const [isCompleted, setIsCompleted] = React.useState(false);
    const courseHours = 1; // Estimated hours for this course

    useEffect(() => {
        if (isAuthenticated && user) {
            axios.get(`http://localhost:3000/progress/${user.sub}`)
                .then(res => {
                    setProgress(res.data);
                    const isActive = res.data.activeCourses.includes('css');
                    const isComp = res.data.completedCourses.includes('css');
                    setIsCompleted(isComp);
                    if (!isActive && !isComp) {
                        // Add to active
                        const updated = { ...res.data, activeCourses: [...res.data.activeCourses, 'css'] };
                        setProgress(updated);
                        axios.put(`http://localhost:3000/progress/${user.sub}`, updated);
                    }
                })
                .catch(err => {
                    // If not found, create initial progress
                    const initial = {
                        userId: user.sub,
                        activeCourses: [],
                        completedCourses: [],
                        hoursLearned: 0,
                        dayStreak: 1,
                        lastLogin: new Date()
                    };
                    setProgress(initial);
                    axios.post('http://localhost:3000/progress', initial);
                });
        }
    }, [isAuthenticated, user]);

    const markCompleted = () => {
        if (progress && !isCompleted) {
            const updated = {
                ...progress,
                completedCourses: [...progress.completedCourses, 'css'],
                activeCourses: progress.activeCourses.filter(c => c !== 'css'),
                hoursLearned: progress.hoursLearned + courseHours
            };
            setProgress(updated);
            setIsCompleted(true);
            axios.put(`http://localhost:3000/progress/${user.sub}`, updated);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
                        <h1 className="mb-5">CSS Tutorial in one video</h1>
                    </div>
                    <div className="row g-2 justify-content-center">

                        <Coursecart link="https://www.youtube.com/embed/Oi9QvyK8zvk" title="Full CSS Tutorial" desc="Full css video tutorial in one video" />

                    </div>
                </div>
            </div>
            {isAuthenticated && (
                <div className="container">
                    <MDBBtn onClick={markCompleted} disabled={isCompleted} color={isCompleted ? "success" : "primary"}>
                        {isCompleted ? "Completed" : "Mark as Completed"}
                    </MDBBtn>
                </div>
            )}
            <Footer />
        </>
    )
}

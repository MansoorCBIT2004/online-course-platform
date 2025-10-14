import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Coursecart from './Coursecart';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import { MDBBtn } from 'mdb-react-ui-kit';

export default function Html() {
    const { user, isAuthenticated } = useAuth0();
    const [progress, setProgress] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const courseHours = 2;

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchProgress();
        }
    }, [isAuthenticated, user]);

    const fetchProgress = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/progress/${user.sub}`);
            setProgress(response.data);
            const isActive = response.data.activeCourses.includes('html');
            const isComp = response.data.completedCourses.includes('html');
            setIsCompleted(isComp);
            if (!isActive && !isComp) {
                // Add to active
                const updated = { ...response.data, activeCourses: [...response.data.activeCourses, 'html'] };
                setProgress(updated);
                await axios.put(`http://localhost:3000/progress/${user.sub}`, updated);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Initialize progress if not found
                const initialProgress = {
                    userId: user.sub,
                    activeCourses: ['html'],
                    completedCourses: [],
                    hoursLearned: 0,
                    dayStreak: 1,
                    lastLogin: new Date()
                };
                await axios.post('http://localhost:3000/progress', initialProgress);
                setProgress(initialProgress);
                setIsCompleted(false);
            } else {
                console.error('Error fetching progress:', error);
            }
        }
    };

    const markCompleted = async () => {
        if (!isAuthenticated || !progress) return;

        const updatedProgress = {
            ...progress,
            completedCourses: [...progress.completedCourses, 'html'],
            activeCourses: progress.activeCourses.filter(course => course !== 'html'),
            hoursLearned: progress.hoursLearned + courseHours
        };

        try {
            await axios.put(`http://localhost:3000/progress/${user.sub}`, updatedProgress);
            setProgress(updatedProgress);
            setIsCompleted(true);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
                        <h1 className="mb-5">HTML Tutorial in one video</h1>
                    </div>
                    <div className="row g-2 justify-content-center">
                        <Coursecart link="https://www.youtube.com/embed/HcOc7P5BMi4" title="HTML Tutorial" desc="HTML full video Tutorial in one video (2 hours)." />
                    </div>
                    {isAuthenticated && (
                        <div className="text-center mt-4">
                            <MDBBtn onClick={markCompleted} disabled={isCompleted} color={isCompleted ? "success" : "primary"}>
                                {isCompleted ? "Completed" : "Mark as Completed"}
                            </MDBBtn>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

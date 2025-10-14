 import React, { useState, useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = () => {
      if (isAuthenticated && user) {
        axios.get(`http://localhost:3000/progress/${user.sub}`)
          .then(res => {
            let prog = res.data;
            // Update streak
            const now = new Date();
            const last = new Date(prog.lastLogin);
            const diffTime = now - last;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            let newStreak = prog.dayStreak;
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
            // Update lastLogin and streak
            const updated = { ...prog, lastLogin: now, dayStreak: newStreak };
            setProgress(updated);
            axios.put(`http://localhost:3000/progress/${user.sub}`, updated);
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
    };

    fetchProgress();

    const handleFocus = () => fetchProgress();
    window.addEventListener('focus', handleFocus);

    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, user]);

  return (
    <>
      <Navbar />

      {/* {isAuthenticated && (
                <>
                    <img src={user.picture} alt={user.name} />
                    <h1>{user.name}</h1>
                    <h1>{user.email}</h1>

                </>

            )} */}

      {isAuthenticated && (
        <>
          <section style={{ backgroundColor: "#eee" }}>
            <MDBContainer className="py-5">
              {/* <MDBRow>
                        <MDBCol>
                            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                                <MDBBreadcrumbItem>
                                    <a href='#'>Home</a>
                                </MDBBreadcrumbItem>
                                <MDBBreadcrumbItem>
                                    <a href="#">User</a>
                                </MDBBreadcrumbItem>
                                <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
                            </MDBBreadcrumb>
                            </MDBCol>
                        </MDBRow> */}

              <MDBRow>
                <MDBCol lg="4">
                  <MDBCard className="mb-4">
                    <MDBCardBody className="text-center">
                      <MDBCardImage
                        // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                        src={user.picture}
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: "150px" }}
                        fluid
                      />
                      <p className="text-muted mb-1 mt-1">
                        Full Stack Developer
                      </p>
                      <p className="text-muted mb-4">
                        Hyderabad, Telangana, India
                      </p>
                      {/* <div className="d-flex justify-content-center mb-2">
                                                <MDBBtn>Follow</MDBBtn>
                                                <MDBBtn outline className="ms-1">Message</MDBBtn>
                                            </div> */}
                    </MDBCardBody>
                  </MDBCard>

                  <MDBCard className="mb-4 mb-lg-0">
                    <MDBCardBody className="p-0">
                      <MDBListGroup flush className="rounded-3">
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon fas icon="globe fa-lg text-warning" />
                          <MDBCardText>https://eLearining.com</MDBCardText>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon
                            fab
                            icon="github fa-lg"
                            style={{ color: "#333333" }}
                          />
                          <MDBCardText>CBIT CSE Students</MDBCardText>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon
                            fab
                            icon="twitter fa-lg"
                            style={{ color: "#55acee" }}
                          />
                          <MDBCardText>@ecommercebycse</MDBCardText>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon
                            fab
                            icon="instagram fa-lg"
                            style={{ color: "#ac2bac" }}
                          />
                          <MDBCardText>CBIT CSE Students</MDBCardText>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon
                            fab
                            icon="facebook fa-lg"
                            style={{ color: "#3b5998" }}
                          />
                          <MDBCardText>CBIT</MDBCardText>
                        </MDBListGroupItem>
                      </MDBListGroup>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
                <MDBCol lg="8">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <MDBCardText className="mb-4">
                        <span className="text-primary font-italic me-1">Progress</span> Learning Stats
                      </MDBCardText>
                      <MDBBtn
                        color="danger"
                        onClick={() => {
                          axios.put(`http://localhost:3000/progress/reset/${user.sub}`);
                          setProgress({
                            userId: user.sub,
                            activeCourses: [],
                            completedCourses: [],
                            hoursLearned: 0,
                            dayStreak: 0,
                            lastLogin: new Date()
                          });
                        }}
                        style={{ marginBottom: '20px' }}
                      >
                        Reset Progress
                      </MDBBtn>
                      <MDBRow>
                        <MDBCol sm="6">
                          <MDBCardText>Active Courses</MDBCardText>
                          <MDBCardText className="text-muted">
                            {progress ? progress.activeCourses.length : 0}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <MDBCardText>Completed Courses</MDBCardText>
                          <MDBCardText className="text-muted">
                            {progress ? progress.completedCourses.length : 0}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="6">
                          <MDBCardText>Hours Learned</MDBCardText>
                          <MDBCardText className="text-muted">
                            {progress ? progress.hoursLearned : 0} hours
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol sm="6">
                          <MDBCardText>Day Streak</MDBCardText>
                          <MDBCardText className="text-muted">
                            {progress ? progress.dayStreak : 0} days
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>

                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Full Name</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.name}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>User Id</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.sub}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Email</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.email}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Phone</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            +91 997 7XX XXXX
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Address</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            Chennai, Tamilnadu, India
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>

                  <MDBRow>
                    <MDBCol md="6">
                      <MDBCard className="mb-4 mb-md-0">
                        <MDBCardBody>
                          <MDBCardText className="mb-4">
                            <span className="text-primary font-italic me-1">
                              assigment
                            </span>{" "}
                            Project Status
                          </MDBCardText>
                          <MDBCardText
                            className="mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            Web Design
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={80}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            JavaScript library
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={72}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            C Programming
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={89}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            DSA
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={55}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            Backend with Nodejs
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={66}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>

                    <MDBCol md="6">
                      <MDBCard className="mb-4 mb-md-0">
                        <MDBCardBody>
                          <MDBCardText className="mb-4">
                            <span className="text-primary font-italic me-1">
                              assigment
                            </span>{" "}
                            Project Status
                          </MDBCardText>
                          <MDBCardText
                            className="mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            Web Design
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={80}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            Website Markup
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={72}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            React
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={89}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            JavaScript
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={55}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>

                          <MDBCardText
                            className="mt-4 mb-1"
                            style={{ fontSize: ".77rem" }}
                          >
                            Backend API
                          </MDBCardText>
                          <MDBProgress className="rounded">
                            <MDBProgressBar
                              width={66}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
        </>
      )}

      <Footer />
    </>
  );
}

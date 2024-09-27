import React, { useContext, useEffect, useState } from 'react'
import { TestContext } from '../../Context/TestContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
{/* <FontAwesomeIcon icon={faArrowLeft} /> */ }
const McqTestPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        if(!localStorage.getItem('token'))
          navigate("/testGenerator/login")
      }, [])
    const { inputData, setInputData, numOfQs, setNumOfQs, qsnList, setQsnList, testDuration, setTestDuration } = useContext(TestContext)

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const [selectedOptions, setSelectedOptions] = useState({});
    const [reviewList, setReviewList] = useState([]);

    const handleOptionChange = (questionIndex, optionIndex) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questionIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        let val = currentQuestionIndex
        setCurrentQuestionIndex(val + 1)
        // console.log(selectedOptions)
    }
    const handlePrevious = () => {
        let val = currentQuestionIndex
        setCurrentQuestionIndex(val - 1)
    }
    const handleNavigateButton = (qsNum) => {
        setCurrentQuestionIndex(qsNum)
    }

    if (!qsnList || qsnList.length === 0) {
        return <div>Loading questions...</div>
    }

    const parts = qsnList[currentQuestionIndex]?.split('|') || [];
    const selectedOption = selectedOptions[currentQuestionIndex];

    const handleClearResponse = () => {
        setSelectedOptions(prevState => {
            const newState = { ...prevState };
            delete newState[currentQuestionIndex]; // Remove the key
            return newState;
        });
    };

    const handleMarkforReview = () => {
        setReviewList(prevList => {
            if (prevList.includes(currentQuestionIndex)) {
                // Remove the idNumber if it's already in the review list
                return prevList.filter(item => item !== currentQuestionIndex);
            } else {
                // Add the idNumber to the review list
                return [...prevList, currentQuestionIndex];
            }
        });
    };

    const handleSubmit = () => {
        // console.log(selectedOptions)
        // console.log(qsnList)

        let score = 0;
        let totalQuestions = qsnList.length;
        let correctCount = 0;
        let wrongCount = 0;

        // Iterate through the selected options and compare with correct answers
        qsnList.forEach((question, index) => {
            const parts = question.split('|'); // Assuming the last part is the correct answer index
            const correctAnswerString = (parts[5]).trim(); // Correct answer index is assumed to be at the 5th position
            const selectedAnswerIndex = selectedOptions[index] + 1;
            const selectedAnswerString = "ansis" + selectedAnswerIndex
            // console.log('\n')
            if (!selectedAnswerIndex === false) {
                // console.log(selectedAnswerString)
                // console.log(correctAnswerString)
                if (selectedAnswerString === correctAnswerString) {
                    score += 4; // Correct answer points
                    correctCount += 1;
                } else {
                    score -= 1; // Wrong answer penalty
                    wrongCount += 1;
                }
            }
        });
        const unansweredCount = totalQuestions - (correctCount + wrongCount);

    }

    return (
        <>

            <div className='main'>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-md-9" style={{ marginTop: "40px" }}>

                            <h1>Online Test - Multiple Choice Questions (MCQs)</h1>
                            <div className="card p-4 border-light bg-dark text-light" style={{ borderRadius: '42px', marginTop: '30px' }}>
                                {/* Outer Card for Question and Options */}
                                {qsnList.length !== 0 && (
                                    (() => {
                                        const parts = qsnList[currentQuestionIndex].split('|');
                                        const selectedOption = selectedOptions[currentQuestionIndex];

                                        return (
                                            <div>
                                                {/* Question Header */}
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <h5 className="mb-4">
                                                            Question {currentQuestionIndex + 1} out of {qsnList.length}

                                                            {currentQuestionIndex !== 0 && (
                                                                <FontAwesomeIcon
                                                                    color="gold"
                                                                    style={{ marginLeft: '20px', cursor: 'pointer' }}
                                                                    size="lg"
                                                                    icon={faArrowLeft}
                                                                    onClick={handlePrevious}
                                                                />
                                                            )}
                                                            {currentQuestionIndex !== qsnList.length - 1 && (
                                                                <FontAwesomeIcon
                                                                    color="gold"
                                                                    style={{ marginLeft: '15px', cursor: 'pointer' }}
                                                                    size="lg"
                                                                    icon={faArrowRight}
                                                                    onClick={handleNext}
                                                                />
                                                            )}
                                                        </h5>
                                                    </div>
                                                    <div>
                                                        <span style={{ marginLeft: '20px', fontSize: '15px' }}>
                                                            Correct Answer <strong style={{ color: '#00FF00' }}>+4</strong>
                                                        </span>
                                                        <span style={{ marginLeft: '15px', fontSize: '15px' }}>
                                                            Negative Marking <strong style={{ color: 'red' }}> -1</strong>
                                                        </span>
                                                    </div>
                                                </div>


                                                <h5 id={currentQuestionIndex} className="mb-3">{parts[0]}</h5>

                                                {/* Options Layout */}
                                                <div className="row">
                                                    {parts.slice(1, 5).map((option, index) => (
                                                        <div className="col-md-6" key={index}>
                                                            <div
                                                                className="form-check option-card p-3 mb-3"
                                                                key={index}
                                                                onClick={() => handleOptionChange(currentQuestionIndex, index)}
                                                                style={{
                                                                    transition: '0.3s',
                                                                    border: selectedOption === index ? '2px solid black' : '2px solid transparent',
                                                                    // backgroundColor: selectedOption === index ? '#5C636A' : 'transparent',
                                                                    backgroundColor: selectedOption === index ? 'cyan' : 'transparent',
                                                                    borderRadius: '25px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                // Inline event handlers for mouse events
                                                                onMouseEnter={(e) => {
                                                                    if (selectedOption !== index) {
                                                                        e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.5)';
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (selectedOption !== index) {
                                                                        e.currentTarget.style.border = '2px solid transparent';
                                                                    }
                                                                }}
                                                            >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`question-${currentQuestionIndex}`}
                                                                    id={`option-${index}`}
                                                                    checked={selectedOption === index}
                                                                    // onChange={() => handleOptionChange(currentQuestionIndex, index)}
                                                                    style={{ display: 'none' }} // Hide default radio button
                                                                />
                                                                <label
                                                                    className="form-check-label w-100 h-100 d-flex align-items-center justify-content-center"
                                                                    htmlFor={`option-${index}`}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        padding: '10px',
                                                                        borderRadius: '8px',
                                                                        transition: '0.3s',
                                                                        cursor: 'pointer',
                                                                        color: selectedOption === index ? 'black' : 'white',
                                                                    }}
                                                                >
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>


                        {/* Right part */}
                        <div className="col-md-3" style={{ marginTop: '0px' }}>
                            {/* Time Left Card */}
                            <div
                                className="card border-light text-bg-dark mb-5 mx-auto"
                                style={{ maxWidth: "15rem", padding: "0rem", borderRadius: '22px' }}
                            >
                                <div className="card-header border-light text-center">Time Left ⏰</div>
                                <div className="card-body">
                                    <h4 className="card-title d-flex justify-content-around mb-1">
                                        <span>01</span>
                                        <span>12</span>
                                        <span>25</span>
                                    </h4>
                                    <p className="card-title d-flex justify-content-around mb-1">
                                        <span>hrs</span>
                                        <span>mins</span>
                                        <span>secs</span>
                                    </p>
                                </div>
                            </div>

                            {/* Question List Card */}
                            <div className="card text-bg-dark border-light p-3" style={{ borderRadius: '22px' }}>
                                <h5 className="mb-3 text-center">Question List</h5>
                                <div className="d-flex flex-wrap">
                                    {qsnList.map((_, idx) => (
                                        <div className="position-relative m-1" key={idx}>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-circle"
                                                onClick={() => handleNavigateButton(idx)}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    margin: "3px"
                                                }}
                                            >
                                                {idx + 1}
                                            </button>
                                            {/* Conditionally render badge if question is flagged */}
                                            {reviewList.includes(idx) && (
                                                <span style={{ padding: "2px", marginTop: "6px", background: "transparent" }} className="position-absolute top-0 start-100 translate-middle p-1 bg-light rounded-circle">
                                                    <span>🚩</span>
                                                    <span className="visually-hidden">Flagged question</span>
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='row'>
                        <div className="col-md-9">

                            <div className="card text-bg-dark mx-auto" style={{ maxWidth: "24rem", padding: "13px", borderRadius: "42px" }}>
                                {/* <div className="card p-4 border-info bg-dark text-light" style={{borderRadius:'42px'}}> */}
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={handleClearResponse}
                                        style={{ borderRadius: '30px' }}
                                    >
                                        Clear Response
                                    </button>

                                    <button
                                        className="btn btn-outline-light"
                                        onClick={handleMarkforReview}
                                        style={{ borderRadius: '30px' }}
                                    >
                                        Mark/Unmark for Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="navbar navbar-expand-lg fixed-bottom bg-dark" data-bs-theme="dark">
                    <div className="container">
                        <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <div className="position-relative m-1">
                                <button
                                    type="button"
                                    className="btn btn-light btn-circle mx-2"
                                    onClick={() => handleNavigateButton(1)}
                                    disabled
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        margin: "3px",
                                        marginBottom: '6px'
                                    }}
                                >
                                    <strong>25</strong>
                                </button>
                            </div>
                            <h5> Total Questions</h5>
                        </span>
                        <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <div className="position-relative m-1">
                                <button
                                    type="button"
                                    className="btn btn-success btn-circle mx-2"
                                    onClick={() => handleNavigateButton(1)}
                                    disabled
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        margin: "3px",
                                        marginBottom: '6px'
                                    }}
                                >
                                    8
                                </button>
                            </div>
                            <h5> Answered</h5>
                        </span>

                        <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <div className="position-relative m-1">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-circle mx-2"
                                    onClick={() => handleNavigateButton(1)}
                                    disabled
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        margin: "3px",
                                        marginBottom: '6px'
                                    }}
                                >
                                    18
                                </button>
                            </div>
                            <h5> Unanswered</h5>
                        </span>

                        <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <div className="position-relative m-1">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-circle mx-2"
                                    onClick={() => handleNavigateButton(1)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        margin: "3px",
                                        marginBottom: '6px'
                                    }}
                                >
                                    4
                                </button>
                                <span style={{ padding: "2px", marginTop: "7px", background: "transparent" }} className="position-absolute top-0 start-100 translate-middle p-1 bg-light rounded-circle">
                                    <span>🚩</span>
                                    <span className="visually-hidden">Flagged question</span>
                                </span>
                            </div>
                            <h5> Marked for review</h5>

                        </span>
                        <span style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <div className="w-50 d-flex justify-content-center">


                                <button
                                    className="btn btn-outline-danger btn-lg"
                                    onClick={handleNext}
                                    disabled={currentQuestionIndex === qsnList.length - 1}
                                    id="end"
                                >
                                    End Test
                                </button>
                            </div>
                            <div className="w-50 d-flex justify-content-center">
                                <button
                                    className="btn btn-info btn-lg"
                                    onClick={handleSubmit}
                                    disabled={currentQuestionIndex === qsnList.length - 1}
                                    id="submit"
                                >
                                    Submit Test
                                </button>
                            </div>
                        </span>
                    </div>
                </nav>
            </div>

        </>

    )
}

export default McqTestPage

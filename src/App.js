import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom"
import HomePage from './Components/HomePage';
import McqsPage from './Components/McqsPage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { TestProvider } from './Context/TestContext';
import McqTestPage from './Components/Testpages/McqTestPage';
import MyTests from './Components/MyTests';
import StartTest from './Components/StartTest';
function App() {
  return (
    <>
      <TestProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path='/testGenerator' Component={HomePage} />
            <Route exact path='/testGenerator/mcqs/create' Component={McqsPage} />
            <Route exact path='/testGenerator/mcqs/test' Component={McqTestPage} />
            <Route exact path='/testGenerator/mcqs/mytests' Component={MyTests} />
            <Route exact path='/testGenerator/mcqs/mytests/:test_id' Component={StartTest} />

            <Route exact path='/testGenerator/login' Component={Login} />

            <Route exact path='/testGenerator/signup' Component={Signup} />

            <Route path = '*' element={<Navigate to="/testGenerator" />} />
          </Routes>
        </BrowserRouter>
      </TestProvider>
    </>
  );
}

export default App;

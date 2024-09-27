import { children, createContext, useState } from "react";

const TestContext = createContext()

const TestProvider = ({children}) => {
    const [inputData, setInputData] = useState("")
    const [numOfQs, setNumOfQs] = useState(5)
    const [qsnList, setQsnList] = useState([])
   
    const [testDuration, setTestDuration] = useState(5)

    const [baseUrl, setBaseUrl] = useState('https://test-gen-server.vercel.app/api')
    return(
        <TestContext.Provider value={{inputData,setInputData, numOfQs, setNumOfQs, qsnList, setQsnList, testDuration, setTestDuration, baseUrl}}>
            {children}
        </TestContext.Provider>
    )
}

export {TestContext, TestProvider}
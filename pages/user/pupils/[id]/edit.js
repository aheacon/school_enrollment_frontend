import { useEffect, useState } from 'react';
import EditStudent from '../../../../src/components/user/editStudent';
import { useRouter } from 'next/router';
import StudentGrades from '../../../../src/components/user/studentGrades'
import GradePage from '../../../../src/components/user/gradePage';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';


const EditPage = (props) => {
    const [selectedTab, setSelectedTab] = useState("editStudent");
    const router = useRouter();
    const { id } = router.query;
    const idExists = id !== undefined && id !== null;

    const determineGradeFromTab = (tab) => {
        switch (tab) {
            case "sixthGrade":
                return "VI";
            case "seventhGrade":
                return "VII";
            case "eightGrade":
                return "VIII";
            case "ninthGrade":
                return "IX";
            default:
                return "";
        }
    };

    // Get the grade based on the selected tab;
    const grade = determineGradeFromTab(selectedTab);

    // Function to switch tabs;
    const handleTabNavigation = (e, tab) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const tabs = ["editStudent", "sixthGrade", "seventhGrade", "eightGrade", "ninthGrade", "studentGrades"];
            const currentIndex = tabs.indexOf(selectedTab);
            let nextIndex = currentIndex + 1;
            if (nextIndex >= tabs.length) {
                nextIndex = 0;
            }
            setSelectedTab(tabs[nextIndex]);
        }
    };

    // Back to previous page;
    const back = () => {
        router.push('/user');
    };

    return (
        <div className="">
            <div className="bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex justify-center flex-1 space-x-4">
                            <button
                                tabIndex={selectedTab === "editStudent" ? "0" : "-1"}
                                className={`focus:outline-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${selectedTab === "editStudent" ? "bg-gray-900" : ""}`}
                                onClick={() => setSelectedTab("editStudent")}
                                onKeyDown={(e) => handleTabNavigation(e, "editStudent")}
                            >Generalije</button>
                            <button
                                tabIndex={selectedTab === "sixthGrade" ? "0" : "-1"}
                                className={`focus:outline-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${selectedTab === "sixthGrade" ? "bg-gray-900" : ""}`}
                                onClick={() => setSelectedTab("sixthGrade")}
                                onKeyDown={(e) => handleTabNavigation(e, "sixthGrade")}
                            >Šesti razred</button>
                            <button
                                tabIndex={selectedTab === "seventhGrade" ? "0" : "-1"}
                                className={`focus:outline-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${selectedTab === "seventhGrade" ? "bg-gray-900" : ""}`}
                                onClick={() => setSelectedTab("seventhGrade")}
                                onKeyDown={(e) => handleTabNavigation(e, "seventhGrade")}
                            >Sedmi razred</button>
                            <button
                                tabIndex={selectedTab === "eightGrade" ? "0" : "-1"}
                                className={`focus:outline-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${selectedTab === "eightGrade" ? "bg-gray-900" : ""}`}
                                onClick={() => setSelectedTab("eightGrade")}
                                onKeyDown={(e) => handleTabNavigation(e, "eightGrade")}
                            >Osmi razred</button>
                            <button
                                tabIndex={selectedTab === "ninthGrade" ? "0" : "-1"}
                                className={`focus:outline-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${selectedTab === "ninthGrade" ? "bg-gray-900" : ""}`}
                                onClick={() => setSelectedTab("ninthGrade")}
                                onKeyDown={(e) => handleTabNavigation(e, "ninthGrade")}
                            >Deveti razred</button>
                            <button
                                tabIndex={selectedTab === "studentGrades" ? "0" : "-1"}
                                className={`focus:outline-none text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${selectedTab === "studentGrades" ? "bg-gray-900" : ""}`}
                                onClick={() => setSelectedTab("studentGrades")}
                                onKeyDown={(e) => handleTabNavigation(e, "studentGrades")}
                            >Ocjene</button>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                                onClick={back}>
                                <ChevronLeftIcon className="w-5 h-5 mr-1" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {selectedTab === "editStudent" && idExists && <EditStudent studentId={id} />}
                {selectedTab === "sixthGrade" && idExists && <GradePage studentId={id} setSelectedPage={setSelectedTab} grade={grade} />}
                {selectedTab === "seventhGrade" && idExists && <GradePage studentId={id} setSelectedPage={setSelectedTab} grade={grade} />}
                {selectedTab === "eightGrade" && idExists && <GradePage studentId={id} setSelectedPage={setSelectedTab} grade={grade} />}
                {selectedTab === "ninthGrade" && idExists && <GradePage studentId={id} setSelectedPage={setSelectedTab} grade={grade} />}
                {selectedTab === "studentGrades" && idExists && <StudentGrades studentId={id} setSelectedPage={setSelectedTab} />}
            </div>
        </div>
    );

};

export default EditPage;
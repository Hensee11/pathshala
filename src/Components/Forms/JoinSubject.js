import { useContext, useState, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import { Navigate } from "react-router-dom";
import axios from "../../config/api/axios";
import { TableHeader } from "../Table";
import Loading from "../Layouts/Loading";
import { toast } from "react-toastify";

//TODO Refactor
const JoinSubject = () => {
  const { user, setSubjectList } = useContext(UserContext);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const getallSubjects = async () => {
      try {
        const response = await axios.get("subject/manage/" + user._id);
        setSubjects(response.data);
      } catch (err) {
        setError(err);
      }
    };
    getallSubjects();

    const updateSubjects = async () => {
      const response = await axios.get(`subject/student/${user._id}`);
      setSubjectList(response.data);
    };
    return () => updateSubjects();
  }, [user, setSubjectList]);

  const handleJoin = async (e) => {
    const subjectId = e.currentTarget.id;
    const index = e.target.name;
    const students = subjects[index].students;
    students.push(user._id);
    updateStudents(subjectId, students, index);
  };

  const handleLeave = async (e) => {
    const subjectId = e.currentTarget.id;
    const index = e.target.name;
    const students = subjects[index].students;
    const updatedStudents = students.filter((student) => student !== user._id);
    updateStudents(subjectId, updatedStudents, index);
  };

  const updateStudents = async (subjectId, studentsObj, subjectIndex) => {
    setError("");
    try {
      const response = await axios.patch("/subject/" + subjectId, {
        students: studentsObj,
        id: subjectId,
      });
      toast.success(response.data.message);
      const updatedSubject = subjects.map((subject, index) => {
        if (index === parseInt(subjectIndex)) {
          subject.joined = !subject.joined;
          return subject;
        } else return subject;
      });
      setSubjects(updatedSubject);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      {user.role === "student" ? (
        <main>
          <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
            Manage Subject
          </h2>
          <form>
            {subjects.length ? (
              <>
                <div className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
                  <table className="w-full text-left">
                    <TableHeader
                      AdditionalRowClasses={"rounded-t-xl text-left"}
                      Headers={[
                        "Subject",
                        "Department",
                        "Year",
                        "Semester",
                        "Teacher",
                        "Manage",
                      ]}
                    />
                    <tbody>
                      {subjects?.map((subject, index) => (
                        <tr key={index}>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {subject.subject}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {subject.department}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {subject.year}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {subject.semester}
                          </td>
                          <td className="border-t-[1px] border-slate-400 px-4 py-2">
                            {subject.teacher.name}
                          </td>
                          <td className="border-t-[1px] border-slate-400 p-0">
                            {!subject.joined ? (
                              <button
                                type="button"
                                id={subject._id}
                                name={index}
                                onClick={(e) => handleJoin(e)}
                                className="m-0 flex h-auto w-full justify-center bg-transparent py-3  text-lg  hover:bg-violet-900 hover:text-slate-100 dark:text-slate-100 "
                              >
                                Join
                              </button>
                            ) : (
                              <button
                                className="m-0 flex h-auto w-full justify-center bg-transparent py-3  text-lg  hover:bg-red-600 hover:text-slate-100 dark:text-slate-100 "
                                type="button"
                                id={subject._id}
                                name={index}
                                onClick={(e) => handleLeave(e)}
                              >
                                Leave
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <Loading />
            )}
          </form>
          <p className="m-2 overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium text-red-700">
            {error
              ? error?.response?.data?.message ||
                error?.data?.message ||
                error?.response?.data
              : ""}
          </p>
        </main>
      ) : (
        <Navigate to="/dash" />
      )}
    </>
  );
};

export default JoinSubject;

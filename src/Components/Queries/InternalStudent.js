import React from "react";
import UserContext from "../../Hooks/UserContext";
import { TableHeader } from "../Table";
import axios from "../../config/api/axios";
import Loading from "../Layouts/Loading";

const InternalStudent = () => {
  const { user } = React.useContext(UserContext);
  const [internal, setInternal] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchInternal = async () => {
      try {
        const response = await axios.get("/internal/student/" + user._id);
        setInternal(response.data);
      } catch (err) {
        setError(err);
      }
    };
    fetchInternal();
  }, [user]);

  return (
    <main className="internal">
      <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
        Internal Mark
      </h2>
      <div>
        <p className="mb-3 overflow-hidden text-ellipsis whitespace-break-spaces text-center font-medium text-red-700">
          {error ? error?.response?.data?.message || error?.response?.data : ""}
        </p>
      </div>
      {internal.length ? (
        <section className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
          <table className="w-full">
            <TableHeader
              AdditionalHeaderClasses={"text-left"}
              Headers={[
                "Subject",
                "Test",
                "Seminar",
                "Assignment",
                "Attendance",
                "Total",
              ]}
            />
            <tbody>
              {internal?.map((subject, index) => (
                <tr
                  key={index}
                  className={
                    parseInt(subject?.marks.test) +
                      parseInt(subject?.marks.seminar) +
                      parseInt(subject?.marks.assignment) +
                      parseInt(subject?.marks.attendance) >
                    7
                      ? "border-t-[1px] border-slate-400 bg-violet-900/50 first:border-none"
                      : "border-t-[1px] border-slate-400 first:border-none"
                  }
                >
                  <td className="p-2 ">{subject.subject}</td>
                  <td className="p-2 ">{subject.marks.test}</td>
                  <td className="p-2 ">{subject.marks.seminar}</td>
                  <td className="p-2 ">{subject.marks.assignment}</td>
                  <td className="p-2 ">{subject.marks.attendance}</td>
                  <td className="p-2 ">
                    {subject.marks.test +
                      subject.marks.seminar +
                      subject.marks.assignment +
                      subject.marks.attendance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <Loading />
      )}
    </main>
  );
};

export default InternalStudent;

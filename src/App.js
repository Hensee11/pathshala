import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { UserProvider } from "./Hooks/UserContext";
import Layout from "./Components/Layouts/Layout";
import Dash from "./Components/Layouts/Dash";
import ErrorElement from "./Components/Layouts/ErrorElement";
import Loading from "./Components/Layouts/Loading";
import AttendanceLayout from "./Components/Layouts/AttendanceLayout";
import LoginLayout from "./Components/Layouts/LoginLayout";
import InternalLayout from "./Components/Layouts/InternalLayout";
import Subject from "./Components/Queries/Subject";
import Notes from "./Components/Queries/Notes";
import StudentsList from "./Components/Queries/StudentsList";
import TeacherForm from "./Components/Forms/TeacherForm";
import StudentForm from "./Components/Forms/StudentForm";
import NotesForm from "./Components/Forms/NotesForm";
import TimeScheduleForm from "./Components/Forms/TimeScheduleForm";
import Login from "./Components/Forms/Login";
import Profile from "./Components/Forms/Profile";
import SubjectForm from "./Components/Forms/SubjectForm";
import ResetPasswordForm from "./Components/Forms/ResetPasswordForm";

const TeacherApproval = lazy(() =>
  import("./Components/Queries/TeacherApproval")
);
// const SubjectForm = lazy(() => import("./Components/Forms/SubjectForm"));
const JoinSubject = lazy(() => import("./Components/Forms/JoinSubject"));

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<LoginLayout />} errorElement={<ErrorElement />}>
        <Route index element={<Login />} />
        <Route path="reg_teacher" element={<TeacherForm />} />
        <Route path="reg_student" element={<StudentForm />} />
        <Route path="resetPassword/:token" element={<ResetPasswordForm />} />
        <Route
          path="/dash"
          element={<Layout />}
          errorElement={<ErrorElement />}
        >
          <Route index element={<Dash />} />
          <Route path="subject" element={<Subject />} />
          <Route path="subject/:subject" element={<Notes />} />
          <Route path="subject/:subject/add" element={<NotesForm />} />
          <Route path="subject/:subject/:note/edit" element={<NotesForm />} />
          <Route path="subject/:subject/students" element={<StudentsList />} />
          <Route path="attendance" element={<AttendanceLayout />} />
          <Route path="internal" element={<InternalLayout />} />
          <Route path="time_schedule" element={<TimeScheduleForm />} />
          <Route path="addSubject" element={<SubjectForm />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="approve_teacher"
            element={
              <Suspense fallback={<Loading />}>
                <TeacherApproval />
              </Suspense>
            }
          />
          <Route
            path="add_subject"
            element={
              <Suspense fallback={<Loading />}>
                <SubjectForm />
              </Suspense>
            }
          />
          <Route
            path="join_subject"
            element={
              <Suspense fallback={<Loading />}>
                <JoinSubject />
              </Suspense>
            }
          />
        </Route>
      </Route>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer
        className="toast"
        toastClassName="toast-rounded"
        bodyClassName="toast-body"
        // progressClassName="toast-progress"
        position="bottom-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        hideProgressBar={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserProvider>
  );
}

export default App;

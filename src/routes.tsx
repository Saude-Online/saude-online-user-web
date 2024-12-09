import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/pages/_layouts/app'
import { AuthLayout } from '@/pages/_layouts/auth'
import { NotFound } from '@/pages/404'
import { HistoricAnamnesis } from '@/pages/app/historic-anamnesis'
import { HistoricExamSchedule } from '@/pages/app/historic-exam-schedule'
import { HistoricSchedule } from '@/pages/app/historic-schedule'
import { Home } from '@/pages/app/home'
import { Schedules } from '@/pages/app/schedules'
import { SignIn } from '@/pages/auth/sign-in'
import { SignUp } from '@/pages/auth/sign-up'
import { Error } from '@/pages/error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/historic-schedule', element: <HistoricSchedule /> },
      { path: '/historic-exam-schedule', element: <HistoricExamSchedule /> },
      { path: '/medical-returns', element: <HistoricAnamnesis /> },
      { path: '/schedule', element: <Schedules /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

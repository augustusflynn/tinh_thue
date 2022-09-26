
import React, { Suspense, lazy } from "react"
import { Spin } from 'antd';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import './App.css'

const Home = lazy(() => import("./pages/home"))
const Tax = lazy(() => import("./pages/tax"))
const Receipt = lazy(() => import("./pages/receipt"))

export const routes = {
  // home: {
  //   path: "/",
  //   component: Home
  // },
  tax: {
    path: "/",
    component: Tax
  },
  receipt: {
    path: "/receipt",
    component: Receipt
  }
}

function App() {
  const RouteComponent = Object.values(routes)

  return (
    <>
      <Router>
        <Suspense fallback={
          <div className="w-100 d-flex justify-content-center mt-5 pt-5"><Spin size="large" /></div>
        }>
          <Switch>
            {
              RouteComponent.map((r) => {
                return (
                  <Route
                    key={r.path}
                    exact path={r.path}
                    component={r.component}
                  />
                )
              })
            }
          </Switch>
        </Suspense>
      </Router>

    </>
  );
}

export default App

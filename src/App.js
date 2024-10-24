import './App.css';
import WebSocketProvider from "./components/socket";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/auth/login/Login";
import Signup from "./components/auth/signup/Signup";
import UserBar from "./components/user/UserBar";
import CreateCoordinate from "./components/basic/coordinates/CreateCoordinates";
import ListCoordinates from "./components/basic/coordinates/ListCoordinates";
import EditCoordinate from "./components/basic/coordinates/EditCoordinates";
import EditLocation from "./components/basic/location/EditLocation";
import ListLocation from "./components/basic/location/ListLocation";
import CreateLocation from "./components/basic/location/CreateLocation";
import ListPerson from "./components/basic/person/ListPerson";
import CreatePerson from "./components/basic/person/CreatePerson";
import EditPerson from "./components/basic/person/EditPerson";
import ListMovie from "./components/basic/movie/ListMovie";
import CreateMovie from "./components/basic/movie/CreateMovie";
import EditMovie from "./components/basic/movie/EditMovie";
import {ErrorProvider, useError} from './ErrorProvider';
import {login} from "./components/storage/UserSlice";
import {useDispatch} from "react-redux";
import AdminAllow from "./components/auth/AdminAllow";
import GroupByTotalBoxOffice from "./components/basic/movie/queries/GroupByTotalBoxOffice";
import MinTotalBoxOffice from "./components/basic/movie/queries/MinTotalBoxOffice";
import MoviesWithoutOscars from "./components/basic/movie/queries/MoviesWithoutOscars";

function App() {
    
    const dispatch = useDispatch();
    if(localStorage.getItem("token")){
        dispatch(login({...localStorage}))
    }
  return (
      <Router>
              <WebSocketProvider>
                      <UserBar />
                      <Routes>
                          <Route path="/" element={<ListMovie />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/admin" element={<AdminAllow />} />
                          <Route path="/groupByTotalBoxOffice" element={<GroupByTotalBoxOffice />} />
                          <Route path="/minTotalBoxOffice" element={<MinTotalBoxOffice />} />
                          <Route path="/moviesWithoutOscars" element={<MoviesWithoutOscars />} />
                          <Route>
                              <Route path="coordinates/edit/:id" element={<EditCoordinate />} />
                              <Route path="coordinates/list" element={<ListCoordinates />} />
                              <Route path="coordinates/create" element={<CreateCoordinate />} />
                          </Route>
                          <Route>
                              <Route path="location/edit/:id" element={<EditLocation />} />
                              <Route path="location/list" element={<ListLocation />} />
                              <Route path="location/create" element={<CreateLocation />} />
                          </Route>
                          <Route>
                              <Route path="person/list" element={<ListPerson />} />
                              <Route path="person/create" element={<CreatePerson />} />
                              <Route path="person/edit/:id" element={<EditPerson />} />
                          </Route>
                          <Route>
                              <Route path="movie/create" element={<CreateMovie />} />
                              <Route path="movie/edit/:id" element={<EditMovie />} />
                          </Route>
                      </Routes>
              </WebSocketProvider>
      </Router>

  );
}

export default App;

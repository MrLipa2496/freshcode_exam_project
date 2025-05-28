import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spiner from '../../Spinner/Spinner';

const ModeratorRoute = () => {
  const { data: user, isFetching } = useSelector(state => state.userStore);

  if (isFetching) {
    return <Spiner />;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (user.role !== 'moderator') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default ModeratorRoute;

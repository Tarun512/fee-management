import React, { useState, useEffect } from "react";
import { useSelector} from 'react-redux';
import { Link } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const Dashboard = () => {
  const {role} = useSelector((state) => state.user);
  console.log(role);

  return (
    <div className="container mx-auto p-6">

      {(role === "accountant" || role === "admin") && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            to="/search"
            className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
            <h2 className="text-lg font-bold mt-2">Search </h2>
          </Link>
          <Link
            to="/add-student"
            className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <PlusIcon className="h-8 w-8 text-yellow-600" />
            <h2 className="text-lg font-bold mt-2">Add Student</h2>
          </Link>
          <Link
            to="/search"
            className="bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <PencilIcon className="h-8 w-8 text-green-600" />
            <h2 className="text-lg font-bold mt-2">Edit Student</h2>
          </Link>
          <Link
            to="/search"
            className="bg-red-100 hover:bg-red-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <TrashIcon className="h-8 w-8 text-red-600" />
            <h2 className="text-lg font-bold mt-2">Delete Student</h2>
          </Link>
          <Link
            to="/fee-structure"
            className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <PlusIcon className="h-8 w-8 text-blue-600" />
            <h2 className="text-lg font-bold mt-2">Add Fee Structure</h2>
          </Link>

          <Link
            to="/search"
            className="bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <PencilIcon className="h-8 w-8 text-green-600" />
            <h2 className="text-lg font-bold mt-2">Edit Fee Structure</h2>
          </Link>

          {role === "admin" && (
            <Link
              to="/search"
              className="bg-red-100 hover:bg-red-200 p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <TrashIcon className="h-8 w-8 text-red-600" />
              <h2 className="text-lg font-bold mt-2">Delete Fee Structure</h2>
            </Link>
          )}

          <Link
            to="/fee-payment"
            className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <PlusIcon className="h-8 w-8 text-yellow-600" />
            <h2 className="text-lg font-bold mt-2">Add Fee Payment</h2>
          </Link>
          <Link
            to="/search"
            className="bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <PencilIcon className="h-8 w-8 text-green-600" />
            <h2 className="text-lg font-bold mt-2">Edit Payment</h2>
          </Link>
          

          {role === "admin" && (
            <Link
              to="/search"
              className="bg-red-100 hover:bg-red-200 p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <TrashIcon className="h-8 w-8 text-red-600" />
              <h2 className="text-lg font-bold mt-2">Delete Fee Payment</h2>
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/register-staff"
              className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <PlusIcon className="h-8 w-8 text-yellow-600" />
              <h2 className="text-lg font-bold mt-2">Register Staff</h2>
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/staff"
              className="bg-red-300 hover:bg-red-600 p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <PencilIcon className="h-8 w-8 text-green-800" />
              <h2 className="text-lg font-bold mt-2">Edit Staff</h2>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

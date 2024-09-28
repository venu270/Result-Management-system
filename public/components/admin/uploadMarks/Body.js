import React, { useEffect, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload"; 
import { useDispatch, useSelector } from "react-redux";
import { uploadAttendance } from "../../../redux/actions/adminActions"; // Update this import
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { SET_ERRORS } from "../../../redux/actionTypes";
import { uploadMarks } from "../../../redux/api";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [value, setValue] = useState({
    department: "",
    year: "",
    file: null, // Added state for file
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleFileChange = (e) => {
    setValue({ ...value, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.file) {
      setError({ fileError: "Please select a file to upload" });
      return;
    }
    setLoading(true);
    setError({});
    dispatch(uploadMarks(value));
  };

  useEffect(() => {
    if (store.admin.uploadSuccess) {
      setUploadSuccess(true);
      setLoading(false);
    }
  }, [store.admin.uploadSuccess]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <UploadIcon />
          <h1>Upload Marks</h1>
        </div>
        <div className="mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          <form
            className="flex flex-col space-y-2 col-span-1"
            onSubmit={handleSubmit}>
            <label htmlFor="department">Department</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.department}
              onChange={(e) =>
                setValue({ ...value, department: e.target.value })
              }>
              <MenuItem value="">None</MenuItem>
              {departments?.map((dp, idx) => (
                <MenuItem key={idx} value={dp.department}>
                  {dp.department}
                </MenuItem>
              ))}
            </Select>
            <label htmlFor="year">Year</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.year}
              onChange={(e) => setValue({ ...value, year: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </Select>
            <label htmlFor="file">Upload Marks File</label>
              <input
              required
              type="file"
              accept=".csv" // assuming you want to upload CSV files
              onChange={handleFileChange}
            />
            {error.fileError && (
              <p className="text-red-500 text-sm">{error.fileError}</p>
            )}
              <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type="submit">
              Upload
            </button>
          </form>
          <div className="col-span-3 mr-6">
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Uploading"
                  height={50}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.fileError || error.backendError) && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.fileError || error.backendError}
                </p>
              )}
              {uploadSuccess && (
                <p className="text-green-500 text-2xl font-bold">
                  Marks uploaded successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;

import { AlertCircle, FileText, Upload, X } from "lucide-react";
import { useState } from "react";
import { useCallback } from "react";
import { isValidFileType } from "../../../utils/validation";
import Toast from "typescript-toastify";
import { uploadResume } from "../../../services/api";

export const Resume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFileDetails, setUploadedFileDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const showToast = (message, type = "default") => {
    new Toast({
      position: "top-center",
      toastMsg: message,
      autoCloseTime: 2000,
      canClose: true,
      showProgress: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      type: type,
      theme: "light",
    });
  };

  const handleFile = async (file) => {
    if (file) {
      if (isValidFileType(file)) {
        setSelectedFile(file);
        setError(null);
        setIsLoading(true);
        setSuccessMessage("");

        try {
          // Pass jobTitle and jobDescription to the uploadResume function
          const response = await uploadResume(file, jobTitle, jobDescription);
          console.log(response);

          setUploadedFileDetails(response);
          setIsUploaded(true);
          setIsLoading(false);

          if (response.error === null) {
            showToast("File uploaded successfully", "default");
          }
        } catch (err) {
          showToast(err.message);
          setIsLoading(false);
          setSelectedFile(null);
        }
      } else {
        showToast("Please upload a file in .pdf or .docx format.", "default");
        setSelectedFile(null);
      }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    handleFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadedFileDetails(null);
    setIsUploaded(false);
  };

  const validateFileAndNavigate = (path) => {
    if (!selectedFile || !jobTitle || !jobDescription) {
      showToast("Please complete all fields before proceeding.", "default");
      return;
    }
    window.location.href = path;
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-3 shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-500" />
            Resume Submission
          </h2>
          <p className="text-gray-600 text-lg">
            Tell us about the position you're interested in and upload your
            resume.
          </p>
        </div>

        {/* Job Title and Job Description Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="job-title"
                className="block text-gray-700 font-medium"
              >
                Job Title
              </label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-2 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the job title"
              />
            </div>
            <div>
              <label
                htmlFor="job-description"
                className="block text-gray-700 font-medium"
              >
                Job Description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-2 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter the job description"
              />
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          {!uploadedFileDetails ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload
                  className={`h-16 w-16 ${
                    isDragging ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-700">
                    Drop your resume here or{" "}
                    <span className="text-blue-500">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF and DOCX files
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {uploadedFileDetails.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      Format: {uploadedFileDetails.file_format}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
              <p className="text-blue-700">Uploading resume...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex justify-end gap-4">
          <button
            onClick={() => validateFileAndNavigate("/user/schedule")}
            disabled={true}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Schedule Interview
          </button>
          <button
            onClick={() => validateFileAndNavigate("/user/interview")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            disabled={!isUploaded}
          >
            Instant Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;

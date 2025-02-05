import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const CalibrationList = () => {
    const navigate = useNavigate();
    const [calibrations, setCalibrations] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCalibration, setSelectedCalibration] = useState(null);
    const [isMaintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
    const [selectedCalibrations, setSelectedCalibrations] = useState(null);
    const [maintainer, setMaintainer] = useState('');
    const [Report, setReport] = useState('');
    const userStationId = localStorage.getItem('station'); 

    const fetchData = async () => {
        try {
            setLoading(true);
            const [calibrationsResponse, stationsResponse] = await Promise.all([
                fetch(`${API_URL}/api/maintenance/`),
                fetch(`${API_URL}/api/stations/`)
            ]);

            const calibrationsData = await calibrationsResponse.json();
            const stationsData = await stationsResponse.json();
            setCalibrations(calibrationsData.filter((data) =>data.station == userStationId ));
            setStations(stationsData);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setError('Failed to load Maintenance data');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {       
        fetchData();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const getStationName = (stationId) => {
        const station = stations.find((s) => s.id === parseInt(stationId));
        return station ? station.name : 'Unknown';
    };

    const filteredCalibrations = selectedDate
        ? calibrations.filter(calibration => new Date(calibration.Date).toDateString() === selectedDate.toDateString())
        : calibrations;

    const handleViewDetails = (calibration) => {
        setSelectedCalibration(calibration);
    };

    const handleMaintenance = (calibration) => {
        setSelectedCalibrations(calibration);
        setMaintenanceModalOpen(true); // Open the maintenance modal
        setSelectedCalibration(null);

    };

    const closeMaintenanceModal = () => {
        setMaintenanceModalOpen(false); // Close the maintenance modal
    };

    const closeModal = () => {
        setSelectedCalibration(null);
    };


    const handleCalibirationSubmit = async (e) => {
        e.preventDefault();

        if (!Report) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in all the required fields.',
                icon: 'error',
                confirmButtonText: 'Okay',
            });
            return;
        }

        const maintenanceData = {
            report:Report
        };

        console.log(maintenanceData);

        try {
            const response = await fetch(`${API_URL}/api/maintenance/${selectedCalibrations.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maintenanceData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                Swal.fire({
                    title: 'Error',
                    text: responseData.error || 'Error adding maintenance. Please try again.',
                    icon: 'info',
                    confirmButtonText: 'Oxkay',
                });
                return;
            }

            Swal.fire({
                title: 'Success!',
                text: 'Thank you for Adding a Report Of Calibration.',
                icon: 'success',
                confirmButtonText: 'Great',
            });

            fetchData();
            closeMaintenanceModal();
        } catch (error) {
            console.error('Error adding maintenance:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error adding maintenance. Please try again.',
                icon: 'error',
                confirmButtonText: 'Okay',
            });
        }
    };





    if (loading) {
        return <p className="text-center mt-20">Loading data...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-20">{error}</p>;
    }

    return (
        <div className="container mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Station Maintenance Records</h1>


                <div className="mb-6">
                    <label htmlFor="date-select" className="text-md font-medium text-gray-600">Filter By  Date : </label>
                    <DatePicker
                        id="date-select"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        className="mt-2 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select a date"
                    />
                </div>
            </div>

            {filteredCalibrations.length === 0 ? (
                <p className="text-center text-gray-600">No calibrations found for this station.</p>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="min-w-full bg-white border-collapse border text-center border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">#</th>
                                <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Station</th>
                                <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Date</th>
                                <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Time</th>
                                <th className="py-2 px-4 border-b text-sm font-medium text-gray-600">Status</th>
                                <th className="py-2 px-4 border-b w-72 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCalibrations.map((calibration, index) => (
                                <tr key={calibration.id}>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{index + 1}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{getStationName(calibration.station)}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{calibration.Date}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{calibration.Time || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{calibration.status}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                                        <button
                                            onClick={() => handleViewDetails(calibration)}
                                            className="mr-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                        >
                                            View Destail
                                        </button>

                                        <button
                                        onClick={() => handleMaintenance(selectedCalibration)}
                                             disabled={calibration.report !== null} // Disable if report is not null
                                            className={`py-1 px-2 rounded ${
                                                calibration.report === null 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                }`}
                            >
                                Make Report
                            </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for View Report */}
            {selectedCalibration && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Maintenance Report on  <span className='text-xl text-yellow-500'>{selectedCalibration.Date}</span> </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <p className="text-gray-700 font-medium"><strong>Station:</strong></p>
                                <p className="text-gray-600">{getStationName(selectedCalibration.station)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-700 font-medium"><strong>Date:</strong></p>
                                <p className="text-gray-600">{selectedCalibration.Date}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-700 font-medium"><strong>Time:</strong></p>
                                <p className="text-gray-600">{selectedCalibration.Time || 'N/A'}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-700 font-medium"><strong>Status:</strong></p>
                                <p className="text-gray-600">{selectedCalibration.status}</p>
                            </div>
                        </div>

                        {/* Report Content */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-gray-700 font-medium mb-5"><strong>Report From manager :</strong></p>
                                <p className="text-gray-600">{selectedCalibration.report || 'No report available'}</p>
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium"><strong>Maintainer:</strong></p>
                                <p className="text-gray-600">{selectedCalibration.maintainer}</p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={closeModal}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {isMaintenanceModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <h3 className="text-2xl font-semibold text-gray-600 mb-6">Adding Maintenance Report</h3>
                        <form onSubmit={handleCalibirationSubmit}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-gray-700 font-medium">Report Description</label>
                                    <textarea
                                        value={Report}
                                        onChange={(e) => setReport(e.target.value)}
                                        required
                                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                        rows="7"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={closeMaintenanceModal}
                                    type="button"
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalibrationList;

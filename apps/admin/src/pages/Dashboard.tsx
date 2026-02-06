import React from 'react';

export const DashboardPage = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
                    <div className="mt-4 text-green-600 text-sm font-medium flex items-center">
                        <span>+12% from last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Exercises</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">56</p>
                    <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                        <span>4 new this week</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Completed Dictations</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">8,921</p>
                    <div className="mt-4 text-purple-600 text-sm font-medium flex items-center">
                        <span>+8% from last week</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="text-gray-500 text-center py-10">
                    Chart placeholder
                </div>
            </div>
        </div>
    );
};

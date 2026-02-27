import React from 'react';

const ApplicationProgress = ({ status }) => {
    const getStatusConfig = () => {
        let bgClass = 'bg-indigo-500';
        let width = '25%';
        let textColor = 'text-indigo-600';

        switch (status) {
            case 'Shortlisted':
                width = '50%';
                bgClass = 'bg-amber-500';
                break;
            case 'Interview Scheduled':
                width = '75%';
                bgClass = 'bg-purple-500';
                break;
            case 'Selected':
                width = '100%';
                bgClass = 'bg-green-500';
                textColor = 'text-green-600';
                break;
            case 'Rejected':
                width = '100%';
                bgClass = 'bg-red-500';
                textColor = 'text-red-600';
                break;
            default:
                width = '25%';
                bgClass = 'bg-blue-500';
                break;
        }

        return { bgClass, width, textColor };
    };

    const config = getStatusConfig();

    return (
        <div className="w-full relative pt-2">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${config.bgClass}`}
                    style={{ width: config.width }}
                ></div>
            </div>
            <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mt-2 font-bold uppercase tracking-wide">
                <span className={status !== 'Rejected' ? 'text-indigo-600' : ''}>Applied</span>
                <span className={['Shortlisted', 'Interview Scheduled', 'Selected'].includes(status) ? 'text-amber-600' : ''}>Shortlisted</span>
                <span className={['Interview Scheduled', 'Selected'].includes(status) ? 'text-purple-600' : ''}>Interview</span>
                <span className={status === 'Selected' ? 'text-green-600' : status === 'Rejected' ? 'text-red-600' : ''}>
                    {status === 'Rejected' ? 'Rejected' : 'Hired'}
                </span>
            </div>
        </div>
    );
};

export default ApplicationProgress;

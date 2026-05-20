export default function StatusBadge({ status, size = 'sm' }) {
    const styles = {
        pending:     'bg-yellow-100 text-yellow-800 border-yellow-300',
        assigned:    'bg-blue-100 text-blue-800 border-blue-300',
        accepted:    'bg-blue-100 text-blue-800 border-blue-300',
        in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        en_route:    'bg-indigo-100 text-indigo-800 border-indigo-300',
        arrived:     'bg-purple-100 text-purple-800 border-purple-300',
        completed:   'bg-green-100 text-green-800 border-green-300',
        cancelled:   'bg-red-100 text-red-800 border-red-300',
        rejected:    'bg-red-100 text-red-800 border-red-300',
        available:   'bg-green-100 text-green-800 border-green-300',
        on_job:      'bg-orange-100 text-orange-800 border-orange-300',
        offline:     'bg-gray-100 text-gray-600 border-gray-300',
    };

    const labels = {
        pending: 'Pending', assigned: 'Assigned', accepted: 'Accepted',
        in_progress: 'In Progress', en_route: 'En Route', arrived: 'Arrived',
        completed: 'Completed', cancelled: 'Cancelled', rejected: 'Rejected',
        available: 'Available', on_job: 'On Job', offline: 'Offline',
    };

    const sizeClasses = {
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center rounded-full border font-medium ${styles[status] || styles.pending} ${sizeClasses[size]}`}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === 'pending' ? 'bg-yellow-500' : status === 'completed' ? 'bg-green-500' : status === 'cancelled' || status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`} />
            {labels[status] || status}
        </span>
    );
}

export default function PriorityBadge({ priority }) {
    const styles = {
        low:    'bg-gray-100 text-gray-700 border-gray-300',
        medium: 'bg-blue-100 text-blue-700 border-blue-300',
        high:   'bg-orange-100 text-orange-700 border-orange-300',
        urgent: 'bg-red-100 text-red-700 border-red-300 animate-urgent',
    };

    const icons = {
        low: '◇', medium: '◆', high: '▲', urgent: '⚠',
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[priority]}`}>
            <span>{icons[priority]}</span>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
}

import GuestLayout from '../../Layouts/GuestLayout';

function Index({ children }) {
    return (
        <div className="min-h-screen bg-gray-800 text-white">
            {children}
        </div>
    );
}

Index.layout = page => <GuestLayout children={page} />

export default Index;
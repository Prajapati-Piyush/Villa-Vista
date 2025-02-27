import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function AccountNav() {

    const { user } = useContext(UserContext);
    const { pathname } = useLocation();
    let subpage = pathname.split('/')?.[2];
    if (subpage === undefined) {
        subpage = 'profile';
    }



    function linkClasses(type = false) {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
        if (type === subpage) {
            classes += ' bg-primary text-white';
        } else {
            classes += ' bg-gray-200';
        }
        return classes;
    }

    return (
        <nav className="w-full flex flex-wrap justify-center items-center mt-6 gap-4 md:gap-6 mb-6 px-4">
            <Link className={linkClasses('profile')} to={'/account'}>
                <svg className="w-5 h-5 md:w-6 md:h-6"></svg>
                My profile
            </Link>
            <Link className={linkClasses('bookings')} to={'/account/bookings'}>
                <svg className="w-5 h-5 md:w-6 md:h-6"></svg>
                My bookings
            </Link>
            {user && user.role !== 'user' && (
                <>
                    <Link className={linkClasses('places')} to={'/account/places'}>
                        <svg className="w-5 h-5 md:w-6 md:h-6"></svg>
                        My accommodations
                    </Link>
                    <Link className={linkClasses('admin')} to={'/admin'}>
                        <svg className="w-5 h-5 md:w-6 md:h-6"></svg>
                        Dashboard
                    </Link>
                </>
            )}
            <Link className={linkClasses('feedback')} to={'/account/feedback'}>
                <svg className="w-5 h-5 md:w-6 md:h-6"></svg>
                Feedback
            </Link>
        </nav>
    );

}

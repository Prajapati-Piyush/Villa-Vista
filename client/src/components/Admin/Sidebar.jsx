import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const Sidebar = () => {
    const { user } = useContext(UserContext);
    return (
        <div className="w-64 bg-gray-800 text-white p-6">
            <h2 className="text-2xl font-semibold text-center mb-8">{user.role.toUpperCase()}</h2>
            <ul>
                <li>
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `block py-2 px-4 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-600' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    {user.role !== 'villa owner' && <NavLink
                        to="/admin/villas"
                        className={({ isActive }) =>
                            `block py-2 px-4 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-600' : ''}`
                        }
                    >
                        Villas
                    </NavLink>}
                </li>
                <li>
                    <NavLink
                        to="/admin/bookings"
                        className={({ isActive }) =>
                            `block py-2 px-4 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-600' : ''}`
                        }
                    >
                        Bookings
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `block py-2 px-4 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-600' : ''}`
                        }
                    >
                        Users
                    </NavLink>
                </li>
                <li>
                    {user.role !== 'villa owner' && <NavLink
                        to="/admin/feedbacks"
                        className={({ isActive }) =>
                            `block py-2 px-4 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-600' : ''}`
                        }
                    >
                        Feedbacks
                    </NavLink>}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

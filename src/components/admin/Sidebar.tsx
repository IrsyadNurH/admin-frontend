import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiMessageSquare, FiShoppingBag, FiLogOut ,  FiActivity } from 'react-icons/fi';
import { MdOutlineWidgets, MdPhonelinkSetup } from 'react-icons/md';
import { LuSettings2 } from 'react-icons/lu';
import ContactUs from '../../assets/contact-mail.svg';
import Yukmari from '../../assets/YukMari.svg';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Get email from localStorage
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        console.error('No user email found in localStorage');
        return;
      }
      
      // Send logout request and create log entry
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userEmail
        })
      });
  
      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
  
        // Redirect to login page
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {isOpen && <img src={Yukmari} alt="Yukmari" />}
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <NavLink to="/dashboard">
              <FiHome />
              {isOpen && <span>Beranda</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/tetangkami' ? 'active' : ''}>
            <NavLink to="/dashboard/tetangkami">
              <FiUsers />
              {isOpen && <span>Tentang Kami</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/konsultasi' ? 'active' : ''}>
            <NavLink to="/dashboard/konsultasi">
              <FiMessageSquare />
              {isOpen && <span>Konsultasi</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/projectbimble' ? 'active' : ''}>
            <NavLink to="/dashboard/projectbimble">
              <FiShoppingBag />
              {isOpen && <span>Project & Bimble</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/programLainnya' ? 'active' : ''}>
            <NavLink to="/dashboard/programLainnya">
              <MdOutlineWidgets />
              {isOpen && <span>Program Lainnya</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/kontakKami' ? 'active' : ''}>
            <NavLink to="/dashboard/kontakKami">
              <MdPhonelinkSetup />
              {isOpen && <span>Kontak Kami</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/settings' ? 'active' : ''}>
            <NavLink to="/dashboard/settings">
              <LuSettings2 />
              {isOpen && <span>Pengaturan</span>}
            </NavLink>
          </li>
          <li className={location.pathname === '/dashboard/logs' ? 'active' : ''}>
            <NavLink to="/dashboard/logs">
              <FiActivity />
              {isOpen && <span>Logs</span>}
            </NavLink>
          </li>
              <ul className="bottom-menu">

            <li>
              <NavLink to="/" onClick={handleLogout}>
                <FiLogOut />
                {isOpen && <span>Logout</span>}
              </NavLink>
            </li>
          </ul>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

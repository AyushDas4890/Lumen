import {Link, Route, Routes} from 'react-router-dom';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {lumenTheme} from './theme';
import {Layout} from './components/Layout';
import {PageHead} from './components/PageHead';
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Patients from './pages/Patients';
import Contact from './pages/Contact';
import Book from './pages/Book';
import Appointments from './pages/Appointments';

function NotFound() {
  return (
    <PageHead trail={[{label: 'Page not found'}]} title="Page not found">
      That page doesn’t exist. <Link to="/" className="textlink">Back to home</Link>
    </PageHead>
  );
}

export default function App() {
  return (
    <Theme theme={lumenTheme} mode="light">
      <LinkProvider component={Link}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </LinkProvider>
    </Theme>
  );
}

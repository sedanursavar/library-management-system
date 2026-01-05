import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Authors from './pages/admin/Authors';
import Categories from './pages/admin/Categories';
import BookForm from './pages/admin/BookForm';
import BookList from './pages/admin/BookList';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/books" element={<Books />} />

                        {/* Admin Routes - Sadece Admin erişebilir */}
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute adminOnly>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/authors"
                            element={
                                <PrivateRoute adminOnly>
                                    <Authors />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/categories"
                            element={
                                <PrivateRoute adminOnly>
                                    <Categories />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/books"
                            element={
                                <PrivateRoute adminOnly>
                                    <BookList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/books/new"
                            element={
                                <PrivateRoute adminOnly>
                                    <BookForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/books/edit/:id"
                            element={
                                <PrivateRoute adminOnly>
                                    <BookForm />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

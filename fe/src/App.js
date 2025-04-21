import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment, useLayoutEffect, useState } from 'react';

import CatalogService from '@/service/admin/catalog.service';

import DefaultLayout from './layouts/DefaultLayout';
import { publicRoutes, privateRoutes } from '@/routes';
import NavigateProgress from '@/components/UI/NavigateProgress';
import PrivateRoute from './routes/components';
import { ErrorWithStatusCode } from './pages/Error';
import { useDispatch, useSelector } from 'react-redux';
import { setCatalog } from './core/action/catalog';
import MovieList from './pages/MovieList';

function App() {
    const dispatch = useDispatch();
    const catalogState = useSelector((state) => state.catalog.list);
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        const fetchCatalog = async () => {
            await CatalogService.getAll()
                .then((res) => {
                    dispatch(
                        setCatalog(
                            res.catalogs.map((catalog) => ({
                                id: catalog.id,
                                name: catalog.name,
                                slug: catalog.slug,
                            }))
                        )
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        if (!catalogState || catalogState.length === 0) {
            fetchCatalog();
        } else {
            setIsLoading(false);
        }
    }, [catalogState, dispatch]);

    if (isLoading) {
        return null;
    }

    return (
        <Router>
            <div className='App'>
                <NavigateProgress />
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) Layout = route.layout;
                        else if (route.layout === null) Layout = Fragment;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {catalogState &&
                        catalogState?.map((catalog, index) => (
                            <Route
                                key={index}
                                path={
                                    catalog.slug === 'trang-chu'
                                        ? '/'
                                        : `/${catalog.slug}`
                                }
                                element={
                                    <DefaultLayout>
                                        <MovieList catalog={catalog} />
                                    </DefaultLayout>
                                }
                            />
                        ))}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        const requires = route.requires ?? {};

                        if (route.layout) Layout = route.layout;
                        else if (route.layout === null) Layout = Fragment;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <PrivateRoute {...requires}>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </PrivateRoute>
                                }
                            />
                        );
                    })}
                    <Route
                        path='/403'
                        element={
                            <ErrorWithStatusCode
                                mainMessage='You are not allowed to do this action!'
                                subMessage='Check your account permission'
                                code={403}
                            />
                        }
                    />
                    <Route
                        path='*'
                        element={
                            <ErrorWithStatusCode
                                mainMessage='Oops! This Page is Not Found.'
                                subMessage='The requested page dose not exist.'
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
